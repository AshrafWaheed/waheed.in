'use client';

/**
 * SoGains — §5. Outcomes as a checklist that ticks itself, fit/not as bands.
 *
 * The ticks draw in sequence rather than fading in together: each is two
 * borders on one span, and the entrance animates its `clip-path` so the stroke
 * appears to be struck. It costs one element per row and no SVG.
 *
 * fit / not are full-width BANDS here, stacked, rather than the two columns the
 * other pages use — partly so this page has a shape of its own, and partly
 * because the refusals on an SEO page are the ones most worth reading slowly.
 */
import { useEffect, useRef } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SoGains({ page }: { page: ServicePage }) {
  const { heading, list, fitHeading, fit, notHeading, not } = page.outcomes;
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.3 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="so-gains" data-section-color="dark">
      <div className="cnt">
        <header className="so-head">
          <h2 className="so-h2 so-h2--on-night">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
        </header>

        <ul className="so-gain-list">
          {list.map((l, i) => (
            <li
              key={l}
              ref={(el) => { refs.current[i] = el; }}
              className="so-gain"
              style={v({ '--k': i })}
            >
              <span className="so-gain-tick" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>

        <div className="so-bands">
          <section className="so-band reveal">
            <h3 className="so-band-h">{fitHeading}</h3>
            <ul>{fit.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
          <section className="so-band is-not reveal">
            <h3 className="so-band-h">{notHeading}</h3>
            <ul>{not.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
        </div>
      </div>
    </section>
  );
}
