'use client';

/**
 * HeroStudioWindow — "The Studio Window" hero for /home3.
 *
 * Replaces HeroBarakahCore, which was a diagram: a hairline gold mandala on
 * near-black, with all six labels printed on top of their own glyphs. Same
 * disease the Expertise section had before CraftArtifact — no mass, no light
 * panel, one grey texture.
 *
 * The mechanism here is Outcrowd's actual hero (see reference/outcrowd.io.md §7
 * §0): ONE anchor object plus satellite UI fragments at varying depth, all
 * parallaxing at different rates. Outcrowd anchors on a tilted laptop; we anchor
 * on the two founders, which is the trust play they don't need and WAHEED does.
 *
 * Depth layers, back to front:
 *   1. guilloche  — BarakahCore in `quiet` mode, geometry demoted to texture
 *   2. back card  — the woman, ivory panel
 *   3. front card — the man, gold-soft panel
 *   4. satellites — craft chips, fastest parallax, deliberately overlapping the
 *                   cards because that overlap is what sells the depth
 *
 * Both founder SVGs are pre-processed into /public/founders (baked-in yellow and
 * sage panels stripped, fixed width/height removed). The panels here are ours,
 * so they can be brand colours. Both figures bottom-align and break out of the
 * top of their panel — that overflow is intentional.
 *
 * Copy is verbatim from content/home.ts and must stay that way.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import BarakahCore from '@/components/graphics/BarakahCore';
import Khatam from '@/components/graphics/Khatam';
import SplitReveal from '@/components/motion/SplitReveal';
import ExplodeButton from '@/components/motion/ExplodeButton';
import { hero } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

/**
 * Satellite chips. `k` is the parallax depth multiplier — bigger = nearer the
 * viewer = travels further on pointer move. `d` staggers the entrance.
 *
 * NB: these carry craft names, not invented percentages. The chips inside
 * CraftArtifact use placeholder metrics ("+34% reply rate"), which is fine for a
 * decorative card mid-page but reads as a real claim at hero size. Drop actual
 * numbers in here once there are some.
 */
const SATS = [
  { id: 'growth', k: 2.2, d: 1.35 },
  { id: 'rank',   k: 2.9, d: 1.5 },
  { id: 'reach',  k: 1.9, d: 1.65 },
  { id: 'build',  k: 2.5, d: 1.78 },
  { id: 'seal',   k: 3.2, d: 1.9 },
] as const;

function Satellite({ id }: { id: (typeof SATS)[number]['id'] }) {
  if (id === 'growth') {
    return (
      <div className="sw-sat sw-sat--growth">
        <span className="sw-sat-lbl">Organic</span>
        <svg viewBox="0 0 118 44" fill="none" aria-hidden="true">
          <polyline className="sw-spark" points="4,38 25,31 46,33 67,20 88,14 114,5" />
          <circle className="sw-spark-dot" cx="114" cy="5" r="3" />
        </svg>
      </div>
    );
  }
  if (id === 'rank') {
    return (
      <div className="sw-sat sw-sat--rank">
        <span className="sw-rank-badge">1</span>
        <span className="sw-rank-txt">
          <b />
          <em />
        </span>
      </div>
    );
  }
  if (id === 'reach') {
    return (
      <div className="sw-sat sw-sat--reach">
        <span className="sw-avatars">
          <i /><i /><i /><i />
        </span>
        <span className="sw-sat-lbl">Community</span>
      </div>
    );
  }
  if (id === 'build') {
    return (
      <div className="sw-sat sw-sat--build">
        <span className="sw-chrome">
          <i /><i /><i />
        </span>
        <span className="sw-chrome-body">
          <b className="sw-chrome-hero" />
          <b className="w80" />
          <b className="w55" />
        </span>
      </div>
    );
  }
  return (
    <div className="sw-sat sw-sat--seal">
      <Khatam size={15} inner={0.5} stroke="var(--rd-night)" strokeWidth={1.6} />
      <span className="sw-sat-lbl">Ihsan</span>
    </div>
  );
}

export default function HeroStudioWindow() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  // Entrance runs on mount — the hero is above the fold, so there is nothing to
  // observe. rAF so the initial (pre-transition) state paints first.
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /**
   * Pointer parallax. One --px/--py pair on the stage; every layer multiplies it
   * by its own --k. Written straight to style (not React state) so it never
   * re-renders on mouse move. Skipped entirely on coarse pointers and under
   * reduced motion, where the CSS guard also zeroes the transform.
   */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -1..1 from the stage centre, clamped so a wide viewport can't fling it.
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      // Lerp toward the pointer so the cluster glides instead of snapping.
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty('--px', `${(cx * 7).toFixed(2)}px`);
      el.style.setProperty('--py', `${(cy * 7).toFixed(2)}px`);
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="sw-hero" data-section-color="dark">
      <div className="sw-hero-text">
        <motion.p className="hy-bismillah" lang="ar" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {hero.bismillah}
        </motion.p>
        <motion.p className="hy-eyebrow" custom={0.28} variants={fadeUp} initial="hidden" animate="visible">
          {hero.eyebrow}
        </motion.p>
        <h1 className="hy-hero-h1 sw-hero-h1">
          <SplitReveal text={hero.headline.lead} by="char" trigger="mount" delay={0.42} stagger={0.02} />{' '}
          <em>
            <SplitReveal text={hero.headline.em!} by="char" trigger="mount" delay={0.7} stagger={0.02} />
          </em>
        </h1>
        <motion.p className="hy-hero-sub sw-hero-sub" custom={1.15} variants={fadeUp} initial="hidden" animate="visible">
          {hero.sub}
        </motion.p>
        <motion.div className="hy-hero-ctas sw-hero-ctas" custom={1.3} variants={fadeUp} initial="hidden" animate="visible">
          <ExplodeButton href={hero.ctaPrimary.href} className="btn btn-gold">{hero.ctaPrimary.label}</ExplodeButton>
          <ExplodeButton href={hero.ctaSecondary.href} className="btn btn-outline-lt">{hero.ctaSecondary.label}</ExplodeButton>
        </motion.div>
      </div>

      <div className={`sw-stage${inView ? ' is-in' : ''}`} ref={stageRef}>
        {/* Layer 1 — the geometry, demoted from subject to texture. */}
        <div className="sw-glyph sw-lay" style={v({ '--k': 0.5 })} aria-hidden="true">
          <BarakahCore quiet />
        </div>

        {/* Layer 2 — back card. Ivory, because a niqab silhouette on teal is mush. */}
        <figure className="sw-card sw-card--back sw-lay" style={v({ '--k': 1, '--d': '.55s' })}>
          <img className="sw-card-fig" src="/founders/woman.svg" alt="" aria-hidden="true" />
        </figure>

        {/* Layer 3 — front card. Gold-soft, which the warm skin and jacket sing against. */}
        <figure className="sw-card sw-card--front sw-lay" style={v({ '--k': 1.5, '--d': '.72s' })}>
          <img className="sw-card-fig" src="/founders/man.svg" alt="" aria-hidden="true" />
        </figure>

        {/* Layer 4 — satellites, overlapping the cards on purpose. */}
        {SATS.map((s) => (
          <div key={s.id} className={`sw-satwrap sw-lay sw-sat-${s.id}`} style={v({ '--k': s.k, '--d': `${s.d}s` })}>
            <Satellite id={s.id} />
          </div>
        ))}

        <figcaption className="sw-caption">
          <Khatam size={11} inner={0.5} stroke="var(--rd-gold-line)" strokeWidth={1.5} />
          The founders
        </figcaption>
      </div>
    </section>
  );
}
