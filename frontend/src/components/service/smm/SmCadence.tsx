'use client';

/**
 * SmCadence — §4. Ninety days as a grid that fills in.
 *
 * Thirteen weeks across, five publishing days down. The cells fill in reading
 * order as the section is scrolled, scrubbed rather than timed, so the grid
 * fills at the reader's pace — which is the section's whole claim made
 * literally: cadence is a thing that accumulates, and it is visible as a shape
 * before it is described in words.
 *
 * The four phases sit under the columns they occupy, each spanning its own week
 * range, so the schedule and the illustration are one object rather than a
 * diagram with a caption.
 *
 * ONE style write per frame: ScrollTrigger sets `--p` on the grid and every
 * cell resolves its own opacity from `--i` against it. 65 cells fading by class
 * toggle would be 65 style recalculations a frame; this is one.
 */
import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

const WEEKS = 13;
const DAYS = 5;

/** 'Weeks 3–4' / 'Weeks 11–13' → [3, 4]. Falls back to the whole run. */
function weekRange(span: string): [number, number] {
  const nums = span.match(/\d+/g);
  if (!nums) return [1, WEEKS];
  const a = Number(nums[0]);
  const b = nums[1] ? Number(nums[1]) : a;
  return [a, b];
}

export default function SmCadence({ page }: { page: ServicePage }) {
  const { eyebrow, heading, sub, steps } = page.process;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = gsap.to({}, {
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          end: 'bottom 68%',
          scrub: 0.4,
          onUpdate: (self) => { el.style.setProperty('--p', String(self.progress)); },
        },
      });
      return () => { st.scrollTrigger?.kill(); st.kill(); el.style.removeProperty('--p'); };
    });
    return () => mm.revert();
  }, []);

  const cells = WEEKS * DAYS;

  return (
    <section className="sm-cadence" data-section-color="light">
      <div className="cnt">
        <header className="sm-head">
          <p className="sm-eyebrow">{eyebrow}</p>
          <h2 className="sm-h2">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="sm-lede reveal">{sub}</p>
        </header>

        <div className="sm-cal">
          <div className="sm-cal-grid" ref={gridRef} style={v({ '--n': cells, '--w': WEEKS })} aria-hidden="true">
            {Array.from({ length: cells }, (_, n) => {
              // Reading order is week-by-week, so the fill sweeps left to right.
              const week = n % WEEKS;
              const day = Math.floor(n / WEEKS);
              const i = week * DAYS + day;
              return <span key={n} className="sm-cell" style={v({ '--i': i })} />;
            })}
          </div>

          {/* Markers span the weeks they occupy, so they stay locked to the
              grid above. The COPY does not — a two-week phase would get 2/13ths
              of the measure, which is 178px for a forty-word paragraph. */}
          <div className="sm-marks" aria-hidden="true">
            {steps.map((s) => {
              const [a, b] = weekRange(s.span);
              return (
                <span key={s.title} className="sm-mark" style={v({ '--a': a, '--b': b + 1 })}>
                  {s.span}
                </span>
              );
            })}
          </div>

          <ol className="sm-phases">
            {steps.map((s) => (
              <li key={s.title} className="sm-phase">
                <span className="sm-phase-span">{s.span}</span>
                <h3 className="sm-phase-t">{s.title}</h3>
                <p className="sm-phase-b">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
