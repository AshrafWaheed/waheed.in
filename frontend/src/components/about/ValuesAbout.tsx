'use client';

/**
 * ValuesAbout — "The Values We Stand For", the fourth body section of the
 * redesigned /about page (WAHEEDWEB Figma, nodes 74:499–74:515).
 *
 * A dark band: centred heading over a 3×2 checkerboard of tiles — teal / gold /
 * teal on top, gold / teal / gold below (even index → teal, odd → gold). The
 * Figma tiles are EMPTY (no value names authored yet), so tiles render blank
 * until `values.items` in content/about.ts is filled; the label support is
 * already wired so populating is a one-line copy change.
 *
 * Reveal via whileInView (IntersectionObserver, Lenis-safe): heading splits in,
 * tiles pop in on a stagger.
 */
import { motion, useReducedMotion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import { values } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ValuesAbout() {
  const { heading, items } = values;
  const reduce = useReducedMotion();

  return (
    <section className="va" data-section-color="dark">
      <div className="cnt">
        <h2 className="va-h">
          <SplitReveal text={heading} by="word" />
        </h2>

        <div className="va-grid">
          {items.map((label, i) => (
            <motion.div
              key={i}
              className={`va-tile va-tile--${i % 2 === 0 ? 'teal' : 'gold'}`}
              initial={reduce ? false : { opacity: 0, y: 22, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
            >
              {label && <span className="va-tile-label">{label}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
