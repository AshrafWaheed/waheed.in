'use client';

/**
 * TheGapAbout — "The Gap in Halal Industry Marketing", the second body section
 * of the redesigned /about page (WAHEEDWEB Figma, node 74:437–74:454).
 *
 * A DARK band: heading + two paragraphs on the left, a diagonal stack of three
 * overlapping cards on the right (white behind, blue mid, gold front) — image
 * placeholders in the design, ready to hold real photos. The stack geometry
 * mirrors the Figma: three 340×424 cards stepping ~90px left / ~75px down.
 * Copy is `theGap` in content/about.ts, verbatim from the Figma.
 *
 * Reveal via whileInView (IntersectionObserver, Lenis-safe): heading splits in,
 * copy fades up, and the three cards fan in back-to-front on a stagger.
 */
import { motion, useReducedMotion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import GapWorkStack from '@/components/about/GapWorkStack';
import { theGap } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TheGapAbout() {
  const { heading, paras } = theGap;
  const reduce = useReducedMotion();

  return (
    <section className="tg" data-section-color="dark">
      <div className="cnt tg-grid">
        <div className="tg-copy">
          <h2 className="tg-h">
            <SplitReveal text={heading} by="word" />
          </h2>

          {paras.map((p, i) => (
            <motion.p
              key={i}
              className="tg-p"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* An interactive stack of real work — the three cards shuffle through
            the three slots so each is seen fully; see GapWorkStack. */}
        <GapWorkStack />
      </div>
    </section>
  );
}
