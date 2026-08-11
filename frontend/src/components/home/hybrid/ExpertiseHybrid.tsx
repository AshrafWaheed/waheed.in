'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import CraftDash from '@/components/graphics/CraftDash';
import Spotlight from '@/components/motion/Spotlight';
import Khatam from '@/components/graphics/Khatam';
import { expertise } from '@/content/home';

export default function ExpertiseHybrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  // Desktop only: pin the section and translate the card row horizontally as you
  // scroll vertically (GSAP). Mobile falls back to native horizontal swipe (CSS).
  useEffect(() => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const len = () => Math.max(0, row.scrollWidth - window.innerWidth);
      const tween = gsap.to(row, {
        x: () => -len(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${len()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(row, { x: 0 }); };
    });
    return () => mm.revert();
  }, []);

  const { eyebrow, heading } = expertise;
  // `doors` is now nested under groups (tab-based ExpertiseBento is the live
  // variant); flatten for this unmounted legacy variant. Cast to the fields it
  // reads — the two groups' `as const` door shapes differ (slug/art), which
  // trips flatMap's inference otherwise.
  const doors = expertise.groups.flatMap((g) => [...g.doors]) as ReadonlyArray<{
    num: string; title: string; desc: string; promise: string; soon: boolean;
  }>;

  return (
    <section ref={sectionRef} className="hy-expertise" data-section-color="dark">
      <div className="hy-exp-stage">
        <div className="hy-exp-head cnt">
          <span className="hy-exp-eyebrow">{eyebrow}</span>
          <h2 className="hy-exp-h">
            {heading.lead} <em>{heading.em}</em>
          </h2>
          <div className="hy-exp-progress" aria-hidden="true">
            <span ref={fillRef} className="hy-exp-progress-fill" />
          </div>
        </div>

        <div className="hy-exp-row" ref={rowRef}>
          {doors.map((d, i) => (
            <Spotlight key={d.num} className="hy-exp-card-wrap">
              <article className={`hy-exp-card${d.soon ? ' is-soon' : ''}`} data-cursor>
                <div className="hy-exp-card-art">
                  <CraftDash i={i} />
                </div>
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
