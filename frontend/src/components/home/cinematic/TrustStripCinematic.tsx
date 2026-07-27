'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import Khatam from '@/components/graphics/Khatam';
import { trustItems } from '@/content/home';

// Scroll-linked horizontal sweep (Wahda scrubbed scrolling-text): the row of
// trust items drifts left as the strip passes through the viewport. No autoplay.
export default function TrustStripCinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(
        track,
        { xPercent: 6 },
        { xPercent: -42, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
      );
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => mm.revert();
  }, []);

  const items = [...trustItems, ...trustItems];
  return (
    <div ref={ref} className="cn-trust" data-section-color="dark">
      <div ref={trackRef} className="cn-trust-track">
        {items.map((t, i) => (
          <span key={i} className="hy-trust-item">
            {t}
            <Khatam size={12} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.4} />
          </span>
        ))}
      </div>
    </div>
  );
}
