'use client';

/**
 * ExpertiseBento — "The Solutions to Help You Build & Grow" as a TAB-based bento.
 *
 * Two tabs, "I want to build" and "I want to grow" (the Figma toggle); clicking
 * one swaps the grid to that group's solutions (build 3, grow 5). Each group is
 * its own valid 6-col grid via LAYOUTS below.
 *
 * Motion is SCROLL-SCRUBBED (useScrollProgress) and attached to scroll: the
 * heading reveals (fade-up) and the cards FLY IN (rise + fade) on a per-card
 * stagger as the section scrolls through the viewport, reversing on scroll-up.
 * Because the progress is a live MotionValue, switching tabs while the section
 * is already in view shows the new cards at the current state.
 *
 * Each door names its own CraftArtifact index (`art`) and page `slug`.
 */
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import CraftArtifact from '@/components/graphics/CraftArtifact';
import Spotlight from '@/components/motion/Spotlight';
import ScrubReveal from '@/components/motion/ScrubReveal';
import { useScrollProgress } from '@/components/motion/useScrollProgress';
import Khatam from '@/components/graphics/Khatam';
import StackButton from '@/components/ui/StackButton';
import { expertise } from '@/content/home';

/** A solution card. `slug` is present only for doors that have a page. */
type Door = {
  num: string; title: string; desc: string; promise: string;
  art: number; soon: boolean; slug?: string;
};

/** Per-group grid span + inner layout (rows sum to 6). */
const LAYOUTS: Record<string, { span: number; layout: 'split' | 'stack' }[]> = {
  build: [
    { span: 4, layout: 'split' },
    { span: 2, layout: 'stack' },
    { span: 6, layout: 'split' },
  ],
  grow: [
    { span: 4, layout: 'split' },
    { span: 2, layout: 'stack' },
    { span: 2, layout: 'stack' },
    { span: 4, layout: 'split' },
    { span: 6, layout: 'split' },
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
  const [active, setActive] = useState(0);

  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pHead = useScrollProgress(headRef);
  const pGrid = useScrollProgress(gridRef, { startVh: 0.95, endVh: 0.4 });
  const headY = useTransform(pHead, [0, 0.8], [44, 0], { clamp: true });
  const headO = useTransform(pHead, [0, 0.55], [0, 1], { clamp: true });

  const group = groups[active];
  const cells = LAYOUTS[group.key];

  return (
    <section className="xp" data-section-color="dark">
      <div className="cnt">
        <motion.div className="xp-head" ref={headRef} style={{ y: headY, opacity: headO }}>
          <h2 className="xp-h">{heading.lead}</h2>
        </motion.div>

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

        <div className="xp-grid" ref={gridRef} key={group.key}>
          {(group.doors as ReadonlyArray<Door>).map((d, i) => {
            const cell = cells[i] ?? cells[cells.length - 1];
            const linkable = !!d.slug && !d.soon;
            const from = Math.min(0.5, i * 0.07);
            return (
              <ScrubReveal
                key={d.num}
                progress={pGrid}
                from={from}
                to={from + 0.5}
                y={64}
                className={`xp-cell s${cell.span} l-${cell.layout}${d.soon ? ' is-soon' : ''}`}
              >
                <Spotlight className="xp-cell-spot">
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
                      <CraftArtifact i={d.art} live={true} />
                    </div>
                  </article>
                </Spotlight>
              </ScrubReveal>
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
