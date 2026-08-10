'use client';

/**
 * BrandLockup — the pre-footer sign-off band from the Figma redesign.
 *
 * The giant "waheed" wordmark bleeding off the bottom, with the tagline threaded
 * across the middle so the wordmark's tall arcs rise into the gap between its two
 * halves: "The Long-Term" on the left, "Partner for Your Halal Brand" on the
 * right. Mounted on the homepage above the (unchanged) global footer.
 *
 * Motion: SCROLL-SCRUBBED. A single `progress` MotionValue (0→1 as the band
 * scrolls from "just entering at the viewport bottom" to "fully in view") drives
 * the wordmark's lift out of the footer and the two tagline halves sliding in
 * from left and right. Scroll up and it reverses.
 *
 * Why not Framer's useScroll: this page runs Lenis smooth-scroll, which is
 * bridged to GSAP's ScrollTrigger — NOT to Framer — so Framer's scroll listener
 * never advances and the scrub would freeze at 0 (wordmark invisible). Instead we
 * compute progress from getBoundingClientRect inside a rAF loop that an
 * IntersectionObserver only runs while the band is near the viewport. That reads
 * the real rendered position, so it stays correct whether Lenis or native scroll
 * is moving the page.
 *
 * Honours prefers-reduced-motion: progress is pinned to 1 (settled layout, no
 * coupling). Centring lives on the .lk-mark auto margins so Framer owns the
 * transform for the lift.
 */
import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { brandLockup } from '@/content/home';

export default function BrandLockup() {
  const { pre, post } = brandLockup;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);

  const markY = useTransform(progress, [0, 0.9], [140, 0]);
  const markOpacity = useTransform(progress, [0, 0.55], [0, 1]);
  const leftX = useTransform(progress, [0.12, 0.78], [-64, 0]);
  const rightX = useTransform(progress, [0.12, 0.78], [64, 0]);
  const tagOpacity = useTransform(progress, [0.08, 0.55], [0, 1]);

  useEffect(() => {
    if (reduce) { progress.set(1); return; }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let running = false;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const ih = window.innerHeight || 1;
      // 0 when the band's top is at the viewport bottom (just entering);
      // 1 when its bottom reaches the viewport bottom (fully in view).
      const p = Math.min(1, Math.max(0, (ih - r.top) / (r.height || 1)));
      progress.set(p);
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
          measure(); // settle to the final (clamped) value on the way out
        }
      },
      { rootMargin: '200px 0px 200px 0px' },
    );
    io.observe(el);
    measure(); // set the correct starting value before first paint of scroll

    return () => { io.disconnect(); cancelAnimationFrame(raf); running = false; };
  }, [reduce, progress]);

  return (
    <section ref={ref} className="lk" data-section-color="dark">
      <div className="cnt lk-tagwrap">
        <motion.span className="lk-tag lk-tag--pre" style={{ x: leftX, opacity: tagOpacity }}>{pre}</motion.span>
        <motion.span className="lk-tag lk-tag--post" style={{ x: rightX, opacity: tagOpacity }}>{post}</motion.span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img className="lk-mark" src="/logo.png" alt="Waheed" style={{ y: markY, opacity: markOpacity }} />
    </section>
  );
}
