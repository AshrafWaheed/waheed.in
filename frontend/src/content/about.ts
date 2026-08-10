/**
 * WAHEED /about copy — SINGLE SOURCE OF TRUTH.
 *
 * Lifted VERBATIM out of the old app/about/page.tsx when that page was rebuilt
 * to homepage standard. Same contract as content/home.ts: rearrange freely in
 * the layout, but never edit a string here without an explicit instruction to
 * change copy.
 *
 * Two things about these strings are deliberate and must not be "tidied":
 *
 *  1. The apostrophes are inconsistent in the source and stay that way. The
 *     bios were TS literals and use a curly ’ ("wouldn’t"); the narrative was
 *     JSX using &apos;, which renders as a straight ' ("didn't", "Da'wah",
 *     "Allah's"). Normalising either way would change the rendered copy.
 *  2. `people.eyebrow` is a verbatim prefix of `people.heading`, so the layout
 *     deliberately does NOT render it — see FoundersAbout.tsx. It is kept here
 *     because it is authored copy, and because the old page carried it too
 *     (hidden, like every eyebrow on the inner pages).
 *
 * Emphasised headings use the { lead, em?, tail? } shape from home.ts so the
 * layout can gold a fragment without touching the words.
 */
import type { Heading } from './home';

/* ─── §1 Hero ──────────────────────────────────────────────────── */
export const aboutHero = {
  eyebrow: 'About Waheed',
  headline: {
    lead: 'Built for brands that',
    em: 'refuse to compromise.',
  } as Heading,
} as const;

/* ─── §2a Our Founding Story (redesign) ────────────────────────────
   Verbatim from the WAHEEDWEB Figma "About Us" artboard (node 74:434).
   The em dash and the straight apostrophe in "da'wah" are as authored —
   do not tidy. */
export const foundingStory = {
  heading: 'Our Founding Story',
  paras: [
    'It all started when one of the founding team received messages from organisations looking for fully Shariah-compliant marketing services. That’s when she realised there was a lack of truly halal alternatives to mainstream marketing—alternatives that don’t compromise the principles, modesty, or peace of mind of halal business and organisation founders and operators, while still helping them achieve meaningful brand growth.',
    "More than simply serving the community through their technical expertise, the people at Waheed see this initiative as an opportunity for da'wah—a way to demonstrate that brands can grow, create meaningful impact, and achieve success without compromising their faith and values.",
  ],
} as const;

/* ─── §2b The Gap in Halal Industry Marketing (redesign) ───────────
   Verbatim from the WAHEEDWEB Figma "About Us" artboard (node 74:440).
   Rendered as two paragraphs; the em dashes and curly apostrophe are as
   authored — do not tidy. */
export const theGap = {
  heading: 'The Gap in Halal Industry Marketing',
  paras: [
    'We see it time and time again: websites that failed to convert because they didn’t offer a simple experience that helped their audience find the answers they needed. Content that lacked clear positioning because teams thought speaking to everyone was the best approach. Growth strategies that felt disconnected from their values—and, eventually, from barakah—because they forced halal brand founders to compromise their integrity for the sake of sales.',
    'And we want to change that.',
  ],
} as const;

/* ─── §2 The Founding Story ────────────────────────────────────── */
export const gap = {
  eyebrow: 'The Founding Story',
  heading: 'We Saw the Same Gap, Again and Again.',
  /** First is the lead (set larger); second is the detail. */
  paras: [
    'Powerful halal businesses and Muslim organisations with big visions, but very little digital foundation to support them in a way that stays true to Islamic values.',
    "Websites that didn't convert because they didn't offer a simple experience that helped the audience get their answers. Content that lacked positioning because teams thought speaking to everyone was a good approach. Growth strategies that felt disconnected from Barakah because they forced founders to lower their integrity for the sake of sales.",
  ],
  question:
    'You want a site that converts, content that truly connects with your ideal audience, a platform built for how your business actually runs, or a growth plan that moves the needle — without compromising your principles, your modesty, or your peace of mind?',
  answer: 'We got you.',
  close:
    'Today, we lead Waheed as a transformational digital solutions studio rooted in Islamic values and guided by the principle of Ihsan (excellence).',
} as const;

/* ─── §3 The People & the Journey ──────────────────────────────── */
export const people = {
  /** Not rendered — a verbatim prefix of `heading`. See the file header. */
  eyebrow: 'The People & the Journey',
  heading: {
    lead: 'The People & the Journey Behind',
    em: 'Waheed',
  } as Heading,
  sub: 'Committed to craft, clarity, & excellence.',
  intro:
    'Waheed was founded by two professionals who were both hired into the same halal advertising agency, one of the largest networks reaching Muslim consumers globally. The Founder came from software and strategy — the technical work of making something actually function. The Co-Founder came from brand and marketing — the words and instincts that make a business feel like itself, and the positioning that turns that feeling into trust people act on.',
  /**
   * `fig` maps each founder to the portrait already used in the homepage hero.
   * The pronouns in the bios fix the mapping: the Founder is "he", the
   * Co-Founder is "she".
   */
  members: [
    {
      label: 'Founder',
      role: 'Tech Engineer & Strategist',
      fig: 'man' as const,
      bio: 'The Founder had spent his early career at a tech company led by non-Muslims, where he was fired after facing islamophobic discrimination. By the Mercy of Allah, he was granted another means to earn rizq at the same halal advertising agency, starting as a web developer. He climbed to technical lead and ad operations, and the work — building products and understanding how advertising actually functions — gave him a deep, practical understanding of user experience and Muslim consumer behavior.',
    },
    {
      label: 'Co-Founder',
      role: 'Brand & Marketing',
      fig: 'woman' as const,
      bio: 'The Co-Founder started her career trying to find work that wouldn’t force her to compromise her Islamic principles. She job-hopped between roles from 2022 onward, until in early 2024 she made the shift from onsite to remote work, earned a digital skills certification, and was hired at the agency as a social media manager. There, she learned how to read what actually earns trust online — audience psychology, halal-compliant content, and the small creative decisions that decide whether a Muslim audience feels spoken to or spoken at.',
    },
  ],
} as const;

/* ─── §4 The realisation (outro) ───────────────────────────────── */
export const outro = {
  /** First is set as a lead, second as the body — a deliberate step down. */
  paras: [
    'The realisation came when a handful of Muslim founders reached out to the Co-Founder, specifically asking for fully Shariah-compliant social media services. That opened her eyes to how much need there was for solutions built for faith-conscious brands. From there, she moved from social media alone into brand and marketing more broadly, seeking to serve Muslim brands and organisations with the right niyyah, a real understanding of Islamic values, and excellence in execution.',
    "Both of them watched the same problem play out, over and over: Muslim-led brands and ethical initiatives with real potential to reshape the Muslim economy, real revenue, and real ambition, stuck with digital work that either ignored their values or diluted them for the sake of growth. Neither of them was only looking at what this market could generate. They wanted to help these businesses get noticed and taken seriously as authorities in their industries, without ever having to compromise their values to get there. Beyond business, they wanted this to be a form of Da'wah — to entrepreneurs, creators, educators, and leaders — proof that real growth is only possible with Allah's Tawfeeq and Barakah.",
  ],
} as const;

/* ─── §5 CTA ───────────────────────────────────────────────────── */
export const aboutCta = {
  eyebrow: 'Work with us',
  heading: {
    lead: 'Ready to build something with',
    em: 'Barakah?',
  } as Heading,
  cta: { label: 'Apply for a Discovery Call →', href: '/contact' },
} as const;
