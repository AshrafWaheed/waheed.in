'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import GirihEngine from '@/components/graphics/GirihEngine';
import BarakahCurrent from '@/components/graphics/BarakahCurrent';
import { manifesto } from '@/content/home';

export default function ManifestoHybrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Pinned scrub: the three quote lines brighten + rise one after another.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = section.querySelectorAll<HTMLElement>('.hy-quote-line');
    const attr = section.querySelector<HTMLElement>('.hy-quote-attr');

    if (reduce) {
      gsap.set(lines, { opacity: 1, y: 0 });
      if (attr) gsap.set(attr, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(lines, { opacity: 0.14, y: 34 });
      gsap.set(attr, { opacity: 0, y: 18 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=230%', pin: true, scrub: 0.6 },
      });
      lines.forEach((l, i) => tl.to(l, { opacity: 1, y: 0, ease: 'power2.out', duration: 1 }, i * 0.9));
      tl.to(attr, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.7 }, '>-0.2');
      tl.to({}, { duration: 0.8 });
    }, section);
    return () => ctx.revert();
  }, []);

  // Cursor-following gold glow (fine pointer only), lerped for smoothness.
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 50, ty = 50, cx = 50, cy = 50, raf = 0, active = false;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      active = true;
    };
    const onLeave = () => { active = false; };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.setProperty('--mx', `${cx}%`);
      glow.style.setProperty('--my', `${cy}%`);
      glow.style.opacity = active ? '1' : '0';
      raf = requestAnimationFrame(tick);
    };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hy-manifesto" data-section-color="dark">
      <div className="hy-manifesto-stage">
        {/* Order matters: the current is the field, the engine is the margin
            ornament on top of it, the glow rides above both. */}
        <BarakahCurrent />
        <div className="hy-manifesto-engine">
          <GirihEngine draw="inView" spin />
        </div>
        <div ref={glowRef} className="hy-manifesto-glow" aria-hidden="true" style={{ opacity: 0 }} />

        <blockquote className="hy-quote">
          {manifesto.lines.map((line) => (
            <span key={line} className="hy-quote-line">{line}</span>
          ))}
        </blockquote>
        <p className="hy-quote-attr">{manifesto.attribution}</p>
      </div>
    </section>
  );
}
