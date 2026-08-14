import { linkableServices } from '@/content/services';

/**
 * Organization + WebSite structured data, mounted once on the homepage.
 *
 * The site already emits Service, FAQPage and Article schema on the pages that
 * warrant them, but nothing declared the ENTITY those pages belong to. That is
 * the gap this closes, and it is the one that matters most for two audiences
 * that are increasingly the same audience:
 *
 *  · Google, for entity resolution — `sameAs` is how the five social profiles
 *    get tied to this domain rather than being five unrelated accounts with a
 *    similar name, and it is the input a knowledge panel is built from.
 *  · Answer engines. When something asks an LLM "who builds halal-compliant
 *    websites", the thing it can quote is a machine-readable statement of what
 *    this studio is, what it sells, and where to reach it. Prose in a hero
 *    section is a much weaker signal than a typed graph.
 *
 * ── Rules this file keeps ───────────────────────────────────────────────────
 *
 *  1. Nothing here is invented. Every value is either already visible on the
 *     site or derived from a content registry, and there is no postal address
 *     or founding date because the site does not state one. Structured data
 *     that says something the page does not is a manual-action risk, and a lie
 *     to an LLM is worse than a silence.
 *  2. The services come from `linkableServices`, the same registry the nav
 *     renders from, so the graph cannot drift from the site — it is the list of
 *     crafts whose PAGES exist, so a service listed here always resolves. The
 *     /packages page is deliberately unlisted (kept out of the nav, sitemap and
 *     this graph), so no OfferCatalog is emitted for it.
 *  3. Stable `@id`s. Other pages' markup can point at
 *     `https://waheed.in/#organization` instead of restating the publisher,
 *     and Google merges the nodes.
 *
 * Homepage only, deliberately: the Organization is one entity, and repeating
 * it on all thirty routes gives crawlers thirty copies to reconcile rather
 * than one canonical statement.
 */

const SITE = 'https://waheed.in';
const ORG_ID = `${SITE}/#organization`;

/** Every profile the footer links to. Kept in the same order for diffability. */
const SAME_AS = [
  'https://www.instagram.com/waheedhq/',
  'https://www.facebook.com/waheedhq.fb/',
  'https://youtube.com/@waheedhq',
  'https://www.linkedin.com/company/waheedhq/',
];

export default function SiteJsonLd() {
  const graph = [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: 'WAHEED',
      legalName: 'Waheed Digital Studio',
      alternateName: 'Waheed Digital Studio',
      url: SITE,
      description:
        'A halal-first digital studio. We help Muslim-led brands grow with integrity — ' +
        'strategy, brand, websites and custom software built on Shariah-aligned values.',
      slogan: 'Scale your brand online without compromising your values.',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/logo.png`,
        width: 1800,
        height: 601,
      },
      image: `${SITE}/logo.png`,
      email: 'info@waheed.in',
      // The one phone number the site publishes — the footer's WhatsApp link.
      telephone: '+91-542-407-2195',
      /*
       * A sole proprietorship has exactly one founder: its owner. Only Ashraf
       * Waheed Ansari (the footer's ownership line) is a schema founder here —
       * the Managing Partner holds a strategic, non-equity role, not a foundership.
       */
      founder: { '@type': 'Person', name: 'Ashraf Waheed Ansari' },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      knowsLanguage: ['en', 'ar'],
      sameAs: SAME_AS,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'info@waheed.in',
          url: `${SITE}/contact`,
          availableLanguage: ['English'],
        },
      ],
      makesOffer: linkableServices.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.navBlurb,
          url: `${SITE}/services/${s.slug}`,
        },
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'WAHEED',
      description:
        'We help Muslim-led brands grow with integrity. Strategy, design, and digital ' +
        'products built on Shariah-aligned values.',
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: SITE,
      name: 'WAHEED · Halal Digital Studio',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': ORG_ID },
      inLanguage: 'en-GB',
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
