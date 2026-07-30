import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import ServicesHero from '@/components/services/ServicesHero';
import OfferLadder from '@/components/services/OfferLadder';
import CustomPlanCta from '@/components/services/CustomPlanCta';

export const metadata: Metadata = pageMeta({
  title: 'Services · WAHEED',
  description:
    'Five packages built for halal brands: Halal Brand Audit, Foundations Engagement, The Authority System, Halal Brand OS, and Halal Brand Partnership.',
  path: '/services',
});

/**
 * /services — rebuilt to homepage standard, same three page-level primitives as
 * / and /about: Lenis smooth scroll, the khatam cursor, and the section-colour
 * nav that inverts against each `data-section-color` below.
 *
 * dark → light → dark, so the ladder gets the calm light band it needs to be read
 * and the page still opens and closes on night.
 *
 * Every visible string comes from content/services.ts, lifted verbatim from the
 * previous version of this file.
 */
export default function ServicesPage() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <ServicesHero />
        <OfferLadder />
        <CustomPlanCta />
      </main>
    </SmoothScroll>
  );
}
