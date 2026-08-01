'use client';

/**
 * SmLift — §5. Outcomes as bars that grow.
 *
 * Five statements, each with a bar that rises to its own height when the row
 * arrives. The heights ASCEND with the list rather than encoding a measurement,
 * because there is no measurement here to encode — inventing percentages for
 * outcome statements would be exactly the fake-dashboard move this page spends
 * its copy arguing against.
 *
 * So the bars are a rhythm device, not a chart. That is why they carry no axis,
 * no numbers and no gridlines: nothing about them invites being read as data.
 *
 * Refusals are a two-column split with a heavy rule between them — the fourth
 * shape that block has taken across the five service pages.
 */
import { useEffect, useRef } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SmLift({ page }: { page: ServicePage }) {
  const { eyebrow, heading, list, fitHeading, fit, notHeading, not } = page.outcomes;
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.35 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="sm-lift" data-section-color="dark">
      <div className="cnt">
        <header className="sm-head">
          <p className="sm-eyebrow">{eyebrow}</p>
          <h2 className="sm-h2 sm-h2--on-night">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
        </header>

        <ul className="sm-bars">
          {list.map((l, i) => (
            <li
              key={l}
              ref={(el) => { refs.current[i] = el; }}
              className="sm-bar-row"
              style={v({ '--k': i, '--of': list.length - 1 })}
            >
              <span className="sm-bar" aria-hidden="true">
                <span className="sm-bar-fill" />
              </span>
              <span className="sm-bar-t">{l}</span>
            </li>
          ))}
        </ul>

        <div className="sm-fit">
          <div className="sm-fit-col reveal">
            <h3 className="sm-fit-h">{fitHeading}</h3>
            <ul>{fit.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="sm-fit-col is-not reveal">
            <h3 className="sm-fit-h">{notHeading}</h3>
            <ul>{not.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
