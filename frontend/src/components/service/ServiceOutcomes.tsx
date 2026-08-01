'use client';

/**
 * ServiceOutcomes — §5. What you walk away with, and who this is wrong for.
 *
 * The "not for you if" column is the point of the section. The Refusal panel on
 * the homepage already establishes that this studio names what it will not do;
 * doing the same at the offer level is the same move at a smaller scale, and it
 * is the thing that makes the outcomes column believable — a page that only
 * lists upside reads as a page that would say anything.
 *
 * So the two fit columns are given equal weight. Shrinking the refusal into a
 * footnote would quietly undo the whole argument.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

export default function ServiceOutcomes({ page }: { page: ServicePage }) {
  const { eyebrow, heading, list, fitHeading, fit, notHeading, not } = page.outcomes;

  return (
    <section className="sd-out" data-section-color="dark">
      <div className="cnt">
        <header className="sd-head">
          <p className="ab-pill">{eyebrow}</p>
          <h2 className="sd-h2 sd-h2--on-night">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
        </header>

        <ul className="sd-out-list">
          {list.map((l) => (
            <li key={l} className="sd-out-item reveal">
              <span className="sd-tick" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>

        <div className="sd-fit">
          <div className="sd-fit-col reveal">
            <h3 className="sd-fit-h">{fitHeading}</h3>
            <ul>
              {fit.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="sd-fit-col is-not reveal">
            <h3 className="sd-fit-h">{notHeading}</h3>
            <ul>
              {not.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
