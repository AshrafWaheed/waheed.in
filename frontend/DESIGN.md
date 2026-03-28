# DESIGN.md — WAHEED Frontend Design System

## Colours (CSS Variables)
--green: #3d6b4f
--green-dark: #2a4d38
--green-light: #5a8a6a
--cream: #f5f0e8
--cream-dark: #ede7d9
--yellow: #e8c547
--yellow-soft: #f0d778
--text-dark: #1a2e22
--text-mid: #3d5245
--text-light: #7a9080

## Typography
- Display/headings: Cormorant Garamond (serif)
- Body/UI: DM Sans (sans-serif)
- Arabic: Amiri

## Brand Voice
- Use: "We believe", "We help", "We choose", "Aligned", "Intentional"
- Never use: "Guaranteed", "Viral", "Hack", "Dominate", "Crush", "Explode your growth"

## Components
- Button: primary (yellow bg), outline (cream on green), ghost (text only)
- SectionTag: small uppercase label with line prefix
- SectionTitle: Cormorant Garamond, italic em colour variant
- ServiceCard: displays a SERVICE GROUP — number (Cormorant, yellow), icon, group title, description, sub-service bullet list (·), hover → dark green bg with cream text, "View Pricing →" ghost CTA linking to /services
  - Group 01 — Development: Web Design, Mobile App (React Native / Flutter), Custom Software & SaaS
  - Group 02 — Marketing: Content Strategy, Community Management, Paid Campaigns (halal only)
  - Group 03 — Coaching: Group Sessions (₹1,000), Private Coaching (₹10,000), ISLAMify Course
  - NOTE: Project-based services include Mobile App Dev + Custom Software (React Native, Flutter, Laravel backend, FCM push notifications)
- TrustStrip: horizontal icon + text indicators
- ProcessStep: circle number, connector line, title, description
- TestimonialCard: quote mark, italic text, author + avatar
- BlogCard: category chip on image, date, title, excerpt
- PricingCard: tier name, price, feature list, CTA
- IslamicGeometry: SVG with configurable opacity and colour
- ArabicText: Amiri font wrapper with opacity control

## Animation
- Page load: staggered fade-up on hero elements
- Scroll: IntersectionObserver — elements rise in on viewport entry
- Hover on service rows: dark green fill
- Hero floating cards: CSS keyframe float (translateY, 6s loop)
- Nav: shrinks on scroll (padding 1.4rem → 0.9rem)
- Always respect: prefers-reduced-motion

## Homepage Sections (Build Order)
1. Nav
2. Hero — Bismillah, manifesto headline, 2 CTAs, floating cards, Islamic SVG
3. Trust Strip — 5 indicators
4. Featured Services — 3 column hover cards
5. What We Do — split layout + video placeholder
6. Manifesto Band — full width yellow: "If growth costs integrity, it is not growth."
7. How It Works — 3 step process
8. Case Studies — asymmetric grid
9. Testimonials — 3 column
10. Blog Preview — latest 3
11. Newsletter — email capture
12. Footer — 4 column + duaa
