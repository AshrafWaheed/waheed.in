'use client';

/**
 * ExpertiseBento — "Seven crafts, one standard." as an asymmetric bento.
 *
 * Replaces the drag-scroll row of CraftDash schematics on /home3. Seven is an
 * awkward number for a bento, so the grid runs on 6 columns with a deliberate
 * zig-zag rhythm (4|2 · 2|4 · 6 · 3|3) that lands the two "Coming Soon" crafts
 * side by side as a lighter closing row.
 *
 * Wide cards put copy left and the artifact right; narrow cards stack. Each card
 * goes `is-live` via IntersectionObserver so its artifact only animates on
 * screen, and keeps the tactile signatures: cursor spotlight + hover lift.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CraftArtifact from '@/components/graphics/CraftArtifact';
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import StackButton from '@/components/ui/StackButton';
import { expertise } from '@/content/home';
import { services, isLinkable } from '@/content/services';

/**
 * The two groups the redesign splits the crafts into — "build" (make the
 * product) and "grow" (get the customers). The boundary falls on a grid-row
 * edge: doors 0–1 are one full 6-col row, doors 2–6 are the remaining three
 * rows, so each group is a valid grid on its own and no card's span or entrance
 * has to change. Labels and closing CTAs come from `expertise.groups`; only the
 * `from`/`to` row boundary lives here, because it is layout, not copy.
 *
 * `services` (the routable catalogue) is index-aligned with `expertise.doors`
 * — same order, same count — so `services[i]` gives door `i` its slug and tells
 * us whether it has a page yet. That alignment is load-bearing; if either list
 * is reordered, the arrows point at the wrong craft.
 */
const RANGES = [
  { from: 0, to: 2 },
  { from: 2, to: 7 },
] as const;

/** The bottom-left "go to this craft" affordance. */
function GoArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 L17 7 M9 7 H17 V15" />
    </svg>
  );
}

/**
 * Per-craft grid span + inner layout + entrance direction. Index matches
 * `expertise.doors`. `dir` makes each card fly in from the side it sits on, so
 * the two halves of a row converge; the full-width card (05) has no side to come
 * from, so it rises instead.
 */
const CELLS = [
  { span: 4, layout: 'split', dir: 'l' },  // 01 Web & App Development
  { span: 2, layout: 'stack', dir: 'r' },  // 02 Custom Software Development
  { span: 2, layout: 'stack', dir: 'l' },  // 03 Brand Strategy
  { span: 4, layout: 'split', dir: 'r' },  // 04 SEO
  { span: 6, layout: 'split', dir: 'u' },  // 05 Social Media Marketing
  { span: 3, layout: 'stack', dir: 'l' },  // 06 Conversion Copywriting
  { span: 3, layout: 'stack', dir: 'r' },  // 07 Ad Creatives
] as const;

export default function ExpertiseBento() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [live, setLive] = useState<boolean[]>(() => expertise.doors.map(() => false));

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
      // Fires as the card starts entering, so the fly-in reads as an arrival
      // rather than a correction to something already sitting on screen.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const { heading, doors, groups } = expertise;

  return (
    <section className="xp" data-section-color="dark">
      <div className="cnt">
        <div className="xp-head">
          <h2 className="xp-h">
            <SplitReveal text={heading.lead} by="char" />
          </h2>
        </div>

        {RANGES.map((r, gi) => {
          const g = groups[gi];
          return (
          <div className="xp-group" key={g.label}>
            <div className="xp-grouplabel">
              <span className="xp-tab">{g.label}</span>
            </div>

            <div className="xp-grid">
              {doors.slice(r.from, r.to).map((d, j) => {
                const i = r.from + j;                 // index into doors/CELLS/services
                const cell = CELLS[i];
                const svc = services[i];
                const linkable = !!svc && isLinkable(svc) && !d.soon;
                return (
                  <Spotlight
                    key={d.num}
                    className={`xp-cell s${cell.span} l-${cell.layout} d-${cell.dir}${live[i] ? ' is-in' : ''}${d.soon ? ' is-soon' : ''}`}
                  >
                    <article
                      ref={(el) => { cardRefs.current[i] = el; }}
                      data-i={i}
                      className={`xp-card${live[i] ? ' is-live' : ''}`}
                      data-cursor
                    >
                      <div className="xp-card-copy">
                        <div className="xp-card-top">
                          <span className="xp-num">{d.num}</span>
                          {d.soon && <span className="xp-soon">Coming Soon</span>}
                        </div>
                        <h3 className="xp-title">{d.title}</h3>
                        <p className="xp-desc">{d.desc}</p>

                        {/* The bottom-left affordance. A live craft gets the
                            circular arrow that navigates to its page; a
                            not-yet-built one keeps the khatam bullet, since
                            there is nowhere to send anyone. The promise line
                            rides alongside it either way. */}
                        <div className="xp-foot">
                          {linkable ? (
                            <Link
                              href={`/services/${svc.slug}`}
                              className="xp-arrow"
                              data-cursor
                              aria-label={`Explore ${d.title}`}
                            >
                              <GoArrow />
                            </Link>
                          ) : (
                            <Khatam size={11} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.5} />
                          )}
                          <span className="xp-promise">{d.promise}</span>
                        </div>
                      </div>

                      <div className="xp-card-art">
                        <CraftArtifact i={i} live={live[i]} />
                      </div>
                    </article>
                  </Spotlight>
                );
              })}
            </div>

            {/* The button that closes each group in the redesign: "Contact us"
                under build, "View our packages" under grow. */}
            <div className="xp-groupcta">
              <StackButton href={g.cta.href} size="sm">{g.cta.label}</StackButton>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
