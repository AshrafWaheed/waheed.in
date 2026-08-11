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

  /* Tab-based: the two intents the visitor picks between. Each group owns its
     own doors and its closing button. Per the redesign the Figma splits web and
     app into TWO solutions, so "build" carries three. Each door names the
     CraftArtifact index it renders (`art`) and, if it has a page, its `slug`
     (App reuses the combined web-app page until it gets its own). `desc` copy is
     verbatim from the Figma; App's is node 14:175. */
  groups: [
    {
      key: 'build',
      label: 'I want to build',
      cta: { label: 'Contact us', href: '/contact' },
      doors: [
        {
          num: '01',
          title: 'Website Design & Development',
          desc: 'Your website is often your first door to turning visitors into paying customers. Have it clearly communicate your product or offer, load quickly, and deliver a user-optimised experience.',
          promise: 'Built to convert. Made to last.',
          art: 0,
          slug: 'web-app-development',
          soon: false,
        },
        {
          num: '02',
          title: 'Custom Software Design & Development',
          desc: 'Different operations often require custom software solutions. Build the right systems that pay for themselves through saved hours, streamlined workflows, and clearer decision-making.',
          promise: 'Software that earns its keep.',
          art: 1,
          slug: 'custom-software-development',
          soon: false,
        },
        {
          num: '03',
          title: 'App Design & Development',
          desc: 'Turn your idea into a platform that solves real problems, creates seamless experiences, and supports your business goals.',
          promise: 'From idea to shipped app.',
          art: 0,
          slug: 'web-app-development',
          soon: false,
        },
      ],
    },
    {
      key: 'grow',
      label: 'I want to grow',
      cta: { label: 'View our packages', href: '/packages' },
      doors: [
        {
          num: '04',
          title: 'Visual & Brand Strategy',
          desc: 'Great branding shapes people’s perception of your brand. Go from missed to noticed with the right visual identity, positioning, and messaging.',
          promise: 'Positioning that pre-sells.',
          art: 2,
          slug: 'brand-strategy',
          soon: false,
        },
        {
          num: '05',
          title: 'Search Engine Optimisation',
          desc: "SEO is dead? Nope, it's evolving! Compound your online visibility organically and attract qualified buyers to your door.",
          promise: 'Traffic that compounds.',
          art: 3,
          slug: 'seo',
          soon: false,
        },
        {
          num: '06',
          title: 'Social Media Growth',
          desc: 'A long-term successful brand is built on trust, and trust-led brands are community-first. Social media gives you a cost-effective way to build a loyal community.',
          promise: 'Content engagements, then sales.',
          art: 4,
          slug: 'social-media-marketing',
          soon: false,
        },
        {
          num: '07',
          title: 'Copywriting',
          desc: "Great copy makes people feel like they're talking to a trusted friend. Win your audience's heart with jargon-free copywriting that speaks their language and understands cultural nuances.",
          promise: 'Words that close.',
          art: 5,
          soon: true,
        },
        {
          num: '08',
          title: 'Creative Asset Design',
          desc: 'Low-quality, fully AI-generated assets are killing audience trust. Human-led, AI-assisted strategic content design helps you share your message without compromising authenticity and creativity.',
          promise: 'Creative that earns the click.',
          art: 6,
          soon: true,
        },
      ],
    },
  ],
} as const;

/* ─── Audience — Who we love to work with ──────────────────────────
   Heading, sub and the five categories are the redesign's copy; the section
   keeps its OLD accordion styling (per instruction). Bodies are adapted from
   the previous four categories where they map; "Hospitality and Experiences"
   is new and its body is newly written in the same voice. `eyebrow` is retained
   only for any unmounted variant that still reads it. */
export const audience = {
  eyebrow: 'Who we work with',
  heading: { lead: 'Who We Love to Work With', em: '' } as Heading,
  sub: 'We are committed to helping faith-conscious and values-led Muslims and non-Muslims running impact-driven brands around the world.',
  items: [
    {
      num: '01',
      title: 'e-Commerce Brands',
      body: 'Halal D2C and e-commerce brands in food, modest fashion, lifestyle, and beauty that have built something truly impactful for the Ummah and want to grow it the right way.',
    },
    {
      num: '02',
      title: 'Hospitality and Experiences',
      body: 'Halal-friendly hospitality, travel, and experience brands — restaurants, venues, and destinations — that want a digital presence as considered as the experience they offer.',
    },
    {
      num: '03',
      title: 'Educational Institutions',
      body: 'Academies, ed-tech platforms, and Islamic learning institutions building engaging learning environments that respect both their pedagogy and their audiences.',
    },
    {
      num: '04',
      title: 'NGOs, Charities, & Masajid',
      body: "Da'wah organisations, fundraising operations, and masajid that need digital systems built to compound, not just sizzle when a seasonal campaign ends.",
    },
    {
      num: '05',
      title: 'Consultants, Coaches & Educators',
      body: 'Coaches, consultants, and educators building personal brands grounded in Islamic wisdom, who need a digital presence that reflects their credibility and converts the right clients.',
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

/* ─── Growth System Packages ───────────────────────────────────────
   The redesign's packages section (WAHEEDWEB, Page 2). A separate export from
   the older `services` above — which still feeds the unmounted Services.tsx
   variant — so nothing there has to change. Copy is verbatim from the Figma;
   the three tiers and their inclusion lists mirror the first three rungs of the
   /packages ladder. */
export const growthPackages = {
  heading: 'Growth System Packages',
  sub: 'The right strategy, channels, and execution = real growth. Explore our packages that drive your growth, the halal way!',
  /** Underlined verbatim in the sub, matched as a substring. */
  subUnderline: 'real growth',
  footnote: 'Packages are tailored to fit your goals, scope, and capacity.',
  cta: { label: 'Contact us', href: '/contact' },
  cards: [
    {
      title: 'Brand Audit',
      featured: false,
      items: [
        'Brand & website audit',
        'Personalised report',
        '60-min strategy call',
        '30-day post-hand off ongoing support',
      ],
    },
    {
      title: 'Foundation Engagements',
      featured: true,
      badge: 'For best results',
      items: [
        'Everything in Brand Audit',
        'Visual and brand foundations',
        'Full website design, copy, & development',
        'Basic SEO setup',
        'Social media audit & strategy',
        '90-day ongoing support and strategy optimisation',
      ],
    },
    {
      title: 'The Authority System',
      featured: false,
      items: [
        'Everything in foundations',
        'Advanced SEO set up',
        'Full social media management',
        'Creative assets*',
      ],
      note: '* Additional charges apply to requests for extra assets.',
    },
  ],
} as const;

/* ─── Ihsan Process — five principles ──────────────────────────── */
export const process = {
  /* Heading renamed to the redesign's "Our Work Process". `eyebrow` and `sub`
     are retained for the unmounted IhsanProcess / IhsanProcessHybrid variants;
     the live IhsanProcessTactile renders neither, per the redesign. `em` is
     empty because the new heading is a single unhighlighted phrase. */
  eyebrow: 'Our methodology',
  heading: { lead: 'Our Work Process', em: '' } as Heading,
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

/* ─── Founding story — homepage teaser that links to /about ─────────
   Copy verbatim from the Figma redesign's "Our Founding Story" section. It is a
   teaser: the full story lives on /about, which is where "Learn more" points. */
export const founding = {
  heading: 'Our Founding Story',
  paras: [
    "It started when the founding team received messages from organisations looking for fully Shariah-compliant marketing services. That's when she realised there was a lack of truly halal alternatives to mainstream marketing—alternatives that don't compromise the principles, modesty, or peace of mind of halal business and organisation founders and operators, while still helping them achieve meaningful brand growth.",
    "More than simply serving the community through their technical expertise, both founders see Waheed as an opportunity for da'wah—a way to demonstrate that brands can grow, create meaningful impact, and achieve success without compromising their faith and values.",
  ],
  /** Underlined verbatim inside the first paragraph. */
  underline: 'truly halal',
  cta: { label: 'Learn more', href: '/about' },
} as const;

/* ─── Refusal — what we will not build ─────────────────────────── */
export const refusal = {
  eyebrow: 'A standard, not a disclaimer',
  heading: { lead: 'What we', em: 'will not', tail: 'build.' } as Heading,
  intro: 'Naming what we refuse is how we honour what we build.',
  title: 'What We Will Not Build',
  sub: 'We name what we refuse to build to honour what we build.',
  /** Underlined verbatim in the sub. */
  subUnderline: 'honour',
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
  /** Live section (NewsletterHybrid) uses `title` + `body`; `heading` stays for
     any unmounted variant. Copy is the redesign's. */
  title: 'Subscribe to Waheed Brand Notes',
  body: 'Get one smart idea about halal brand growth in your inbox every Thursday morning.',
  success: 'You’re on the list, Jazakallahu Khayran.',
  placeholder: 'Your email address',
  submitIdle: 'Subscribe',
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

/* ─── Clarity-call form (homepage) ──────────────────────────────────
   The redesign's "Have a project in mind? Book a clarity call." form. On
   submit it posts to the LIVE /api/contact pipe (HubSpot contact + company +
   deal, keyed by email), then sends the visitor to /book prefilled with that
   same email — so the booking's own HubSpot sync attaches the meeting to the
   very same contact. `name` is sent as the brand and `service` fixed to
   "Clarity call" to satisfy the contact endpoint's required fields. */
export const clarityForm = {
  heading: { lead: 'Have a project in mind?', em: 'Book a clarity call.' } as Heading,
  body:
    "Whether you're exploring your options or ready to start immediately, we'd " +
    "love to hear about your brand. Fill out the form and we'll be in touch, in sha Allah.",
  fields: {
    brand: 'Your brand',
    project: 'Your project (describe your brand, goals, and challenges)',
    email: 'Your email',
    phone: 'Your WhatsApp number (optional)',
  },
  submitIdle: 'Submit & book a call',
  submitBusy: 'Submitting…',
  bookDirect: { label: 'or book a call directly', href: '/book' },
  error: 'Something went wrong. Please try again, or email info@waheed.in.',
} as const;

/* ─── Brand lockup (pre-footer sign-off band) ───────────────────────
   The giant wordmark with the tagline threaded around its arcs. */
export const brandLockup = {
  pre: 'The Long-Term',
  post: 'Partner for Your Halal Brand',
} as const;
