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
import { useEffect, useRef, useState } from 'react';
import CraftArtifact from '@/components/graphics/CraftArtifact';
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import { expertise } from '@/content/home';

/** Per-craft grid span + inner layout. Index matches `expertise.doors`. */
const CELLS = [
  { span: 4, layout: 'split' },  // 01 Web & App Development
  { span: 2, layout: 'stack' },  // 02 Custom Software Development
  { span: 2, layout: 'stack' },  // 03 Brand Strategy
  { span: 4, layout: 'split' },  // 04 SEO
  { span: 6, layout: 'split' },  // 05 Social Media Marketing
  { span: 3, layout: 'stack' },  // 06 Conversion Copywriting
  { span: 3, layout: 'stack' },  // 07 Ad Creatives
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
      { rootMargin: '0px 0px -12% 0px', threshold: 0.25 },
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const { eyebrow, heading, doors } = expertise;

  return (
    <section className="xp" data-section-color="dark">
      <div className="cnt">
        <div className="xp-head">
          <span className="xp-eyebrow">{eyebrow}</span>
          <h2 className="xp-h">
            <SplitReveal text={heading.lead} by="char" />{' '}
            <em>
              <SplitReveal text={heading.em!} by="char" />
            </em>
          </h2>
        </div>

        <div className="xp-grid">
          {doors.map((d, i) => {
            const cell = CELLS[i];
            return (
              <Spotlight
                key={d.num}
                className={`xp-cell s${cell.span} l-${cell.layout}${d.soon ? ' is-soon' : ''}`}
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
                    <span className="xp-promise">
                      <Khatam size={11} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.5} />
                      {d.promise}
                    </span>
                  </div>

                  <div className="xp-card-art">
                    <CraftArtifact i={i} live={live[i]} />
                  </div>
                </article>
              </Spotlight>
            );
          })}
        </div>
      </div>
    </section>
  );
}
