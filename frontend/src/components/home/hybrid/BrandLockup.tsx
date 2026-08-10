'use client';

/**
 * BrandLockup — the pre-footer sign-off band from the Figma redesign.
 *
 * The giant "waheed" wordmark bleeding off the bottom, with the tagline threaded
 * across the middle so the wordmark's tall arcs rise into the gap between its two
 * halves: "The Long-Term" on the left, "Partner for Your Halal Brand" on the
 * right. Mounted on the homepage above the (unchanged) global footer.
 *
 * Motion: when the band scrolls into view the wordmark RISES up — as if lifting
 * out of the footer beneath it — while the two tagline halves slide in from the
 * left and right to meet over its shoulders. Staggered: tagline first, then the
 * wordmark's lift is the finale. Honours prefers-reduced-motion (fade only, no
 * travel). Variants propagate from the motion.section through motion children,
 * so the intermediate .lk-tagwrap is a motion.div to keep the chain intact.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { brandLockup } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BrandLockup() {
  const { pre, post } = brandLockup;
  const reduce = useReducedMotion();
  const dx = reduce ? 0 : 64;   // left/right travel for the tagline halves
  const dy = reduce ? 0 : 130;  // how far the wordmark lifts out of the footer

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
  };
  const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const fromLeft: Variants = {
    hidden: { opacity: 0, x: -dx },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
  };
  const fromRight: Variants = {
    hidden: { opacity: 0, x: dx },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: dy },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
  };

  return (
    <motion.section
      className="lk"
      data-section-color="dark"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.div className="cnt lk-tagwrap" variants={group}>
        <motion.span className="lk-tag lk-tag--pre" variants={fromLeft}>{pre}</motion.span>
        <motion.span className="lk-tag lk-tag--post" variants={fromRight}>{post}</motion.span>
      </motion.div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img className="lk-mark" src="/logo.png" alt="Waheed" variants={rise} />
    </motion.section>
  );
}
