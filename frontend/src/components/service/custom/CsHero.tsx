'use client';

/**
 * CsHero — §1 of Custom Software Development's bespoke, "system online" layout.
 *
 * A blueprint-grid dark field with a mono status eyebrow, the headline, and the
 * SoftwareRig system diagram on the right. The whole page shares the `cs-`
 * design language (grid field, mono labels, gold-lit HUD panels) so it reads as
 * one custom-built environment rather than the shared service template.
 */
import { motion } from 'framer-motion';
import StackButton from '@/components/ui/StackButton';
import SoftwareRig from '@/components/graphics/SoftwareRig';
import type { ServicePage } from '@/content/services';

const EASE = [0.22, 1, 0.36, 1] as const;
const rise = (d: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay: d },
});

export default function CsHero({ page }: { page: ServicePage }) {
  const { eyebrow, h1, sub, promise } = page.hero;
  return (
    <section className="cs cs-hero" data-section-color="dark">
      <div className="cs-grid-bg" aria-hidden="true" />
      <span className="cs-scan" aria-hidden="true" />

      <div className="cnt cs-hero-in">
        <div className="cs-hero-copy">
          <motion.p className="cs-eyebrow" {...rise(0.05)}>
            <span className="cs-dot" />
            {eyebrow} · SYSTEM ONLINE
          </motion.p>

          <motion.h1 className="cs-hero-h" {...rise(0.14)}>
            {h1.lead} <em>{h1.em}</em>
          </motion.h1>

          <motion.p className="cs-hero-sub" {...rise(0.24)}>{sub}</motion.p>
          <motion.p className="cs-hero-promise" {...rise(0.32)}>{`// ${promise}`}</motion.p>

          <motion.div className="cs-hero-acts" {...rise(0.4)}>
            <StackButton href="/contact" size="lg" arrow>
            Book a free clarity call
          </StackButton>
            <StackButton href="/packages" size="lg" tone="ghost" onDark>
            See the packages
          </StackButton>
          </motion.div>
        </div>

        <motion.div
          className="cs-hero-art"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.45 }}
          aria-hidden="true"
        >
          <SoftwareRig />
        </motion.div>
      </div>
    </section>
  );
}
