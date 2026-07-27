'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import CraftDash from '@/components/graphics/CraftDash';
import Khatam from '@/components/graphics/Khatam';
import { expertise } from '@/content/home';

// Cinematic expertise — pinned horizontal scrub of the 7 cards, and each card
// reveals itself (fade + rise) as it crosses centre, driven off the horizontal
// scroll via GSAP containerAnimation. No hover interactions.
export default function ExpertiseCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

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
          trigger: section, start: 'top top', end: () => `+=${len()}`, pin: true, scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`; },
        },
      });
      const cards = gsap.utils.toArray<HTMLElement>('.cn-exp-card', row);
      const subs = cards.map((card) =>
        gsap.fromTo(card, { opacity: 0, y: 54 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 80%', toggleActions: 'play none none reverse' },
        }),
      );
      return () => {
        tween.scrollTrigger?.kill(); tween.kill();
        subs.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
        gsap.set(row, { x: 0 }); gsap.set(cards, { opacity: 1, y: 0 });
      };
    });
    return () => mm.revert();
  }, []);

  const { eyebrow, heading, doors } = expertise;
  return (
    <section ref={sectionRef} className="hy-expertise cn-exp" data-section-color="dark">
      <div className="hy-exp-stage">
        <div className="hy-exp-head cnt">
          <span className="hy-exp-eyebrow">{eyebrow}</span>
          <h2 className="hy-exp-h">
            {heading.lead} <em>{heading.em}</em>
          </h2>
          <div className="hy-exp-progress" aria-hidden="true"><span ref={fillRef} className="hy-exp-progress-fill" /></div>
        </div>
        <div className="hy-exp-row cn-exp-row" ref={rowRef}>
          {doors.map((d, i) => (
            <div key={d.num} className="cn-exp-card-wrap">
              <article className={`hy-exp-card cn-exp-card${d.soon ? ' is-soon' : ''}`}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
