import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
// Direction C — the founders flank the copy instead of the collage stacking
// under it. HeroSignalBoard (B) is kept unmounted for comparison.
import HeroFoundersFlank from '@/components/home/hybrid/HeroFoundersFlank';
import TrustStripHybrid from '@/components/home/hybrid/TrustStripHybrid';
// Manifesto commented out per the redesign — the hero now runs straight into
// the solutions grid, with no interstitial manifesto line.
// import ManifestoHybrid from '@/components/home/hybrid/ManifestoHybrid';
// "Our craft" uses the tactile Expertise bento (promoted from /home3, where it
// was built); "Our methodology" uses the tactile Ihsan Process.
import ExpertiseBento from '@/components/home/tactile/ExpertiseBento';
import AudienceHybrid from '@/components/home/hybrid/AudienceHybrid';
import ServicesHybrid from '@/components/home/hybrid/ServicesHybrid';
import IhsanProcessTactile from '@/components/home/tactile/IhsanProcessTactile';
import RefusalHybrid from '@/components/home/hybrid/RefusalHybrid';
import NewsletterHybrid from '@/components/home/hybrid/NewsletterHybrid';
import FinalCtaHybrid from '@/components/home/hybrid/FinalCtaHybrid';
import SiteJsonLd from '@/components/seo/SiteJsonLd';

// The homepage — Hybrid variant, with the tactile Expertise bento and tactile
// Ihsan Process swapped in. Indexable (metadata lives in layout).
export default function HomePage() {
  return (
    <SmoothScroll>
      <SectionNav />
      {/* Organization + WebSite schema. Homepage only — this is the site's one
          canonical statement of who it is; see the component's header. */}
      <SiteJsonLd />
      <main>
        <HeroFoundersFlank />
        <TrustStripHybrid />
        {/* <ManifestoHybrid /> — removed per the redesign; hero → solutions. */}
        <ExpertiseBento />
        <AudienceHybrid />
        <ServicesHybrid />
        <IhsanProcessTactile />
        <RefusalHybrid />
        <NewsletterHybrid />
        <FinalCtaHybrid />
      </main>
    </SmoothScroll>
  );
}
