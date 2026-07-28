'use client';

/**
 * HeroSignalBoard — "Signal Board" hero for `/`. Direction B.
 *
 * The literal read of Outcrowd's hero (reference/outcrowd.io.md §7 §0): centred
 * pill eyebrow → big headline → CTAs → a collage of 6–8 floating UI fragments at
 * varying depths around ONE tilted anchor object. Outcrowd anchors on a laptop;
 * this anchors on a tilted growth console.
 *
 * Deliberately the opposite trade to /home3's HeroStudioWindow: there the
 * founders ARE the anchor, here they are demoted to a single pill in the caption
 * row. B is more faithful to the reference and less differentiated — it competes
 * on the same ground as every other agency hero. That contrast is the point of
 * building both.
 *
 * Layout note: this hero is intentionally taller than one viewport. Outcrowd's
 * runs 2520px (~2.8 viewports) — the text block owns the fold and the collage
 * rewards the first scroll. Copy is verbatim from content/home.ts.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Khatam from '@/components/graphics/Khatam';
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

/** Fragments: `k` = parallax depth (bigger = nearer), `d` = entrance stagger. */
const FRAGS = [
  { id: 'traffic',   k: 2.4, d: 0.30 },
  { id: 'organic',   k: 3.0, d: 0.42 },
  { id: 'copydoc',   k: 2.0, d: 0.54 },
  { id: 'serp',      k: 2.7, d: 0.36 },
  { id: 'creative',  k: 3.3, d: 0.48 },
  { id: 'community', k: 2.2, d: 0.60 },
] as const;

/* ── the anchor: a tilted growth console ─────────────────────────────────────
   Carries no invented metrics. The curve and the bars are shapes; the only text
   is generic analytics vocabulary ("Organic", "Direct", "Referral"), which are
   category names rather than claims. Swap in real figures when there are some. */
function Console() {
  const bars = [34, 52, 44, 68, 58, 82, 71, 92];
  return (
    <div className="sb-console">
      <div className="sb-console-bar">
        <span className="sb-dots"><i /><i /><i /></span>
        <span className="sb-console-title">Growth</span>
      </div>
      <div className="sb-console-body">
        <aside className="sb-rail">
          <b />
          <span /><span /><span /><span />
        </aside>
        <div className="sb-console-main">
          <div className="sb-panel">
          <div className="sb-legend">
            <span className="sb-key is-gold">Organic</span>
            <span className="sb-key is-teal">Direct</span>
            <span className="sb-key is-dim">Referral</span>
          </div>
          <div className="sb-area">
            <svg viewBox="0 0 320 120" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sbFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#254851" stopOpacity=".26" />
                  <stop offset="100%" stopColor="#254851" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="sb-area-fill" d="M0 96 L46 84 L92 88 L138 62 L184 52 L230 34 L276 26 L320 10 L320 120 L0 120 Z" fill="url(#sbFill)" />
              <polyline className="sb-area-line" points="0,96 46,84 92,88 138,62 184,52 230,34 276,26 320,10" />
            </svg>
          </div>
          </div>
          <div className="sb-bars">
            {bars.map((h, i) => (
              <span key={i} style={v({ '--h': `${h}%`, '--d': `${0.9 + i * 0.06}s` })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Fragment({ id }: { id: (typeof FRAGS)[number]['id'] }) {
  switch (id) {
    case 'traffic':
      return (
        <div className="sb-frag sb-frag--traffic">
          <span className="sb-frag-lbl">Sessions</span>
          <div className="sb-minibars">
            {[40, 62, 50, 78, 66, 90].map((h, i) => (
              <span key={i} style={v({ '--h': `${h}%`, '--d': `${1.1 + i * 0.07}s` })} />
            ))}
          </div>
        </div>
      );
    case 'organic':
      return (
        <div className="sb-frag sb-frag--organic">
          <span className="sb-frag-lbl">Organic</span>
          <svg viewBox="0 0 112 40" fill="none" aria-hidden="true">
            <polyline className="sb-spark" points="4,34 24,28 44,30 64,18 84,12 108,4" />
            <circle className="sb-spark-dot" cx="108" cy="4" r="3" />
          </svg>
        </div>
      );
    case 'copydoc':
      return (
        <div className="sb-frag sb-frag--copydoc">
          <span className="sb-doc-eyebrow">Landing page</span>
          <b className="sb-doc-h" />
          <b className="w88" />
          <b className="w66" />
          <span className="sb-doc-cta">Book a call</span>
        </div>
      );
    case 'serp':
      return (
        <div className="sb-frag sb-frag--serp">
          <span className="sb-rank">1</span>
          <span className="sb-rank-txt">
            <b />
            <em />
          </span>
        </div>
      );
    case 'creative':
      return (
        <div className="sb-frag sb-frag--creative">
          <span className="sb-ad-tag">Creative</span>
          <span className="sb-ad-bar" />
          <span className="sb-ad-bar w58" />
        </div>
      );
    default:
      return (
        <div className="sb-frag sb-frag--community">
          <span className="sb-avatars">
            <i /><i /><i /><i />
          </span>
          <span className="sb-frag-lbl">Community</span>
        </div>
      );
  }
}

export default function HeroSignalBoard() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Same depth primitive as /home3's HeroStudioWindow: one --px/--py on the
  // stage, each layer scales it by its own --k. Written to style directly so
  // pointer movement never triggers a React render.
  useEffect(() => {
    const el = stageRef.current;
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
      el.style.setProperty('--px', `${(cx * 8).toFixed(2)}px`);
      el.style.setProperty('--py', `${(cy * 8).toFixed(2)}px`);
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="sb-hero" data-section-color="dark">
      <div className="sb-inner">
        <motion.p className="hy-bismillah" lang="ar" custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
          {hero.bismillah}
        </motion.p>

        {/* Outcrowd's eyebrow is a bordered pill, not loose text. */}
        <motion.p className="sb-pill" custom={0.28} variants={fadeUp} initial="hidden" animate="visible">
          {hero.eyebrow}
        </motion.p>

        <h1 className="hy-hero-h1 sb-h1">
          <SplitReveal text={hero.headline.lead} by="word" trigger="mount" delay={0.42} stagger={0.05} />{' '}
          <em>
            <SplitReveal text={hero.headline.em!} by="word" trigger="mount" delay={0.72} stagger={0.05} />
          </em>
        </h1>

        <motion.p className="hy-hero-sub sb-sub" custom={1.15} variants={fadeUp} initial="hidden" animate="visible">
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

      <div className={`sb-stage${inView ? ' is-in' : ''}`} ref={stageRef}>
        <div className="sb-anchor sb-lay" style={v({ '--k': 1, '--d': '.18s' })}>
          <div className="sb-tilt">
            <Console />
          </div>
        </div>

        {FRAGS.map((f) => (
          <div key={f.id} className={`sb-fragwrap sb-lay sb-at-${f.id}`} style={v({ '--k': f.k, '--d': `${f.d}s` })}>
            <Fragment id={f.id} />
          </div>
        ))}

        {/* The founders, demoted — the whole premise of B. */}
        <div className="sb-footrow">
          <Link href="/story" className="sb-founders" data-cursor>
            <span className="sb-face sb-face--woman"><img src="/founders/woman.svg" alt="" aria-hidden="true" /></span>
            <span className="sb-face sb-face--man"><img src="/founders/man.svg" alt="" aria-hidden="true" /></span>
            Meet the founders
          </Link>
          <span className="sb-seal">
            <Khatam size={13} inner={0.5} stroke="var(--rd-night)" strokeWidth={1.6} />
            Ihsan
          </span>
        </div>
      </div>
    </section>
  );
}
