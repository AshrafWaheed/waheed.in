import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroSignalBoard from '@/components/home/hybrid/HeroSignalBoard';
import TrustStripHybrid from '@/components/home/hybrid/TrustStripHybrid';
import ManifestoHybrid from '@/components/home/hybrid/ManifestoHybrid';
// "Our craft" uses the cinematic Expertise; "Our methodology" uses the tactile
// Ihsan Process — per the chosen mix for the live homepage.
import ExpertiseCinematic from '@/components/home/cinematic/ExpertiseCinematic';
import AudienceHybrid from '@/components/home/hybrid/AudienceHybrid';
import ServicesHybrid from '@/components/home/hybrid/ServicesHybrid';
import IhsanProcessTactile from '@/components/home/tactile/IhsanProcessTactile';
import RefusalHybrid from '@/components/home/hybrid/RefusalHybrid';
import NewsletterHybrid from '@/components/home/hybrid/NewsletterHybrid';
import FinalCtaHybrid from '@/components/home/hybrid/FinalCtaHybrid';

// The homepage — Hybrid variant, with the cinematic "Our craft" and tactile
// "Our methodology" sections swapped in. Indexable (metadata lives in layout).
export default function HomePage() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroSignalBoard />
        <TrustStripHybrid />
        <ManifestoHybrid />
        <ExpertiseCinematic />
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
