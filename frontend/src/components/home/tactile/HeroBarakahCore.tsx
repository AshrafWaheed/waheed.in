'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import BarakahCore from '@/components/graphics/BarakahCore';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import { hero } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

// Barakah-Core hero: 55% verbatim WAHEED copy (left) + 45% living Barakah engine
// (right). Tactile — char-reveal headline, explode + magnetic CTAs.
export default function HeroBarakahCore() {
  return (
    <section className="bc-hero" data-section-color="dark">
      <div className="bc-hero-text">
        <motion.p className="hy-bismillah" lang="ar" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {hero.bismillah}
        </motion.p>
        <motion.p className="hy-eyebrow" custom={0.28} variants={fadeUp} initial="hidden" animate="visible">
          {hero.eyebrow}
        </motion.p>
        <h1 className="hy-hero-h1 bc-hero-h1">
          <SplitReveal text={hero.headline.lead} by="char" trigger="mount" delay={0.42} stagger={0.02} />{' '}
          <em>
            <SplitReveal text={hero.headline.em!} by="char" trigger="mount" delay={0.7} stagger={0.02} />
          </em>
        </h1>
        <motion.p className="hy-hero-sub bc-hero-sub" custom={1.15} variants={fadeUp} initial="hidden" animate="visible">
          {hero.sub}
        </motion.p>
        <motion.div className="hy-hero-ctas" custom={1.3} variants={fadeUp} initial="hidden" animate="visible">
          <ExplodeButton href={hero.ctaPrimary.href} className="btn btn-gold">{hero.ctaPrimary.label}</ExplodeButton>
          <ExplodeButton href={hero.ctaSecondary.href} className="btn btn-outline-lt">{hero.ctaSecondary.label}</ExplodeButton>
        </motion.div>
      </div>

      <div className="bc-hero-engine">
        <BarakahCore />
      </div>
    </section>
  );
}
