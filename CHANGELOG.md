# Vertex Services Website — Build Summary

Live URL: **https://vertex-services-nine.vercel.app**  
Stack: Node.js · Express · EJS · Vanilla CSS/JS · Vercel

---

## Version 1 — Initial Build

**What was built from scratch:**

A full single-page marketing website for **Vertex Services**, a Singapore-headquartered AI hardware repair company serving Southeast Asia. The source material was a Chinese company profile PDF (Bainei Technology), which was adapted — all China-specific branding, cities, pricing, and personnel were removed and replaced with Singapore/SEA context.

### Tech Stack
- **Server:** Node.js + Express, EJS templating engine
- **Deployment:** Vercel (`@vercel/node` serverless builder) via `vercel.json`
- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (mono accents) — Google Fonts
- **Styling:** Single CSS file with custom property tokens
- **JS:** Vanilla JS — no frameworks

### Sections Built
| Section | Content |
|---|---|
| **Navbar** | Fixed top nav with logo, page links, "Get a Quote" CTA; collapses to hamburger on mobile |
| **Hero** | Full-height section with animated particle network canvas, headline, subtitle, two CTAs, animated stats bar (60+ engineers, 85%+ chip repair success, 60-day warranty, 24/7 support) |
| **About** | Two-column layout: company description + pillars (Chip-Level Expertise, Rapid Mobilisation, Parts Certainty, Certified Quality); stat cards; ISO cert badges |
| **Services** | 3-column grid of 6 service cards: GPU Core Repair, Whole-Machine Diagnosis, Spare-Parts Supply, Software Maintenance, On-site O&M, Extended Warranty |
| **Process** | 6-step repair process with vertical timeline; Emergency Response block showing 30-min/4-hr/24-hr escalation |
| **SLA Tiers** | 3-tier cards (Basic / Pro / MAX) with response SLAs, plus a Fault Severity table (P0–P3) |
| **Coverage** | Custom SVG Southeast Asia map showing Singapore HQ (cyan), Johor Bahru repair centre (violet), and planned cities (Bangkok, KL, Jakarta, Ho Chi Minh, Manila); coverage detail cards |
| **Facility** | 6-zone Johor Bahru repair centre overview (Receiving, Chip-Level, Diagnostic, Parts Warehouse, Testing, Clean Room) |
| **Case Studies** | 3 real-world case cards: Baseboard fault repair (JB data centre), 1,000-server GPU batch maintenance, VRAM chip replacement |
| **Contact** | Two-column: contact info + enquiry form; form POSTs to `/contact` endpoint |
| **Footer** | Logo, tagline, 3-column links, ISO cert badges, copyright |

### Design System (v1)
- **Theme:** Dark (deep navy backgrounds `#050D1A` to `#0C1A35`)
- **Accent colours:** Cyan `#00D4FF` + Violet `#7C3AED` — used together as gradients
- **Gradients:** `linear-gradient(135deg, cyan, violet)` on buttons, text, card borders, section lines
- **Hero background:** Animated canvas drawing a particle network (55 nodes, cyan/violet connections)
- **Borders:** Cyan-tinted `rgba(0, 212, 255, 0.10)`

### Deployment Setup
- Express app exports `module.exports = app` with conditional `app.listen` (runs only locally)
- `vercel.json` routes all requests to `server.js` via `@vercel/node`
- Project linked to Vercel team `yibo-s-vertex`, project slug `vertex-services`
- Deployed to: `https://vertex-services-nine.vercel.app`

---

## Version 2 — Font Size Increases + Mobile SLA Carousel

**What changed:**

### Font Size Increases
All sub-`0.9rem` text across the entire site was bumped up to enforce a readable minimum. Key changes:

| Element | Before | After |
|---|---|---|
| `.hero-badge` | `0.72rem` | `0.9rem` desktop / `0.82rem` mobile |
| `.section-label` | `0.72rem` | `0.85rem` |
| `.stat-label` | `0.78rem` | `0.9rem` |
| `.about-card-label` | `0.8rem` | `0.9rem` |
| `.service-card p` | `0.9rem` | `0.95rem` |
| `.service-tags li` | `0.72rem` | `0.8rem` |
| `.sla-positioning` | `0.88rem` | `0.95rem` |
| `.metric-val` | `0.85rem` | `0.92rem` |
| `.case-tag`, `.case-meta span` | `0.7rem` | `0.8rem` |
| `.kpi-label` | `0.72rem` | `0.85rem` |
| `label` | `0.82rem` | `0.9rem` |
| `.footer-bottom p` | `0.82rem` | `0.9rem` |
| Body / nav links | various | minimum `0.95rem` |

### Mobile SLA Swipe Carousel
On screens ≤768px, the SLA tier cards changed from a vertical stacked list to a **horizontal scroll-snap carousel**:

- `display: flex; overflow-x: auto; scroll-snap-type: x mandatory`
- Each card is `flex: 0 0 82%` so the next card peeks at the right edge
- `scrollbar-width: none` hides the scrollbar
- Three dot indicators (`·` `·` `·`) added below the carousel in the HTML
- JS tracks scroll position and highlights the active dot; clicking a dot scrolls to that card

---

## Version 3 — Minimalistic Rebrand (Dark Theme, No Gradients)

**Brief from user:** More minimalistic branding. No gradient colours. B2B company serving large institutional customers — build trust. References: Adyen, Stripe, Cloudflare.

**What changed:**

### Colour System Overhaul
| Token | Before | After |
|---|---|---|
| Primary accent | Cyan `#00D4FF` | Single accent `#00B8D9` |
| Secondary accent | Violet `#7C3AED` | Removed entirely |
| Green | `#00FF88` (brand use) | `#22C55E` (success states only) |
| Gradients | `--grad`, `--grad-text` | Removed entirely |
| Borders | `rgba(0,212,255,0.10)` cyan-tinted | `rgba(255,255,255,0.07)` white-tinted |

### Removed
- All `linear-gradient` and `radial-gradient` on backgrounds, buttons, and text
- Animated canvas particle network — removed from both JS and CSS (`display: none`)
- Hero overlay radial gradients
- All neon `box-shadow: 0 0 Xpx rgba(cyan)` glow effects on buttons, badges, nodes
- `.gradient-text` gradient clip — replaced with solid `color: var(--accent)`
- Violet as a brand colour
- Glow on `.badge-dot`, `.legend-dot`, `.sla-recommended`

### Changed
- **Buttons:** `.btn-primary` changed from gradient to solid `#00B8D9` flat button; `.nav-cta` same
- **Cards:** All accent-coloured gradient card backgrounds (`linear-gradient(135deg, rgba(cyan), var(--bg-card))`) replaced with flat `var(--bg-card)` — only border colour differs
- **Section labels:** Colour changed from `var(--cyan)` to `var(--text-dim)` (muted)
- **`.process-line`:** Gradient `cyan → violet` replaced with solid `var(--border)`
- **`.sla-recommended` badge:** Gradient → solid accent
- **`.case-tag`:** Violet-tinted → neutral white-tinted
- **Metric values, stats, KPI numbers:** Cyan → white text
- **Footer link hover:** Cyan → white

---

## Version 4 — Light Theme (White/Gray Backgrounds)

**Brief from user:** Alternate backgrounds so important information is on white. Hero (first landing section) on white.

**What changed:**

### Complete Theme Flip — Dark → Light

| Token | Dark theme (v3) | Light theme (v4) |
|---|---|---|
| `--bg-base` | `#06090F` | `#FFFFFF` |
| `--bg-section` | `#070C14` | `#F7F9FC` |
| `--bg-alt` | `#09101C` | `#FFFFFF` |
| `--bg-card` | `#0D1524` | `#FFFFFF` |
| `--bg-card-hover` | `#111C2E` | `#F7F9FC` |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(15,23,42,0.10)` |
| `--border-hover` | `rgba(255,255,255,0.14)` | `rgba(15,23,42,0.20)` |
| `--accent` | `#00B8D9` | `#0099B8` (darker for white-bg legibility) |
| `--text` | `#EEF2F9` (light) | `#0F172A` (dark navy) |
| `--text-muted` | `#8895AA` | `#475569` |
| `--text-dim` | `#546070` | `#94A3B8` |
| `--green` | `#22C55E` | `#16A34A` |
| `--red` | `#EF4444` | `#DC2626` |
| `--amber` | `#F59E0B` | `#D97706` |

### Section Alternation Pattern
The site now alternates between white and light-gray sections:

| Section | Background |
|---|---|
| Hero | White `#FFFFFF` |
| About | Light gray `#F7F9FC` |
| Services | White `#FFFFFF` |
| Process | Light gray `#F7F9FC` |
| SLA Tiers | White `#FFFFFF` |
| Coverage | Light gray `#F7F9FC` |
| Facility | White `#FFFFFF` |
| Case Studies | Light gray `#F7F9FC` |
| Contact | White `#FFFFFF` |
| Footer | **Dark navy** `#08101E` (dark island) |

### Footer Dark Island
The footer stays dark while the rest of the page is light, implemented via **CSS custom property scoping**:
```css
.footer {
  --text: #E2E8F0;
  --text-muted: #8895AA;
  --border: rgba(255,255,255,0.08);
  background: #08101E;
}
```
All elements inside `.footer` automatically use the dark-theme token values without any extra overrides.

### Navbar
- At the top: transparent — white page background shows through naturally
- On scroll: `rgba(255,255,255,0.95)` frosted glass with bottom border

### Cards
Subtle `box-shadow: 0 1px 3px rgba(15,23,42,0.05)` added so cards lift off both white and gray section backgrounds.

### SEA Coverage Map
The SVG map was redesigned for the light ocean background (`#EBF3F8`):
- **Land masses:** Changed from near-invisible `rgba(0,212,255,0.06)` fills to solid `#C2D8E8` with `#8AAEC8` strokes — clearly visible on light blue ocean
- **Connection lines:** Changed from coloured (cyan/violet) to `rgba(0,153,184,0.55)` and `rgba(0,100,140,0.20)` — readable without being jarring
- **Singapore HQ node:** `#0099B8` (accent)
- **Johor Bahru node:** `#3B7A9E` (darker blue-slate)
- **Planned city nodes:** `#6B9FB8` (muted)
- **Text labels:** Dark navy/teal on light ocean — legible at small sizes
- Removed radial glow gradients (incompatible with light theme)

### Other Updates
- All `rgba(255,255,255,X)` semi-transparent overlays → `rgba(0,0,0,X)` equivalents
- Emergency block: dark-theme subtle bg → `rgba(220,38,38,0.03)` red-tinted light bg
- Section labels: changed from `var(--text-dim)` back to `var(--accent)` — provides rhythm on light backgrounds
- Hero stats bar: dark glass → `var(--bg-section)` light gray card
- Contact form background: `var(--bg-section)` light gray (sits on white contact section)
- `.section-label` colour: accent teal — creates visual rhythm across sections
- `.pillar-icon`, `.service-icon`, `.contact-icon`: accent-dim tinted background with accent border

---

## Version 5 — Multi-Tab Layout & Green Rebrand

**Brief from user:** Convert from single-page scroll to multi-tab navigation. Set all section backgrounds to white (except footer). Rebrand colour theme to green, inspired by Adyen but with different hex codes.

### Tab Architecture

Single-page scroll replaced with a **5-tab navigation system** (`Home`, `Services`, `Coverage`, `Cases`, `Get a Quote`). All content is preserved — reorganised into tab panels:

| Tab | Panels |
|---|---|
| **Home** | Hero + About |
| **Services** | Services grid + Repair Process + SLA Tiers |
| **Coverage** | SEA Coverage Map + Repair Facility |
| **Cases** | Case Studies |
| **Contact** | Contact form + info |

**Implementation:**
- Each tab wraps content in `<div class="tab-panel" id="panel-X">`
- `.tab-panel { display: none }` / `.tab-panel.active { display: block }`
- JS `switchTab(tabName)` function activates panel, scrolls to top, updates URL hash
- `data-goto-tab="X"` attribute on any button/link — intercepted by a single document-level click listener
- `history.replaceState` keeps URL hash in sync; initial tab restored from hash on load
- **IntersectionObserver + display:none fix:** double `requestAnimationFrame` workaround in `revealVisibleInPanel()` forces scroll-reveal elements to become visible after tab switch

### Green Colour System

| Token | Previous (teal) | New (green) |
|---|---|---|
| `--accent` | `#0099B8` | `#0E9850` |
| Active nav underline | teal | `#0E9850` |
| Hover accent | `#0077A0` | `#0A7840` |
| Footer accent (dark bg) | `#00B8D9` | `#1FC870` |
| SEA map HQ node | `#0099B8` | `#0E9850` |
| SEA map JB node | `#3B7A9E` | `#2E7D4F` |
| SEA map planned nodes | `#6B9FB8` | `#5AA872` |
| Map connection lines | `rgba(0,153,184,…)` | `rgba(14,152,80,…)` |

Logo SVG updated from teal to solid green `#0E9850`. Footer logo uses `#1FC870` on dark background. All section backgrounds set to `#FFFFFF` (white).

### Other Changes
- Nav links changed from `<a href="#section">` anchors to `<button class="nav-tab" data-tab="X">` tab buttons
- All internal CTAs changed from scroll-anchors to `data-goto-tab` buttons
- Footer nav links changed from `<a>` to `<button class="footer-link-btn" data-goto-tab="X">`
- Google Fonts updated to: Space Grotesk, Inter, JetBrains Mono

---

## Version 6 — Dark Navbar, Rebrand, Contact & Image Update

**Brief from user:** Dark header background, full company name, updated contact details, remove "First Repair Centre" references, add facility photos.

### Dark Navbar

Navbar background changed from white/frosted glass to dark navy, matching the footer's aesthetic.

| Element | Before | After |
|---|---|---|
| Navbar background | `rgba(255,255,255,0.95)` | `#0B1425` |
| Navbar border | `var(--border)` light | `rgba(255,255,255,0.08)` |
| Logo text colour | `var(--text)` dark navy | `#E2E8F0` light |
| Nav tab default colour | `var(--text-muted)` | `rgba(203,213,225,0.75)` |
| Nav tab hover colour | `var(--text)` | `#E2E8F0` |
| Nav tab hover background | `rgba(15,23,42,0.05)` | `rgba(255,255,255,0.07)` |
| Active tab indicator | `#0E9850` green | `#1FC870` bright green (dark bg) |
| Hamburger lines | `var(--text-muted)` | `#94A3B8` |
| Mobile dropdown background | `rgba(255,255,255,0.97)` | `#0D1F35` dark |
| Mobile dropdown border | `var(--border)` | `rgba(255,255,255,0.08)` |

### Company Name

Full legal name applied throughout the website.

| Location | Before | After |
|---|---|---|
| Page `<title>` | `Vertex Services — …` | `Vertex Infrastructure Services Pte. Ltd. — …` |
| About section label | `About Vertex Services` | `About Vertex Infrastructure Services` |
| About body text | `Vertex Services is a Singapore-incorporated …` | `Vertex Infrastructure Services Pte. Ltd. is a Singapore-incorporated …` |
| Footer copyright | `© 2025 Vertex Services Pte. Ltd.` | `© 2025 Vertex Infrastructure Services Pte. Ltd.` |

The `VERTEX SERVICES` logo mark (nav + footer) is retained as the design shortname.

### Contact Details

| Field | Before | After |
|---|---|---|
| Email (contact section) | `hello@vertexservices.sg` | `enquiry@vertexservice.ai` |
| Email (footer) | `hello@vertexservices.sg` | `enquiry@vertexservice.ai` |
| Phone (contact section) | `+65 0000 0000` (24/7 Hotline block) | **Removed** |
| Phone (footer) | `\| +65 0000 0000` | **Removed** |

### "First Repair Centre" Removal

All instances of "First" preceding "Repair Centre" removed site-wide:

| Location | Before | After |
|---|---|---|
| Hero badge | `First Repair Centre: Johor Bahru` | `Repair Centre: Johor Bahru` |
| Meta description | `first repair centre in Johor Bahru` | `repair centre in Johor Bahru` |
| About body | `Our first dedicated repair centre is established` | `Our dedicated repair centre is established` |
| Coverage section sub | `our first repair centre in Johor Bahru` | `our repair centre in Johor Bahru` |
| Coverage point status | `Operational — First Repair Centre` | `Operational` |
| Contact details | `First Repair Centre` | `Repair Centre` |

### Images Added

142 images were extracted from the source PDF (`BAINEI TECHNOLOGY.pdf`) using `pymupdf`. Best images were selected and placed in four key areas:

| Placement | File | Description |
|---|---|---|
| Hero — strip below stats | `pdf_p52_0.jpeg` (3840×1211) | Wide panoramic of engineer probing GPU board; dark moody blue tone |
| About — right column | `pdf_p11_0.jpeg` (2730×1535) | Close-up gloved hands doing precision PCB repair; clean white background |
| Services — banner above grid | `pdf_p67_0.jpeg` | Engineers in uniforms at diagnostic workstations with GPU servers |
| Facility — photo gallery (3) | `pdf_p65_1.jpeg` | Diagnostic testing lab with GPU/server testing stations |
| Facility — photo gallery (3) | `pdf_p65_9.jpeg` | Clean-room-style GPU testing zone, wide-angle |
| Facility — photo gallery (3) | `pdf_p66_0.jpeg` | Parts warehouse with palletised stock and forklift |

**New CSS classes:**
- `.hero-visual` — rounded banner strip, `height: 300px` desktop / `200px` mobile
- `.about-photo` — right-column image, `height: 260px` desktop / `200px` mobile
- `.services-visual` — full-width banner with gradient overlay caption, `height: 340px` desktop / `220px` mobile
- `.services-visual-caption` — absolute-positioned caption at bottom of services banner
- `.facility-photos` — 3-column grid (`1fr` on mobile)
- `.facility-photo` — card with hover zoom effect on image, label below

---

## Version 7 — Coverage Redesign, Real SEA Map & Mobile Polish

**Brief from user:** Remove ISO certifications, rewrite coverage to reflect all-SEA service with Singapore HQ and planned Q4 2026 repair centres in Johor Bahru and Bangkok, replace abstract map with actual country outlines, restructure detail cards, and add mobile breathing space.

### ISO Certifications Removed

| Location | Change |
|---|---|
| About section | `cert-badges` block removed entirely |
| Footer | Certifications column removed entirely |

### Coverage Section Rewritten

The old split-by-site coverage model was replaced with an all-SEA coverage model.

| Element | Before | After |
|---|---|---|
| Section subtitle | Mentioned separate site tabs | "Serving All of Southeast Asia" — single unified service |
| Structure | Separate tabs/cards per site | HQ (Singapore, operational) + Repair Centres (JB + Bangkok, Q4 2026) |
| JB status | Operational | Operational (unchanged) |
| Bangkok | Not prominently featured | Promoted to full planned repair centre card |
| Marker colours | Green for operational, blue-grey for planned | Green for HQ, amber `#D97706` for Q4 2026 planned centres |

New `coverage-area-note` added listing all SEA countries served: Singapore · Malaysia · Indonesia · Thailand · Vietnam · Philippines · Myanmar · Cambodia · and all of Southeast Asia.

### SEA Map — Actual Country Outlines

The previous abstract hand-drawn shapes were replaced with simplified but geographically accurate country outlines.

| Before | After |
|---|---|
| Abstract blobs (4–5 generic shapes) | Proper country polygons for all 12 SEA countries/island groups |
| Animated pulse rings around markers | Clean solid markers — no rings |
| 3-item legend (HQ, Repair Centre, Coverage Area) | 2-item legend (HQ operational, Repair Centre Q4 2026) |
| Grid pattern background | Solid ocean blue `#C5D9EC` |

Countries rendered: Myanmar · Thailand · Laos · Vietnam · Cambodia · Malaysia Peninsula · Sumatra · Java · Borneo · Sulawesi · Philippines (Luzon, Visayas, Mindanao).

Site markers: Singapore HQ (green `#0E9850`, 8px), Johor Bahru (amber `#D97706`, 6px), Bangkok (amber `#D97706`, 7px) — all with white `stroke-width: 2` rings for legibility on the land fill.

Context labels retained (faint): Kuala Lumpur, Ho Chi Minh, Manila.

New CSS: `.country { fill: #C8D8C8; stroke: #9AB0A0; stroke-width: 0.8; }` — applied to all country `<path>` and `<polygon>` elements via class.

Pulse ring CSS (`@keyframes pulseRingAnim`, `.pulse-ring`, `.pulse-ring-2`) removed.

### Coverage Detail Cards — Grouped Layout

| Before | After |
|---|---|
| Flat list of 3 cards | Cards grouped under "HQ" and "Repair Centre" section headers |
| "Singapore Headquarters" title | "Singapore" |
| "Johor Bahru Repair Centre" title | "Johor Bahru" |
| "Bangkok Repair Centre" title | "Bangkok" |

New HTML structure: `.coverage-group` wraps a `.coverage-group-label` header and one or more `.coverage-point` cards.

New CSS:
```css
.coverage-group { display: flex; flex-direction: column; gap: 12px; }
.coverage-group-label {
  font-size: 0.7rem; font-family: var(--font-mono);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-dim); padding-left: 2px;
}
```

### Mobile Breathing Space

Added extra top padding for the first section in Services, Coverage, and Cases tabs on mobile, creating breathing room between the fixed dark navbar and the first line of page content.

```css
@media (max-width: 768px) {
  #panel-services > .section:first-child,
  #panel-coverage > .section:first-child,
  #panel-cases    > .section:first-child { padding-top: 120px; }
}
```

Before: `72px` (inherited from `.section` mobile rule). After: `120px` (+48px).

---

## Version 8 — Careers Page, Prominent Coverage Labels

**Brief from user:** Replace Cases tab with a Careers page, and make the "HQ" / "Repair Centre" group labels on the Coverage tab bigger and more prominent.

### Coverage — Group Label Styling

| Property | Before | After |
|---|---|---|
| `font-size` | `0.7rem` | `0.82rem` |
| `color` | `var(--text-dim)` (faint grey) | `var(--accent)` (`#0E9850` green) |

Labels now match the accent-coloured `.section-label` pattern used across the rest of the site, making "HQ" and "REPAIR CENTRE" clearly readable as group headers.

### Cases Tab → Careers Tab

The "Cases" nav tab was removed and replaced with a "Careers" tab (`data-tab="career"`, panel `#panel-career`). The footer "Case Studies" link was updated to "Careers" accordingly.

**Career page structure:**

1. **Section header** — "Build the Future of AI Infrastructure"
2. **Value pillars** (reuses `.about-pillars` + `.pillar` classes) — 3 items:
   - Frontier Hardware — hands-on with NVIDIA H-Series/A-Series GPU modules
   - Regional Growth — expand with us into JB, Bangkok, and beyond
   - Real-World Impact — mission-critical work with visible outcomes
3. **Open Positions** — 2-column grid of 4 job cards, each with location tag, type tag, description, and `mailto:` apply link:
   - GPU Repair Technician (Johor Bahru)
   - Field Service Engineer (Singapore / Regional)
   - Technical Operations Lead (Singapore)
   - Business Development Executive (Singapore)
4. **Open-application CTA** — "Don't see your role? Send your CV to enquiry@vertexservice.ai"

**New CSS classes added:**

| Class | Purpose |
|---|---|
| `.careers-values` | Wrapper for the value pillars (`margin-bottom: 56px`) |
| `.careers-section-label` | "Open Positions" sub-header in green mono |
| `.careers-grid` | 2-column job cards grid (1-column on mobile ≤768px) |
| `.career-card` | Individual job card (flex column, gap, border, shadow) |
| `.career-card-top` | Title + tags grouping within card |
| `.career-title` | Job title (`1.1rem`, `var(--text)`) |
| `.career-tags` | Flex row of tag pills |
| `.career-tag` | Neutral location pill (mono, rounded, `var(--bg-section)` bg) |
| `.career-tag.type-tag` | "Full-time" pill in accent green |
| `.career-apply` | Mono green link "Apply for this role →" |
| `.careers-cta` | Centred open-application block at bottom of page |
| `.careers-email` | Green email link within CTA |

Mobile responsive: `#panel-career > .section:first-child` gets `padding-top: 120px` (same breathing-space rule as Services and Coverage); `.careers-grid` collapses to single column.

---

## File Structure

```
Vertex Website/
├── server.js           # Express server; exports app for Vercel compatibility
├── vercel.json         # Vercel routing — all requests → server.js
├── package.json        # Dependencies: express, ejs; devDeps: nodemon, vercel
├── .gitignore          # Excludes node_modules, .env, .DS_Store, .claude/
├── CHANGELOG.md        # This file
├── views/
│   └── index.ejs       # Single-page HTML template (all 10 sections)
└── public/
    ├── css/
    │   └── main.css    # Complete design system (~850 lines)
    └── js/
        └── main.js     # Navbar scroll, mobile nav, counters, scroll-reveal, SLA carousel dots
```
