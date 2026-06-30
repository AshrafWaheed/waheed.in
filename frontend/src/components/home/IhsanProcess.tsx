'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  {
    num:    1,
    phase:  'Niyyah',
    en:     'Intent',
    bg:     'ivory',
    lines:  [
      'A free clarity call.',
      'We learn your goals, your audience, and the values you refuse to compromise.',
      'We name your intent before we name the work.',
    ],
  },
  {
    num:    2,
    phase:  'Tasawwur',
    en:     'Conception',
    bg:     'teal',
    lines:  [
      'A documented strategy and visual direction.',
      'Brand foundations, content architecture, conversion path —',
      'agreed in writing before a pixel is drawn.',
    ],
  },
  {
    num:    3,
    phase:  'Ihsan',
    en:     'Execution',
    bg:     'ivory',
    lines:  [
      'Build, test, launch.',
      'Excellence applied to code, copy, contracts, and conduct.',
      'Weekly check-ins. Honest communication throughout.',
    ],
  },
  {
    num:    4,
    phase:  'Amanah',
    en:     'Stewardship',
    bg:     'teal',
    lines:  [
      'Post-launch optimisation, quarterly reviews, ongoing care.',
      'Because a strong digital presence requires consistent stewardship.',
    ],
  },
];

const N = STEPS.length;

export default function IhsanProcess() {
  const tlRef    = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepEls  = useRef<(HTMLDivElement | null)[]>([]);
  const dotEls   = useRef<(HTMLSpanElement | null)[]>([]);
  const numEls   = useRef<(HTMLSpanElement | null)[]>([]);
  const animated = useRef(new Set<number>());
  const curIdx   = useRef(-1);
  const rafId    = useRef<number | null>(null);

  useEffect(() => {
    const tl    = tlRef.current!;
    const stage = stageRef.current;
    if (!tl) return;

    function countUp(el: HTMLSpanElement, target: number) {
      if (animated.current.has(target)) {
        el.textContent = String(target).padStart(2, '0');
        return;
      }
      animated.current.add(target);
      const dur = 900;
      const t0  = performance.now();
      function frame(t: number) {
        const p      = Math.min(1, (t - t0) / dur);
        const eased  = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(eased * target)).padStart(2, '0');
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function setActive(i: number) {
      if (i === curIdx.current) return;
      const prev  = curIdx.current;
      curIdx.current = i;

      const steps = stepEls.current;
      const dots  = dotEls.current;
      const nums  = numEls.current;

      if (prev >= 0) steps[prev]?.classList.remove('active');
      steps[i]?.classList.add('active');

      dots.forEach((d, k) => d?.classList.toggle('on', k === i));

      if (stage) stage.dataset.bg = STEPS[i].bg;

      const numEl = nums[i];
      if (numEl) countUp(numEl, STEPS[i].num);
    }

    function tick() {
      const r       = tl.getBoundingClientRect();
      const vh      = window.innerHeight;
      const total   = tl.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      const p       = total > 0 ? scrolled / total : 0;
      const idx     = Math.min(N - 1, Math.floor(p * N * 0.999));
      setActive(idx);
    }

    function onScroll() {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => { rafId.current = null; tick(); });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    setActive(0);
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section className="ihsan-section">
      <div className="cnt">

        {/* Header */}
        <div className="ihsan-header">
          <span className="eyebrow-v2 center">Our methodology</span>
          <h2 className="ihsan-h reveal">
            The Ihsan Process. <em>How we build.</em>
          </h2>
          <p className="ihsan-sub reveal delay-1">
            Four phases that bring clarity and organisation to the process — each grounded in an Islamic principle.
          </p>
        </div>

        {/* Full-bleed pinned scroller */}
        <div
          className="ihsan-timeline"
          ref={tlRef}
          style={{ '--steps': N } as React.CSSProperties}
        >
          <div className="ihsan-stage" ref={stageRef} data-bg="ivory">

            {/* Side dot indicators */}
            <div className="ihsan-dots" aria-hidden="true">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  ref={(el) => { dotEls.current[i] = el; }}
                  className={i === 0 ? 'on' : undefined}
                />
              ))}
            </div>

            {/* Steps — all stacked, active one shown */}
            <div className="ihsan-process">
              {STEPS.map((step, i) => (
                <div
                  key={step.phase}
                  className={`ip-step${i === 0 ? ' active' : ''}`}
                  ref={(el) => { stepEls.current[i] = el; }}
                  data-i={i}
                  data-bg={step.bg}
                >
                  {/* Big italic counter */}
                  <div className="ip-counter">
                    <span
                      className="ip-counter-num"
                      ref={(el) => { numEls.current[i] = el; }}
                    >
                      00
                    </span>
                  </div>

                  <h3 className="ip-name">{step.phase}</h3>
                  <p className="ip-name-en">{step.en}</p>
                  <p className="ip-desc">
                    {step.lines.map((ln) => (
                      <span key={ln} className="ln">{ln}</span>
                    ))}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
