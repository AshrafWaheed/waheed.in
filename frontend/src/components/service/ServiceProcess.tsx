'use client';

/**
 * ServiceProcess — §4. Four phases on a horizontal rail.
 *
 * The rail is horizontal here, on purpose: the offer ladder on /packages owns
 * the vertical rail with a khatam node per rung, and repeating it would make
 * this page look like that one. Time reads left-to-right anyway, which is what
 * the `span` column ('Week 1', 'Weeks 2–3') is asserting.
 *
 * The rail fills as the section is reached, one segment per phase, so the
 * schedule assembles rather than arriving finished.
 */
import { useEffect, useRef, useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import type { ServicePage } from '@/content/services';

export default function ServiceProcess({ page }: { page: ServicePage }) {
  const { eyebrow, heading, sub, steps } = page.process;
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          // Only climbs — scrolling back up must not un-draw the schedule.
          setReached((prev) => (i > prev ? i : prev));
        });
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 0.3 },
    );
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="sd-process" data-section-color="light">
      <div className="cnt">
        <header className="sd-head">
          <p className="ab-pill">{eyebrow}</p>
          <h2 className="sd-h2">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="sd-lede reveal">{sub}</p>
        </header>

        <ol className="sd-phases">
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-i={i}
              className={`sd-phase${i <= reached ? ' is-on' : ''}`}
            >
              <span className="sd-phase-mark" aria-hidden="true">
                <span className="sd-phase-node">
                  <Khatam size={20} inner={0.5} stroke="currentColor" strokeWidth={1.7} />
                </span>
              </span>
              <span className="sd-phase-span">{s.span}</span>
              <h3 className="sd-phase-t">{s.title}</h3>
              <p className="sd-phase-b">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
