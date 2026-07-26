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
}

/* ─── Hero ─────────────────────────────────────────────────────── */
export const hero = {
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  eyebrow: 'Ihsan-Led Tech & Marketing for Halal, Impact-Driven Initiatives',
  headline: {
    lead: 'Scale your brand online',
    em: 'without compromising your values.',
  } as Heading,
  sub:
    'We build your tech. We sharpen your brand. We grow your audience. ' +
    'All of it grounded in Islamic principles, from the first brief to ' +
    'the final deliverable.',
  ctaPrimary:   { label: 'Apply for a Free Discovery Call', href: '/contact' },
  ctaSecondary: { label: 'Explore Our Services',            href: '/services' },
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
  eyebrow: 'Our craft',
  heading: { lead: 'Seven crafts, one', em: 'standard.' } as Heading,
  doors: [
    {
      num: '01',
      title: 'Web & App Development',
      desc: 'Your website is the first impression and the closing pitch. We build sites and applications that load fast, convert decisively, and are built to convert visitors you never speak to.',
      promise: 'Built to convert. Made to last.',
      soon: false,
    },
    {
      num: '02',
      title: 'Custom Software Development',
      desc: "Off-the-shelf tools weren't built for your business. We engineer dashboards, integrations, and automations that pay themselves back in saved hours and clearer decisions.",
      promise: 'Software that earns its keep.',
      soon: false,
    },
    {
      num: '03',
      title: 'Brand Strategy',
      desc: 'A weak brand competes on price; a strong brand commands premium trust. We craft positioning, narrative and visual systems that make the right buyer feel chosen, and the wrong buyer move on.',
      promise: 'Positioning that pre-sells.',
      soon: false,
    },
    {
      num: '04',
      title: 'SEO',
      desc: 'Ads stop the moment you stop paying. We compound your visibility on Google with technical fixes, intent-driven content, and authority signals that bring qualified buyers to your door, for years.',
      promise: 'Traffic that compounds.',
      soon: false,
    },
    {
      num: '05',
      title: 'Social Media Marketing',
      desc: 'Posting daily and praying for reach is not a strategy. We build content engines that earn trust first, sell second, and turn passive followers into a community that buys, refers and returns.',
      promise: 'Content engagements, then sales.',
      soon: false,
    },
    {
      num: '06',
      title: 'Conversion Copywriting',
      desc: 'Beautiful design without sharp words leaves money on the table. We write headlines, landing pages and email sequences that move readers from curious to convinced, and convinced to customer.',
      promise: 'Words that close.',
      soon: true,
    },
    {
      num: '07',
      title: 'Ad Creatives',
      desc: 'Sharp targeting still dies on weak creative. We design and write scroll-stopping ad creatives (static, motion, and copy) engineered to earn attention and turn cold audiences into buyers, without clickbait or compromise.',
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
  footerLink: { label: 'View all packages →', href: '/services' },
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
