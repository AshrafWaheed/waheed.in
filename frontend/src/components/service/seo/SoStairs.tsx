'use client';

/**
 * SoStairs — §4. Twelve months as an actual staircase.
 *
 * The cards ARE the stair: four columns, each sitting a step higher than the
 * one before it, with the tread drawn along each card's top edge and the riser
 * dropping from its left edge to the previous tread. No SVG — the geometry is
 * the layout, so it cannot drift out of alignment with the cards the way a
 * drawn-behind diagram would.
 *
 * Tread first, then riser, per card, staggered on entry. That order is the
 * point: you walk along a phase and then step up to the next.
 *
 * Below 900px the stair unfolds into a plain vertical list — a four-step
 * staircase on a phone is 4 columns of 90px, which is not a staircase.
 */
import { useEffect, useRef } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SoStairs({ page }: { page: ServicePage }) {
  const { heading, sub, steps } = page.process;
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="so-stairs" data-section-color="light">
      <div className="cnt">
        <header className="so-head">
          <h2 className="so-h2">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="so-lede reveal">{sub}</p>
        </header>

        <ol className="so-stair">
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => { refs.current[i] = el; }}
              className="so-tread"
              style={v({ '--k': i, '--last': steps.length - 1 - i })}
            >
              <span className="so-tread-line" aria-hidden="true" />
              {i > 0 && <span className="so-riser" aria-hidden="true" />}
              <span className="so-tread-span">{s.span}</span>
              <h3 className="so-tread-t">{s.title}</h3>
              <p className="so-tread-b">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
