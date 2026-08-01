'use client';

/**
 * ServiceProblem — §2. The three symptoms, named before anything is sold.
 *
 * Laid out as a stated thesis on the left and the symptoms stacked on the right,
 * each one hanging off a shared rule. Three equal cards was the obvious move and
 * the wrong one: symptoms are a list the reader scans looking for themselves in
 * it, and a horizontal row makes them compete instead of accumulate.
 *
 * No icons. An icon per symptom would be three shrugging glyphs standing in for
 * sentences that are already short.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

export default function ServiceProblem({ page }: { page: ServicePage }) {
  const { eyebrow, heading, body, symptoms } = page.problem;

  return (
    <section className="sd-problem" data-section-color="light">
      <div className="cnt sd-problem-grid">
        <div className="sd-problem-lead">
          <p className="ab-pill">{eyebrow}</p>
          <h2 className="sd-h2">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
          <p className="sd-lede reveal">{body}</p>
        </div>

        <ol className="sd-symptoms">
          {symptoms.map((s, i) => (
            <li key={s.title} className="sd-symptom reveal">
              <span className="sd-symptom-i" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="sd-symptom-t">{s.title}</h3>
                <p className="sd-symptom-b">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
