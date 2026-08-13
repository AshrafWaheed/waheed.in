'use client';

/**
 * SmHero — §1. Copy left, a feed running past it on the right.
 *
 * Fifth service hero, fifth composition. The one thing that distinguishes it
 * from page 01 — which is also copy-left with an object right — is that the
 * object is not a card sitting still: it is two columns of posts travelling in
 * opposite directions, which is the only hero on the site that is still moving
 * once it has finished arriving.
 *
 * That is not decoration. The page's argument is that a feed never stops and
 * that most brands are feeding it without a system, so the hero has to show the
 * treadmill before the copy names it.
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import FeedColumns from '@/components/graphics/FeedColumns';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

export default function SmHero({ page }: { page: ServicePage }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section className={`sm-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="cnt sm-hero-grid">
        <div className="sm-hero-copy">
          <motion.p className="sm-eyebrow" custom={0.12} variants={fadeUp} initial="hidden" animate="visible">
            {eyebrow}
          </motion.p>

          <h1 className="sm-hero-h1">
            <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.28} stagger={0.024} />{' '}
            <em>
              <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.56} stagger={0.024} />
            </em>
          </h1>

          <motion.p className="sm-hero-sub" custom={0.9} variants={fadeUp} initial="hidden" animate="visible">
            {sub}
          </motion.p>

          <motion.p className="sm-hero-promise" custom={1.02} variants={fadeUp} initial="hidden" animate="visible">
            {promise}
          </motion.p>

          <motion.div className="sm-hero-acts" custom={1.14} variants={fadeUp} initial="hidden" animate="visible">
            <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
            <StackButton href="/packages" size="lg" tone="ghost" onDark>
            See the packages
          </StackButton>
          </motion.div>
        </div>

        <motion.div
          className="sm-hero-feed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
        >
          <FeedColumns />
        </motion.div>
      </div>
    </section>
  );
}
