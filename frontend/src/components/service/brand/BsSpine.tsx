'use client';

/**
 * BsSpine — §4. Four phases alternating across a spine that draws as you scroll.
 *
 * The default layout runs its phases left-to-right on a horizontal rail. This
 * one is vertical and alternating: each phase enters from the side it sits on,
 * and the spine between them is drawn by scroll position rather than by a
 * timed animation, so the line is literally as far along as the reader is.
 *
 * The fill is a `scaleY` on a 1px element driven from ScrollTrigger's `onUpdate`
 * — a transform on one node, so it stays on the compositor and never triggers
 * layout. Under reduced motion the trigger is never created and CSS shows the
 * spine at full height, which is the correct still frame rather than an empty one.
 */
import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import SplitReveal from '@/components/motion/SplitReveal';
import Khatam from '@/components/graphics/Khatam';
import type { ServicePage } from '@/content/services';

export default function BsSpine({ page }: { page: ServicePage }) {
  const { heading, sub, steps } = page.process;
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Spine fill — scroll-linked.
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = gsap.to({}, {
        scrollTrigger: {
          trigger: list,
          start: 'top 72%',
          end: 'bottom 62%',
          scrub: 0.5,
          onUpdate: (self) => { fill.style.transform = `scaleY(${self.progress})`; },
        },
      });
      return () => { st.scrollTrigger?.kill(); st.kill(); fill.style.transform = ''; };
    });
    return () => mm.revert();
  }, []);

  // Per-phase entrance from its own side.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.25 },
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bs-spine" data-section-color="dark">
      <div className="cnt">
        <header className="bs-spine-head">
          <h2 className="bs-h2">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="bs-lede reveal">{sub}</p>
        </header>

        <ol className="bs-steps" ref={listRef}>
          <span className="bs-steps-line" aria-hidden="true">
            <span ref={fillRef} className="bs-steps-fill" />
          </span>

          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`bs-step ${i % 2 === 0 ? 'is-left' : 'is-right'}`}
            >
              <span className="bs-step-node" aria-hidden="true">
                <Khatam size={17} inner={0.5} stroke="currentColor" strokeWidth={1.6} />
              </span>
              <div className="bs-step-card">
                <span className="bs-step-span">{s.span}</span>
                <h3 className="bs-step-t">{s.title}</h3>
                <p className="bs-step-b">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
