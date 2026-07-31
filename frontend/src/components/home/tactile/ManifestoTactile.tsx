'use client';

import { useEffect, useRef } from 'react';
import GirihEngine from '@/components/graphics/GirihEngine';
import BarakahCurrent from '@/components/graphics/BarakahCurrent';
import { manifesto } from '@/content/home';

function QuoteLayer() {
  return (
    <>
      <blockquote className="hy-quote">
        {manifesto.lines.map((l) => (
          <span key={l} className="hy-quote-line">{l}</span>
        ))}
      </blockquote>
      <p className="hy-quote-attr">{manifesto.attribution}</p>
    </>
  );
}

// Tactile manifesto — the quote sits faint by default; a bright copy is revealed
// only through a spotlight that follows the cursor (Outcrowd/original-WAHEED
// signature). No pin. Touch/reduced-motion shows the bright copy in full.
export default function ManifestoTactile() {
  const sectionRef = useRef<HTMLElement>(null);
  const brightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bright = brightRef.current;
    if (!section || !bright) return;
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 50, ty = 50, cx = 50, cy = 50, raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      bright.style.setProperty('--mx', `${cx}%`);
      bright.style.setProperty('--my', `${cy}%`);
      raf = requestAnimationFrame(tick);
    };
    section.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { section.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={sectionRef} className="hy-manifesto tc-manifesto" data-section-color="dark">
      <div className="hy-manifesto-stage">
        <BarakahCurrent />
        <div className="hy-manifesto-engine">
          <GirihEngine draw="inView" spin />
        </div>
        <div className="tc-quote-dim"><QuoteLayer /></div>
        <div ref={brightRef} className="tc-quote-bright" aria-hidden="true"><QuoteLayer /></div>
        <p className="tc-manifesto-hint" aria-hidden="true">move your cursor</p>
      </div>
    </section>
  );
}
