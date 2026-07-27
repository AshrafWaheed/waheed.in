'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/components/motion/gsap';
import GirihEngine from '@/components/graphics/GirihEngine';
import { manifesto } from '@/content/home';

// Cinematic manifesto — a long pinned scrub reveals the three quote lines one by
// one (scroll is the playhead). Drawn girih behind, no cursor glow.
export default function ManifestoCinematic() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const lines = section.querySelectorAll<HTMLElement>('.hy-quote-line');
    const attr = section.querySelector<HTMLElement>('.hy-quote-attr');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(lines, { opacity: 1, y: 0 });
      if (attr) gsap.set(attr, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(lines, { opacity: 0.1, y: 44 });
      gsap.set(attr, { opacity: 0, y: 20 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=280%', pin: true, scrub: 0.6 },
      });
      lines.forEach((l, i) => tl.to(l, { opacity: 1, y: 0, ease: 'power2.out', duration: 1 }, i * 1));
      tl.to(attr, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 }, '>-0.2');
      tl.to({}, { duration: 1 });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hy-manifesto" data-section-color="dark">
      <div className="hy-manifesto-stage">
        <div className="hy-manifesto-engine">
          <GirihEngine draw="inView" spin />
        </div>
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
