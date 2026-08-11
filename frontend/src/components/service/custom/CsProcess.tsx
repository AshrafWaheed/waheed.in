'use client';

/**
 * CsProcess — §4. The four phases as a spec pipeline: glowing numbered nodes
 * threaded on a gold wire, each with its week-range span. "Mapped before it is
 * built" — the first two nodes sit before the build node.
 */
import { motion } from 'framer-motion';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CsProcess({ page }: { page: ServicePage }) {
  const { heading, sub, steps } = page.process;
  return (
    <section className="cs cs-process" data-section-color="dark">
      <div className="cs-grid-bg" aria-hidden="true" />
      <div className="cnt">
        <header className="cs-head cs-head--center">
          <p className="cs-eyebrow cs-eyebrow--center"><span className="cs-dot" />Pipeline</p>
          <h2 className="cs-h">{heading}</h2>
          <p className="cs-sub">{sub}</p>
        </header>

        <div className="cs-pipe">
          <span className="cs-pipe-wire" aria-hidden="true" />
          {steps.map((st, i) => (
            <motion.div
              key={st.title}
              className="cs-stage"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
            >
              <span className="cs-stage-node">{String(i + 1).padStart(2, '0')}</span>
              <span className="cs-stage-span">{st.span}</span>
              <h3 className="cs-stage-t">{st.title}</h3>
              <p className="cs-stage-b">{st.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
