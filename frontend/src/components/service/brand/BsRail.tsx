'use client';

/**
 * BsRail — §3. The six artefacts, travelling sideways through a pinned section.
 *
 * The default layout puts its six deliverables in a static hairline grid. Here
 * they are a rail: the section pins and the row translates horizontally as you
 * scroll, so the artefacts arrive one at a time in the order they are produced.
 * That order is the content — positioning first, guidelines last — and a grid
 * throws it away by showing all six at once.
 *
 * Desktop only, and only when motion is allowed: `gsap.matchMedia` handles both
 * conditions and reverts cleanly, and below 900px the row falls back to a native
 * scroll-snap swipe, which is better on touch than a hijacked page anyway.
 *
 * `invalidateOnRefresh` matters — the travel distance depends on `scrollWidth`,
 * which changes when fonts land or the viewport resizes, and without it the rail
 * stops short of the last card.
 */
import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import Spotlight from '@/components/motion/Spotlight';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import type { ServicePage } from '@/content/services';

export default function BsRail({ page }: { page: ServicePage }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const len = () => Math.max(0, row.scrollWidth - window.innerWidth + 120);
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

  const { eyebrow, heading, sub, items } = page.build;

  return (
    <section ref={sectionRef} className="bs-rail" data-section-color="light">
      <div className="bs-rail-stage">
        <div className="cnt bs-rail-head">
          <p className="bs-eyebrow">{eyebrow}</p>
          <h2 className="bs-h2 bs-h2--tight">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="bs-lede">{sub}</p>
          <div className="bs-rail-bar" aria-hidden="true">
            <span ref={fillRef} className="bs-rail-fill" />
          </div>
        </div>

        <div className="bs-rail-row" ref={rowRef}>
          {items.map((it) => (
            <Spotlight key={it.num} className="bs-card">
              <span className="bs-card-num">{it.num}</span>
              <h3 className="bs-card-t">{it.title}</h3>
              <p className="bs-card-b">{it.body}</p>
              <span className="bs-card-mark" aria-hidden="true">
                <Khatam size={16} inner={0.5} stroke="currentColor" strokeWidth={1.5} />
              </span>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
