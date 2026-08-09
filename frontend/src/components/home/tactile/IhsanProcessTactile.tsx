'use client';

/**
 * "Our Work Process" — the Ihsan process, reskinned to the Figma redesign.
 *
 * Same sticky-scroll it always was: a rail that stays put while the tall steps
 * scroll past, each activating via IntersectionObserver as it reaches centre.
 * The redesign only changes the skin — the whole thing now lives inside a dark
 * rounded panel on a white section, and the rail is a dotted gold timeline with
 * a square node per step (filled as the step becomes active) instead of the old
 * ProcessThread SVG.
 *
 * Copy — heading, the five steps, their "grounded in …" principles — is
 * `process` in content/home.ts, unchanged. The eyebrow, sub and step numbers
 * the old version showed are dropped; the redesign shows title → principle →
 * body and nothing else.
 */
import { useEffect, useRef, useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import { process as proc } from '@/content/home';

const N = proc.steps.length;

export default function IhsanProcessTactile() {
  const railRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      // A tight band across the middle: a step becomes active only while it
      // occupies the centre of the viewport.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Drive the rail's fill height from the active index.
  useEffect(() => {
    railRef.current?.style.setProperty('--p', String(N > 1 ? active / (N - 1) : 0));
  }, [active]);

  return (
    <section className="wp" data-section-color="light">
      <div className="cnt">
        <div className="wp-panel">
          <h2 className="wp-h">
            <SplitReveal text={proc.heading.lead} by="char" />
          </h2>

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
                <div
                  key={step.grounded}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-i={i}
                  className={`wp-step${i === active ? ' active' : ''}`}
                >
                  <h3 className="wp-title"><SplitReveal text={step.title} by="char" /></h3>
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
      </div>
    </section>
  );
}
