'use client';

/**
 * CsProblem — §2. The three symptoms rendered as console panels: a title-bar
 * with an error code, a `$` prompt line, and the detail. The manual middleman
 * is the bug the system removes, so the symptoms read like diagnostics.
 */
import { motion } from 'framer-motion';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const CODES = ['ERR_DUPLICATE_ENTRY', 'ERR_POOR_FIT', 'ERR_NO_SOURCE_OF_TRUTH'];

export default function CsProblem({ page }: { page: ServicePage }) {
  const { heading, body, symptoms } = page.problem;
  return (
    <section className="cs cs-problem" data-section-color="dark">
      <div className="cs-grid-bg" aria-hidden="true" />
      <div className="cnt">
        <header className="cs-head">
          <p className="cs-eyebrow"><span className="cs-dot" />Diagnostic</p>
          <h2 className="cs-h">{heading.lead} <em>{heading.em}</em></h2>
          <p className="cs-sub">{body}</p>
        </header>

        <div className="cs-term-grid">
          {symptoms.map((s, i) => (
            <motion.div
              key={s.title}
              className="cs-term"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
            >
              <div className="cs-term-bar">
                <span /><span /><span />
                <em className="cs-term-code">{CODES[i]}</em>
              </div>
              <div className="cs-term-body">
                <p className="cs-term-line"><span className="cs-prompt">$</span>{s.title}</p>
                <p className="cs-term-txt">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
