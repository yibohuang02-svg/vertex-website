# Vertex Infrastructure Services — Website

Marketing website for **Vertex Infrastructure Services Pte. Ltd.**, a Singapore-headquartered specialist in AI hardware repair and maintenance serving Southeast Asia.

**Live site:** https://vertex-services-nine.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Server framework | Express |
| Templating | EJS (Embedded JavaScript) |
| Styling | Vanilla CSS with custom properties |
| JavaScript | Vanilla JS — no frameworks |
| Hosting | Vercel (serverless via `@vercel/node`) |

---

## Project Structure

```
Vertex Website/
├── server.js           # Express app — routes, static files, contact endpoint
├── vercel.json         # Vercel build config — routes all requests to server.js
├── package.json        # npm dependencies and scripts
├── CHANGELOG.md        # Full version history of every change made
├── views/
│   └── index.ejs       # The entire website in one EJS template
└── public/
    ├── css/
    │   └── main.css    # All styles — design tokens, layout, components, responsive
    ├── js/
    │   └── main.js     # Client-side JS — nav, tab switching, counters, scroll reveal
    └── images/
        ├── logo-chip.svg       # Brand logo (chip icon, used in navbar + footer)
        ├── facility-team.png   # Services tab banner photo
        ├── pdf_p52_0.jpeg      # Hero section banner photo
        ├── pdf_p11_0.jpeg      # About section photo
        └── pdf_p65_*.jpeg / pdf_p66_*.jpeg  # Facility section gallery photos
```

---

## Local Development

### Prerequisites

- Node.js 18 or later
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server with auto-reload
npm run dev

# 3. Open in browser
open http://localhost:3000
```

`npm run dev` uses **nodemon** — the server restarts automatically whenever you save a file.

To run without auto-reload:

```bash
npm start
```

---

## Site Structure

The site is a **single EJS template** (`views/index.ejs`) with a **5-tab navigation** system. All content is on one page; JavaScript switches which panel is visible.

| Tab | Panel ID | Sections inside |
|---|---|---|
| Home | `#panel-home` | Hero, About |
| Services | `#panel-services` | Services grid, Technical Service Loop, SLA Tiers |
| Coverage | `#panel-coverage` | SEA Map, Repair Facility |
| Careers | `#panel-career` | Value pillars, Open Positions |
| Get a Quote | `#panel-contact` | Contact form + details |

### Tab switching (JS)

Any element with `data-goto-tab="X"` switches to that tab when clicked. The active tab is stored in the URL hash (`#services`, `#coverage`, etc.) and restored on page load.

### Design tokens (CSS)

All colours, spacing, and font stacks are defined as CSS custom properties in `:root` at the top of `main.css`:

```css
:root {
  --accent:      #0E9850;   /* primary green */
  --accent-hover:#0A7840;   /* hover state */
  --accent-light:#1FC870;   /* used on dark backgrounds (footer) */
  --bg:          #FFFFFF;
  --bg-section:  #F8FAFB;
  --bg-card:     #FFFFFF;
  --text:        #0F1923;
  --text-muted:  #4A5568;
  --text-dim:    #94A3B8;
  --border:      #E2E8F0;
  --font-sans:   'Inter', sans-serif;
  --font-heading:'Space Grotesk', sans-serif;
  --font-mono:   'JetBrains Mono', monospace;
}
```

---

## Editing Content

### Text content
All copy lives in `views/index.ejs`. Each section is clearly commented:

```html
<!-- ══════════════════════════════════════════
     TAB: SERVICES
══════════════════════════════════════════ -->
```

Search for the section name to jump directly to it.

### Images
Drop new images into `public/images/` and reference them in `index.ejs` as `/images/filename.ext`. The Express static middleware serves everything in `public/` automatically.

### Styles
Edit `public/css/main.css`. The file is organised top-to-bottom:
1. Reset + CSS variables
2. Typography
3. Navbar
4. Hero
5. About, Services, Process, SLA, Coverage, Facility, Careers, Contact, Footer
6. Utilities and responsive overrides (`@media` blocks at the bottom)

### Colours
To change the brand colour, update `--accent`, `--accent-hover`, and `--accent-light` in `:root`. Also update the logo SVG at `public/images/logo-chip.svg` (currently hardcoded to `#16A34A`).

### Contact form
Form submissions POST to `/contact` in `server.js`. The handler currently logs to the console and returns a JSON success message. To wire it to an email service (e.g. SendGrid, Resend), add your API call inside that handler.

---

## Deployment

### Vercel (current hosting)

The project is pre-configured for Vercel. `vercel.json` tells Vercel to build `server.js` with `@vercel/node` and route all requests through it.

```bash
# Deploy to production
npx vercel --prod
```

First-time setup:

```bash
# Install Vercel CLI globally (optional — npx works without this)
npm install -g vercel

# Log in
vercel login

# Link to a Vercel project (run once in the project folder)
vercel link

# Deploy
vercel --prod
```

### Other hosting platforms

The app is a standard Express server — it runs anywhere Node.js is supported.

#### Railway / Render / Fly.io / Heroku

1. Make sure `server.js` listens on `process.env.PORT` (already done).
2. Set the start command to `npm start`.
3. Push your code — the platform will run `npm install` and `npm start` automatically.

No changes to `server.js` or `vercel.json` are needed for these platforms (they ignore `vercel.json`).

#### VPS / bare server (e.g. AWS EC2, DigitalOcean Droplet)

```bash
# On your server:
git clone <your-repo-url>
cd "Vertex Website"
npm install --production
npm start

# Keep it running with pm2:
npm install -g pm2
pm2 start server.js --name vertex-website
pm2 save
pm2 startup
```

Add a reverse proxy (nginx or Caddy) in front of port 3000 to serve on port 80/443 with HTTPS.

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t vertex-website .
docker run -p 3000:3000 vertex-website
```

---

## Environment Variables

The app has no required environment variables in its current state. If you add integrations (email, analytics, etc.), add them to a `.env` file locally and set them in your hosting platform's dashboard.

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |

---

## Key Contact Details (in the code)

| Item | Value | Location in code |
|---|---|---|
| General enquiry email | `enquiry@vertexservice.ai` | Contact section, footer |
| Careers / job applications | `yibo@vertexservice.ai` | Careers tab, all job `mailto:` links |
| HQ location | Singapore | Hero badge, contact section |
| Repair centre | Johor Bahru, Malaysia | Hero badge, coverage section, contact |

To update any of these, search `index.ejs` for the current value and replace.

---

## Version History

See [CHANGELOG.md](CHANGELOG.md) for a full record of every change made across all 11 versions.
