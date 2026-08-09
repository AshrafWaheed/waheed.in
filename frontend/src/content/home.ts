/**
 * WAHEED homepage copy — SINGLE SOURCE OF TRUTH.
 *
 * Every visible homepage string lives here, VERBATIM. The three homepage
 * variants (Hybrid `/`, Wahda-cinematic `/home2`, Outcrowd-tactile `/home3`)
 * all import from this module so the copy is guaranteed identical across them
 * and can never drift. Rearrange freely in the layouts — but never edit a
 * string here without an explicit instruction to change copy.
 *
 * Emphasised headings are modelled as { lead, em?, tail? } so each variant can
 * style the <em> part however it likes without touching the words.
 */

export interface Heading {
  lead: string;
  em?: string;
  tail?: string;
  /**
   * A fragment set BETWEEN `lead` and `em`, rendered as the near-invisible word
   * only the hero uses (the "invisible → trusted" torch line). Optional so
   * every other heading on the site keeps the plain {lead, em, tail} shape.
   */
  hidden?: string;
}

/* ─── Hero ─────────────────────────────────────────────────────────
   Copy is VERBATIM from the Figma redesign (WAHEEDWEB, Page 2 hero). It
   replaced the earlier "Scale your brand online / Ihsan-Led Tech & Marketing"
   set wholesale — headline, eyebrow, sub and the CTA all changed together, so
   this is a copy change made under explicit instruction, not drift.

   The headline is three parts, not two: `lead` upright, then `hidden`
   ("invisible") which the hero renders faint and reveals under a cursor-torch,
   then `em` ("trusted") in gold italic, with a drawn arrow between them. The
   demonstration IS the sentence — the word "invisible" is invisible until you
   move a light over it. */
export const hero = {
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  eyebrow: 'The Long-Term Partner for Your Halal Brand',
  headline: {
    lead: 'Take your brand from',
    hidden: 'invisible',
    em: 'trusted',
  } as Heading,
  sub:
    'Build the technology and growth systems you need to attract the right ' +
    'customers. No compromise in values. Ever!',
  /* Phrases the hero underlines in gold, matched verbatim against `sub`. Kept
     as data rather than markup so the sentence stays one editable string and
     the two decorated spans can never fall out of sync with it. */
  subUnderline: ['attract', 'No compromise'],
  trustedBy: 'Trusted by Muslim-led brands',
  ctaPrimary:   { label: 'Book a call',          href: '/book'    },
  /* Retained for the two unmounted hero variants (HeroHybrid, HeroSignalBoard)
     that still reference it; the live hero renders a single CTA, per the
     redesign. */
  ctaSecondary: { label: 'Explore Our Services', href: '/packages' },
} as const;

/* ─── Trust strip (marquee) ────────────────────────────────────── */
export const trustItems = [
  'Delivered with Ihsan',
  'Human Customer Care',
  'Long-Term Impact',
  '100% Shariah-Compliant',
] as const;

/* ─── Manifesto (thesis) ───────────────────────────────────────── */
export const manifesto = {
  lines: [
    '“Growth is not the goal.',
    'Growth with Barakah is',
    'the one that never costs your integrity.”',
  ],
  attribution: 'WAHEED',
} as const;

/* ─── Expertise — Seven crafts ─────────────────────────────────── */
export const expertise = {
  /* Section copy is VERBATIM from the Figma redesign's "Solutions" section
     (WAHEEDWEB, Page 2), replacing the old "Seven crafts, one standard."
     heading and every craft blurb under instruction. The redesign has no
     eyebrow above the heading, so the component no longer renders one.

     The redesign lists EIGHT solutions and our bento has seven cells, so one is
     dropped: "App Design & Development", whose remit overlaps our web offering
     the most. Card 01 therefore carries the website copy (its artifact is a
     browser mock), and the rest map craft-for-craft onto the matching artifact.
     The `promise` lines and the artifacts are ours and stay — see the note in
     content history for why the cards keep their layout. */
  /* Retained only for the unmounted ExpertiseHybrid variant that still reads it;
     the live ExpertiseBento no longer renders an eyebrow, per the redesign. */
  eyebrow: 'Our craft',
  heading: { lead: 'The Solutions to Help You Build & Grow' } as Heading,

  /* The two halves the crafts divide into, each closed by the button the
     redesign shows under it. `from`/`to` (the grid-row boundary) are a layout
     fact and live in the component, not here. */
  groups: [
    { label: 'I want to build', cta: { label: 'Contact us',        href: '/contact'  } },
    { label: 'I want to grow',  cta: { label: 'View our packages', href: '/packages' } },
  ],

  doors: [
    {
      num: '01',
      title: 'Website Design & Development',
      desc: 'Your website is often your first door to turning visitors into paying customers. Have it clearly communicate your product or offer, load quickly, and deliver a user-optimised experience.',
      promise: 'Built to convert. Made to last.',
      soon: false,
    },
    {
      num: '02',
      title: 'Custom Software Design & Development',
      desc: 'Different operations often require custom software solutions. Build the right systems that pay for themselves through saved hours, streamlined workflows, and clearer decision-making.',
      promise: 'Software that earns its keep.',
      soon: false,
    },
    {
      num: '03',
      title: 'Visual & Brand Strategy',
      desc: 'Great branding shapes people’s perception of your brand. Go from missed to noticed with the right visual identity, positioning, and messaging.',
      promise: 'Positioning that pre-sells.',
      soon: false,
    },
    {
      num: '04',
      title: 'Search Engine Optimisation',
      desc: "SEO is dead? Nope, it's evolving! Compound your online visibility organically and attract qualified buyers to your door.",
      promise: 'Traffic that compounds.',
      soon: false,
    },
    {
      num: '05',
      title: 'Social Media Growth',
      desc: 'A long-term successful brand is built on trust, and trust-led brands are community-first. Social media gives you a cost-effective way to build a loyal community.',
      promise: 'Content engagements, then sales.',
      soon: false,
    },
    {
      num: '06',
      title: 'Copywriting',
      desc: "Great copy makes people feel like they're talking to a trusted friend. Win your audience's heart with jargon-free copywriting that speaks their language and understands cultural nuances.",
      promise: 'Words that close.',
      soon: true,
    },
    {
      num: '07',
      title: 'Creative Asset Design',
      desc: 'Low-quality, fully AI-generated assets are killing audience trust. Human-led, AI-assisted strategic content design helps you share your message without compromising authenticity and creativity.',
      promise: 'Creative that earns the click.',
      soon: true,
    },
  ],
} as const;

/* ─── Audience — Who we work with ──────────────────────────────── */
export const audience = {
  eyebrow: 'Who we work with',
  heading: {
    lead: 'We transform brands that',
    em: 'refuse to compromise their values.',
  } as Heading,
  items: [
    {
      num: '01',
      title: 'Halal D2C Brands',
      body: 'Halal D2C brands in food, modest fashion, lifestyle, and beauty that have built something truly impactful for the Ummah and want to grow it the right way.',
    },
    {
      num: '02',
      title: 'Islamic Educational Institutions',
      body: 'Academies, ed-tech platforms, and Islamic learning institutions building engaging learning environments that respect both their pedagogy and their audiences.',
    },
    {
      num: '03',
      title: 'NGOs, Charities & Masajid',
      body: "Da'wah organisations, fundraising operations, and masajid that need digital systems built to compound, not just sizzle when a seasonal campaign ends.",
    },
    {
      num: '04',
      title: 'Muslim Coaches & Educators',
      body: 'Coaches, consultants, and educators building personal brands grounded in Islamic wisdom, who need a digital presence that reflects their credibility and converts the right students and clients.',
    },
  ],
} as const;

/* ─── Services — packages ──────────────────────────────────────── */
export const services = {
  eyebrow: 'How we build with you',
  heading: 'The infrastructure halal brands are built on.',
  sub: 'Top tier packages, each strategically crafted to move the business forward.',
  featuredBadge: 'BEST OFFER',
  footerLink: { label: 'View all packages →', href: '/packages' },
  cards: [
    {
      eyebrow:  'Web & Brand',
      title:    'Foundations Engagement',
      subtitle: 'For halal brands ready to strengthen their presence with clarity and purpose.',
      desc:     'Full website + brand foundations + 30-day post-launch optimisation. Conversion-fluent, mobile-first, built on a system you can grow into.',
      featured: false,
    },
    {
      eyebrow:  'Full System',
      title:    'The Authority System',
      subtitle: 'Full website + brand system + 90-day social ramp. For founders building authority in their industry.',
      desc:     'Everything in Foundations, plus brand identity refresh, content strategy, social ramp-up, and quarterly review for one year.',
      featured: true,
    },
    {
      eyebrow:  'Partnership',
      title:    'Halal Brand Partnership',
      subtitle: 'Quarterly strategy reviews and ongoing execution. For brands that value steady, sustainable growth.',
      desc:     'Monthly retainer covering iterative design, growth experiments, technical maintenance, and strategic counsel. Two-client cap per quarter.',
      featured: false,
    },
  ],
} as const;

/* ─── Ihsan Process — five principles ──────────────────────────── */
export const process = {
  eyebrow: 'Our methodology',
  heading: { lead: 'The Ihsan Process.', em: 'How we build.' } as Heading,
  sub: 'Five phases that bring clarity and organisation to the process, each grounded in an Islamic principle.',
  /** Label template rendered as `grounded in {grounded}`. */
  groundedPrefix: 'grounded in ',
  steps: [
    {
      num: 1,
      title: 'Discovery + Diagnosis',
      grounded: 'the right Niyyah (Intention)',
      bg: 'ivory',
      desc: `We start by understanding your challenges, your goals, your ideal audience, the values you refuse to compromise, and what "growth" actually needs to mean for you before anything is designed. This is where we surface what's working, what isn't, and what you're really trying to build.`,
    },
    {
      num: 2,
      title: 'Strategy Roadmap',
      grounded: 'Tadbir (Wise planning)',
      bg: 'teal',
      desc: `A clear picture of the site, brand, and system before a single pixel is drawn. Direction, architecture, and priorities are agreed in writing, so both sides know exactly what's being built and why.`,
    },
    {
      num: 3,
      title: 'Build & Execution',
      grounded: 'Ihsan (Excellence)',
      bg: 'ivory',
      desc: `The work gets built with care at every stage, not just at the parts a client will see. Ihsan means doing something as if it's being watched closely, even when it isn't.`,
    },
    {
      num: 4,
      title: 'Optimise what works',
      grounded: 'Itqan (Mastery)',
      bg: 'teal',
      desc: `Once something is live, we refine it against real data instead of guesswork. Itqan is precision, the discipline of not leaving something "good enough" when it could be exact.`,
    },
    {
      num: 5,
      title: 'Long-term Partnership',
      grounded: 'Amanah (Trust)',
      bg: 'ivory',
      desc: `The relationship doesn't end at launch. Amanah means trust held responsibly, we stay accountable for what we built and keep showing up for it.`,
    },
  ],
} as const;

/* ─── Refusal — what we will not build ─────────────────────────── */
export const refusal = {
  eyebrow: 'A standard, not a disclaimer',
  heading: { lead: 'What we', em: 'will not', tail: 'build.' } as Heading,
  intro: 'Naming what we refuse is how we honour what we build.',
  items: [
    'Gambling or lottery platforms',
    'Interest-based financial products',
    'Haram entertainment & music content',
    'Brands built on manipulative tactics',
    'Alcohol & tobacco',
    'Adult content of any kind',
  ],
} as const;

/* ─── Newsletter ───────────────────────────────────────────────── */
export const newsletter = {
  eyebrow: 'Halal Brand Letters',
  heading: { lead: 'No pitch. Just one useful idea,', em: 'every Thursday.' } as Heading,
  body:
    'Strategic notes for halal brand & organisation founders, on positioning, ' +
    'conversion, brand integrity, and growing without compromise.',
  success: 'You’re on the list, Jazakallahu Khayran.',
  placeholder: 'your@email.com',
  submitIdle: 'Subscribe →',
  submitBusy: 'Saving…',
  note: 'Confirmed opt-in. Unsubscribe any time. We never sell or share your data.',
} as const;

/* ─── Final CTA ────────────────────────────────────────────────── */
export const finalCta = {
  eyebrow: "Let's build something meaningful",
  heading: { lead: 'Ready to grow with', em: 'clarity and Barakah?' } as Heading,
  body:
    'A 15–30 minute fit call. We review every application personally and ' +
    'respond within 24 hours, in sha Allah.',
  cta: { label: 'Book a free clarity call →', href: '/contact' },
} as const;
