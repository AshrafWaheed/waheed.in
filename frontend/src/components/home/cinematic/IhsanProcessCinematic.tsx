'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/components/motion/gsap';
import ProcessThread from '@/components/graphics/ProcessThread';
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

// Cinematic process — longer pinned scrub; the grounded principle runs along a
// drawn textPath arc (Wahda), the number counts up, and the stage flips ivory/teal.
export default function IhsanProcessCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.to({}, {
        scrollTrigger: {
          trigger: section, start: 'top top', end: `+=${N * 105}%`, pin: true, scrub: 0.5,
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

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) stage.dataset.bg = proc.steps[active].bg;
    const el = numRefs.current[active];
    if (el) countUp(el, proc.steps[active].num);
  }, [active]);

  return (
    <section ref={sectionRef} className="hy-proc cn-proc" data-section-color="dark">
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
                <svg className="cn-proc-arc" viewBox="0 0 820 96" fill="none" aria-hidden="true">
                  <path id={`cnArc${i}`} d="M20 86 Q410 6 800 86" />
                  <text textAnchor="middle" className="cn-proc-arc-text">
                    <textPath href={`#cnArc${i}`} startOffset="50%">
                      {proc.groundedPrefix}
                      {step.grounded}
                    </textPath>
                  </text>
                </svg>
                <span className="hy-proc-num" ref={(el) => { numRefs.current[i] = el; }}>
                  {String(step.num).padStart(2, '0')}
                </span>
                <h3 className="hy-proc-title">{step.title}</h3>
                <p className="hy-proc-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
