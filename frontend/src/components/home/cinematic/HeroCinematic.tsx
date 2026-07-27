'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { gsap } from '@/components/motion/gsap';
import GirihEngine from '@/components/graphics/GirihEngine';
import SplitReveal from '@/components/motion/SplitReveal';
import { hero } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

// Cinematic hero — content reveals on load, then a long pinned scrub flies you
// THROUGH the engine (dramatic zoom) as the copy parallaxes out. No tactile hover.
export default function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=200%', pin: true, scrub: 0.8 },
      });
      tl.to(engineRef.current, { scale: 2.7, rotate: 45, ease: 'none' }, 0);
      tl.to(innerRef.current, { y: -130, opacity: 0, ease: 'none' }, 0.12);
      tl.to(engineRef.current, { opacity: 0, ease: 'none' }, 0.6);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hy-hero cn-hero" data-section-color="dark">
      <div className="cn-hero-engine">
        <div ref={engineRef} className="cn-hero-engine-inner">
          <GirihEngine draw="mount" spin />
        </div>
      </div>

      <div ref={innerRef} className="hy-hero-inner">
        <motion.p className="hy-bismillah" lang="ar" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {hero.bismillah}
        </motion.p>
        <motion.p className="hy-eyebrow" custom={0.28} variants={fadeUp} initial="hidden" animate="visible">
          {hero.eyebrow}
        </motion.p>
        <h1 className="hy-hero-h1">
          <SplitReveal text={hero.headline.lead} by="word" trigger="mount" delay={0.42} stagger={0.05} />{' '}
          <em>
            <SplitReveal text={hero.headline.em!} by="word" trigger="mount" delay={0.72} stagger={0.05} />
          </em>
        </h1>
        <motion.p className="hy-hero-sub" custom={1.15} variants={fadeUp} initial="hidden" animate="visible">
          {hero.sub}
        </motion.p>
        <motion.div className="hy-hero-ctas" custom={1.3} variants={fadeUp} initial="hidden" animate="visible">
          <Link href={hero.ctaPrimary.href} className="btn btn-gold" data-cursor>{hero.ctaPrimary.label}</Link>
          <Link href={hero.ctaSecondary.href} className="btn btn-outline-lt" data-cursor>{hero.ctaSecondary.label}</Link>
        </motion.div>
      </div>

      <motion.div className="hy-scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 1 }} aria-hidden="true">
        <span className="hy-scroll-line" />
      </motion.div>
    </section>
  );
}
