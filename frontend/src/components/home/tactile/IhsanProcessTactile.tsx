'use client';

import { useEffect, useRef, useState } from 'react';
import ProcessThread from '@/components/graphics/ProcessThread';
import SplitReveal from '@/components/motion/SplitReveal';
import { process as proc } from '@/content/home';

const N = proc.steps.length;

function countUp(el: HTMLElement, target: number) {
  el.textContent = '00';
  const t0 = performance.now();
  const dur = 700;
  const frame = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(e * target)).padStart(2, '0');
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// Tactile process — NO scrub/pin. A sticky rail stays while the tall steps scroll
// past; each activates via IntersectionObserver as it reaches centre. Char-reveal
// titles, count-up numbers.
export default function IhsanProcessTactile() {
  const railRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counted = useRef(new Set<number>());
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
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (railRef.current) railRef.current.style.setProperty('--p', String(active / (N - 1)));
    const el = numRefs.current[active];
    if (el && !counted.current.has(active)) {
      counted.current.add(active);
      countUp(el, proc.steps[active].num);
    }
  }, [active]);

  return (
    <section className="tc-proc" data-section-color="light">
      <div className="hy-proc-head cnt">
        <span className="hy-proc-eyebrow">{proc.eyebrow}</span>
        <h2 className="hy-proc-h tc-proc-h">{proc.heading.lead} <em>{proc.heading.em}</em></h2>
        <p className="hy-proc-sub tc-proc-sub">{proc.sub}</p>
      </div>
      <div className="cnt tc-proc-grid">
        <div className="tc-proc-rail-wrap">
          <div ref={railRef} className="tc-proc-rail"><ProcessThread active={active} count={N} /></div>
        </div>
        <div className="tc-proc-steps">
          {proc.steps.map((step, i) => (
            <div
              key={step.grounded}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-i={i}
              className={`tc-proc-step${i === active ? ' active' : ''}`}
            >
              <span className="hy-proc-num" ref={(el) => { numRefs.current[i] = el; }}>
                {String(step.num).padStart(2, '0')}
              </span>
              <h3 className="hy-proc-title"><SplitReveal text={step.title} by="char" /></h3>
              <p className="hy-proc-grounded tc-proc-grounded">
                {proc.groundedPrefix}
                <em>{step.grounded}</em>
              </p>
              <p className="hy-proc-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
