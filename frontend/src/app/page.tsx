import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroHybrid from '@/components/home/hybrid/HeroHybrid';
import TrustStripHybrid from '@/components/home/hybrid/TrustStripHybrid';
import ManifestoHybrid from '@/components/home/hybrid/ManifestoHybrid';
import ExpertiseHybrid from '@/components/home/hybrid/ExpertiseHybrid';
import AudienceHybrid from '@/components/home/hybrid/AudienceHybrid';
import ServicesHybrid from '@/components/home/hybrid/ServicesHybrid';
import IhsanProcessHybrid from '@/components/home/hybrid/IhsanProcessHybrid';
import RefusalHybrid from '@/components/home/hybrid/RefusalHybrid';
import NewsletterHybrid from '@/components/home/hybrid/NewsletterHybrid';
import FinalCtaHybrid from '@/components/home/hybrid/FinalCtaHybrid';

// The homepage — Hybrid variant (Wahda pinned-scrub storytelling + Outcrowd
// tactile micro-interactions). Indexable (canonical/OG metadata live in layout).
export default function HomePage() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroHybrid />
        <TrustStripHybrid />
        <ManifestoHybrid />
        <ExpertiseHybrid />
        <AudienceHybrid />
        <ServicesHybrid />
        <IhsanProcessHybrid />
        <RefusalHybrid />
        <NewsletterHybrid />
        <FinalCtaHybrid />
      </main>
    </SmoothScroll>
  );
}
