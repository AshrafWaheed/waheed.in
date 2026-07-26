import type { Metadata } from 'next';
import SmoothScroll from '@/components/motion/SmoothScroll';
import PrimitivesDemo from '@/components/home/_lab/PrimitivesDemo';

// Wahda-cinematic variant. Real sections land in S3–S4.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home2Page() {
  return (
    <SmoothScroll>
      <main>
        <PrimitivesDemo variant="Wahda-cinematic" />
      </main>
    </SmoothScroll>
  );
}
