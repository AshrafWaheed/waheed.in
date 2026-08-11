'use client';

/**
 * useScrollProgress — a 0→1 MotionValue tracking an element through the viewport,
 * for SCROLL-SCRUBBED reveals (the animation advances with scroll position and
 * reverses on scroll-up), not fire-once entrances.
 *
 * Progress is 0 when the element's top sits at `startVh` of the viewport height
 * (entering from the bottom) and 1 when it reaches `endVh` (settled higher up),
 * clamped outside that band.
 *
 * Why not Framer's useScroll: this site runs Lenis smooth-scroll bridged to GSAP
 * (not Framer), so Framer's scroll listener never advances. Instead we read the
 * element's getBoundingClientRect every frame inside a rAF loop that an
 * IntersectionObserver only runs while the element is near the viewport — that
 * reads the real rendered position regardless of who moves the page. Same
 * technique as BrandLockup. Reduced-motion pins progress to 1 (fully revealed).
 */
import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import type { RefObject } from 'react';

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { startVh = 0.9, endVh = 0.45 }: { startVh?: number; endVh?: number } = {},
): MotionValue<number> {
  const progress = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { progress.set(1); return; }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    const span = Math.max(0.01, startVh - endVh);

    const measure = () => {
      const r = el.getBoundingClientRect();
      const ih = window.innerHeight || 1;
      const p = (startVh * ih - r.top) / (span * ih);
      progress.set(Math.min(1, Math.max(0, p)));
    };
    const loop = () => { measure(); if (running) raf = requestAnimationFrame(loop); };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
          measure(); // settle at the clamped edge value on the way out
        }
      },
      { rootMargin: '300px 0px 300px 0px' },
    );
    io.observe(el);
    measure();

    return () => { io.disconnect(); cancelAnimationFrame(raf); running = false; };
  }, [ref, progress, startVh, endVh, reduce]);

  return progress;
}
