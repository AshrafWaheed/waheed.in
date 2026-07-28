import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroSignalBoard from '@/components/home/hybrid/HeroSignalBoard';
import TrustStripHybrid from '@/components/home/hybrid/TrustStripHybrid';
import ManifestoHybrid from '@/components/home/hybrid/ManifestoHybrid';
// "Our craft" uses the tactile Expertise bento (promoted from /home3, where it
// was built); "Our methodology" uses the tactile Ihsan Process.
import ExpertiseBento from '@/components/home/tactile/ExpertiseBento';
import AudienceHybrid from '@/components/home/hybrid/AudienceHybrid';
import ServicesHybrid from '@/components/home/hybrid/ServicesHybrid';
import IhsanProcessTactile from '@/components/home/tactile/IhsanProcessTactile';
import RefusalHybrid from '@/components/home/hybrid/RefusalHybrid';
import NewsletterHybrid from '@/components/home/hybrid/NewsletterHybrid';
import FinalCtaHybrid from '@/components/home/hybrid/FinalCtaHybrid';

// The homepage — Hybrid variant, with the tactile Expertise bento and tactile
// Ihsan Process swapped in. Indexable (metadata lives in layout).
export default function HomePage() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroSignalBoard />
        <TrustStripHybrid />
        <ManifestoHybrid />
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
