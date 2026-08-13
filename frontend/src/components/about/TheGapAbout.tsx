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
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import { theGap } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

/** back → front, so the fan-in reads as the stack building up toward the gold. */
const CARDS = ['tg-card--back', 'tg-card--mid', 'tg-card--front'] as const;

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

        {/* A diagonal stack: white + blue mats behind, and the gold front card
            holding a real example of the work — a high-converting brand site. */}
        <div className="tg-stack">
          {CARDS.map((cls, i) => (
            <motion.div
              key={cls}
              className={`tg-card ${cls}`}
              initial={reduce ? false : { opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, ease: EASE, delay: i * 0.14 }}
            >
              {cls === 'tg-card--front' && (
                <Image
                  className="tg-photo"
                  src="/about/gap-highconverting.jpeg"
                  alt="A high-converting website built for a values-led Muslim women's brand, shown on a laptop."
                  width={340}
                  height={424}
                  sizes="(max-width: 820px) 86vw, 340px"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
