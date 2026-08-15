'use client';

/**
 * SoHero — §1. Copy on top, the argument drawn full-bleed underneath it.
 *
 * Four service heroes, four compositions: 01 is copy-left with an artifact card
 * right, 03 is centred inside a rosette, /packages is engine-left with copy
 * right. This one is STACKED — copy occupying the upper band, and the paid-vs-
 * organic curve running the full width along the bottom, drawing on mount.
 *
 * The chart is the headline's evidence, so it is deliberately not decoration
 * tucked behind the words: it gets its own band and its own labels.
 */
import { useEffect, useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import CompoundCurve from '@/components/graphics/CompoundCurve';
import type { ServicePage } from '@/content/services';

/**
 * Hero copy enters via CSS (`.rd-rise` in globals.css), not framer-motion.
 * framer's initial="hidden" baked opacity:0 into the SSR HTML, so the copy could
 * not paint until hydration — pinning LCP to ~8s (the sub paragraph is the
 * measured LCP element). The rise is transform-only and the h1 SplitReveal runs
 * with fade={false}, so all hero text is painted at the first frame. `--rd`
 * staggers the lines.
 */
const rd = (d: string) => ({ ['--rd']: d } as React.CSSProperties);

export default function SoHero({ page }: { page: ServicePage }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { eyebrow, h1, sub, promise } = page.hero;

  return (
    <section className={`so-hero${inView ? ' is-in' : ''}`} data-section-color="dark">
      <div className="cnt so-hero-in">
        <p className="so-eyebrow rd-rise-fade" style={rd('.12s')}>
          {eyebrow}
        </p>

        <div className="so-hero-grid">
          <h1 className="so-hero-h1">
            <SplitReveal text={h1.lead} by="char" trigger="mount" delay={0.28} stagger={0.025} fade={false} />{' '}
            <em>
              <SplitReveal text={h1.em} by="char" trigger="mount" delay={0.5} stagger={0.025} fade={false} />
            </em>
          </h1>

          <div className="so-hero-tail">
            <p className="so-hero-sub rd-rise" style={rd('.3s')}>
              {sub}
            </p>
            <p className="so-hero-promise rd-rise" style={rd('.4s')}>
              {promise}
            </p>
            <div className="so-hero-acts rd-rise" style={rd('.5s')}>
              <StackButton href="/contact" size="lg" arrow>
                Book a free clarity call
              </StackButton>
            </div>
          </div>
        </div>
      </div>

      {/* The evidence band. Full bleed, its own labels — not decoration. */}
      <div className="so-hero-chart" aria-hidden="true">
        <CompoundCurve />
        <div className="cnt so-hero-keys">
          <span className="so-key so-key--paid">Paid — stops when the spend stops</span>
          <span className="so-key so-key--organic">Organic — keeps returning</span>
        </div>
      </div>
    </section>
  );
}
