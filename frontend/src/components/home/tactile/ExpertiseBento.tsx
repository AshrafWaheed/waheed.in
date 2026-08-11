'use client';

/**
 * ExpertiseBento — "The Solutions to Help You Build & Grow" as a TAB-based bento.
 *
 * Two tabs, "I want to build" and "I want to grow" (the Figma toggle); clicking
 * one swaps the grid to that group's solutions. Build carries three cards
 * (Website, Custom Software, App — the redesign splits web and app), grow carries
 * five. Each group is its own valid 6-col grid via LAYOUTS below.
 *
 * The directional fly-in from the previous (stacked) version is kept: cards start
 * offset per their `dir` class and transition in when `revealed` adds `is-in`.
 * `revealed` is driven by an IntersectionObserver on the section (so the first
 * reveal waits for scroll) and re-fired on every tab switch (double-rAF so the
 * hidden state paints before the transition). Reduced-motion is handled in CSS.
 *
 * Each door names its own CraftArtifact index (`art`) and page `slug`; there is
 * no longer an index-alignment with the services catalogue.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CraftArtifact from '@/components/graphics/CraftArtifact';
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import StackButton from '@/components/ui/StackButton';
import { expertise } from '@/content/home';

/** A solution card. `slug` is present only for doors that have a page. */
type Door = {
  num: string; title: string; desc: string; promise: string;
  art: number; soon: boolean; slug?: string;
};

/** Per-group grid span + inner layout + entrance direction (rows sum to 6). */
const LAYOUTS: Record<string, { span: number; layout: 'split' | 'stack'; dir: 'l' | 'r' | 'u' }[]> = {
  build: [
    { span: 4, layout: 'split', dir: 'l' },
    { span: 2, layout: 'stack', dir: 'r' },
    { span: 6, layout: 'split', dir: 'u' },
  ],
  grow: [
    { span: 4, layout: 'split', dir: 'l' },
    { span: 2, layout: 'stack', dir: 'r' },
    { span: 2, layout: 'stack', dir: 'l' },
    { span: 4, layout: 'split', dir: 'r' },
    { span: 6, layout: 'split', dir: 'u' },
  ],
};

/** The bottom-left "go to this craft" affordance. */
function GoArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 L17 7 M9 7 H17 V15" />
    </svg>
  );
}

export default function ExpertiseBento() {
  const { heading, groups } = expertise;
  const secRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // First reveal waits for the section to scroll into view.
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // (Re)play the fly-in whenever the section first enters view or the tab changes.
  // Double rAF: let the hidden (offset) state paint before adding is-in so the
  // transition actually runs.
  useEffect(() => {
    if (!inView) return;
    setRevealed(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setRevealed(true)); });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [inView, active]);

  const group = groups[active];
  const cells = LAYOUTS[group.key];

  return (
    <section ref={secRef} className="xp" data-section-color="dark">
      <div className="cnt">
        <div className="xp-head">
          <h2 className="xp-h">
            <SplitReveal text={heading.lead} by="char" />
          </h2>
        </div>

        {/* Tabs — pick an intent. */}
        <div className="xp-tabs" role="tablist" aria-label="Solutions by intent">
          {groups.map((g, i) => (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`xp-tabbtn${active === i ? ' is-on' : ''}`}
              onClick={() => setActive(i)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="xp-grid" key={group.key}>
          {(group.doors as ReadonlyArray<Door>).map((d, i) => {
            const cell = cells[i] ?? cells[cells.length - 1];
            const linkable = !!d.slug && !d.soon;
            return (
              <Spotlight
                key={d.num}
                className={`xp-cell s${cell.span} l-${cell.layout} d-${cell.dir}${revealed ? ' is-in' : ''}${d.soon ? ' is-soon' : ''}`}
              >
                <article className="xp-card is-live" data-cursor>
                  <div className="xp-card-copy">
                    <div className="xp-card-top">
                      <span className="xp-num">{d.num}</span>
                      {d.soon && <span className="xp-soon">Coming Soon</span>}
                    </div>
                    <h3 className="xp-title">{d.title}</h3>
                    <p className="xp-desc">{d.desc}</p>

                    <div className="xp-foot">
                      {linkable ? (
                        <Link href={`/services/${d.slug}`} className="xp-arrow" data-cursor aria-label={`Explore ${d.title}`}>
                          <GoArrow />
                        </Link>
                      ) : (
                        <Khatam size={11} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.5} />
                      )}
                      <span className="xp-promise">{d.promise}</span>
                    </div>
                  </div>

                  <div className="xp-card-art">
                    <CraftArtifact i={d.art} live={revealed} />
                  </div>
                </article>
              </Spotlight>
            );
          })}
        </div>

        <div className="xp-groupcta">
          <StackButton href={group.cta.href} size="sm">{group.cta.label}</StackButton>
        </div>
      </div>
    </section>
  );
}
