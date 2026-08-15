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

// Hero copy enters via CSS (.rd-rise, transform-only), not framer opacity:0 —
// which was baked into the SSR HTML and pinned LCP to hydration (~8s mobile; the
// sub paragraph is the LCP element). The headline (no SplitReveal here) rides the
// same transform-only rise. The decorative rig keeps its framer fade. See the
// hero-LCP project note.
const EASE = [0.22, 1, 0.36, 1] as const;
const rd = (d: string) => ({ ['--rd']: d } as React.CSSProperties);

export default function CsHero({ page }: { page: ServicePage }) {
  const { eyebrow, h1, sub, promise } = page.hero;
  return (
    <section className="cs cs-hero" data-section-color="dark">
      <div className="cs-grid-bg" aria-hidden="true" />
      <span className="cs-scan" aria-hidden="true" />

      <div className="cnt cs-hero-in">
        <div className="cs-hero-copy">
          <p className="cs-eyebrow rd-rise-fade" style={rd('.05s')}>
            <span className="cs-dot" />
            {eyebrow} · SYSTEM ONLINE
          </p>

          <h1 className="cs-hero-h rd-rise" style={rd('.14s')}>
            {h1.lead} <em>{h1.em}</em>
          </h1>

          <p className="cs-hero-sub rd-rise" style={rd('.24s')}>{sub}</p>
          <p className="cs-hero-promise rd-rise" style={rd('.32s')}>{`// ${promise}`}</p>

          <div className="cs-hero-acts rd-rise" style={rd('.4s')}>
            <StackButton href="/contact" size="lg" arrow>
              Book a free clarity call
            </StackButton>
          </div>
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
