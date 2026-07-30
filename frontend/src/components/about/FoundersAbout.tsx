'use client';

/**
 * FoundersAbout — §3, "The People & the Journey Behind Waheed".
 *
 * The old team cards were the weakest thing on the page: two boxes with gradient
 * headers (one of them a near-fluorescent gold), a generic stroked person icon
 * standing in for each founder, and the bio in 0.87rem grey. Meanwhile the
 * homepage hero has actual founder artwork. So this section finally uses it —
 * same two SVGs, same panel colours, same flush-bottom framing — which makes
 * /about and / read as one site instead of two.
 *
 * Rows alternate side (portrait left, then portrait right) so the page does not
 * settle into a single column, and each portrait flies in from the side it
 * occupies. That entrance uses `translate`, not `transform`, because the pointer
 * parallax owns `transform` on the same element.
 *
 * The eyebrow from content/about.ts is intentionally NOT rendered here: it reads
 * "The People & the Journey", which is a verbatim prefix of the h2 right below
 * it, so showing both would stutter. Every other section on this page does show
 * its eyebrow.
 *
 * Portrait geometry (aspect ratios, --fig-w/--fig-b/--fig-x) is copied from the
 * homepage hero, where it was derived from a canvas alpha scan of the true ink
 * rather than getBBox — see the .ab-card rules in globals.css.
 *
 * Copy is verbatim from content/about.ts.
 */
import { useEffect, useRef, useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import Spotlight from '@/components/motion/Spotlight';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import Khatam from '@/components/graphics/Khatam';
import { people } from '@/content/about';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function FoundersAbout() {
  const secRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [live, setLive] = useState<boolean[]>(() => people.members.map(() => false));

  useParallaxOrigin(secRef, 7);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          setLive((prev) => (prev[i] ? prev : prev.map((p, n) => (n === i ? true : p))));
          obs.unobserve(e.target);
        });
      },
      // Fire as the row starts entering so the fly-in reads as an arrival, not a
      // correction to something already sitting on screen. Same numbers as the
      // homepage bento, for the same reason.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    rowRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={secRef} className="ab-people" data-section-color="dark">
      <div className="cnt">
        {/* ── head: claim left, lead-in right ──────────────────────── */}
        <div className="ab-people-head">
          <div>
            <h2 className="ab-people-h">
              <SplitReveal text={people.heading.lead} by="char" stagger={0.014} />{' '}
              <em>
                <SplitReveal text={people.heading.em!} by="char" stagger={0.03} delay={0.3} />
              </em>
            </h2>
            <p className="ab-people-sub reveal delay-1">{people.sub}</p>
          </div>
          <p className="ab-people-intro reveal delay-2">{people.intro}</p>
        </div>

        {/* ── the two founders ─────────────────────────────────────── */}
        <div className="ab-fnd-list">
          {people.members.map((m, i) => (
            <div
              key={m.label}
              ref={(el) => { rowRefs.current[i] = el; }}
              data-i={i}
              className={`ab-fnd ab-fnd--${i % 2 === 0 ? 'l' : 'r'}${live[i] ? ' is-in' : ''}`}
            >
              <Spotlight className="ab-fnd-art">
                <div
                  className={`ab-card ab-card--${m.fig} ab-lay`}
                  style={v({ '--k': i === 0 ? 1.2 : 1.5 })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ab-fig" src={`/founders/${m.fig}.svg`} alt="" aria-hidden="true" />
                </div>
              </Spotlight>

              <div className="ab-fnd-copy">
                <span className="ab-fnd-badge">{m.label}</span>
                <h3 className="ab-fnd-role">{m.role}</h3>
                <p className="ab-fnd-bio">{m.bio}</p>
                <span className="ab-fnd-mark" aria-hidden="true">
                  <Khatam size={16} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.4} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
