'use client';

/**
 * AboutCta — §5. Deliberately the SAME component shape as the homepage's
 * FinalCtaHybrid, reusing its `.hy-cta*` classes rather than cloning them into
 * `.ab-*`: converging rosette, animated gradient, cursor-fill ExplodeButton. A
 * visitor who scrolls to the bottom of / and to the bottom of /about should meet
 * the identical closing gesture.
 *
 * The one difference is structural, not stylistic: the homepage CTA has a body
 * paragraph between heading and button and /about's copy has none, so the button
 * row carries its own top margin (.ab-cta-acts) instead of inheriting the gap
 * from .hy-cta-body.
 *
 * The old version of this section was a 1.8rem heading and a small teal button
 * on flat white — the weakest close on the site.
 *
 * Copy is verbatim from content/about.ts.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import ConvergenceRosette from '@/components/graphics/ConvergenceRosette';
import { aboutCta } from '@/content/about';

export default function AboutCta() {
  const { eyebrow, heading, cta } = aboutCta;

  return (
    <section className="hy-cta ab-cta" data-section-color="dark">
      <div className="hy-cta-rosette" aria-hidden="true">
        <ConvergenceRosette />
      </div>
      <div className="cnt hy-cta-inner">
        <span className="hy-cta-eyebrow">{eyebrow}</span>
        <h2 className="hy-cta-h">
          <SplitReveal text={heading.lead} by="word" />{' '}
          <em>
            <SplitReveal text={heading.em!} by="word" />
          </em>
        </h2>
        <div className="hy-cta-acts ab-cta-acts">
          <ExplodeButton href={cta.href} className="btn btn-gold">
            {cta.label}
          </ExplodeButton>
        </div>
      </div>
    </section>
  );
}
