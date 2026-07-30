'use client';

/**
 * FaqCta — §3. Its copy maps onto the same shape as the homepage close
 * (eyebrow → heading → paragraph → button), so it reuses `.hy-cta*` like the
 * /about and /services closes do. Previously a small teal button on a flat ivory
 * band with a 1.7rem heading.
 *
 * Copy is verbatim from content/faq.ts.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import ConvergenceRosette from '@/components/graphics/ConvergenceRosette';
import { faqCta } from '@/content/faq';

export default function FaqCta() {
  return (
    <section className="hy-cta" data-section-color="dark">
      <div className="hy-cta-rosette" aria-hidden="true">
        <ConvergenceRosette />
      </div>
      <div className="cnt hy-cta-inner">
        <span className="hy-cta-eyebrow">{faqCta.eyebrow}</span>
        <h2 className="hy-cta-h">
          <SplitReveal text={faqCta.heading} by="word" />
        </h2>
        <p className="hy-cta-body">{faqCta.body}</p>
        <div className="hy-cta-acts">
          <ExplodeButton href={faqCta.cta.href} className="btn btn-gold">
            {faqCta.cta.label}
          </ExplodeButton>
        </div>
      </div>
    </section>
  );
}
