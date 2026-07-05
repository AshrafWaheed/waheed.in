'use client';

import { useEffect, useRef } from 'react';

const LINES = [
  '“Growth is not the goal.',
  'Growth with Barakah is —',
  'the one that never costs your integrity.”',
];

function QuoteLayer() {
  return (
    <>
      <blockquote className="m-quote">
        {LINES.map((line) => (
          <span key={line} className="m-line">{line}</span>
        ))}
      </blockquote>
      <p className="m-attr">— WAHEED</p>
    </>
  );
}

export default function Manifesto() {
  const bandRef   = useRef<HTMLElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const brightRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number | null>(null);
  const tRef      = useRef({ x: 0, y: 0 });
  const cRef      = useRef({ x: 0, y: 0 });

  // Entry: add .entered on scroll into view
  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { band.classList.add('entered'); obs.disconnect(); }
      },
      { threshold: 0.25 },
    );
    obs.observe(band);
    return () => obs.disconnect();
  }, []);

  // Cursor spotlight (desktop / pointer:fine only)
  useEffect(() => {
    const band   = bandRef.current;
    const stage  = stageRef.current;
    const bright = brightRef.current;
    const cursor = cursorRef.current;
    if (!band || !stage || !bright || !cursor) return;

    // Skip on touch / coarse pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    const b = band;
    const s = stage;
    const br = bright;
    const cur = cursor;

    function tick() {
      const t = tRef.current;
      const c = cRef.current;
      c.x = lerp(c.x, t.x, 0.12);
      c.y = lerp(c.y, t.y, 0.12);

      // Cursor dot position (absolute within band)
      const bR = b.getBoundingClientRect();
      cur.style.left = `${c.x - bR.left}px`;
      cur.style.top  = `${c.y - bR.top}px`;

      // Spotlight position as % of stage size
      const sR = s.getBoundingClientRect();
      const mx = ((c.x - sR.left) / sR.width)  * 100;
      const my = ((c.y - sR.top)  / sR.height) * 100;
      br.style.setProperty('--mx', `${mx}%`);
      br.style.setProperty('--my', `${my}%`);

      rafRef.current = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) { tRef.current = { x: e.clientX, y: e.clientY }; }
    function onEnter() { cur.style.opacity = '1'; }
    function onLeave() { cur.style.opacity = '0'; }

    // Init cursor at stage center
    const sR = s.getBoundingClientRect();
    tRef.current = cRef.current = {
      x: sR.left + sR.width  / 2,
      y: sR.top  + sR.height / 2,
    };

    band.addEventListener('mousemove', onMove);
    band.addEventListener('mouseenter', onEnter);
    band.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      band.removeEventListener('mousemove', onMove);
      band.removeEventListener('mouseenter', onEnter);
      band.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={bandRef} className="manifesto-band">

      {/* Spinning decorative medallion */}
      <svg
        className="manifesto-medallion"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <g stroke="#c9a227" strokeWidth=".5" fill="none">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" />
          <polygon points="100,30 170,65 170,135 100,170 30,135 30,65" />
          <circle cx="100" cy="100" r="68" />
          <circle cx="100" cy="100" r="42" />
          <circle cx="100" cy="100" r="22" />
          <g transform="translate(100 100)">
            <polygon
              points="0,-80 14,-30 64,-22 28,12 38,62 0,38 -38,62 -28,12 -64,-22 -14,-30"
              strokeWidth=".4"
            />
          </g>
        </g>
      </svg>

      <div className="cnt">
        <div ref={stageRef} className="manifesto-stage">

          {/* Dim layer: always visible, faint */}
          <div className="manifesto-layer m-dim">
            <QuoteLayer />
          </div>

          {/* Bright layer: same content, revealed only through the spotlight mask */}
          <div ref={brightRef} className="m-bright" aria-hidden="true">
            <QuoteLayer />
          </div>

        </div>
      </div>

      {/* Custom cursor glow dot */}
      <div ref={cursorRef} className="m-cursor" aria-hidden="true" />

      {/* Desktop hint */}
      <p className="m-hint" aria-hidden="true">move your cursor</p>

    </section>
  );
}
