# CLAUDE.md — WAHEED Project Context

## Project
- Name: WAHEED — India's First Halal Digital Studio
- Domain: waheed.in
- Founder: Ashraf Waheed
- Mission: Shariah-aligned digital studio for Muslim-led brands

## Server
- Provider: Hetzner Cloud, Ubuntu 24.04 LTS
- IP: 116.203.45.2
- User: dev (sudo, passwordless)
- Root: /var/www/waheed.in
- Frontend: /var/www/waheed.in/frontend (Next.js → port 3000)
- Backend: /var/www/waheed.in/backend (Laravel → port 8000)
- Nginx: waheed.in → :3000, waheed.in/api → :8000
- PM2: waheed-frontend + waheed-backend both running, startup registered
- SSL: Let's Encrypt via Certbot
- MySQL: database=waheed, user=waheed_user
- Redis: running + enabled

## Tech Stack
- Frontend: Next.js 14+ App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- Backend: Laravel 11, Sanctum auth, MySQL, Redis queues
- Mobile: React Native / Flutter (project-based)
- Custom Software / SaaS: Laravel backend, FCM push notifications (project-based)
- Fonts: Cormorant Garamond, DM Sans, Amiri (Google Fonts via next/font)
- Analytics: GA4
- Payments: PayPal Checkout
- Version Control: git@github.com:AshrafWaheed/waheed.in.git, branch: main

## Git Workflow
- Always commit and push as dev from /var/www/waheed.in
- git add . && git commit -m "message" && git push

## Brand
- Primary: Forest Green #3D6B4F
- Dark: #2A4D38
- Accent Yellow: #E8C547
- Cream: #F5F0E8
- Text Dark: #1A2E22
- Text Secondary: #7A9080
- Fonts: Cormorant Garamond (display), DM Sans (body), Amiri (Arabic)
- Voice: Calm, respectful, clear. Never: "guaranteed", "viral", "hack", "dominate"

## Shariah Boundaries (NON-NEGOTIABLE)
- No gambling, alcohol, adult, riba-based fintech, crypto scams
- No dark UX patterns, fake countdowns, hidden fees
- No Google Analytics (privacy) — using GA4 with consent
- No ad networks — WAHEED is ad-free by principle

## Build Phases
- Phase 1 ✅ — Server, Next.js, Laravel, Nginx, PM2, DESIGN.md, component library
- Phase 2 🔄 — Homepage (12 sections, static data)
  - ✅ Nav — W*HEED logo, 6 links, desktop CTA, scroll-shrink, mobile framer-motion overlay
  - ✅ Hero — Bismillah, Islamic geometry SVG, SectionTag, H1, sub, 2 CTAs, 3 floating cards, scroll hint
  - ✅ Trust Strip — 5 indicators, ✦ yellow bullet, cream-dark bg, 2-col mobile, scroll fade-in
  - ✅ Featured Services — 3 grouped cards (Development / Marketing / Coaching), each with sub-service list, group-hover dark green flip, "View Pricing →" CTA → /services
  - ✅ What We Do — dark green split layout, 4 pillars 2×2, video placeholder, slide-in animation
  - ⬜ Manifesto Band, How It Works
  - ⬜ Case Studies, Testimonials, Blog Preview, Newsletter, Footer
- Phase 3 — Core pages
- Phase 4 — Backend & CMS
- Phase 5 — LMS & Payments
- Phase 6 — Pre-launch

## Current Status
- Phase 1 in progress
- Update this file after every session with what was completed

## Session Log
- Session 1: Installed Node.js v22, PHP 8.3, Composer, MySQL, Redis, PM2. Created Next.js frontend, Laravel backend. Configured Nginx, PM2, SSL intact. Both services returning HTTP 200.
- Session 2: Created CLAUDE.md + DESIGN.md. Set up design tokens in globals.css (CSS vars for all brand colours, float/fade-up keyframes, prefers-reduced-motion). Configured layout.tsx with Cormorant Garamond, DM Sans, Amiri via next/font. Scaffolded Button, SectionTag, SectionTitle, ArabicText, IslamicGeometry, Nav, Footer components. Installed framer-motion + lucide-react. Built and restarted PM2. Both services HTTP 200.
- Session 3: Phase 2 Nav + Hero complete. Nav: W*HEED logo (yellow *), 6 links with active yellow underline, scroll-shrink (1.4rem→0.9rem), framer-motion mobile overlay with staggered link entrance, body scroll lock. Hero: Bismillah (Amiri, cream, 65% opacity), IslamicGeometry SVG (two instances, top-right + bottom-left echo), SectionTag light variant, H1 clamp(3rem,6.5vw,6rem) italic Cormorant, subheadline, 2 CTAs, 3 floating service cards with staggered CSS float + framer entrance, scroll hint. Fixed Framer Motion v12 Variants TypeScript strictness (ease must be Easing tuple). Updated globals.css to @import "tailwindcss" (v4 syntax). Clean build, HTTP 200.
  - NOTE: Framer Motion v12 requires ease values in Variants to be typed as const tuples [x1,y1,x2,y2] not strings. Always import type Variants and define EASE_OUT as const tuple.
- Session 4: TrustStrip, FeaturedServices, WhatWeDo complete. SectionTag: added accent prop (yellow). SectionTitle: added light prop (cream text + yellow emphasis). ServiceCards use Tailwind group-hover for CSS-only hover state flip. WhatWeDo uses whileInView with slide-in from opposing sides. All scroll animations use viewport once:true. Clean build, HTTP 200.
- Session 5: Updated FeaturedServices to 3 grouped service cards (Development / Marketing / Coaching). Each card now shows sub-service bullet list. CTA changed to "View Pricing →" linking to /services. Added Mobile App Dev + Custom Software to tech stack. Updated DESIGN.md to document service group structure and project-based capabilities.
- Session 6: Synced Hero floating card titles/descriptions to match grouped service structure (Web Mobile & Software / Social Media Marketing / Halal Business Coaching). Fixed IslamicGeometry SVG rendering — root cause was compound opacity: per-element fillOpacity/strokeOpacity (0.12, 0.08, 0.4) were multiplying against SVG-level opacity:0.06, producing effective opacity as low as 0.007 (invisible). Fixed by removing all per-element opacity overrides — SVG-level opacity is now the single control. Also switched geometry positioning from negative offset classes to translate-x/y so it renders correctly within overflow-hidden parent.
