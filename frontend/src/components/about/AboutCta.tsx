'use client';

/**
 * AboutCta — §5. A SPLIT close: the ask on the left, the action on the right,
 * over a hairline that runs the full measure.
 *
 * It used to be a carbon copy of the homepage's FinalCtaHybrid — same centred
 * stack, same rosette behind the copy — on the theory that a visitor reaching
 * the bottom of / and of /about should meet the identical gesture. In practice
 * that made the close read as chrome: four pages, one ending. It also put eight
 * straight petal edges behind a 3.6rem heading.
 *
 * No rosette here on purpose. JourneyOutro sits directly above this section and
 * already carries one, edge-anchored at .11 — a second would be repetition
 * within a single screen. This close has no body paragraph either, which is
 * what makes the two-column split possible: heading and button are the only
 * two objects, so they can sit on one baseline.
 *
 * Copy is verbatim from content/about.ts.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import { aboutCta } from '@/content/about';

export default function AboutCta() {
  const { eyebrow, heading, cta } = aboutCta;

  return (
    <section className="hy-cta ab-cta" data-section-color="dark">
      <div className="cnt ab-cta-grid">
        <div>
          <span className="hy-cta-eyebrow">{eyebrow}</span>
          <h2 className="hy-cta-h">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em!} by="word" />
            </em>
          </h2>
        </div>
        <div className="hy-cta-acts ab-cta-acts">
          <StackButton href={cta.href} size="lg">
            {cta.label}
          </StackButton>
        </div>
      </div>
    </section>
  );
}
