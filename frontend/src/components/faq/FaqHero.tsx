'use client';

/**
 * FaqHero — §1 of the rebuilt /faq.
 *
 * Third variant of the inner-page hero, kept distinct from the other two on
 * purpose: /about puts the engine right of left-aligned copy, /services mirrors
 * that, and this one centres the engine directly behind centred copy. A page of
 * questions reads better symmetrical, and it is also the shortest of the three
 * (~46vh) because nobody arrives at an FAQ to admire the header — the first
 * question should be visible almost immediately.
 *
 * Copy is verbatim from content/faq.ts.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import GirihEngine from '@/components/graphics/GirihEngine';
import { faqHero } from '@/content/faq';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: d } }),
};

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function FaqHero() {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useParallaxOrigin(secRef, 7);

  return (
    <section ref={secRef} className={`fq-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="fq-hero-engine ab-lay" style={v({ '--k': 1 })} aria-hidden="true">
        <GirihEngine draw="mount" spin />
      </div>

      <div className="cnt fq-hero-inner">
        <motion.p className="ab-pill" custom={0.12} variants={fadeUp} initial="hidden" animate="visible">
          {faqHero.eyebrow}
        </motion.p>

        <h1 className="fq-hero-h1">
          <SplitReveal text={faqHero.headline.lead} by="char" trigger="mount" delay={0.3} stagger={0.024} />{' '}
          <em>
            <SplitReveal text={faqHero.headline.em!} by="char" trigger="mount" delay={0.6} stagger={0.024} />
          </em>
        </h1>

        <motion.p className="fq-hero-sub" custom={0.95} variants={fadeUp} initial="hidden" animate="visible">
          {faqHero.sub}
        </motion.p>
      </div>
    </section>
  );
}
