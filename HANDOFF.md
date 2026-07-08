# Vertex Services Website — Deployment Handoff

Summary of a session spent (1) reverse-engineering how this site is actually
hosted in production, since no deployment docs existed, and (2) fixing a
broken contact form and two URL routing bugs discovered along the way.

## Production server investigation

**Server:** `root@47.84.246.185` (Alibaba Cloud ECS, Ubuntu 24.04, hostname `Vertex`).
Access is via SSH password auth (no key configured) — consider switching to
key-based auth and disabling `PermitRootLogin` at some point.

**How the site is actually served** (there was no existing documentation of
this, so future engineers should read this carefully):

- There is **no Node/Express process running in production**. The repo's
  `server.js` (Express + EJS) is only used for local dev and for the
  Vercel deployment target (`vercel.json` uses `@vercel/node`) — it is
  **not** what's live at `vertexservice.ai` on this server.
- nginx runs as a **Docker container** (`docker ps` → container name `nginx`),
  not a system service. Its config is bind-mounted from
  `/home/app/nginx/opt/config` → `/etc/nginx` inside the container.
- nginx serves **static files only**, root'd at `/opt/www` inside the
  container, which maps to `/home/app/nginx/opt/www` on the host
  (see `/home/app/nginx/opt/config/conf.d/basic.comm`).
- The live `/opt/www` directory contains a **pre-rendered static HTML
  export** (`index.html`) plus `css/`, `images/`, `js/`, `vercel.json`, and
  a Netlify-style `_redirects` file — this was built by starting
  `server.js` locally, hitting `GET /` to capture the rendered HTML output,
  and bundling it with the `public/` asset folder (flattened, i.e.
  `public/css/*` → `css/*`, not nested).
- The last such bundle lives on the server at
  `/home/app/vertexservice.tar.gz` (9MB) for reference.
- There is also an unrelated `/note/` reverse-proxy rule in the nginx config
  pointing at `172.17.0.1:6806` — not part of this project, don't touch it.

**Implication:** updating the live site means rebuilding this static
export and re-uploading it — you cannot just `git pull` on the server,
because there is no git checkout or running app there at all.

## Changes made this session

All changes are local only — **not yet deployed** as of writing this doc.

1. **Contact form was silently broken in production** — fixed.
   - `public/js/main.js` posted to `/contact`, handled by an Express route
     in `server.js` that only did `console.log(...)` (never actually sent
     anywhere, even locally) — and that route doesn't exist at all in
     production (static-only server, see above), so the POST 404'd.
   - The form's `catch` block masked this by displaying a fake "Thank you"
     success message regardless of failure — visitors believed their
     enquiry was sent when it never reached anyone.
   - **Fix:** the form now submits directly to
     [Web3Forms](https://web3forms.com) (`public/js/main.js`), which emails
     submissions straight to `enquiry@vertexservice.ai` with no backend
     required — this fits the static-hosting model instead of fighting it.
     Access key is stored at `public/js/main.js` (search
     `WEB3FORMS_ACCESS_KEY`) — already set and **tested end-to-end
     successfully** (real submission confirmed `success: true` from the
     Web3Forms API).
   - Added a real error state (red banner, `.form-success.is-error` in
     `public/css/main.css`) so a genuine failure is no longer disguised as
     success.
   - Removed the now-dead `POST /contact` route and unused
     `express.json()` / `express.urlencoded()` middleware from `server.js`.

2. **Tab navigation was writing `#home`, `#services`, etc. into the URL
   bar on every click** (`history.replaceState` in `public/js/main.js`) —
   removed. Deep links (e.g. sharing a link ending in `#contact`) still
   work on page load; only the "rewrite URL on every click" behavior was
   removed.

3. **`/#career` deep link was broken** — the tab-validity check in
   `public/js/main.js` (`validTabs`) listed `'cases'` instead of
   `'career'` (the actual panel is `id="panel-career"`), so visiting
   `vertexservice.ai/#career` silently fell back to the home tab. Fixed
   the typo.

All three fixes were verified in a live browser preview (tab switching,
URL behavior, deep links, and an actual end-to-end form submission that
Web3Forms confirmed as delivered).

### Note: other uncommitted local changes

`git status` also shows pre-existing uncommitted edits to `views/index.ejs`,
`public/css/main.css`, and a deleted `public/images/logo-chip.svg`, plus
new untracked images (`favicon.png`, `logo-icon.png`,
`sea-coverage-map.jpg`) — these predate this session and were **not**
made or reviewed as part of this work. Check `git diff` before deploying
to make sure you're comfortable shipping those too, since the deploy
script below packages whatever is currently on disk, not just this
session's changes.

## How to deploy

A one-command deploy script was created: **`deploy.sh`** (project root,
already executable). It:

1. Boots `server.js` locally on a scratch port and curls `/` to capture a
   freshly rendered `index.html`.
2. Assembles a bundle matching the production layout (`index.html`, `css/`,
   `images/`, `js/`, `vercel.json`).
3. `scp`s it to the server as `/home/app/vertexservice_new.tar.gz`.
4. Backs up the live `/home/app/nginx/opt/www` directory (timestamped
   copy) and extracts the new bundle over it — existing files not present
   in the new bundle (like `_redirects`) are left untouched.
5. Curls `https://vertexservice.ai` to sanity-check the result.

**Usage:**
```bash
cd "/Users/yibohuang/Downloads/Vertex/Vertex Website"
./deploy.sh
```
You'll be prompted for the root password twice (once for `scp`, once for
`ssh`) — nothing is stored by the script.

**Rollback:** if something goes wrong, the previous version is sitting at
`/home/app/nginx/opt/www_backup_<timestamp>` on the server — restore it
with:
```bash
ssh root@47.84.246.185
rm -rf /home/app/nginx/opt/www
mv /home/app/nginx/opt/www_backup_<timestamp> /home/app/nginx/opt/www
```

**No nginx reload is needed** — it's serving static files directly off
disk, so changes are live as soon as the new files are extracted.

## Suggested follow-ups (not done yet)

- SSH is password-only; consider adding a key and disabling root password
  login.
- Web3Forms free tier is unlimited submissions but rate-limited /
  feature-limited vs. paid — fine for a low-traffic B2B contact form, but
  worth knowing if volume grows.
- There's no automated CI/CD — every deploy is a manual `./deploy.sh` run
  from someone's laptop. Fine for current scale, but worth revisiting if
  more people start deploying.
