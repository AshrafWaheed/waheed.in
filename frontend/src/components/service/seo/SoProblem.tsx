'use client';

/**
 * SoProblem — §2. A statement that lights word by word, then three cards that stack.
 *
 * Two mechanics, neither used elsewhere on the site:
 *
 * 1. The thesis is split into words and lit by SCROLL POSITION rather than by a
 *    timed animation. ScrollTrigger writes one custom property (`--p`, 0→1) on
 *    the paragraph, and each word resolves its own opacity from
 *    `clamp(.18, calc(var(--p) * var(--n) - var(--i)), 1)`. That is one style
 *    write per frame for the whole paragraph instead of sixty class toggles,
 *    and the still frame under reduced motion is simply `--p: 1`.
 *
 * 2. The symptoms are sticky cards that stack ON each other — each one scrolls
 *    up and parks, and the next slides over it. Page 03 pins an illustration
 *    and scrolls text past it; this pins the text itself.
 */
import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SoProblem({ page }: { page: ServicePage }) {
  const { heading, body, symptoms } = page.problem;
  const lineRef = useRef<HTMLParagraphElement>(null);

  const words = body.split(' ');

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = gsap.to({}, {
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'bottom 52%',
          scrub: 0.4,
          onUpdate: (self) => { el.style.setProperty('--p', String(self.progress)); },
        },
      });
      return () => { st.scrollTrigger?.kill(); st.kill(); el.style.removeProperty('--p'); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="so-problem" data-section-color="light">
      <div className="cnt">
        <h2 className="so-h2">
          {heading.lead} <em>{heading.em}</em>
        </h2>

        <p
          ref={lineRef}
          className="so-scrub"
          style={v({ '--n': words.length })}
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="so-scrub-w" style={v({ '--i': i })}>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>

      {/* Stacking deck. The wrapper is tall; each card parks at the same top. */}
      <div className="cnt so-deck">
        {symptoms.map((s, i) => (
          <article key={s.title} className="so-deck-card" style={v({ '--k': i })}>
            <span className="so-deck-n">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="so-deck-t">{s.title}</h3>
            <p className="so-deck-b">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
