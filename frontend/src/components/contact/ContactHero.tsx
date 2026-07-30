'use client';

/**
 * ContactHero — §1 of the rebuilt /contact.
 *
 * Shortest hero on the site (~42vh) and the only one with no scroll cue: the
 * whole job of this page is the form directly beneath it, so the header should
 * get out of the way rather than invite a pause. Engine sits low-left, mostly
 * off-canvas, so it reads as texture rather than as a subject.
 *
 * Replaces the old flat teal band with its hand-drawn hexagon accent SVG.
 *
 * Copy is verbatim from content/contact.ts.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import GirihEngine from '@/components/graphics/GirihEngine';
import { contactHero } from '@/content/contact';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: d } }),
};

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function ContactHero() {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useParallaxOrigin(secRef, 7);

  return (
    <section ref={secRef} className={`ct-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="ct-hero-engine ab-lay" style={v({ '--k': 1 })} aria-hidden="true">
        <GirihEngine draw="mount" spin />
      </div>

      <div className="cnt ct-hero-inner">
        <motion.p className="ab-pill" custom={0.12} variants={fadeUp} initial="hidden" animate="visible">
          {contactHero.eyebrow}
        </motion.p>

        <h1 className="ct-hero-h1">
          <SplitReveal text={contactHero.headline.lead} by="char" trigger="mount" delay={0.28} stagger={0.024} />{' '}
          <em>
            <SplitReveal text={contactHero.headline.em!} by="char" trigger="mount" delay={0.6} stagger={0.024} />
          </em>
        </h1>

        <motion.p className="ct-hero-sub" custom={0.92} variants={fadeUp} initial="hidden" animate="visible">
          {contactHero.sub}
        </motion.p>
      </div>
    </section>
  );
}
