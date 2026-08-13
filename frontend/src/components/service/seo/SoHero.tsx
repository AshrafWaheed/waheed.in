'use client';

/**
 * SoHero — §1. Copy on top, the argument drawn full-bleed underneath it.
 *
 * Four service heroes, four compositions: 01 is copy-left with an artifact card
 * right, 03 is centred inside a rosette, /packages is engine-left with copy
 * right. This one is STACKED — copy occupying the upper band, and the paid-vs-
 * organic curve running the full width along the bottom, drawing on mount.
 *
 * The chart is the headline's evidence, so it is deliberately not decoration
 * tucked behind the words: it gets its own band and its own labels.
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import CompoundCurve from '@/components/graphics/CompoundCurve';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

export default function SoHero({ page }: { page: ServicePage }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section className={`so-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="cnt so-hero-in">
        <motion.p className="so-eyebrow" custom={0.12} variants={fadeUp} initial="hidden" animate="visible">
          {eyebrow}
        </motion.p>

        <div className="so-hero-grid">
          <h1 className="so-hero-h1">
            <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.28} stagger={0.025} />{' '}
            <em>
              <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.5} stagger={0.025} />
            </em>
          </h1>

          <div className="so-hero-tail">
            <motion.p className="so-hero-sub" custom={0.9} variants={fadeUp} initial="hidden" animate="visible">
              {sub}
            </motion.p>
            <motion.p className="so-hero-promise" custom={1.02} variants={fadeUp} initial="hidden" animate="visible">
              {promise}
            </motion.p>
            <motion.div className="so-hero-acts" custom={1.14} variants={fadeUp} initial="hidden" animate="visible">
              <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
              <StackButton href="/packages" size="lg" tone="ghost" onDark>
            See the packages
          </StackButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The evidence band. Full bleed, its own labels — not decoration. */}
      <div className="so-hero-chart" aria-hidden="true">
        <CompoundCurve />
        <div className="cnt so-hero-keys">
          <span className="so-key so-key--paid">Paid — stops when the spend stops</span>
          <span className="so-key so-key--organic">Organic — keeps returning</span>
        </div>
      </div>
    </section>
  );
}
