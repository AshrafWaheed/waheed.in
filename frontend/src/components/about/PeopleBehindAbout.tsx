'use client';

/**
 * PeopleBehindAbout — "The People Behind Waheed", the third body section of the
 * redesigned /about page (WAHEEDWEB Figma, nodes 74:454–74:490).
 *
 * A white rounded panel on the dark band: a centred heading + intro, then two
 * founder columns (portrait, name, title, role, bio — all centred). The Figma
 * shows grey placeholder boxes for the portraits; we use the site's existing
 * founder artwork instead (public/founders/{man,woman}.svg, the same used on the
 * homepage hero), bottom-anchored on a tinted panel with the established
 * --fig-w/--fig-b/--fig-x geometry so head + shoulders sit flush. Copy is
 * `peopleBehind` in content/about.ts, verbatim from the Figma.
 *
 * Reveal via whileInView (IntersectionObserver, Lenis-safe): heading splits in,
 * intro fades up, the two columns rise in on a stagger.
 */
import { motion, useReducedMotion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import { peopleBehind } from '@/content/about';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PeopleBehindAbout() {
  const { heading, intro, members } = peopleBehind;
  const reduce = useReducedMotion();

  return (
    <section className="pbw" data-section-color="dark">
      <div className="cnt">
        <div className="pbw-panel">
          <h2 className="pbw-h">
            <SplitReveal text={heading} by="word" />
          </h2>

          <motion.p
            className="pbw-intro"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            {intro}
          </motion.p>

          <div className="pbw-grid">
            {members.map((m, i) => (
              <motion.div
                key={m.name}
                className="pbw-person"
                initial={reduce ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.1 + i * 0.14 }}
              >
                <div className={`pbw-card pbw-card--${m.fig}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pbw-fig" src={`/founders/${m.fig}.svg`} alt={m.name} />
                </div>
                <h3 className="pbw-name">{m.name}</h3>
                <p className="pbw-title">{m.title}</p>
                <p className="pbw-role">{m.role}</p>
                <p className="pbw-bio">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
