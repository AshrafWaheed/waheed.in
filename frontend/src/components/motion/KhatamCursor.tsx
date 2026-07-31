'use client';

/**
 * Custom khatam cursor. A gold 8-point star that trails the pointer (lerped),
 * spins slowly (CSS), grows over interactive elements, and becomes a thin caret
 * over text inputs. Desktop / fine-pointer only; disabled under reduced-motion.
 * Renders nothing on touch devices, so it's safe to mount globally on a variant.
 */
import { useEffect, useRef } from 'react';
import Khatam from '../graphics/Khatam';

export default function KhatamCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;
    document.body.classList.add('khatam-active');

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = '1';
      const t = e.target as Element | null;
      const field = t?.closest('input, textarea, select');
      const hot = t?.closest('a, button, [data-cursor], [role="button"]');
      el.classList.toggle('is-text', !!field);
      el.classList.toggle('is-hover', !!hot && !field);
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };
    const tick = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      document.body.classList.remove('khatam-active');
    };
  }, []);

  return (
    <div ref={ref} className="khatam-cursor" aria-hidden="true" style={{ opacity: 0 }}>
      <span className="khatam-cursor-star">
        <Khatam size={30} inner={0.55} stroke="var(--rd-gold-line, #4f93d6)" strokeWidth={1.4} />
      </span>
      <span className="khatam-cursor-dot" />
    </div>
  );
}
