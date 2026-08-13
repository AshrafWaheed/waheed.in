'use client';

/**
 * CustomPlanCta — §3, the "request a custom package" close.
 *
 * The old version was a pale bordered strip at the bottom of the ivory section
 * with a small teal button — easy to scroll straight past, despite being the
 * escape hatch for everyone who did not see themselves in the five rungs.
 *
 * It is now an INSET PANEL rather than a centred stack. This section is the
 * escape hatch for everyone who did not see themselves in the five rungs above,
 * so it should read like a slip you fill in — bordered, left-aligned, its button
 * on the same baseline as the ask — and not like a second hero. It briefly WAS
 * a clone of the homepage close, rosette and all, which made four different
 * pages end on one gesture and put petal edges behind the heading.
 *
 * Copy is verbatim from content/packages.ts.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import { customPlan } from '@/content/packages';

export default function CustomPlanCta() {
  return (
    <section className="hy-cta pk-cta" data-section-color="dark">
      <div className="cnt">
        <div className="pk-cta-panel">
          <div>
            <h2 className="hy-cta-h">
              <SplitReveal text={customPlan.heading} by="word" />
            </h2>
            <p className="hy-cta-body">{customPlan.body}</p>
          </div>
          <div className="hy-cta-acts">
            <StackButton href={customPlan.cta.href} size="lg">
              {customPlan.cta.label}
            </StackButton>
          </div>
        </div>
      </div>
    </section>
  );
}
