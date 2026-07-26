import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroHybrid from '@/components/home/hybrid/HeroHybrid';
import TrustStripHybrid from '@/components/home/hybrid/TrustStripHybrid';
import ManifestoHybrid from '@/components/home/hybrid/ManifestoHybrid';
import ExpertiseHybrid from '@/components/home/hybrid/ExpertiseHybrid';

// Hybrid variant — staged here, promoted to `/` at the end of S2.
// Top half (§1–4) built in S1; bottom half (§5–10) lands in S2.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home1Page() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroHybrid />
        <TrustStripHybrid />
        <ManifestoHybrid />
        <ExpertiseHybrid />
      </main>
    </SmoothScroll>
  );
}
