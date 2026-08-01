/**
 * WAHEED /packages copy — SINGLE SOURCE OF TRUTH.
 *
 * Lifted VERBATIM out of the old app/services/page.tsx when that page was
 * rebuilt. Same contract as content/home.ts and content/about.ts: rearrange
 * freely in the layout, never edit a string here without an explicit
 * instruction to change copy.
 *
 * The apostrophes came through JSX `&apos;`, so "We'll" and "Let's talk" use a
 * straight ' — matching the old rendered page. Do not curl them.
 *
 * `rungs` is ordered, and the order is the product: it is an ascending offer
 * ladder from a one-off diagnostic to an open-ended partnership. The layout
 * leans on that, so re-ordering this array changes the page's argument.
 */
import type { Heading } from './home';

/* ─── §1 Hero ──────────────────────────────────────────────────── */
export const packagesHero = {
  eyebrow: 'How we build with you',
  headline: {
    lead: 'The Framework halal brands are',
    em: 'built on.',
  } as Heading,
  sub: 'Packages that are strategically crafted to move the business forward.',
} as const;

/* ─── §2 The offer ladder ──────────────────────────────────────── */
export const ladder = {
  /** Shared by every rung — the old page repeated it per card. */
  applyLabel: 'Apply →',
  applyHref: '/contact',
  rungs: [
    {
      eyebrow: 'Diagnostic',
      title: 'Halal Brand Audit',
      subtitle: 'A clear-eyed read on your brand, before you commit to a build.',
      desc: "A review of your current site, delivered as a personalised report plus a 60-90-minute strategy call. You walk away knowing exactly what's costing you sales and what to fix first.",
      featured: false,
      badge: null,
    },
    {
      eyebrow: 'Web & Brand',
      title: 'Foundations Engagement',
      subtitle: 'For halal brands that want their sites to actually convert.',
      desc: 'Full website + brand foundations + 30-day post-launch optimisation, with weekly check-ins on progress. Conversion-fluent, mobile-first, built on a system you can grow into.',
      featured: false,
      badge: null,
    },
    {
      eyebrow: 'Full System',
      title: 'The Authority System',
      subtitle: 'Full website + brand system + 90-day social ramp. For founders ready to be taken seriously.',
      desc: 'Everything in Foundations, plus brand identity refresh, content strategy, social ramp-up, monthly reviews, and weekly check-ins.',
      featured: true,
      badge: 'Most Requested',
    },
    {
      eyebrow: 'Custom Build',
      title: 'Halal Brand OS',
      subtitle: 'For education platforms and scaling brands that need a website with real systems underneath it.',
      desc: 'Custom software or platform, full brand system, and six months of hands-on strategic partnership. Built for founders whose next stage of growth depends on something no template can hold.',
      featured: false,
      badge: null,
    },
    {
      eyebrow: 'Partnership',
      title: 'Halal Brand Partnership',
      subtitle: 'Continuous build and monthly strategy reviews. For brands that need an ongoing partner, not a vendor.',
      desc: 'Monthly retainer covering iterative design, growth experiments, technical maintenance, and strategic counsel.',
      featured: false,
      badge: null,
    },
  ],
} as const;

/* ─── §3 Custom plan / close ───────────────────────────────────── */
export const customPlan = {
  eyebrow: 'Not sure what you need?',
  heading: 'Request a custom package.',
  body: "Tell us the problems that frustrate you, your goals, your budget, and where you are right now. We'll put together a curated scope that fits.",
  cta: { label: "Let's talk →", href: '/contact' },
} as const;
