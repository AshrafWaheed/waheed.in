'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/components/motion/gsap';
import ProcessThread from '@/components/graphics/ProcessThread';
import { process as proc } from '@/content/home';

const N = proc.steps.length;

function countUp(el: HTMLElement, target: number, done: Set<number>) {
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
  done.add(target);
}

export default function IhsanProcessHybrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const done = useRef(new Set<number>());

  // Desktop + motion: pin the section and scrub through the 5 steps.
  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.to({}, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${N * 90}%`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (rail) rail.style.setProperty('--p', self.progress.toFixed(3));
            setActive(Math.min(N - 1, Math.floor(self.progress * N * 0.999)));
          },
        },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => mm.revert();
  }, []);

  // React to active: flip the stage bg + count the number up.
  useEffect(() => {
    const stage = stageRef.current;
    if (stage) stage.dataset.bg = proc.steps[active].bg;
    const el = numRefs.current[active];
    if (el) countUp(el, proc.steps[active].num, done.current);
  }, [active]);

  return (
    <section ref={sectionRef} className="hy-proc" data-section-color="dark">
      <div className="hy-proc-inner">
        <div className="hy-proc-head cnt">
          <span className="hy-proc-eyebrow">{proc.eyebrow}</span>
          <h2 className="hy-proc-h">
            {proc.heading.lead} <em>{proc.heading.em}</em>
          </h2>
          <p className="hy-proc-sub">{proc.sub}</p>
        </div>

        <div ref={stageRef} className="hy-proc-stage" data-bg="ivory">
          <div ref={railRef} className="hy-proc-rail">
            <ProcessThread active={active} count={N} />
          </div>
          <div className="hy-proc-steps">
            {proc.steps.map((step, i) => (
              <div key={step.grounded} className={`hy-proc-step${i === active ? ' active' : ''}`}>
                <span className="hy-proc-num" ref={(el) => { numRefs.current[i] = el; }}>
                  {String(step.num).padStart(2, '0')}
                </span>
                <h3 className="hy-proc-title">{step.title}</h3>
                <p className="hy-proc-grounded">
                  {proc.groundedPrefix}
                  <em>{step.grounded}</em>
                </p>
                <p className="hy-proc-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
