import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import KhatamCursor from '@/components/motion/KhatamCursor';
import SectionNav from '@/components/motion/useSectionNav';
import HeroTactile from '@/components/home/tactile/HeroTactile';
import TrustStripTactile from '@/components/home/tactile/TrustStripTactile';
import ManifestoTactile from '@/components/home/tactile/ManifestoTactile';
import ExpertiseTactile from '@/components/home/tactile/ExpertiseTactile';

// Outcrowd-tactile variant. Top half (§1–4) built in S5; bottom half in S6.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home3Page() {
  return (
    <SmoothScroll>
      <KhatamCursor />
      <SectionNav />
      <main>
        <HeroTactile />
        <TrustStripTactile />
        <ManifestoTactile />
        <ExpertiseTactile />
      </main>
    </SmoothScroll>
  );
}
