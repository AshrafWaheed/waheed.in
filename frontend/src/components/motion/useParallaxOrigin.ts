'use client';

/**
 * useParallaxOrigin — the depth primitive the homepage heroes use, extracted so
 * more than one section can share it.
 *
 * Point it at a container. It writes ONE `--px`/`--py` pair to that element's
 * inline style as the pointer moves; because custom properties inherit, every
 * descendant that carries the `.ab-lay` / `.ff-lay` / `.sb-lay` transform picks
 * the pair up and multiplies it by its own `--k` to sit at a different depth.
 *
 * Two things here are load-bearing:
 *  - The value is written straight to `style`, never through React state, so
 *    pointer movement never triggers a re-render.
 *  - Layers must apply it via `transform`, which means their entrance animation
 *    has to use `translate` instead — otherwise the two fight over one property.
 *
 * Skipped entirely for coarse pointers and reduced motion; the CSS guards zero
 * the transform in those cases, so there is no JS branch to desync from SSR.
 */
import { useEffect } from 'react';
import type { RefObject } from 'react';

export default function useParallaxOrigin(
  ref: RefObject<HTMLElement | null>,
  /** Peak travel in px at the edge of the container, before each layer's --k. */
  amplitude = 8,
  /** Per-frame catch-up toward the pointer; lower = heavier. */
  lerp = 0.08,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * lerp;
      cy += (ty - cy) * lerp;
      el.style.setProperty('--px', `${(cx * amplitude).toFixed(2)}px`);
      el.style.setProperty('--py', `${(cy * amplitude).toFixed(2)}px`);
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, amplitude, lerp]);
}
