'use client';

/**
 * CsOutcomes — §5. The outcomes as a system readout (gold-ticked lines) beside
 * two fit/not-fit panels, closing the "system online" argument.
 */
import { motion } from 'framer-motion';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CsOutcomes({ page }: { page: ServicePage }) {
  const { heading, list, fitHeading, fit, notHeading, not } = page.outcomes;
  return (
    <section className="cs cs-out" data-section-color="dark">
      <div className="cs-grid-bg" aria-hidden="true" />
      <div className="cnt cs-out-grid">
        <motion.div
          className="cs-out-main"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="cs-eyebrow"><span className="cs-dot" />Output</p>
          <h2 className="cs-h">{heading.lead} <em>{heading.em}</em></h2>
          <ul className="cs-readout">
            {list.map((l, i) => (
              <li key={i} className="cs-readout-i"><span className="cs-check">✓</span>{l}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="cs-out-side"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
        >
          <div className="cs-fit cs-fit--yes">
            <h3 className="cs-fit-h">{fitHeading}</h3>
            <ul>{fit.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
          <div className="cs-fit cs-fit--no">
            <h3 className="cs-fit-h">{notHeading}</h3>
            <ul>{not.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
