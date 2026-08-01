/**
 * The shape every `/services/[slug]` page is written to.
 *
 * One route renders all of them, so this interface IS the page design — a field
 * added here has to earn a section, and a page that cannot fill a field is a
 * page that should not use this template.
 *
 * The argument each page makes, in order:
 *   hero      — what the craft is, and the promise it makes
 *   problem   — why the reader is here, named as symptoms they recognise
 *   build     — what actually gets delivered (the antidote to vague retainers)
 *   process   — how it runs, with weeks attached so scope feels bounded
 *   outcomes  — what they walk away with, and who this is NOT for
 *   packages  — the funnel: which /packages rungs contain this craft
 *   faq       — the four objections that come up before a discovery call
 *   cta       — the close
 *
 * Nothing here is optional. That is deliberate: an optional section becomes the
 * one nobody fills in, and five service pages of uneven depth read as four good
 * pages and one that was abandoned.
 */

export interface ServicePage {
  /** Must equal the `slug` in the register — the route looks the page up by it. */
  slug: string;

  metaTitle: string;
  metaDescription: string;

  hero: {
    /** Rendered in the mono label tier, e.g. 'Service 01'. */
    eyebrow: string;
    h1: { lead: string; em: string };
    sub: string;
    /** The one-line promise. Verbatim from `expertise.doors[n].promise`. */
    promise: string;
  };

  problem: {
    eyebrow: string;
    heading: { lead: string; em: string };
    body: string;
    /** Exactly three. Symptoms the reader recognises in their own business. */
    symptoms: { title: string; body: string }[];
  };

  build: {
    eyebrow: string;
    heading: string;
    sub: string;
    /** Six deliverables. Concrete nouns — a thing that gets handed over. */
    items: { num: string; title: string; body: string }[];
  };

  process: {
    eyebrow: string;
    heading: string;
    sub: string;
    /** Four phases. `span` is the honest duration, not a best case. */
    steps: { span: string; title: string; body: string }[];
  };

  outcomes: {
    eyebrow: string;
    heading: { lead: string; em: string };
    /**
     * Five. Results, not features.
     *
     * CONVENTION: an item containing ' → ' is a from/to pair, and a layout may
     * split on it to render the two halves as a shift. Pages that do not use
     * the arrow render as a plain list everywhere, so this is opt-in per page
     * and costs nothing to ignore.
     */
    list: string[];
    fitHeading: string;
    fit: string[];
    /** Naming who this is wrong for is the same move as the Refusal panel. */
    notHeading: string;
    not: string[];
  };

  /**
   * Titles of the /packages rungs that contain this craft. Matched against
   * `ladder.rungs[].title` at render time, so a typo here shows up as a missing
   * card rather than as a wrong link.
   */
  packages: string[];

  /** Four. Rendered as an accordion and emitted as FAQPage JSON-LD. */
  faq: { q: string; a: string }[];

  cta: {
    eyebrow: string;
    heading: { lead: string; em: string };
    body: string;
  };
}
