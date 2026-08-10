'use client';

/**
 * BsDiagnosis — §2. A sticky plate, three symptoms scrolling past it.
 *
 * The default service layout stacks its symptoms down one rail and lets the
 * reader scan. This does the opposite: the illustration is PINNED (CSS sticky,
 * not GSAP — there is nothing here that needs a scrub, and sticky survives
 * resize and reduced-motion without any of the teardown a pin needs) while the
 * three symptoms travel past it, and the plate re-draws itself to match
 * whichever one is level with the viewport.
 *
 * The IntersectionObserver uses a thin band across the middle of the screen
 * (`-45% 0px -45% 0px`) rather than a threshold, so the swap happens when a
 * symptom reaches the plate's optical centre — which is what makes the drawing
 * feel like it is illustrating that paragraph rather than trailing it.
 */
import { useEffect, useRef, useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import DiagnosisPlate from '@/components/graphics/DiagnosisPlate';
import type { ServicePage } from '@/content/services';

export default function BsDiagnosis({ page }: { page: ServicePage }) {
  const { heading, body, symptoms } = page.problem;
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bs-diag" data-section-color="dark">
      <div className="cnt">
        <header className="bs-diag-head">
          <h2 className="bs-h2">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em} by="word" />
            </em>
          </h2>
          <p className="bs-lede reveal">{body}</p>
        </header>

        <div className="bs-diag-grid">
          <div className="bs-diag-sticky">
            <div className="bs-plate">
              <DiagnosisPlate state={active} />
              <div className="bs-plate-steps" aria-hidden="true">
                {symptoms.map((s, i) => (
                  <span key={s.title} className={`bs-plate-step${i === active ? ' is-on' : ''}`} />
                ))}
              </div>
            </div>
          </div>

          <ol className="bs-diag-list">
            {symptoms.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => { itemRefs.current[i] = el; }}
                data-i={i}
                className={`bs-sym${i === active ? ' is-on' : ''}`}
              >
                <span className="bs-sym-i">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="bs-sym-t">{s.title}</h3>
                <p className="bs-sym-b">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
