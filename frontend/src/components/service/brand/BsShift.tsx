'use client';

/**
 * BsShift — §5. The outcomes, as five before/after swaps.
 *
 * `outcomes.list` uses the ' → ' convention documented in content/services/
 * types.ts, so each item arrives here as one string and is split into a FROM and
 * a TO. That keeps the register generic — the default layout renders the same
 * strings as a plain ticked list — while this page gets the thing a positioning
 * page actually needs to show, which is a change of state.
 *
 * On reveal the connector draws left-to-right and the TO half slides in behind
 * it, so the row performs the swap rather than describing it. `split` falls back
 * to rendering the whole string as the TO if a page has no arrow in it, which is
 * the sane degradation: an outcome with no 'before' is still an outcome.
 */
import { useEffect, useRef } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

function split(item: string): { from: string | null; to: string } {
  const i = item.indexOf('→');
  if (i === -1) return { from: null, to: item };
  return { from: item.slice(0, i).trim(), to: item.slice(i + 1).trim() };
}

export default function BsShift({ page }: { page: ServicePage }) {
  const { eyebrow, heading, list, fitHeading, fit, notHeading, not } = page.outcomes;
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.4 },
    );
    rowRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bs-shift" data-section-color="light">
      <div className="cnt">
        <header className="bs-shift-head">
          <p className="bs-eyebrow">{eyebrow}</p>
          <h2 className="bs-h2">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
        </header>

        <ul className="bs-swaps">
          {list.map((item, i) => {
            const { from, to } = split(item);
            return (
              <li
                key={item}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="bs-swap"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <span className="bs-swap-from">{from ?? ''}</span>
                <span className="bs-swap-arrow" aria-hidden="true">
                  <span className="bs-swap-line" />
                  <span className="bs-swap-head" />
                </span>
                <span className="bs-swap-to">{to}</span>
              </li>
            );
          })}
        </ul>

        <div className="bs-fit">
          <div className="bs-fit-col reveal">
            <h3 className="bs-fit-h">{fitHeading}</h3>
            <ul>
              {fit.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
          {/* Hatched, not dimmed. The refusal column has to be as legible as the
              other one — that is what stops it reading as small print. */}
          <div className="bs-fit-col is-not reveal">
            <h3 className="bs-fit-h">{notHeading}</h3>
            <ul>
              {not.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
