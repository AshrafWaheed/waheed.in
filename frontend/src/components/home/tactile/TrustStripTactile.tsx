'use client';

import Marquee from '@/components/motion/Marquee';
import Khatam from '@/components/graphics/Khatam';
import { trustItems } from '@/content/home';

// Tactile trust strip — autoplay marquee; items brighten on hover.
export default function TrustStripTactile() {
  return (
    <div className="hy-trust tc-trust" data-section-color="dark">
      <Marquee speed={30}>
        {trustItems.map((t) => (
          <span key={t} className="hy-trust-item tc-trust-item">
            {t}
            <Khatam size={12} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.4} />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
