'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import { services } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const cardV: Variants = {
  hidden: { opacity: 0, y: 54 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: i * 0.12 } }),
};

function TierHud({ level }: { level: number }) {
  return (
    <svg width="72" height="34" viewBox="0 0 72 34" fill="none" stroke="currentColor" aria-hidden="true">
      <g strokeWidth="2" strokeLinecap="round">
        {[0, 1, 2].map((n) => (
          <line key={n} x1={6 + n * 12} y1={28} x2={6 + n * 12} y2={28 - (n + 1) * 6} opacity={n <= level ? 0.95 : 0.28} />
        ))}
      </g>
      <g transform="translate(52 6)">
        <path d="M9 0 l2.3 4.6 5.1 0.7 -3.7 3.6 0.9 5.1 -4.6 -2.4 -4.6 2.4 0.9 -5.1 -3.7 -3.6 5.1 -0.7 Z" strokeWidth="1.3" opacity="0.85" />
      </g>
    </svg>
  );
}

// Cinematic services — cards reveal on scroll (stagger), featured card statically
// lifted, no spotlight / magnetic. Plain "view all" link.
export default function ServicesCinematic() {
  const { eyebrow, heading, sub, featuredBadge, footerLink, cards } = services;
  return (
    <section className="hy-svc cn-svc" data-section-color="dark">
      <div className="cnt">
        <div className="hy-svc-head">
          <span className="hy-svc-eyebrow">{eyebrow}</span>
          <h2 className="hy-svc-h"><SplitReveal text={heading} by="word" /></h2>
          <p className="hy-svc-sub">{sub}</p>
        </div>
        <div className="hy-svc-grid">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`cn-svc-card-wrap${card.featured ? ' featured' : ''}`}
              custom={i}
              variants={cardV}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <article className={`hy-svc-card${card.featured ? ' featured' : ''}`}>
                {card.featured && <span className="hy-svc-badge">{featuredBadge}</span>}
                <div className="hy-svc-hud"><TierHud level={i} /></div>
                <span className="hy-svc-card-eyebrow">{card.eyebrow}</span>
                <h3 className="hy-svc-title">{card.title}</h3>
                <p className="hy-svc-subtitle">{card.subtitle}</p>
                <p className="hy-svc-desc">{card.desc}</p>
              </article>
            </motion.div>
          ))}
        </div>
        <div className="hy-svc-foot">
          <Link href={footerLink.href} className="btn btn-outline-lt" data-cursor>
            {footerLink.label}
            <Khatam size={12} inner={0.5} stroke="currentColor" strokeWidth={1.4} />
          </Link>
        </div>
      </div>
    </section>
  );
}
