'use client';

/**
 * BsHero — §1. Centred copy standing inside the resolving mark.
 *
 * Neither of the other service heroes is centred: /services/web-app-development
 * is copy-left with an artifact card right, and /packages is engine-left with
 * copy right. This one is dead centre, with BrandField full-bleed behind it so
 * the two drawn rings frame the headline. The composition is the claim — you
 * are the thing that resolved out of the field.
 *
 * There is no artifact card here on purpose. A product screenshot on a brand
 * strategy page would be arguing the wrong thing.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import BrandField from '@/components/graphics/BrandField';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

export default function BsHero({ page }: { page: ServicePage }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section ref={ref} className={`bs-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="bs-hero-field" aria-hidden="true">
        <BrandField />
      </div>

      <div className="cnt bs-hero-in">
        <motion.p className="bs-eyebrow" custom={0.15} variants={fadeUp} initial="hidden" animate="visible">
          {eyebrow}
        </motion.p>

        <h1 className="bs-hero-h1">
          <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.3} stagger={0.03} />{' '}
          <em>
            <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.55} stagger={0.03} />
          </em>
        </h1>

        <motion.p className="bs-hero-sub" custom={0.95} variants={fadeUp} initial="hidden" animate="visible">
          {sub}
        </motion.p>

        <motion.div className="bs-hero-acts" custom={1.1} variants={fadeUp} initial="hidden" animate="visible">
          <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
        </motion.div>

        {/* Last, not between the headline and the sub — dead centre belongs to
            the mark, and the promise was landing straight on top of it. */}
        <motion.p className="bs-hero-promise" custom={1.3} variants={fadeUp} initial="hidden" animate="visible">
          {promise}
        </motion.p>
      </div>
    </section>
  );
}
