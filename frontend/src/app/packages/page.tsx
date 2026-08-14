import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
import PackagesHero from '@/components/packages/PackagesHero';
import OfferLadder from '@/components/packages/OfferLadder';
import CustomPlanCta from '@/components/packages/CustomPlanCta';

export const metadata: Metadata = {
  ...pageMeta({
    title: 'Packages · WAHEED',
    description:
      'Five packages built for halal brands: Halal Brand Audit, Foundations Engagement, The Authority System, Halal Brand OS, and Halal Brand Partnership.',
    path: '/packages',
  }),
  // Unlisted. The page still resolves and is reachable from the homepage, but it
  // is deliberately kept out of the nav, the sitemap, the JSON-LD catalog and
  // /llms.txt — so it is not advertised or indexed. `follow` stays true so the
  // CTAs on it (contact, book) still pass link equity.
  robots: { index: false, follow: true },
};

/**
 * /packages — rebuilt to homepage standard, same three page-level primitives as
 * / and /about: Lenis smooth scroll, the khatam cursor, and the section-colour
 * nav that inverts against each `data-section-color` below.
 *
 * dark → light → dark, so the ladder gets the calm light band it needs to be read
 * and the page still opens and closes on night.
 *
 * Every visible string comes from content/packages.ts, lifted verbatim from the
 * previous version of this file.
 */
export default function PackagesPage() {
  return (
    <SmoothScroll>
      <SectionNav />
      <main>
        <PackagesHero />
        <OfferLadder />
        <CustomPlanCta />
      </main>
    </SmoothScroll>
  );
}
