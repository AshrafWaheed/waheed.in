'use client';

/**
 * Lenis smooth-scroll provider, bridged to the GSAP ticker so ScrollTrigger stays
 * in perfect sync (the exact glue Wahda & Outcrowd use). Mount ONCE near the top of
 * a variant page and wrap the page content so descendants can `useLenis()`.
 *
 * Honors prefers-reduced-motion: when set, Lenis is skipped entirely and the page
 * falls back to native scroll (ScrollTrigger then drives off native scroll).
 * Because Lenis moves the real window scroll, existing native scroll listeners
 * (Nav, ScrollProgress) keep working unchanged.
 *
 * The instance is shared via a stable ref (no setState → no cascading renders):
 *   const lenis = useLenis();  lenis?.current?.scrollTo(0);
 */
import { createContext, useContext, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);
export const useLenis = () => useContext(LenisContext);

export interface SmoothScrollProps {
  children?: React.ReactNode;
  /** Lenis interpolation factor (lower = smoother/slower catch-up). */
  lerp?: number;
  wheelMultiplier?: number;
}

export default function SmoothScroll({
  children,
  lerp = 0.1,
  wheelMultiplier = 0.9,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh();
      return;
    }

    const l = new Lenis({ lerp, wheelMultiplier, smoothWheel: true });
    lenisRef.current = l;

    l.on('scroll', ScrollTrigger.update);
    const onTick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onTick);
      l.destroy();
      lenisRef.current = null;
    };
  }, [lerp, wheelMultiplier]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
