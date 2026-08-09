'use client';

/**
 * "Our Work Process" — a compact pinned card, per the redesign's second pass.
 *
 * The panel is a short (~420px) dark card that PINS in place while a taller
 * track scrolls past it; sentinels down the track advance the active step, so
 * the steps swap inside the fixed card rather than the card growing to hold all
 * five (which is what made the first pass a 3-screen-tall dark block).
 *
 * Two other redesign notes, both honoured here:
 *  · the step text sits at the TOP of the card, not centred;
 *  · the gold timeline on the left fills and stacks from the BOTTOM upward as
 *    steps complete — hence `column-reverse` on the rail and a bottom-anchored
 *    fill in the CSS.
 *
 * Copy (`process` in content/home.ts) is unchanged.
 */
import { useEffect, useRef, useState } from 'react';
import { process as proc } from '@/content/home';

const N = proc.steps.length;

type CSSVars = React.CSSProperties & Record<string, string | number>;

export default function IhsanProcessTactile() {
  const railRef = useRef<HTMLDivElement>(null);
  const sentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      // A zero-height band at the viewport centre: the sentinel crossing it is
      // the step now level with the pinned card.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    sentRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Drives the rail fill height (0 → 1, bottom → active).
  useEffect(() => {
    railRef.current?.style.setProperty('--p', String(N > 1 ? active / (N - 1) : 0));
  }, [active]);

  return (
    <section className="wp" data-section-color="light">
      <div className="cnt">
        <div className="wp-track" style={{ '--n': N } as CSSVars}>
          <div className="wp-panel">
            <h2 className="wp-h">{proc.heading.lead}</h2>

            <div className="wp-grid">
              <div className="wp-rail-wrap">
                <div ref={railRef} className="wp-rail">
                  <span className="wp-rail-fill" aria-hidden="true" />
                  {proc.steps.map((step, i) => (
                    <span
                      key={step.grounded}
                      className={`wp-node${i <= active ? ' is-done' : ''}${i === active ? ' is-active' : ''}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <div className="wp-steps">
                {proc.steps.map((step, i) => (
                  <div key={step.grounded} className={`wp-step${i === active ? ' active' : ''}`}>
                    <h3 className="wp-title">{step.title}</h3>
                    <p className="wp-grounded">
                      {proc.groundedPrefix}
                      <em>{step.grounded}</em>
                    </p>
                    <p className="wp-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll sentinels — one per step, spaced down the track. Never painted. */}
          {proc.steps.map((step, i) => (
            <span
              key={step.grounded}
              ref={(el) => { sentRefs.current[i] = el; }}
              data-i={i}
              className="wp-sent"
              style={{ top: `${((i + 0.5) / N) * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
