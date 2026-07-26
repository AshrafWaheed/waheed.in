'use client';

/**
 * Single registration point for GSAP + ScrollTrigger. Import { gsap, ScrollTrigger }
 * from here in any client component so the plugin is only registered once and only
 * in the browser. The Lenis↔ScrollTrigger bridge lives in SmoothScroll.tsx.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// registerPlugin is idempotent, so a plain browser guard is enough.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
