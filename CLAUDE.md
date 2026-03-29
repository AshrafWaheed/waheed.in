# CLAUDE.md — WAHEED Project Context

## IMPORTANT — File Size Rule
CLAUDE.md must stay under 40KB at all times.
Only keep essential quick-reference context here.
Full project documentation, decisions, and session logs
go in CONTEXT.md — not here.
Before adding anything to CLAUDE.md, ask: does this need
to be here for quick reference, or does it belong in CONTEXT.md?

> **Always read CONTEXT.md first for full project context.**
> CONTEXT.md contains the complete reference: infrastructure, design system, all components, services pricing, DB schema, API endpoints, and what to build next.

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
- Phase 2 ✅ — Homepage (12 sections, static data)
  - ✅ Nav — W*HEED logo, 6 links, desktop CTA, scroll-shrink, mobile framer-motion overlay
  - ✅ Hero — Bismillah, Islamic geometry SVG, SectionTag, H1, sub, 2 CTAs, 3 floating cards, scroll hint
  - ✅ Trust Strip — 5 indicators, ✦ yellow bullet, cream-dark bg, 2-col mobile, scroll fade-in
  - ✅ Featured Services — 3 grouped cards (Development / Marketing / Coaching), each with sub-service list, group-hover dark green flip, "View Pricing →" CTA → /services
  - ✅ What We Do — dark green split layout, 4 pillars 2×2, video placeholder, slide-in animation
  - ✅ Manifesto Band — full-bleed yellow, Cormorant italic quote, scale+fade entrance, ✦ decorative stars
  - ✅ How It Works — 3 steps, dark green circle numbers, dashed connectors (desktop), mobile vertical dashes, stagger 0.2s, "Start with a Free Call" CTA
  - ✅ Case Studies — dark green, asymmetric 3/5+2/5 grid, featured + 2 secondary cards, category chips, gradient placeholder images, discretion note
  - ✅ Testimonials — cream bg, 3 cards with large yellow quote mark, Cormorant italic quote, divider line, initials avatar (dark green circle), stagger animation
  - ✅ Blog Preview — dark green bg, 3 blog cards with category chips + date, Cormorant title, line-clamp-2 excerpt, ArrowRight hover nudge, "Visit the Blog →" outline CTA
  - ✅ Newsletter — yellow bg, 2-col layout (left: stats with ✦ bullets; right: email form), controlled input with useState, success state "JazakAllahu Khayran"
  - ✅ Footer — #1A2E22 darkest green, W*HEED logo + tagline + social icons (inline SVG), Services + Company link columns, Contact column (yellow CTA + email + location), bottom bar with duaa (Amiri)
- Phase 2 ✅ COMPLETE — all 12 sections live
- Phase 3 — Core pages
  - ✅ Services page (/services) — Hero, Fixed Pricing (4 groups: Web Dev, Social Media, Maintenance, Coaching), Project-Based (Mobile App + Custom Software), ISLAMify teaser, Bottom CTA
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
- Session 7: ManifestoBand, HowItWorks, CaseStudies complete. ManifestoBand: full-bleed yellow, Cormorant italic quote clamp(2.5rem–5rem), scale 0.95→1 + fade on scroll, ✦ stars at opacity 0.12 with staggered fade-in. HowItWorks: 3-step process with dark green circle numbers, dashed horizontal connectors (desktop) and dashed vertical spacers (mobile) via Fragment, stagger 0.2s, yellow CTA. CaseStudies: 5-col asymmetric grid (lg:col-span-3 + lg:col-span-2), gradient placeholder images, CategoryChip sub-component, ArrowRight nudge on hover, discretion note. Clean build, HTTP 200.
- Session 8: Phase 2 COMPLETE. Testimonials: cream bg, 3 cards, Cormorant quote, divider + initials avatar. BlogPreview: dark green, 3 blog cards, stagger grid, "Visit the Blog →" CTA. Newsletter: yellow 2-col, controlled email input, success state. Footer: rewrote scaffold — #1A2E22, W*HEED logo, inline SVG social icons (lucide doesn't carry brand icons), 4-col grid, Arabic duaa bottom bar. Footer moved to layout.tsx so it appears on all pages. lucide-react does not export Instagram/Twitter/Linkedin/Youtube — use inline SVG paths for social brand icons. Clean build, HTTP 200.
- Session 9: Fixed 3 homepage issues. Newsletter: removed fake subscriber count stats, replaced with 3 honest indicators (✦ 100% Halal Content / No Ads. Ever. / Unsubscribe Anytime) — no numbers, no social proof. BlogPreview: SectionTag → "Perspectives", SectionTitle → "Thinking out loud on faith, business & the web". Testimonials: SectionTag → "Kind Words", SectionTitle → "What our clients say". Clean build, HTTP 200.
- Session 10: Phase 3 started — Services page complete at /services. Split into server page.tsx (metadata) + client ServicesContent.tsx (animations). 5 sections: Hero (dark green, IslamicGeometry, Bismillah, fade-up stagger), Fixed Pricing (4 PricingGroups × stagger cards — Web Dev 3 tiers, Social Media 3 tiers, Maintenance 3 tiers, Coaching 2 tiers), Project-Based (Mobile App + Custom Software slide-in cards), ISLAMify teaser (yellow, scale+fade), Bottom CTA. PricingCard: popular badge absolute top-right, border-2 yellow, md:scale-[1.02]. ISLAMify CTA uses direct Link with dark green bg (no matching Button variant). Clean build, HTTP 200.
- Session 11: Fixed Nav links — all hash anchors replaced with proper page routes (/services, /about, /work, /contact). Both "Book a Free Consultation" CTAs (desktop + mobile) updated from #contact to /contact. usePathname active detection and close-on-click were already correct. Clean build, HTTP 200.
- Session 12: Created comprehensive CONTEXT.md at /var/www/waheed.in/CONTEXT.md — full project handoff document covering all 15 sections: project identity, Shariah boundaries, server infrastructure, complete tech stack, design system, all file descriptions, phase build history, what to build next, services pricing, DB schema, API endpoints, git workflow, Claude Code rules, known issues, and content checklist. Added "Always read CONTEXT.md first" header to CLAUDE.md.
