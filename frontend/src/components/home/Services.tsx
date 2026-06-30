'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Card {
  eyebrow:  string;
  title:    string;
  subtitle: string;
  desc:     string;
  featured: boolean;
  delay:    number;
}

const CARDS: Card[] = [
  {
    eyebrow:  'Web & Brand',
    title:    'Foundations Engagement',
    subtitle: 'For halal brands ready to strengthen their presence with clarity and purpose.',
    desc:     'Full website + brand foundations + 30-day post-launch optimisation. Conversion-fluent, mobile-first, built on a system you can grow into.',
    featured: false,
    delay:    0.05,
  },
  {
    eyebrow:  'Full System',
    title:    'The Authority System',
    subtitle: 'Full website + brand system + 90-day social ramp. For founders building authority in their industry.',
    desc:     'Everything in Foundations, plus brand identity refresh, content strategy, social ramp-up, and quarterly review for one year.',
    featured: true,
    delay:    0.45,
  },
  {
    eyebrow:  'Partnership',
    title:    'Halal Brand Partnership',
    subtitle: 'Quarterly strategy reviews and ongoing execution. For brands that value steady, sustainable growth.',
    desc:     'Monthly retainer covering iterative design, growth experiments, technical maintenance, and strategic counsel. Two-client cap per quarter.',
    featured: false,
    delay:    0.18,
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 140 },
  visible: (card: Card) => ({
    opacity: 1,
    y:       card.featured ? -22 : 0,
    transition: { duration: 1, ease: EASE, delay: card.delay },
  }),
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-10% 0px' });

  return (
    <section className="sec" ref={sectionRef} style={{ background: '#FFFDF9' }}>
      <div className="cnt">

        {/* Header */}
        <div style={{ maxWidth: 640, margin: '0 auto 1rem', textAlign: 'center' }}>
          <span className="eyebrow-v2 center">How we build with you</span>
          <h2 className="svc-section-h reveal">
            The infrastructure halal brands are built on.
          </h2>
          <p className="svc-section-sub reveal delay-1">
            Three engagement levels, each strategically crafted to move the business forward.
          </p>
        </div>

        {/* Cards */}
        <div className="svc-grid">
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              className={`svc-card${card.featured ? ' featured' : ''}`}
              custom={card}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {card.featured && (
                <div className="svc-card-featured-badge">BEST OFFER</div>
              )}

              <div
                className="svc-eyebrow-label"
                style={{ color: card.featured ? undefined : '#254851' }}
              >
                {card.eyebrow}
              </div>

              <h3 className="svc-title">{card.title}</h3>
              <p className="svc-subtitle">{card.subtitle}</p>
              <p className="svc-desc">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Custom plan banner */}
        <div className="svc-custom-banner reveal">
          <div className="svc-custom-left">
            <span className="svc-custom-tag">Not sure what you need?</span>
            <h3 className="svc-custom-h">Request a custom service plan.</h3>
            <p className="svc-custom-p">
              Tell us your goals, your budget, and where you are right now.
              We&apos;ll put together a curated scope that fits.
            </p>
          </div>
          <Link href="/contact" className="btn btn-teal svc-custom-btn">
            Let&apos;s talk →
          </Link>
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/services" className="btn btn-outline reveal">
            View Full Services →
          </Link>
        </div>

      </div>
    </section>
  );
}
