/**
 * Case study content, verbatim-ish from the client-approved write-up.
 *
 * Kept as data rather than JSX for the same reason the rest of content/ is:
 * the copy is the deliverable and it gets edited by people who are reading for
 * meaning, not for markup. Adding a second study is an entry in this array and
 * nothing else: the section and the modal both render whatever is here.
 */

export type CaseStudyStat = {
  /** Rendered big. Numeric part is counted up on scroll where it parses. */
  value: string;
  label: string;
};

export type CaseStudyBlock = {
  heading?: string;
  body?: string[];
  bullets?: string[];
};

export type CaseStudySection = {
  heading: string;
  body?: string[];
  bullets?: string[];
  blocks?: CaseStudyBlock[];
  /** Figures that belong under this section. */
  figures?: { src: string; alt: string; caption: string }[];
};

export type CaseStudy = {
  slug: string;
  client: string;
  /** One line, sits under the client name everywhere. */
  tagline: string;
  services: string[];
  /** The card's pitch. Shorter than the tagline's job: this one has to earn a click. */
  blurb: string;
  /** The image that fronts the card. */
  cover: { src: string; alt: string };
  stats: CaseStudyStat[];
  sections: CaseStudySection[];
  closing: string;
};

export const caseStudiesIntro = {
  eyebrow: 'Selected work',
  heading: 'What it looks like when the brief is a parts list',
  sub: 'One project, documented properly. Not a logo wall.',
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'optipart',
    client: 'Optipart',
    tagline:
      "Building a distributor's digital catalogue from a parts list and a rough logo",
    services: ['UX/UI Design', 'Brand & Graphic Design', 'WordPress Development'],
    blurb:
      'He arrived with a list of the parts he sells and a first-pass logo. What he needed was not a website in the abstract, but a working knowledge base two very different audiences could both use.',
    cover: {
      src: '/case-studies/optipart/wireframe-home.png',
      alt: 'Low-fidelity wireframe of the Optipart homepage, showing the hero, trust pillars and six-category product grid.',
    },
    stats: [
      { value: '6', label: 'product categories, each with its own indexable URL' },
      { value: '2', label: 'audiences served by one site, upstream and downstream' },
      { value: '4', label: 'products documented in full technical detail on Brake System alone' },
      { value: '0', label: 'developers needed to add the next part' },
    ],
    sections: [
      {
        heading: 'The ask',
        body: [
          "Optipart's owner runs a car parts distribution business. Before this project he had no website. What he came to WAHEED with was a list of the parts he sells and a first-pass logo. What he needed was less a website in the abstract and more a working knowledge base: something he could point a manufacturer to when they asked what he stocked and needed supplied, and something a distributor or workshop could find on their own and treat as the default place to source from.",
          'That framing set two jobs for the site to do, not one:',
        ],
        bullets: [
          'Upstream, toward manufacturers: a clear, structured record of every part family Optipart carries, detailed enough that a supplier could see exactly what to quote against.',
          'Downstream, toward buyers: a catalogue a workshop manager, reseller, or fleet buyer could discover, trust, and act on without needing a phone call first.',
        ],
      },
      {
        heading: 'Research',
        body: [
          'Before any screen was designed, the work started with three questions: how does this industry actually sell, what do competing catalogues get wrong, and what does the ideal buyer look for in the first thirty seconds on a site.',
        ],
        blocks: [
          {
            heading: 'Industry and competitor research',
            body: [
              'A common pattern across parts-distribution sites is a catalogue organised by SKU or manufacturer code, which only works for a buyer who already knows the part number they want. That excludes the buyer browsing by problem, "I need brake parts for a hydraulic drum system", rather than searching by code. Optipart\'s catalogue was built to support both: broad entry by vehicle system first, with the option to narrow once the buyer knows more.',
            ],
          },
          {
            heading: 'Prospect research',
            body: [
              'The ideal Optipart buyer is a workshop manager, reseller, or fleet buyer evaluating a new supplier, often on a phone on a shop floor rather than at a desk. That buyer checks credibility fast: certifications, delivery reliability, and whether the business looks established. If those questions are not answered in the first screen, the buyer leaves before reaching the product list.',
            ],
          },
          {
            heading: 'How this shaped navigation',
            bullets: [
              'Products sit under one menu with all six categories visible on hover, so a buyer reaches Brake System or Filters in a single click from anywhere on the site.',
              'Within Brake System, parts are grouped by sub-system, which mirrors how a mechanic thinks about the car rather than how a warehouse sorts stock.',
              'Trust signals, certification, delivery and account terms, sit directly under the hero and before the product grid, so the credibility check happens before the buyer has to scroll.',
              'Layout was planned mobile-first, on the assumption that most buyers open the site from a phone.',
              'One call to action carries the whole site: Browse Products at the top, Contact Us at the close. No competing buttons pulling attention apart.',
            ],
          },
          {
            heading: 'Copywriting fused with basic SEO',
            bullets: [
              'Each category page has its own clean, crawlable URL, matched to the term a buyer would actually search.',
              'Product copy uses the language a buyer searches with, brake pads, wheel cylinder, brake disc, rather than only internal part codes.',
              'The homepage title, Optimise your drive, reads naturally while still carrying the positioning.',
              'Every product description was written to double as on-page content: specific enough to help rankings, plain enough to read as a person wrote it.',
            ],
          },
        ],
      },
      {
        heading: 'Brand and graphic design',
        blocks: [
          {
            heading: 'Logo refinement',
            body: [
              'The brief was to revise the logo Optipart already had rather than start over. The wordmark and icon were tightened: proportions corrected, spacing cleaned up, and the mark simplified so it reads clearly at both header size and favicon size. The revised logo now anchors the header and the footer, and is used consistently across the site so the brand looks like one business rather than a set of loosely related pages.',
            ],
          },
        ],
      },
      {
        heading: 'Low-fidelity design',
        body: [
          'Before any visual design started, the planned structure was sketched as low-fidelity wireframes: boxes, placeholder text, and rough hierarchy, with no colour or type applied. This step exists to test the structure cheaply. It is far faster to move a block on a wireframe than to redo a finished page, and it gives the client something concrete to react to before development time is spent.',
        ],
        figures: [
          {
            src: '/case-studies/optipart/wireframe-home.png',
            alt: 'Homepage wireframe showing the hero, three trust pillars, a six-item product grid and a closing call to action.',
            caption:
              'Homepage wireframe. Hero, trust pillars, product grid and closing CTA, blocked out before visual design.',
          },
          {
            src: '/case-studies/optipart/wireframe-category.png',
            alt: 'Category page wireframe showing sub-group tabs and a repeating product block with an image, description and characteristics panel.',
            caption:
              'Category page wireframe. The product-plus-characteristics pattern later used across the Brake System page.',
          },
        ],
      },
      {
        heading: 'Built on WordPress, from scratch',
        body: [
          'Given the size and scope of the site, a six-category catalogue for a small distribution business, WordPress was the right foundation rather than a custom framework. The reasoning was about the end user as much as the build:',
        ],
        bullets: [
          "Optipart's owner can add a new part or update a description himself once new stock arrives, without needing a developer for routine changes. That directly serves the original ask: a knowledge base he can maintain, not just view.",
          "WordPress's native page and category structure maps onto the information architecture planned in the wireframes, so the site the developer builds matches the site the owner navigates.",
          'Standard SEO and analytics plugins make the groundwork from the research phase enforceable without custom code, and Google Site Kit was connected from launch so there is a performance baseline from day one.',
          'Build timeline and cost stay proportional to what a small distribution business needs. There is no framework overhead to justify for a six-category catalogue.',
          'Adding a seventh category, or extending Filters with the same product-plus-characteristics format used on Brake System, is a content task, not a redevelopment.',
        ],
      },
      {
        heading: 'Results and impact',
        body: ['Measured against the original ask, not a generic launch checklist:'],
        bullets: [
          'Optipart now has a single link for each part system to send a manufacturer, instead of describing stock verbally on a call. The Brake System page alone documents four distinct products in full technical detail.',
          'Distributors and workshops researching a new supplier can verify Optipart in one visit: certifications, delivery terms and account flexibility are all answered on the homepage before they reach the catalogue.',
          'Every category has its own indexable URL, which gives Optipart a foothold to be found for system-specific searches rather than relying only on the homepage.',
          'Analytics and search performance tracking were live from launch, so the site has a measurable baseline rather than starting to track months in.',
          'The revised logo and consistent layout mean Optipart now presents as one coherent business across every page, which is the detail a buyer checks before opening a trade account.',
        ],
      },
    ],
    closing:
      'What was handed over was a name and a rough mark. What launched is a structured, sourced, and maintainable business asset.',
  },
];
