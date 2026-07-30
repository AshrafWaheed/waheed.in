'use client';

/**
 * CustomPlanCta — §3, the "request a custom package" close.
 *
 * The old version was a pale bordered strip at the bottom of the ivory section
 * with a small teal button — easy to scroll straight past, despite being the
 * escape hatch for everyone who did not see themselves in the five rungs.
 *
 * Its copy happens to map exactly onto the shape of the homepage's closing CTA
 * (tag → heading → paragraph → button), so it reuses `.hy-cta*` outright: same
 * converging rosette, same animated gradient, same cursor-fill button. All three
 * top-level pages now end on the identical gesture.
 *
 * Copy is verbatim from content/services.ts.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import ConvergenceRosette from '@/components/graphics/ConvergenceRosette';
import { customPlan } from '@/content/services';

export default function CustomPlanCta() {
  return (
    <section className="hy-cta" data-section-color="dark">
      <div className="hy-cta-rosette" aria-hidden="true">
        <ConvergenceRosette />
      </div>
      <div className="cnt hy-cta-inner">
        <span className="hy-cta-eyebrow">{customPlan.eyebrow}</span>
        <h2 className="hy-cta-h">
          <SplitReveal text={customPlan.heading} by="word" />
        </h2>
        <p className="hy-cta-body">{customPlan.body}</p>
        <div className="hy-cta-acts">
          <ExplodeButton href={customPlan.cta.href} className="btn btn-gold">
            {customPlan.cta.label}
          </ExplodeButton>
        </div>
      </div>
    </section>
  );
}
