'use client';

/**
 * HeroFoundersFlank — the hero for `/`, and now the only one.
 *
 * It was Direction C: the reconciliation of A (HeroStudioWindow — the founders
 * ARE the anchor) and B (HeroSignalBoard — centred copy over a collage). Both
 * of those are gone, deleted with the /home2 and /home3 variant routes, so the
 * comparison below is history rather than a pointer to live code. It is kept
 * because it records WHY this hero is shaped the way it is; git has the two
 * alternatives if anyone needs to see them.
 *
 * B's problem was purely one of axis. It stacked the collage BELOW the copy, so
 * the hero measured 1593px — 1.77 viewports at 1440x900, against /home3's 1.01.
 * None of the parts were wrong; they were arranged vertically, which costs
 * height twice. So the collage moves sideways: founder | copy | founder, with
 * the chart fragments tucked into the flanks against the founder cards. Same
 * elements, one viewport.
 *
 * Deliberately NOT mirrored. A symmetric founder|text|founder pair reads
 * heraldic, and the two SVGs cannot mirror anyway — measured ink inside the
 * shared 150-unit viewBox is 114x146 for the man and 143x197 for the woman, who
 * overflows her own box. So the two cards carry different vertical offsets,
 * tilts and their own --fig-w/--fig-b, and the chips funnel INWARD toward the
 * headline rather than balancing out to the outer edges.
 *
 * B's tilted <Console> does not survive here — it cannot read at flank width.
 * Its ivory analytics panel is promoted to a standalone chip (ChipGrowth) and
 * its gold bar row is dropped, being a duplicate of ChipTraffic's minibars.
 *
 * Copy is verbatim from content/home.ts.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SplitReveal from '@/components/motion/SplitReveal';
import Magnetic from '@/components/motion/Magnetic';
import { hero } from '@/content/home';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

/* ── flank chips ─────────────────────────────────────────────────────────────
   Four, one per clause of the sub copy — grow the audience, build the tech,
   sharpen the brand — plus the analytics panel that carries the growth curve.
   As on /home3 they carry category names, never invented percentages: at hero
   scale a fake "+34%" reads as a claim rather than as decoration. */

function ChipTraffic() {
  return (
    <div className="ff-chip ff-chip--traffic">
      <span className="ff-chip-lbl">Sessions</span>
      <div className="ff-minibars">
        {[40, 62, 50, 78, 66, 90].map((h, i) => (
          <span key={i} style={v({ '--h': `${h}%`, '--d': `${1.35 + i * 0.07}s` })} />
        ))}
      </div>
    </div>
  );
}

function ChipCopydoc() {
  return (
    <div className="ff-chip ff-chip--copydoc">
      <span className="ff-doc-eyebrow">Landing page</span>
      <b className="ff-doc-h" />
      <b className="w88" />
      <b className="w66" />
      <span className="ff-doc-cta">Book a call</span>
    </div>
  );
}

/** The old <Console>'s ivory panel, cut loose and stood on its own. */
function ChipGrowth() {
  return (
    <div className="ff-chip ff-chip--growth">
      <div className="ff-legend">
        <span className="ff-key is-gold">Organic</span>
        <span className="ff-key is-teal">Direct</span>
        <span className="ff-key is-dim">Referral</span>
      </div>
      <div className="ff-area">
        <svg viewBox="0 0 320 120" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ffFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#254851" stopOpacity=".26" />
              <stop offset="100%" stopColor="#254851" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="ff-area-fill" d="M0 96 L46 84 L92 88 L138 62 L184 52 L230 34 L276 26 L320 10 L320 120 L0 120 Z" fill="url(#ffFill)" />
          <polyline className="ff-area-line" points="0,96 46,84 92,88 138,62 184,52 230,34 276,26 320,10" />
        </svg>
      </div>
    </div>
  );
}

function ChipSerp() {
  return (
    <div className="ff-chip ff-chip--serp">
      <span className="ff-rank">1</span>
      <span className="ff-rank-txt">
        <b />
        <em />
      </span>
    </div>
  );
}

export default function HeroFoundersFlank() {
  const secRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  // Above the fold, so there is nothing to observe — run on mount. rAF so the
  // pre-transition state paints first.
  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /**
   * Pointer parallax, same primitive as A and B — but the origin is now the
   * whole <section>, because the two flanks are separate grid children and both
   * need to read the same --px/--py. Custom properties inherit, so one write on
   * the section drives every .ff-lay in both columns.
   *
   * Written straight to style rather than through React state so pointer
   * movement never re-renders. Skipped on coarse pointers and under reduced
   * motion, where the CSS guard also zeroes the transform.
   */
  useEffect(() => {
    const el = secRef.current;
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
    <section
      ref={secRef}
      className={`ff-hero${inView ? ' is-in' : ''}`}
      data-section-color="dark"
    >
      {/* ── left flank: the woman, sitting low on ivory ───────────────────── */}
      <div className="ff-flank ff-flank--l">
        <Link
          href="/about"
          className="ff-card ff-card--woman ff-lay"
          style={v({ '--k': 1, '--d': '.5s' })}
          aria-label="Meet the founders"
          data-cursor
        >
          <img className="ff-fig" src="/founders/woman.svg" alt="" aria-hidden="true" />
        </Link>
        <div className="ff-chip-at ff-at--traffic ff-lay" style={v({ '--k': 2.5, '--d': '1.12s' })}>
          <ChipTraffic />
        </div>
        <div className="ff-chip-at ff-at--copydoc ff-lay" style={v({ '--k': 3.0, '--d': '1.34s' })}>
          <ChipCopydoc />
        </div>
      </div>

      {/* ── centre: the copy, untouched ───────────────────────────────────── */}
      <div className="ff-text">
        <motion.p className="hy-bismillah" lang="ar" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {hero.bismillah}
        </motion.p>

        <motion.p className="ff-pill" custom={0.28} variants={fadeUp} initial="hidden" animate="visible">
          {hero.eyebrow}
        </motion.p>

        <h1 className="hy-hero-h1 ff-h1">
          <SplitReveal text={hero.headline.lead} by="word" trigger="mount" delay={0.42} stagger={0.05} />{' '}
          <em>
            <SplitReveal text={hero.headline.em!} by="word" trigger="mount" delay={0.72} stagger={0.05} />
          </em>
        </h1>

        <motion.p className="hy-hero-sub ff-sub" custom={1.15} variants={fadeUp} initial="hidden" animate="visible">
          {hero.sub}
        </motion.p>

        <motion.div className="hy-hero-ctas" custom={1.3} variants={fadeUp} initial="hidden" animate="visible">
          <Magnetic strength={0.4}>
            <Link href={hero.ctaPrimary.href} className="btn btn-gold" data-cursor>{hero.ctaPrimary.label}</Link>
          </Magnetic>
          <Magnetic strength={0.4}>
            <Link href={hero.ctaSecondary.href} className="btn btn-outline-lt" data-cursor>{hero.ctaSecondary.label}</Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* ── right flank: the man, riding high on gold-soft ────────────────── */}
      <div className="ff-flank ff-flank--r">
        <Link
          href="/about"
          className="ff-card ff-card--man ff-lay"
          style={v({ '--k': 1.3, '--d': '.66s' })}
          aria-label="Our story"
          data-cursor
        >
          <img className="ff-fig" src="/founders/man.svg" alt="" aria-hidden="true" />
        </Link>
        <div className="ff-chip-at ff-at--growth ff-lay" style={v({ '--k': 2.2, '--d': '1.2s' })}>
          <ChipGrowth />
        </div>
        <div className="ff-chip-at ff-at--serp ff-lay" style={v({ '--k': 3.2, '--d': '1.44s' })}>
          <ChipSerp />
        </div>
      </div>
    </section>
  );
}
