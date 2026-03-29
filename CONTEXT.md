# CONTEXT.md — WAHEED Full Project Context

> **Start every session by reading this file and `/var/www/waheed.in/frontend/DESIGN.md`.**
> This document is the single source of truth for the project. It must be kept current.

---

## 1. PROJECT IDENTITY

### Full Identity
- **Project name:** WAHEED — India's First Halal Digital Studio
- **Domain:** waheed.in
- **Founder:** Ashraf Waheed
- **Email:** hello@waheed.in
- **Location:** India (serving clients worldwide)

### What WAHEED Is
WAHEED is a Shariah-aligned digital studio that helps Muslim-led brands grow online. It provides web development, social media marketing, and business coaching — all governed by Islamic ethics.

WAHEED is not a mainstream agency that adds a "halal checkbox". It exists because Muslim entrepreneurs are consistently failed by agencies that use dark patterns, riba-based tools, haram ad placements, and manipulative growth tactics. WAHEED is the alternative.

**Primary market:** Muslim entrepreneurs and business owners in India and globally who want digital services that do not compromise their deen.

**Secondary market:** Ethical businesses of any background who want honest, no-dark-pattern digital work.

### The Core Belief
> **"Success does not require disobedience."**

This is the manifesto headline. It is the foundation of every decision — product, design, pricing, and content.

### The Manifesto
The manifesto is expressed throughout the site. Key lines:
- *"Success does not require disobedience."* — Hero H1
- *"If growth costs integrity, it is not growth."* — ManifestoBand quote
- *"We build with intention."* — WhatWeDo section
- *"Every project begins with a question: does this serve a real need, respect the user, and hold up to accountability before Allah?"*
- *"Technology is not neutral. What we build shapes behaviour."*

### Brand Voice
**Use:**
- "We believe", "We help", "We choose", "Aligned", "Intentional"
- "Transparent", "Ethical", "Ihsan", "Barakah"
- Calm, respectful, measured — no hype

**Never use:**
- "Guaranteed", "Viral", "Hack", "Dominate", "Crush", "Explode your growth"
- Fake urgency: "Only 2 spots left", "Limited time"
- Inflated social proof: fake subscriber counts, invented testimonials

### When Declining a Project
If a prospect asks WAHEED to work on something that violates Shariah boundaries, the response is:
> *"We're not the right fit for this one — but we wish you well."*

No lecture. No condemnation. Just a clean, respectful decline.

---

## 2. SHARIAH BOUNDARIES — NON-NEGOTIABLE

These apply to **every line of code, every design decision, every word**.

### What WAHEED Will Never Build or Promote
- Gambling platforms or gambling-adjacent apps
- Alcohol, tobacco, or substance brands
- Adult content or dating services
- Riba-based fintech (interest-bearing loans, credit cards, BNPL schemes)
- Crypto scam projects, NFT rugpull setups
- Influencer marketing for haram products
- Paid social campaigns promoting haram products (even for existing clients)

### UX Ethics — Forbidden Dark Patterns
- Fake countdown timers (scarcity manipulation)
- Forced continuity (subscriptions that are hard to cancel)
- Hidden fees revealed only at checkout
- Pre-checked consent boxes
- Misleading "X people are viewing this now" widgets
- Roach motel patterns (easy to get in, hard to get out)
- Disguised advertising presented as content
- Privacy-invasive tracking without explicit consent
- Any pattern designed to trick rather than inform

### Privacy Commitments
- User data is never sold to third parties
- No ad network tracking pixels (no Facebook Pixel, no Google Ads remarketing)
- GA4 used for analytics with explicit consent — no fingerprinting
- Newsletter: unsubscribe is always one click, always works
- Forms do not pre-fill or auto-submit

### Payment Ethics
- No riba (interest): WAHEED does not offer BNPL or installment plans with interest
- No hidden fees: all pricing is stated upfront and fully transparent
- PayPal Checkout is used for payments — straightforward, no riba
- WAHEED does not upsell aggressively or create artificial urgency around payments

### Content Moderation Rules
- Blog and newsletter: no content promoting haram products or lifestyles
- All paid social campaigns reviewed before launch — halal content only
- Case studies published only with explicit client permission
- No fake or implied testimonials — all testimonials are real (or marked as placeholder)

---

## 3. SERVER & INFRASTRUCTURE

### Provider & Access
- **Provider:** Hetzner Cloud
- **OS:** Ubuntu 24.04 LTS
- **IP:** 116.203.45.2
- **SSH user:** `dev` (sudo, passwordless)
- **SSH command:** `ssh dev@116.203.45.2`

### Directory Structure
```
/var/www/waheed.in/
├── CLAUDE.md                    # Project bible — session log, build phases
├── CONTEXT.md                   # This file — full project context for AI agents
├── ecosystem.config.js          # PM2 process config for both services
├── frontend/                    # Next.js 16 app → port 3000
│   ├── DESIGN.md                # Design system reference
│   ├── AGENTS.md                # Next.js version warning
│   ├── package.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── globals.css      # Tailwind v4 import + CSS vars + keyframes
│       │   ├── layout.tsx       # Root layout: fonts, metadata, Footer
│       │   ├── page.tsx         # Homepage — renders all 11 sections + Nav
│       │   └── services/
│       │       ├── page.tsx             # Server component — exports metadata
│       │       └── ServicesContent.tsx  # Client component — full services page
│       └── components/
│           ├── layout/
│           │   ├── Nav.tsx      # Sticky nav, scroll-shrink, mobile overlay
│           │   └── Footer.tsx   # 4-col footer, social SVG icons, Arabic duaa
│           ├── sections/        # One file per homepage section
│           │   ├── Hero.tsx
│           │   ├── TrustStrip.tsx
│           │   ├── FeaturedServices.tsx
│           │   ├── WhatWeDo.tsx
│           │   ├── ManifestoBand.tsx
│           │   ├── HowItWorks.tsx
│           │   ├── CaseStudies.tsx
│           │   ├── Testimonials.tsx
│           │   ├── BlogPreview.tsx
│           │   └── Newsletter.tsx
│           └── ui/              # Reusable primitive components
│               ├── Button.tsx
│               ├── SectionTag.tsx
│               ├── SectionTitle.tsx
│               ├── ArabicText.tsx
│               └── IslamicGeometry.tsx
└── backend/                     # Laravel 11 API → port 8000
    ├── artisan
    ├── .env
    ├── app/
    ├── routes/
    │   └── api.php
    └── database/
        └── migrations/
```

### Nginx Configuration
File: `/etc/nginx/sites-enabled/waheed.in`

```nginx
server {
    server_name waheed.in www.waheed.in;
    listen 443 ssl;
    # SSL managed by Certbot — DO NOT MODIFY these lines
    ssl_certificate /etc/letsencrypt/live/waheed.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/waheed.in/privkey.pem;

    # Laravel API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Next.js frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
# HTTP → HTTPS redirect handled by Certbot blocks below
```

**IMPORTANT:** Never modify the Certbot SSL lines. The cert auto-renews.

### PM2 Process Management
Config file: `/var/www/waheed.in/ecosystem.config.js`

| Process | Name | CWD | Script | Port |
|---|---|---|---|---|
| Frontend | waheed-frontend | /var/www/waheed.in/frontend | npm run start | 3000 |
| Backend | waheed-backend | /var/www/waheed.in/backend | php artisan serve | 8000 |

Both processes restart automatically (max 10, 3s delay). PM2 startup is registered with systemd — both services resurrect on server reboot.

**Common PM2 commands:**
```bash
pm2 status                          # check both processes
pm2 restart waheed-frontend         # after npm run build
pm2 restart waheed-backend          # after Laravel changes
pm2 logs waheed-frontend --lines 50 # view frontend logs
pm2 logs waheed-backend --lines 50  # view backend logs
pm2 save                            # persist process list (already done)
```

### Database
- **Engine:** MySQL 8
- **Database:** `waheed`
- **User:** `waheed_user`
- **Password:** in `/var/www/waheed.in/backend/.env`
- Connect: `mysql -u waheed_user -p waheed`

### Redis
- Running and enabled as a systemd service
- Used for Laravel Queues
- Check: `redis-cli ping` → should return `PONG`

### SSL
- Provider: Let's Encrypt via Certbot
- Auto-renews via cron
- Do not manually edit `/etc/nginx/sites-enabled/waheed.in` SSL blocks

### Service Restart Workflow
After any frontend code change:
```bash
cd /var/www/waheed.in/frontend
npm run build
pm2 restart waheed-frontend
```

After any backend code change:
```bash
pm2 restart waheed-backend
# or for migration changes:
cd /var/www/waheed.in/backend
php artisan migrate
pm2 restart waheed-backend
```

---

## 4. TECH STACK — COMPLETE

### Frontend
- **Framework:** Next.js 16.2.1 with Turbopack, App Router, TypeScript
  - IMPORTANT: This is Next.js 16, which may have breaking changes vs 14/15. Read `node_modules/next/dist/docs/` before writing unfamiliar patterns.
  - Metadata export requires a **server component** — cannot use `metadata` + `"use client"` in the same file
  - Solution used throughout: server `page.tsx` exports `metadata` + imports client `*Content.tsx` wrapper
- **Styling:** Tailwind CSS v4
  - Import syntax: `@import "tailwindcss"` (NOT `@tailwind base/components/utilities` — that is v3)
  - PostCSS plugin: `@tailwindcss/postcss`
  - Design tokens: CSS custom properties in `globals.css` `:root` block
- **Animations:** Framer Motion v12
  - **CRITICAL:** `ease` values inside `Variants` objects must be typed as `const` tuples: `[number, number, number, number]`, NOT strings like `"easeOut"`. TypeScript will error.
  - Always: `const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]`
  - Always: `import type { Variants } from "framer-motion"`
  - For overlay animations WITHOUT variants (to avoid type issues): use inline `initial/animate/exit` props directly on `motion.div`
  - `useReducedMotion()` used in Hero to skip animation for accessibility
- **Icons:** Lucide React
  - **IMPORTANT:** Lucide does NOT export brand/social icons (Instagram, Twitter, LinkedIn, YouTube). Use inline SVG `<path d="...">` for social icons.
- **Fonts:** via `next/font/google`
  - `Cormorant_Garamond` → CSS var `--font-cormorant` — display, headings, quotes, prices
  - `DM_Sans` → CSS var `--font-dm-sans` — body, UI, labels
  - `Amiri` → CSS var `--font-amiri` — Arabic script only
  - All three declared in `layout.tsx`, applied as class variables on `<html>`
- **Forms:** React Hook Form + Zod (planned for Phase 4; Newsletter currently uses `useState`)
- **Data fetching:** SWR (planned for Phase 4; currently all static data)
- **Path alias:** `@/` → `src/`

### Backend
- **Framework:** Laravel 11
- **Auth:** Laravel Sanctum (SPA cookie-based auth)
- **ORM:** Eloquent (MySQL 8)
- **File storage:** Cloudflare R2 or AWS S3 (not yet configured — Phase 4)
- **Email:** Mailgun or Resend (not yet configured — Phase 4)
- **Queues:** Laravel Queues backed by Redis
- **Dev server:** `php artisan serve --host=127.0.0.1 --port=8000`
- **Note:** `APP_ENV=production`, `APP_DEBUG=false` in `.env`. Use `--force` flag on `artisan key:generate` in production.

### Mobile (Future — Phase 5+)
- React Native (Expo or bare workflow) for iOS + Android
- Flutter as alternative
- Shared Laravel backend with same auth/API
- FCM (Firebase Cloud Messaging) for push notifications

### Analytics & Payments
- **Analytics:** GA4 — with explicit user consent (no auto-tracking)
- **Payments:** PayPal Checkout — no BNPL, no riba-based installments

### Version Control
- **Repo:** `git@github.com:AshrafWaheed/waheed.in.git`
- **Branch:** `main`
- **Working directory for commits:** `/var/www/waheed.in`

---

## 5. DESIGN SYSTEM — COMPLETE

### Colour Tokens (defined in `globals.css` `:root`)

| Variable | Hex | Usage |
|---|---|---|
| `--green` | `#3d6b4f` | Primary brand green, icons, active states |
| `--green-dark` | `#2a4d38` | Dark section backgrounds, hero, nav |
| `--green-light` | `#5a8a6a` | Hover states, subtle accents |
| `--cream` | `#f5f0e8` | Page background, light text on dark |
| `--cream-dark` | `#ede7d9` | TrustStrip bg, card borders, dividers |
| `--yellow` | `#e8c547` | Primary accent, CTAs, active underlines, ✦ bullets |
| `--yellow-soft` | `#f0d778` | Yellow hover state |
| `--text-dark` | `#1a2e22` | Primary body text, headings on light bg |
| `--text-mid` | `#3d5245` | Secondary body text, descriptions |
| `--text-light` | `#7a9080` | Tertiary text, captions, placeholders |

Additionally used directly in components:
- `#1A2E22` — Footer background (darkest green, same value as `--text-dark`)
- `#1e3b2a` — Hero floating card background (slightly darker than green-dark)
- `#3D6B4F` — Blog/case study card background (same as `--green`)
- `#EDE7D9` — TrustStrip background (same as `--cream-dark`)

### Section Background Pattern
The homepage alternates dark green and light sections for visual rhythm:
- Hero: `#2A4D38` (dark green)
- TrustStrip: `#EDE7D9` (cream-dark)
- FeaturedServices: `var(--cream)`
- WhatWeDo: `#2A4D38` (dark green)
- ManifestoBand: `#E8C547` (yellow)
- HowItWorks: `var(--cream)`
- CaseStudies: `#2A4D38` (dark green)
- Testimonials: `var(--cream)`
- BlogPreview: `#2A4D38` (dark green)
- Newsletter: `var(--yellow)`
- Footer: `#1A2E22` (darkest green)

### Typography

**Cormorant Garamond** (`font-[var(--font-cormorant)]`)
- Weights: 400, 600, 700 — normal and italic
- Used for: H1/H2/H3 display headings, pull quotes, manifesto text, large prices
- Italic + large size = high visual impact. Used for hero H1, ManifestoBand quote.
- Font size pattern: `style={{ fontSize: "clamp(3rem, 6.5vw, 6rem)" }}` for responsive scaling

**DM Sans** (`font-[var(--font-dm-sans)]`)
- Weights: 400, 500, 600
- Used for: body copy, UI labels, nav links, descriptions, form inputs, buttons, captions
- Default body font set in `globals.css`

**Amiri** (`font-[var(--font-amiri)]`)
- Weights: 400, 700
- Used for: Arabic text ONLY — Bismillah, duaa, decorative Islamic phrases
- Always with `lang="ar" dir="rtl"` (handled by `ArabicText` component)

### Animation System

All scroll animations use Framer Motion `whileInView` with:
```tsx
viewport={{ once: true, margin: "-80px" }}
```

**Standard ease curve:**
```tsx
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
```

**Standard variant patterns:**
```tsx
// Fade up (most common)
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

// Stagger container
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// Slide from left
const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE_OUT } },
};

// Slide from right
const slideRight: Variants = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE_OUT, delay: 0.18 } },
};
```

**Hero floating cards:** CSS keyframe animation — `translateY` 0px → -12px → 0px, 6s loop:
```css
.animate-float          { animation: float 6s ease-in-out infinite; }
.animate-float-delayed  { animation: float 6s ease-in-out 2s infinite; }
.animate-float-delayed-2{ animation: float 6s ease-in-out 4s infinite; }
```

**Nav scroll-shrink:** padding `1.4rem` → `0.9rem`, bg opacity `70%` → `95%` on `window.scrollY > 48`

**`prefers-reduced-motion`:** Hero uses `useReducedMotion()` to skip animations. CSS keyframes have `@media (prefers-reduced-motion: reduce)` overrides in `globals.css`.

### Islamic Decorative Elements

**✦ (Celestial/Islamic star)** — used as:
- Section/feature list bullet (yellow, `fontSize: "0.6rem"` or `"0.65rem"`)
- Decorative elements in ManifestoBand (large, opacity 0.12)
- Newsletter indicators

**IslamicGeometry SVG** — 8-pointed khatam star. Used as:
- Hero: top-right (`size=680, opacity=0.06`) + bottom-left echo (`size=500, opacity=0.04`)
- Services Hero: top-right (`size=600, opacity=0.06`)
- **CRITICAL opacity rule:** Opacity controlled ONLY at SVG level via `style={{ opacity }}`. No `fillOpacity` or `strokeOpacity` on child elements — they multiply and produce near-invisible results.

**Bismillah:** `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ` — appears centered above hero heading on dark green sections. Uses `<ArabicText size="2xl" opacity={0.65}>`.

**Duaa in Footer:** `رَبَّنَا تَقَبَّلْ مِنَّا` with translation *"Our Lord, accept from us." — Al-Baqarah 2:127*.

---

## 6. COMPLETE FILE STRUCTURE

### `/var/www/waheed.in/frontend/src/`

#### `app/globals.css`
Tailwind v4 import (`@import "tailwindcss"`), all CSS custom properties for brand colours, keyframe definitions (float, fade-up), `@layer base` body/heading font assignments, `@layer utilities` animation classes with `prefers-reduced-motion` override.

#### `app/layout.tsx`
Root layout. Server component. Loads Cormorant Garamond, DM Sans, Amiri via `next/font/google` as CSS variable classes. Sets site-wide `<Metadata>` (title, description, OG tags). Renders `<Footer />` globally so it appears on every page.

#### `app/page.tsx`
Homepage. Server component. Imports and renders `<Nav />` followed by all 11 homepage sections in order.

#### `app/services/page.tsx`
Services page route. Server component. Exports page-level `<Metadata>`. Renders `<ServicesContent />`.

#### `app/services/ServicesContent.tsx`
Full `/services` page implementation. Client component (`"use client"`). Contains all pricing data as typed TypeScript objects, `PricingCard` and `PricingGroup` sub-components, and 5 sections: Hero, Fixed Pricing, Custom Projects, ISLAMify teaser, Bottom CTA.

#### `components/layout/Nav.tsx`
Sticky header. Client component. Features: W*HEED logo (yellow `*`), 6 nav links with `usePathname()` active detection (yellow underline), scroll-shrink on `scrollY > 48`, "Book a Free Consultation" desktop CTA → `/contact`, mobile hamburger that opens full-screen Framer Motion overlay with staggered link entrance. Body scroll locked when mobile menu open.

Nav links:
- Home → `/`
- Services → `/services`
- About → `/about`
- Work → `/work`
- Blog → `/blog`
- Contact → `/contact`

#### `components/layout/Footer.tsx`
4-column footer on `#1A2E22` background. Server component. Columns: Brand (W*HEED logo + tagline + inline SVG social icons), Services links, Company links, Contact (yellow CTA button + email + location). Bottom bar: copyright + Arabic duaa (Amiri font). Social icons use inline SVG `<path>` — Lucide does not export Instagram/Twitter/LinkedIn/YouTube brand icons.

#### `components/sections/Hero.tsx`
Full-viewport dark green section. Two IslamicGeometry SVGs (top-right + bottom-left echo). Bismillah above tag. SectionTag "India's First Halal Digital Studio" (light). H1 "Success does not require disobedience." italic Cormorant `clamp(3rem, 6.5vw, 6rem)`. Subheadline. Two Button CTAs. Three floating service cards with staggered CSS float animation. Scroll hint with animated line. Uses `useReducedMotion()`.

#### `components/sections/TrustStrip.tsx`
Cream-dark background horizontal strip. 5 indicators with ✦ yellow bullets: Shariah-Compliant, Transparent Pricing, Muslim-Led Studio, Long-Term Growth, Ihsan in Every Detail. Grid: 2-col mobile (5th item `col-span-2`), 5-col desktop. Staggered `whileInView` fade-up.

#### `components/sections/FeaturedServices.tsx`
Cream background. Three service group cards (01 Development, 02 Marketing, 03 Coaching). Each card has: Cormorant number, Lucide icon, title, description, sub-service bullet list with `·` dots. **CSS-only hover flip** via `group-hover:bg-[#2A4D38]` — all text and icon colours transition. "View Pricing →" ghost link → `/services`.

#### `components/sections/WhatWeDo.tsx`
Dark green background. 55/45 split layout. Left: SectionTag "Our Approach" (accent/yellow), SectionTitle "We don't just build. We build with intention.", body copy, 4 pillars 2×2 grid (Ethics First, Transparent, Long-term, Accountable). Right: 16:9 video placeholder (`#3D6B4F`, yellow play button, "02:47" label). Slide-in from opposing sides on scroll.

#### `components/sections/ManifestoBand.tsx`
Full-bleed yellow band. Centered blockquote: *"If growth costs integrity, it is not growth."* Cormorant italic `clamp(2.5rem, 5vw, 5rem)`. Attribution: "— WAHEED Manifesto". Decorative ✦ stars left and right at `opacity: 0.12`, staggered fade-in. Scale `0.95 → 1` + fade on scroll.

#### `components/sections/HowItWorks.tsx`
Cream background. 3-step process using `<Fragment>` to insert connectors between steps. Desktop: horizontal dashed `border-t-2 border-dashed` connectors. Mobile: vertical dashed `border-l-2 border-dashed` spacers. Each step: dark green `#2A4D38` circle with Cormorant number, title, description. Bottom CTA: "Start with a Free Call" → `/contact`. Stagger 0.2s per step.

#### `components/sections/CaseStudies.tsx`
Dark green background. Asymmetric `lg:grid-cols-5` grid: featured card `col-span-3` (portrait `aspect-[4/3]`) + two secondary cards `col-span-2` (video `aspect-video`). `CategoryChip` sub-component (yellow badge). ArrowRight hover nudge (`group-hover:translate-x-1`). Gradient placeholder images with subtle crosshatch texture. Discretion note: "Client names withheld — case studies published with permission only."

Case study data (placeholder):
- Featured: "Building a halal e-commerce platform for a modest fashion brand" — Web Development
- Secondary 1: "Growing a halal food brand's community by 300% in 4 months" — Social Media
- Secondary 2: "Helping a Muslim-led consultancy reposition and reprice" — Coaching

#### `components/sections/Testimonials.tsx`
Cream background. Section: "Kind Words" / "What our clients say". Three white cards (`border border-[var(--cream-dark)]`). Each card: large yellow `"` quote mark (4rem Cormorant), italic blockquote text, 12px `h-px` divider, initials avatar (dark green circle), name + role. Stagger 0.15s.

Testimonial data (placeholder):
- Fatima R., Founder — Modest Fashion Brand
- Ibrahim K., CEO — Halal Food Co.
- Aisha M., Director — Muslim-led Consultancy

#### `components/sections/BlogPreview.tsx`
Dark green background. Section: "Perspectives" / "Thinking out loud on faith, business & the web". Three `#3D6B4F` blog cards with: `CategoryChip` (yellow), date, Cormorant title, `line-clamp-2` DM Sans excerpt, "Read Article →" hover link. Hover: `-translate-y-1`. "Visit the Blog →" outline Button CTA. Stagger 0.13s.

Blog posts (placeholder):
- "Why halal isn't a niche — it's the future of ethical commerce" — Business, March 2025
- "Dark patterns are haram: designing with conscience" — Web Development, February 2025
- "Building a community vs. buying an audience" — Social Media, January 2025

#### `components/sections/Newsletter.tsx`
Yellow background. Two-column layout. Left: SectionTag "Newsletter", heading "Grow your business without compromising your deen.", body copy, 3 indicators: ✦ 100% Halal Content / ✦ No Ads. Ever. / ✦ Unsubscribe Anytime. Right: cream-bg card with email input + "Subscribe — it's free" dark green button. Controlled with `useState`. Success state: "JazakAllahu Khayran." confirmation message. Opt-in note: no spam, data never sold.

#### `components/ui/Button.tsx`
Client component. `forwardRef`. Props: `variant` (primary/outline/ghost), `size` (sm/md/lg), `href` (renders as `<Link>` when provided, otherwise `<button>`).
- `primary`: yellow bg, dark text, hover yellow-soft
- `outline`: cream border + cream text, hover fills cream bg (for use on dark green backgrounds)
- `ghost`: green text, hover underline

#### `components/ui/SectionTag.tsx`
Small uppercase label with horizontal line prefix. Props: `light` (cream line + cream/70 text — for dark green backgrounds), `accent` (yellow line + yellow text — for dark green needing accent), default (green line + green text — for light backgrounds).

Usage pattern:
- On dark green bg: use `<SectionTag light>` or `<SectionTag accent>`
- On cream/light bg: use `<SectionTag>` (default)

#### `components/ui/SectionTitle.tsx`
Cormorant Garamond heading. Props: `as` (h1/h2/h3, default h2), `emphasis` (appended as italic coloured em), `light` (cream text + yellow emphasis for dark bgs), default (text-dark + green emphasis for light bgs). Can also inline `<em>` directly in children for more control.

#### `components/ui/ArabicText.tsx`
Wrapper for Arabic text. Props: `size` (sm/base/lg/xl/2xl/3xl), `opacity` (0–1), `className`. Renders as `<p lang="ar" dir="rtl">` with Amiri font, centred.

#### `components/ui/IslamicGeometry.tsx`
8-pointed khatam star SVG. Props: `size` (default 600), `color` (default `#F5F0E8`), `opacity` (default 0.06), `className`. **All opacity via SVG-level `style={{ opacity }}` ONLY.** No per-element `fillOpacity`/`strokeOpacity` — they would multiply and compound. Uses `currentColor` CSS property. Contains: solid star polygon, inner octagon outline, outer octagon ring, 8 radial guide lines, bounding circle, centre dot.

---

## 7. WHAT HAS BEEN BUILT — PHASE BY PHASE

### Phase 1 — COMPLETE

**Infrastructure:**
- Hetzner Cloud server provisioned (Ubuntu 24.04 LTS)
- Node.js v22 installed via NodeSource `setup_22.x`
- PHP 8.3 + extensions (mbstring, xml, bcmath, mysql, curl, zip, pdo)
- Composer v2 installed
- MySQL 8 installed, `waheed` database + `waheed_user` created
- Redis installed and enabled
- PM2 installed globally (`npm install -g pm2`)
- PM2 startup registered with systemd (`pm2 startup` + `pm2 save`)

**Applications:**
- Next.js 16 frontend scaffolded at `/var/www/waheed.in/frontend`
- Laravel 11 backend scaffolded at `/var/www/waheed.in/backend`
- Laravel `.env` configured: MySQL connection, `APP_ENV=production`, Sanctum
- `php artisan migrate` run successfully
- Framer Motion v12 + Lucide React installed

**Nginx:**
- Proxy rules added: `/api/` → port 8000, `/` → port 3000
- Certbot SSL preserved (not modified)
- HTTP → HTTPS redirect active

**PM2:**
- `ecosystem.config.js` created with both processes
- Both processes running and auto-start on reboot

**Design system:**
- `globals.css`: CSS custom properties, keyframes, base styles
- `layout.tsx`: three fonts via `next/font/google`
- All UI components scaffolded: Button, SectionTag, SectionTitle, ArabicText, IslamicGeometry
- `DESIGN.md` created
- `CLAUDE.md` created

### Phase 2 — COMPLETE (all 12 homepage sections)

All sections live on the homepage at `/`. Rendered in `app/page.tsx` in this order:

| # | Component | File | Background |
|---|---|---|---|
| 1 | Nav | `components/layout/Nav.tsx` | `#2A4D38` (fixed) |
| 2 | Hero | `components/sections/Hero.tsx` | `#2A4D38` |
| 3 | TrustStrip | `components/sections/TrustStrip.tsx` | `#EDE7D9` |
| 4 | FeaturedServices | `components/sections/FeaturedServices.tsx` | `var(--cream)` |
| 5 | WhatWeDo | `components/sections/WhatWeDo.tsx` | `#2A4D38` |
| 6 | ManifestoBand | `components/sections/ManifestoBand.tsx` | `#E8C547` |
| 7 | HowItWorks | `components/sections/HowItWorks.tsx` | `var(--cream)` |
| 8 | CaseStudies | `components/sections/CaseStudies.tsx` | `#2A4D38` |
| 9 | Testimonials | `components/sections/Testimonials.tsx` | `var(--cream)` |
| 10 | BlogPreview | `components/sections/BlogPreview.tsx` | `#2A4D38` |
| 11 | Newsletter | `components/sections/Newsletter.tsx` | `var(--yellow)` |
| 12 | Footer | `components/layout/Footer.tsx` | `#1A2E22` |

Footer rendered via `layout.tsx` (global — appears on all pages).

### Phase 3 — IN PROGRESS

**Completed:**
- `/services` page — `app/services/page.tsx` + `app/services/ServicesContent.tsx`
  - 5 sections: Hero, Fixed Pricing (4 groups), Custom Projects, ISLAMify teaser, Bottom CTA
  - Full pricing data (see Section 9 of this document)
  - Server/client split for metadata + animations
- Nav fix — all links now use Next.js `<Link>` with `usePathname()` active detection. No `#hash` anchors.

**Not started:**
- `/about` — About / Manifesto page
- `/contact` — Contact / Book a Call page
- `/blog` — Blog index page
- `/blog/[slug]` — Blog single post page
- `/work` — Work / Case Studies page

---

## 8. WHAT NEEDS TO BE BUILT NEXT

### Phase 3 — Remaining Core Pages

#### `/about` — About / Manifesto Page
- Founder story: Ashraf Waheed, why WAHEED exists
- The manifesto in full: what WAHEED believes about digital, integrity, Islam
- Team section (TBD — solo founder for now)
- Values expressed in detail (the 4 pillars: Ethics First, Transparent, Long-term, Accountable)

#### `/contact` — Contact / Book a Call Page
- Form: name, email, WhatsApp/phone, project type (dropdown), message
- Calendar embed or booking link for free consultation
- Connect to Laravel API: `POST /api/contact` — stores lead, sends notification email
- Confirmation message after submit

#### `/blog` — Blog Index
- Grid of blog post cards (same `BlogCard` pattern from BlogPreview)
- Pagination or infinite scroll
- Category filter
- Static data for now; Phase 4 wires to CMS

#### `/blog/[slug]` — Blog Post
- Dynamic route `app/blog/[slug]/page.tsx`
- Full article layout: title, date, category, body (MDX or HTML from API)
- Sidebar or bottom: related posts, newsletter CTA
- Static data for first 3 seed articles

#### `/work` — Work / Case Studies
- Full case study grid (more than the 3 on homepage)
- Filter by category (Web Dev, Social Media, Coaching)

### Phase 4 — Backend & CMS

- Laravel API endpoints wired to all frontend pages (see Section 11)
- Admin dashboard (simple — for Ashraf to manage content)
- Newsletter backend: collect emails → store in DB → Mailgun/Resend sends welcome email
- Lead notification: `/contact` form submissions trigger email to hello@waheed.in
- Blog CMS: admin interface to create/edit/publish blog posts
- Case studies CMS: manage case study content

### Phase 5 — LMS & Payments

- ISLAMify course platform
  - Course structure: modules → lessons → quizzes
  - Enrollment system with PayPal Checkout
  - Student dashboard: progress tracking
  - Video lessons (embedded from YouTube or self-hosted)
- Coaching bookings: PayPal payment for Group Session (₹1,000) and Private Coaching (₹10,000)
- Mobile App: React Native or Flutter wrapper around the web platform (Phase 5 end)

### Phase 6 — Pre-launch

- SEO metadata on all pages (title, description, OG image, canonical)
- Lighthouse audit — target 90+ on all metrics
- Security review: OWASP Top 10, rate limiting on API, CORS configuration
- CI/CD: GitHub Actions → auto-deploy on push to main
- Real content population: case studies, testimonials, blog articles
- Logo integration (see Known Issues)
- Privacy Policy and Terms of Service pages
- Email configuration: hello@waheed.in live and deliverable

---

## 9. SERVICES & PRICING — COMPLETE LIST

### Fixed Pricing — Web Design & Development

| Tier | Price | Period | Key Features |
|---|---|---|---|
| Starter | $599 | one-time | Up to 5 pages, mobile responsive, contact form, basic SEO, 2 revisions, 2-week delivery |
| Growth ⭐ | $899 | one-time | Up to 10 pages, blog setup, lead capture forms, on-page SEO, GA setup, 3 revisions, 3-week delivery |
| Authority | $1,899 | one-time | Unlimited pages, custom animations, CMS integration, advanced SEO, performance optimisation, priority support, unlimited revisions, 5-week delivery |

### Fixed Pricing — Social Media Marketing

| Tier | Price | Period | Key Features |
|---|---|---|---|
| Starter | $349 | /month | 2 platforms, 12 posts/month, basic graphics, monthly report, halal content only |
| Growth ⭐ | $549 | /month | 3 platforms, 20 posts/month, custom graphics + reels, community management, bi-weekly report, no paid campaigns for haram products |
| Authority | $1,249 | /month | All platforms, unlimited posts, full creative direction, paid campaign management, weekly strategy calls, detailed analytics |

### Fixed Pricing — Website Maintenance

| Tier | Price | Period | Key Features |
|---|---|---|---|
| Starter | $49 | /month | Monthly updates, security monitoring, uptime monitoring, monthly backup |
| Growth ⭐ | $99 | /month | Weekly updates, security monitoring + fixes, performance checks, weekly backups, priority email support, monthly report |
| Authority | $179 | /month | Daily monitoring, unlimited small edits, performance optimisation, daily backups, dedicated support, monthly report |

### Fixed Pricing — Halal Business Coaching

| Tier | Price | Key Features |
|---|---|---|
| Group Session | ₹1,000 | 90-minute session, up to 10 participants, topic-based learning, Q&A, recording |
| Private Coaching | ₹10,000 | 2-hour 1-on-1 session, business diagnosis, custom action plan, 2-week follow-up, recording |

⭐ = Most Popular (yellow border + slight scale-up on desktop)

### Project-Based Services (Quote on Consultation)

**Mobile App Development**
- React Native or Flutter (client's choice)
- iOS + Android simultaneous
- Laravel API backend (shared auth, shared API)
- FCM push notifications
- App Store + Play Store deployment guidance

**Custom Software Development**
- Web SaaS platforms and dashboards
- Business automation tools
- API integrations
- Internal tools
- Ongoing support contracts available

### Coming Soon

**ISLAMify Your Business** (Course)
- Complete course on building a Shariah-conscious digital business
- Curriculum in development
- Waitlist open via `/contact`

---

## 10. DATABASE SCHEMA

Note: Schema is partially defined. Tables below represent the planned structure. Run `php artisan migrate:status` to see what's been applied.

### `users`
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| name | varchar(255) | |
| email | varchar(255) unique | |
| email_verified_at | timestamp nullable | |
| password | varchar(255) | Bcrypt hashed |
| role | enum('admin', 'client', 'student') | Default: 'client' |
| remember_token | varchar(100) nullable | Sanctum |
| created_at | timestamp | |
| updated_at | timestamp | |

### `contacts` (lead capture from /contact form)
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| name | varchar(255) | |
| email | varchar(255) | |
| phone | varchar(50) nullable | WhatsApp preferred |
| project_type | varchar(100) | Web Dev, Social Media, Coaching, Other |
| message | text | |
| status | enum('new', 'contacted', 'converted', 'declined') | Default: 'new' |
| created_at | timestamp | |
| updated_at | timestamp | |

### `newsletter_subscribers`
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| email | varchar(255) unique | |
| subscribed_at | timestamp | |
| unsubscribed_at | timestamp nullable | |
| token | varchar(100) | For unsubscribe link |

### `posts` (blog)
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| title | varchar(255) | |
| slug | varchar(255) unique | |
| category | varchar(100) | Business, Web Development, Social Media, etc. |
| excerpt | text | |
| body | longtext | HTML or MDX |
| published_at | timestamp nullable | Null = draft |
| created_at | timestamp | |
| updated_at | timestamp | |

### `case_studies`
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| title | varchar(255) | |
| slug | varchar(255) unique | |
| category | varchar(100) | |
| excerpt | text | |
| body | longtext | |
| client_name | varchar(255) nullable | Only if permission granted |
| featured | boolean | Default: false |
| published_at | timestamp nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

### `courses` (Phase 5 — ISLAMify)
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| title | varchar(255) | |
| slug | varchar(255) unique | |
| description | text | |
| price | decimal(10,2) | In ₹ |
| status | enum('draft', 'published', 'archived') | |
| created_at | timestamp | |
| updated_at | timestamp | |

### `enrollments` (Phase 5)
| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned PK | |
| user_id | FK → users.id | |
| course_id | FK → courses.id | |
| payment_reference | varchar(255) | PayPal order ID |
| enrolled_at | timestamp | |

---

## 11. API ENDPOINTS

All backend endpoints are prefixed with `/api/`. The API runs on port 8000, proxied through Nginx.

### Public Endpoints (no auth required)

```
GET  /api/posts              # Blog posts list (paginated)
GET  /api/posts/{slug}       # Single blog post
GET  /api/case-studies       # Case studies list
GET  /api/case-studies/{slug}# Single case study
POST /api/contact            # Submit contact/lead form
POST /api/newsletter/subscribe   # Subscribe to newsletter
GET  /api/newsletter/unsubscribe # Unsubscribe via token (?token=xxx)
```

### Auth Endpoints

```
POST /api/auth/register      # Create account
POST /api/auth/login         # Login → returns Sanctum cookie
POST /api/auth/logout        # Logout
GET  /api/auth/user          # Current authenticated user
```

### Protected Client Endpoints (requires auth)

```
GET  /api/enrollments        # User's course enrollments
POST /api/enrollments        # Enroll in a course (after PayPal payment)
GET  /api/courses            # All published courses
GET  /api/courses/{slug}     # Single course with lessons
```

### Protected Admin Endpoints (requires auth + admin role)

```
# Blog management
GET    /api/admin/posts
POST   /api/admin/posts
PUT    /api/admin/posts/{id}
DELETE /api/admin/posts/{id}

# Case studies
GET    /api/admin/case-studies
POST   /api/admin/case-studies
PUT    /api/admin/case-studies/{id}
DELETE /api/admin/case-studies/{id}

# Contacts / leads
GET    /api/admin/contacts
PUT    /api/admin/contacts/{id}  # Update status

# Newsletter
GET    /api/admin/subscribers

# Courses (Phase 5)
GET    /api/admin/courses
POST   /api/admin/courses
PUT    /api/admin/courses/{id}
```

---

## 12. GIT WORKFLOW

```bash
# Always run from the repo root
cd /var/www/waheed.in

# After any change
git add .
git commit -m "type: description"
git push

# origin = git@github.com:AshrafWaheed/waheed.in.git
# branch = main (only branch)
```

**Commit message format:** `type: short description`
- `feat:` — new feature or page
- `fix:` — bug fix
- `chore:` — config, deps, tooling
- `docs:` — documentation only
- `style:` — styling/CSS only, no logic change
- `refactor:` — code restructure, no behaviour change

---

## 13. CLAUDE CODE WORKFLOW RULES

These rules must be followed in every session.

### Start of Session
1. Read `/var/www/waheed.in/CONTEXT.md` (this file)
2. Read `/var/www/waheed.in/frontend/DESIGN.md`
3. Read any component files relevant to the task before modifying them

### During Development
- Work **one section or component at a time**
- After writing code: `npm run build` — fix ALL TypeScript/build errors before proceeding
- After a clean build: `pm2 restart waheed-frontend`
- Verify the change works; then commit and push

### TypeScript Rules
- **No `any` types** — use proper interfaces or `unknown`
- All components: default export
- Framer Motion `Variants`: always type `ease` as `const` tuple, always `import type { Variants }`
- Server vs client component: if a component uses `useState`, `useEffect`, `usePathname`, or Framer Motion → it must be `"use client"`
- Pages needing both `metadata` and client animations → split into server `page.tsx` + client `*Content.tsx`

### Navigation Rules
- Always use Next.js `<Link href="...">` for internal navigation
- **Never** use `<a href="#...">` hash anchors for page navigation
- Active link detection: always use `usePathname()` from `next/navigation`

### Styling Rules
- CSS vars via `var(--token)` in className — no hardcoded hex unless the token doesn't exist
- When using bg colours not in the token system (e.g. `#1e3b2a`), use `bg-[#1e3b2a]` Tailwind syntax
- Tailwind v4: `@import "tailwindcss"` not `@tailwind base/components/utilities`

### Content Rules
- No fake/invented numbers, subscriber counts, or social proof (Shariah boundary)
- Placeholder testimonials are clearly placeholder — must be replaced with real ones before launch
- Use Islamic vocabulary naturally: ihsan, barakah, deen — no force, no excess

### End of Session
1. Run `npm run build` — confirm clean build
2. Restart PM2: `pm2 restart waheed-frontend`
3. Update `CONTEXT.md` — mark phases, add notes
4. Update `CLAUDE.md` — add session log entry
5. Commit and push: `git add . && git commit -m "..." && git push`

---

## 14. KNOWN ISSUES & DECISIONS

### Logo
The founder (Ashraf Waheed) has a custom-designed logo — the word "WAHEED" incorporating the numeral "1" in the middle, representing the meaning of the name (Waheed = unique, one). This logo has not yet been uploaded to the server.

When the logo is ready, place files at:
```
/var/www/waheed.in/frontend/public/assets/logo/
  waheed-logo-light.svg   # for dark backgrounds
  waheed-logo-dark.svg    # for light backgrounds
  waheed-logo-light.png   # fallback
  waheed-logo-dark.png    # fallback
```

Until then, use the text-based `W*HEED` placeholder (W, yellow `*`, HEED) in Nav and Footer.

### Analytics
GA4 is in use. Privacy-conscious implementation: explicit consent required before tracking fires. Matomo was considered as a self-hosted alternative — defer to Phase 6 decision.

### Social Media Icons in Footer
Lucide React (the icon library in use) does NOT export brand icons: Instagram, Twitter/X, LinkedIn, YouTube. These are rendered as inline SVG elements with hardcoded `<path d="...">` in `Footer.tsx`. This is intentional and correct — do not attempt to import them from lucide-react.

### Hero CTA Hash Anchors
The Hero component still uses `href="#contact"` and `href="#services"` on its two CTA buttons. These should be updated to `/contact` and `/services` in a future session, consistent with the Nav fix applied in Session 11.

### Newsletter Backend
The Newsletter form currently stores nothing — `handleSubmit` sets `submitted = true` and returns. The actual email collection and confirmation email require Phase 4 backend work.

---

## 15. CONTENT STILL NEEDED BEFORE LAUNCH

These items must be sourced from the founder before the site goes live:

| Item | Status | Where Used |
|---|---|---|
| Custom logo (SVG + PNG, light + dark variants) | Not provided | Nav, Footer, OG image |
| 3 real case studies (with client permission) | Placeholder | CaseStudies section, /work page |
| 3 real testimonials | Placeholder | Testimonials section |
| Explainer video "What is WAHEED?" (2–3 mins) | Placeholder | WhatWeDo video player |
| 3 seed blog articles | Placeholder | BlogPreview section, /blog page |
| About page copy (founder bio, story, mission) | Not written | /about page |
| ISLAMify course curriculum outline | Not defined | /services ISLAMify section |
| Privacy Policy document | Not written | /privacy page |
| Terms of Service document | Not written | /terms page |
| Shariah Standards document | Not written | /shariah page |
| hello@waheed.in email configured | Not set up | Footer, Contact form, API emails |
| Social media accounts confirmed | Assumed pending | Footer social icons |

---

*Last updated: Session 12 — CONTEXT.md created*
*For session-by-session history, see `/var/www/waheed.in/CLAUDE.md`*
