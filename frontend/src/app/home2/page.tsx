import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroCinematic from '@/components/home/cinematic/HeroCinematic';
import TrustStripCinematic from '@/components/home/cinematic/TrustStripCinematic';
import ManifestoCinematic from '@/components/home/cinematic/ManifestoCinematic';
import ExpertiseCinematic from '@/components/home/cinematic/ExpertiseCinematic';

// Wahda-cinematic variant. Top half (§1–4) built in S3; bottom half in S4.
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
      </main>
    </SmoothScroll>
  );
}
