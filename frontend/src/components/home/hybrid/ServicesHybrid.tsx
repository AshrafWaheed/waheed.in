'use client';

import Link from 'next/link';
import SplitReveal from '@/components/motion/SplitReveal';
import Spotlight from '@/components/motion/Spotlight';
import Magnetic from '@/components/motion/Magnetic';
import Khatam from '@/components/graphics/Khatam';
import { services } from '@/content/home';

/** Small per-card HUD: ascending gold ticks + a khatam. Decorative. */
function TierHud({ level }: { level: number }) {
  return (
    <svg width="72" height="34" viewBox="0 0 72 34" fill="none" stroke="currentColor" aria-hidden="true">
      <g strokeWidth="2" strokeLinecap="round">
        {[0, 1, 2].map((n) => (
          <line key={n} x1={6 + n * 12} y1={28} x2={6 + n * 12} y2={28 - (n + 1) * 6}
            opacity={n <= level ? 0.95 : 0.28} />
        ))}
      </g>
      <g transform="translate(52 6)">
        <path d="M9 0 l2.3 4.6 5.1 0.7 -3.7 3.6 0.9 5.1 -4.6 -2.4 -4.6 2.4 0.9 -5.1 -3.7 -3.6 5.1 -0.7 Z"
          strokeWidth="1.3" opacity="0.85" />
      </g>
    </svg>
  );
}

export default function ServicesHybrid() {
  const { eyebrow, heading, sub, featuredBadge, footerLink, cards } = services;

  return (
    <section className="hy-svc" data-section-color="dark">
      <div className="cnt">
        <div className="hy-svc-head">
          <span className="hy-svc-eyebrow">{eyebrow}</span>
          <h2 className="hy-svc-h">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="hy-svc-sub">{sub}</p>
        </div>

        <div className="hy-svc-grid">
          {cards.map((card, i) => (
            <Spotlight key={card.title} className={`hy-svc-card-wrap${card.featured ? ' featured' : ''}`}>
              <article className={`hy-svc-card${card.featured ? ' featured' : ''}`} data-cursor>
                {card.featured && <span className="hy-svc-badge">{featuredBadge}</span>}
                <div className="hy-svc-hud"><TierHud level={i} /></div>
                <span className="hy-svc-card-eyebrow">{card.eyebrow}</span>
                <h3 className="hy-svc-title">{card.title}</h3>
                <p className="hy-svc-subtitle">{card.subtitle}</p>
                <p className="hy-svc-desc">{card.desc}</p>
              </article>
            </Spotlight>
          ))}
        </div>

        <div className="hy-svc-foot">
          <Magnetic>
            <Link href={footerLink.href} className="btn btn-outline-lt" data-cursor>
              {footerLink.label}
              <Khatam size={12} inner={0.5} stroke="currentColor" strokeWidth={1.4} className="hy-svc-foot-star" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
