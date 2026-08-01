'use client';

/**
 * SmProblem — §2. Three symptoms as full-width rows behind oversized numerals.
 *
 * The numeral is set at ~6rem in outline only and sits in a gutter of its own,
 * so it reads as a page mark rather than as a list bullet. Each row wipes in with
 * a `clip-path` inset from the left — a wipe rather than a fade, because a fade
 * is what the other four pages already use for a row entering.
 *
 * The clip goes on an INNER wrapper, and that is load-bearing: an element
 * clipped to zero width has zero intersection area, so an IntersectionObserver
 * watching it never fires. Observe the row, clip its contents.
 *
 * Deliberately NOT the stacking deck from page 04 and not the sticky plate from
 * page 03: this section is short and the reader should be able to scan all
 * three at once. Not every section earns a mechanic.
 */
import { useEffect, useRef } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SmProblem({ page }: { page: ServicePage }) {
  const { eyebrow, heading, body, symptoms } = page.problem;
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.25 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="sm-problem" data-section-color="light">
      <div className="cnt">
        <header className="sm-head">
          <p className="sm-eyebrow">{eyebrow}</p>
          <h2 className="sm-h2">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
          <p className="sm-lede reveal">{body}</p>
        </header>

        <ol className="sm-syms">
          {symptoms.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => { refs.current[i] = el; }}
              className="sm-sym"
              style={v({ '--k': i })}
            >
              {/* The wipe lives on THIS wrapper, never on the observed <li>.
                  An element clipped to zero width has zero intersection area, so
                  the IntersectionObserver above would never fire and the row
                  would stay invisible forever — which is exactly what it did. */}
              <div className="sm-sym-in">
                <span className="sm-sym-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sm-sym-t">{s.title}</h3>
                <p className="sm-sym-b">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
