'use client';

/**
 * CsBuild — §3. The six kinds of system as a HUD module grid: numbered,
 * corner-ticked panels with an ACTIVE status chip, that light on hover.
 */
import { motion } from 'framer-motion';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CsBuild({ page }: { page: ServicePage }) {
  const { heading, sub, items } = page.build;
  return (
    <section className="cs cs-build" data-section-color="dark">
      <div className="cs-grid-bg" aria-hidden="true" />
      <div className="cnt">
        <header className="cs-head cs-head--center">
          <p className="cs-eyebrow cs-eyebrow--center"><span className="cs-dot" />Modules</p>
          <h2 className="cs-h">{heading}</h2>
          <p className="cs-sub">{sub}</p>
        </header>

        <div className="cs-mod-grid">
          {items.map((it, i) => (
            <motion.article
              key={it.num}
              className="cs-mod"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: EASE, delay: (i % 3) * 0.08 }}
            >
              <div className="cs-mod-top">
                <span className="cs-mod-num">[{it.num}]</span>
                <span className="cs-mod-stat">ACTIVE</span>
              </div>
              <h3 className="cs-mod-t">{it.title}</h3>
              <p className="cs-mod-b">{it.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
