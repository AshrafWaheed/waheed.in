import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
import AboutHero from '@/components/about/AboutHero';
import FoundingStoryAbout from '@/components/about/FoundingStoryAbout';
import TheGapAbout from '@/components/about/TheGapAbout';
import PeopleBehindAbout from '@/components/about/PeopleBehindAbout';
import ValuesAbout from '@/components/about/ValuesAbout';
import QuoteAbout from '@/components/about/QuoteAbout';
// The clarity form + brand lockup are shared with the homepage; the global
// Footer is mounted in app/layout.tsx, so it already follows the lockup here.
import ClarityFormHybrid from '@/components/home/hybrid/ClarityFormHybrid';
import BrandLockup from '@/components/home/hybrid/BrandLockup';
// Old sections superseded by the redesign (kept as files, no longer mounted).
// import GapNarrative from '@/components/about/GapNarrative';
// import FoundersAbout from '@/components/about/FoundersAbout';
// import JourneyOutro from '@/components/about/JourneyOutro';
// import AboutCta from '@/components/about/AboutCta';

export const metadata: Metadata = pageMeta({
  title: 'About WAHEED · A Muslim-Led Digital Agency',
  description:
    'Built for brands that refuse to compromise. Meet the founders behind this Muslim-led digital agency — our story, our values, and the halal-first standard behind every build.',
  path: '/about',
});

/**
 * /about — rebuilt to homepage standard.
 *
 * Same three page-level primitives the homepage mounts: Lenis smooth scroll,
 * the khatam cursor, and the section-colour-aware nav (which reads the
 * `data-section-color` on each section below and inverts the nav to match).
 *
 * Colour rhythm alternates dark → light → dark → light → dark so the founders
 * sit on night, where their gold-lit portraits actually read, and so the page
 * has the same banded cadence as `/` instead of the old flat run of near-white
 * sections.
 *
 * Every visible string comes from content/about.ts, lifted verbatim from the
 * previous version of this file.
 */
export default function AboutPage() {
  return (
    <SmoothScroll>
      <SectionNav />
      <main>
        <AboutHero />
        <FoundingStoryAbout />
        <TheGapAbout />
        <PeopleBehindAbout />
        <ValuesAbout />
        <QuoteAbout />
        <ClarityFormHybrid />
        <BrandLockup />
      </main>
    </SmoothScroll>
  );
}
