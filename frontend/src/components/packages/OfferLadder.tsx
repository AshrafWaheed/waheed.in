'use client';

/**
 * OfferLadder — §2, the five packages.
 *
 * The old layout was a wrapping flex of five equal cards, which at three-up left
 * the last two orphaned and centred under the first row, with card edges and
 * heights that lined up with nothing. Worse, it threw away what the copy is: an
 * ASCENDING LADDER, from a one-off diagnostic through to an open-ended
 * partnership. Five equal boxes say "pick one of five"; the content says "these
 * are rungs".
 *
 * So it is built as rungs — full-width rows on a shared gold rail, each with a
 * tick meter that fills one step further than the rung above it. The rail
 * brightens up to whichever rung you have reached, so scrolling the page reads
 * as climbing it. Rows also solve the practical problem the card grid could not:
 * the five descriptions differ in length by more than 2×, which is exactly what
 * makes equal-height cards look broken.
 *
 * "The Authority System" is the featured rung, so it breaks the row rhythm on
 * purpose: night panel, gold badge, gold CTA. That is the one place a ladder
 * should have a landing.
 *
 * No numerals are printed. The rung meter carries the level graphically because
 * the copy contains no numbering, and inventing "01…05" would be adding content.
 *
 * Copy is verbatim from content/packages.ts.
 */
import StackButton from '@/components/ui/StackButton';
import { useEffect, useRef, useState } from 'react';
import Spotlight from '@/components/motion/Spotlight';
import Khatam from '@/components/graphics/Khatam';
import { ladder } from '@/content/packages';

const N = ladder.rungs.length;

/** Ascending ticks: `level + 1` of five lit. Decorative, no text. */
function TierMeter({ level, lit }: { level: number; lit: boolean }) {
  return (
    <svg className="pk-meter" width="54" height="30" viewBox="0 0 54 30" fill="none"
      stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      {Array.from({ length: N }, (_, n) => (
        <line
          key={n}
          x1={3 + n * 12} y1={26}
          x2={3 + n * 12} y2={26 - (n + 1) * 4.4}
          strokeWidth="2"
          opacity={n <= level ? (lit ? 0.95 : 0.55) : 0.16}
        />
      ))}
    </svg>
  );
}

export default function OfferLadder() {
  const ladderRef = useRef<HTMLDivElement | null>(null);
  const rungRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          // Only ever climbs. A rung you have passed stays lit, so scrolling back
          // up does not un-build the ladder behind you.
          setActive((prev) => (i > prev ? i : prev));
        });
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    );
    rungRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="pk-ladder-sec" data-section-color="light">
      <div className="cnt">
        <div ref={ladderRef} className="pk-ladder">
          {ladder.rungs.map((r, i) => (
            <Spotlight
              key={r.title}
              className={`pk-rung${r.featured ? ' is-featured' : ''}${i <= active ? ' is-on' : ''}`}
            >
              <div
                ref={(el) => { rungRefs.current[i] = el; }}
                data-i={i}
                className="pk-rung-mark"
                aria-hidden="true"
              >
                <span className="pk-node">
                  <Khatam size={17} inner={0.5} stroke="currentColor" strokeWidth={1.5} />
                </span>
                <TierMeter level={i} lit={i <= active} />
              </div>

              <div className="pk-rung-in reveal">
                <div className="pk-rung-lead">
                  {r.badge && <span className="pk-badge">{r.badge}</span>}
                  <h3 className="pk-rung-title">{r.title}</h3>
                  <p className="pk-rung-sub">{r.subtitle}</p>
                </div>

                <div className="pk-rung-tail">
                  <p className="pk-rung-desc">{r.desc}</p>
                  <StackButton
                    href={ladder.applyHref}
                    size="sm"
                    tone={r.featured ? 'gold' : 'ghost'}
                    className="pk-apply"
                  >
                    {ladder.applyLabel}
                  </StackButton>
                </div>
              </div>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
