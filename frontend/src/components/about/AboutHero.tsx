'use client';

/**
 * AboutHero — §1 of the rebuilt /about.
 *
 * The old hero was a flat teal band with a centred h1 and nothing else: no
 * depth, no motion, 300px of dead colour. This replaces it with the homepage's
 * vocabulary — Barakah Engine behind, gold pill eyebrow, per-character headline
 * reveal — but deliberately NOT at homepage scale.
 *
 * Two ways it stays subordinate to `/`:
 *  1. Left-aligned, not centred. `/` centres its h1 over a symmetric collage;
 *     an inner page that copies that reads like a second homepage.
 *  2. No 100vh. The homepage hero earns a full viewport because it is the whole
 *     first impression; here the reader arrived wanting the story, so the hero
 *     is ~58vh and the narrative starts above the fold on a laptop.
 *
 * Copy is verbatim from content/about.ts.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import useParallaxOrigin from '@/components/motion/useParallaxOrigin';
import GirihEngine from '@/components/graphics/GirihEngine';
import Khatam from '@/components/graphics/Khatam';
import { aboutHero } from '@/content/about';

// The hero copy enters via CSS (`.rd-rise*` in globals.css) rather than
// framer-motion initial="hidden", which baked opacity:0 into the SSR HTML and so
// held the copy off-screen until hydration (LCP tax on mobile). The h1 keeps its
// SplitReveal but with fade={false} so the characters are painted at the first
// frame. Only the decorative rule (aria-hidden) still uses framer.
const EASE = [0.22, 1, 0.36, 1] as const;

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function AboutHero() {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  // Above the fold, so nothing to observe — rAF so the pre-transition state paints.
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Depth: the engine and the spark ride the pointer at different --k. See the
  // hook for why this never touches React state.
  useParallaxOrigin(secRef, 9);

  return (
    <section
      ref={secRef}
      className={`ab-hero${inView ? ' is-in' : ''}`}
      data-section-color="dark"
    >
      <div className="ab-hero-engine ab-lay" style={v({ '--k': 1 })} aria-hidden="true">
        <GirihEngine draw="mount" spin />
      </div>
      <span className="ab-hero-spark ab-lay" style={v({ '--k': 3.2 })} aria-hidden="true">
        <Khatam size={26} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.2} />
      </span>

      <div className="cnt ab-hero-inner">
        <p className="ab-pill rd-rise-fade" style={v({ '--rd': '.12s' })}>
          {aboutHero.eyebrow}
        </p>

        <h1 className="ab-hero-h1">
          <SplitReveal text={aboutHero.headline.lead} by="char" trigger="mount" delay={0.3} stagger={0.022} fade={false} />{' '}
          <em>
            <SplitReveal text={aboutHero.headline.em!} by="char" trigger="mount" delay={0.62} stagger={0.022} fade={false} />
          </em>
        </h1>

        <motion.span
          className="ab-hero-rule"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 1.05 }}
        />
      </div>

      <span className="ab-scroll-cue" aria-hidden="true">
        <span className="hy-scroll-line" />
      </span>
    </section>
  );
}
