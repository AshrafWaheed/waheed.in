'use client';

/**
 * PackagesHero — §1 of the rebuilt /packages.
 *
 * Same family as the /about hero (dark, Barakah Engine, gold pill, per-character
 * headline) but mirrored: the engine sits on the LEFT here and the copy is right
 * of it, so the two inner pages don't open with an identical frame. It also
 * carries a sub line, which /about's hero has no copy for.
 *
 * `.pk-hero` keeps its own CSS block rather than sharing `.ab-hero` — that is
 * the established pattern in this stylesheet, where `.hy-hero`, `.sw-hero`,
 * `.sb-hero` and `.ff-hero` all coexist as sibling hero treatments.
 *
 * Copy is verbatim from content/packages.ts.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import GirihEngine from '@/components/graphics/GirihEngine';
import { packagesHero } from '@/content/packages';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: d } }),
};

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function PackagesHero() {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useParallaxOrigin(secRef, 9);

  return (
    <section ref={secRef} className={`pk-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="pk-hero-engine ab-lay" style={v({ '--k': 1 })} aria-hidden="true">
        <GirihEngine draw="mount" spin />
      </div>

      <div className="cnt pk-hero-inner">
        <motion.p className="ab-pill" custom={0.12} variants={fadeUp} initial="hidden" animate="visible">
          {packagesHero.eyebrow}
        </motion.p>

        <h1 className="pk-hero-h1">
          <SplitReveal text={packagesHero.headline.lead} by="char" trigger="mount" delay={0.3} stagger={0.02} />{' '}
          <em>
            <SplitReveal text={packagesHero.headline.em!} by="char" trigger="mount" delay={0.66} stagger={0.02} />
          </em>
        </h1>

        <motion.p className="pk-hero-sub" custom={0.95} variants={fadeUp} initial="hidden" animate="visible">
          {packagesHero.sub}
        </motion.p>
      </div>

      <span className="ab-scroll-cue" aria-hidden="true">
        <span className="hy-scroll-line" />
      </span>
    </section>
  );
}
