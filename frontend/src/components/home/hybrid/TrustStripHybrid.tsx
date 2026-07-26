'use client';

import Marquee from '@/components/motion/Marquee';
import Khatam from '@/components/graphics/Khatam';
import { trustItems } from '@/content/home';

export default function TrustStripHybrid() {
  return (
    <div className="hy-trust" data-section-color="dark">
      <Marquee speed={32}>
        {trustItems.map((t) => (
          <span key={t} className="hy-trust-item">
            {t}
            <Khatam size={12} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.4} />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
