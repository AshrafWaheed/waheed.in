import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroCinematic from '@/components/home/cinematic/HeroCinematic';
import TrustStripCinematic from '@/components/home/cinematic/TrustStripCinematic';
import ManifestoCinematic from '@/components/home/cinematic/ManifestoCinematic';
import ExpertiseCinematic from '@/components/home/cinematic/ExpertiseCinematic';
import AudienceCinematic from '@/components/home/cinematic/AudienceCinematic';
import ServicesCinematic from '@/components/home/cinematic/ServicesCinematic';
import IhsanProcessCinematic from '@/components/home/cinematic/IhsanProcessCinematic';
import RefusalHybrid from '@/components/home/hybrid/RefusalHybrid';
import NewsletterCinematic from '@/components/home/cinematic/NewsletterCinematic';
import FinalCtaCinematic from '@/components/home/cinematic/FinalCtaCinematic';

// Wahda-cinematic variant — full page. Refusal is hover-free, so it reuses the
// Hybrid component directly.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home2Page() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroCinematic />
        <TrustStripCinematic />
        <ManifestoCinematic />
        <ExpertiseCinematic />
        <AudienceCinematic />
        <ServicesCinematic />
        <IhsanProcessCinematic />
        <RefusalHybrid />
        <NewsletterCinematic />
        <FinalCtaCinematic />
      </main>
    </SmoothScroll>
  );
}
