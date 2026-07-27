'use client';

import { useEffect, useRef } from 'react';
import CraftDash from '@/components/graphics/CraftDash';
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import { expertise } from '@/content/home';

// Tactile expertise — a native drag/swipe horizontal row (no pin). Each card has
// a spotlight glow and inverts to a brighter teal on hover. Progress thread tracks
// the row's scroll position.
export default function ExpertiseTactile() {
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const onScroll = () => {
      const max = row.scrollWidth - row.clientWidth;
      const p = max > 0 ? row.scrollLeft / max : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    };
    row.addEventListener('scroll', onScroll, { passive: true });

    let down = false, startX = 0, startL = 0;
    const md = (e: MouseEvent) => { down = true; startX = e.clientX; startL = row.scrollLeft; row.classList.add('dragging'); };
    const mm = (e: MouseEvent) => { if (down) row.scrollLeft = startL - (e.clientX - startX); };
    const mu = () => { down = false; row.classList.remove('dragging'); };
    const fine = !window.matchMedia('(pointer: coarse)').matches;
    if (fine) {
      row.addEventListener('mousedown', md);
      window.addEventListener('mousemove', mm);
      window.addEventListener('mouseup', mu);
    }
    onScroll();
    return () => {
      row.removeEventListener('scroll', onScroll);
      row.removeEventListener('mousedown', md);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
    };
  }, []);

  const { eyebrow, heading, doors } = expertise;
  return (
    <section className="hy-expertise tc-exp" data-section-color="dark">
      <div className="tc-exp-inner">
        <div className="hy-exp-head cnt">
          <span className="hy-exp-eyebrow">{eyebrow}</span>
          <h2 className="hy-exp-h">
            <SplitReveal text={heading.lead} by="char" /> <em><SplitReveal text={heading.em!} by="char" /></em>
          </h2>
          <div className="hy-exp-progress" aria-hidden="true"><span ref={fillRef} className="hy-exp-progress-fill" /></div>
        </div>
        <div className="tc-exp-row" ref={rowRef}>
          {doors.map((d, i) => (
            <Spotlight key={d.num} className="tc-exp-card-wrap">
              <article className={`hy-exp-card tc-exp-card${d.soon ? ' is-soon' : ''}`} data-cursor>
                <div className="hy-exp-card-art"><CraftDash i={i} /></div>
                <div className="hy-exp-card-body">
                  <span className="hy-exp-card-num">{d.num}</span>
                  {d.soon && <span className="hy-exp-soon">Coming Soon</span>}
                  <h3 className="hy-exp-card-title">{d.title}</h3>
                  <p className="hy-exp-card-desc">{d.desc}</p>
                  <span className="hy-exp-card-promise">
                    <Khatam size={11} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.5} />
                    {d.promise}
                  </span>
                </div>
              </article>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
