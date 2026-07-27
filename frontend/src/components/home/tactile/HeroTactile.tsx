'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import GirihEngine from '@/components/graphics/GirihEngine';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import { hero } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

// Tactile hero — no scroll pin. The engine idles + drifts toward the cursor
// (parallax), the headline reveals per-character, and both CTAs are explode +
// magnetic. Cursor-alive, Outcrowd-style.
export default function HeroTactile() {
  const engineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 44;
      ty = (e.clientY / window.innerHeight - 0.5) * 44;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (engineRef.current) engineRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="hy-hero tc-hero" data-section-color="dark">
      <div className="cn-hero-engine">
        <div ref={engineRef} className="cn-hero-engine-inner">
          <GirihEngine draw="mount" spin />
        </div>
      </div>

      <div className="hy-hero-inner">
        <motion.p className="hy-bismillah" lang="ar" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {hero.bismillah}
        </motion.p>
        <motion.p className="hy-eyebrow" custom={0.28} variants={fadeUp} initial="hidden" animate="visible">
          {hero.eyebrow}
        </motion.p>
        <h1 className="hy-hero-h1">
          <SplitReveal text={hero.headline.lead} by="char" trigger="mount" delay={0.42} stagger={0.02} />{' '}
          <em>
            <SplitReveal text={hero.headline.em!} by="char" trigger="mount" delay={0.7} stagger={0.02} />
          </em>
        </h1>
        <motion.p className="hy-hero-sub" custom={1.15} variants={fadeUp} initial="hidden" animate="visible">
          {hero.sub}
        </motion.p>
        <motion.div className="hy-hero-ctas" custom={1.3} variants={fadeUp} initial="hidden" animate="visible">
          <ExplodeButton href={hero.ctaPrimary.href} className="btn btn-gold">{hero.ctaPrimary.label}</ExplodeButton>
          <ExplodeButton href={hero.ctaSecondary.href} className="btn btn-outline-lt">{hero.ctaSecondary.label}</ExplodeButton>
        </motion.div>
      </div>

      <motion.div className="hy-scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 1 }} aria-hidden="true">
        <span className="hy-scroll-line" />
      </motion.div>
    </section>
  );
}
