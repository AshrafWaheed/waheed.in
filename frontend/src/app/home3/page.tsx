import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import PrimitivesDemo from '@/components/home/_lab/PrimitivesDemo';

// Outcrowd-tactile variant. Real sections land in S5–S6.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home3Page() {
  return (
    <SmoothScroll>
      <main>
        <PrimitivesDemo variant="Outcrowd-tactile" />
      </main>
    </SmoothScroll>
  );
}
