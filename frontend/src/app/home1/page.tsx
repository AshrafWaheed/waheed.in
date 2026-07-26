import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import PrimitivesDemo from '@/components/home/_lab/PrimitivesDemo';

// Staging route for the Hybrid variant. Promoted to `/` at the end of S2.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home1Page() {
  return (
    <SmoothScroll>
      <main>
        <PrimitivesDemo variant="Hybrid (staging)" />
      </main>
    </SmoothScroll>
  );
}
