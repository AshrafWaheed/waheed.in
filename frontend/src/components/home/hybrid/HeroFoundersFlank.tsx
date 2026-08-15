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
import StackButton from '@/components/ui/StackButton';
import { hero, clients } from '@/content/home';

/**
 * The centre copy's entrance used to be framer-motion (`initial="hidden"`,
 * opacity:0). Because framer bakes that initial state into the SERVER HTML, the
 * hero text shipped invisible and could not paint until the JS bundle loaded and
 * hydrated this (heavy) page — which pinned LCP to Time-to-Interactive (~8s on
 * throttled mobile; the sub-copy is the measured LCP element). The reveal is now
 * a pure-CSS load animation (`.rd-rise` / `.rd-rise-fade` in globals.css) that
 * runs from stylesheet-apply time (~FCP), independent of the JS bundle, with the
 * stagger delays passed as `--rd`. The rise is transform-only (never opacity), so
 * the copy is painted at the first frame and LCP no longer waits on JS at all.
 */
type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;


/**
 * The sub-headline, with the phrases in `hero.subUnderline` wrapped in a gold
 * rule. Split on the phrases (kept as delimiters) so the sentence stays one
 * string in content and the decoration can never drift from the words.
 */
function SubCopy({ text, phrases }: { text: string; phrases: readonly string[] }) {
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return (
    <>
      {text.split(re).map((part, i) =>
        phrases.includes(part) ? (
          <span key={i} className="ff-uline">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

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
  const invRef = useRef<HTMLSpanElement | null>(null);
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

      // The torch. Written straight to the "invisible" word in its own local
      // coordinates every move (no rAF, no spring): the light has to sit
      // exactly under the cursor or the reveal lags behind the pointer and the
      // illusion breaks. Cheap — two custom-property writes on one small span.
      const inv = invRef.current;
      if (inv) {
        const ir = inv.getBoundingClientRect();
        inv.style.setProperty('--lx', `${e.clientX - ir.left}px`);
        inv.style.setProperty('--ly', `${e.clientY - ir.top}px`);
      }
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
      {/* The three-column stage. Its own wrapper now, so the trust marquee can
          be a full-bleed sibling below it rather than a grid cell fighting the
          centre track. */}
      <div className="ff-stage">
        {/* ── left flank: the woman, sitting low on ivory ─────────────────── */}
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

        {/* ── centre: the copy ────────────────────────────────────────────────
            Entrance is CSS (`.rd-rise` = transform-only rise; `.rd-rise-fade` =
            fade only, used on the pill so its optical-centering translateX is not
            clobbered by the rise's transform, and because it is not the LCP node).
            `--rd` staggers them; see the note by the imports for why this is CSS
            and not framer-motion, and why the rise never touches opacity. */}
        <div className="ff-text">
          <p className="hy-bismillah rd-rise" lang="ar" style={v({ '--rd': '.05s' })}>
            {hero.bismillah}
          </p>

          <p className="ff-pill rd-rise-fade" style={v({ '--rd': '.12s' })}>
            {hero.eyebrow}
          </p>

          <h1 className="hy-hero-h1 ff-h1">
            <span className="ff-h1-lead rd-rise" style={v({ '--rd': '.2s' })}>
              {hero.headline.lead}
            </span>
            <span className="ff-h1-turn rd-rise" style={v({ '--rd': '.3s' })}>
              {/* The word is present for a screen reader (in the base layer) and
                  faint for a mouse user until the cursor-torch crosses it. The
                  glow layer is an aria-hidden duplicate so the word is announced
                  once, not twice. */}
              <span className="ff-invisible" ref={invRef}>
                <span className="ff-invisible-base">{hero.headline.hidden}</span>
                <span className="ff-invisible-glow" aria-hidden="true">{hero.headline.hidden}</span>
              </span>
              <span className="ff-h1-arrow" aria-hidden="true">
                <svg viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8 H34 M27 2 L35.5 8 L27 14" />
                </svg>
              </span>
              <em className="ff-trusted">{hero.headline.em}</em>.
            </span>
          </h1>

          <p className="hy-hero-sub ff-sub rd-rise" style={v({ '--rd': '.42s' })}>
            <SubCopy text={hero.sub} phrases={hero.subUnderline} />
          </p>

          <div className="hy-hero-ctas rd-rise" style={v({ '--rd': '.55s' })}>
            {/* Single CTA, per the redesign. The three-plate button is NOT
                wrapped in Magnetic — its face stays put and only the plates
                behind it track the cursor. */}
            <StackButton href={hero.ctaPrimary.href} size="lg">{hero.ctaPrimary.label}</StackButton>
          </div>
        </div>

        {/* ── right flank: the man, riding high on gold-soft ──────────────── */}
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
      </div>

      {/* ── trust note + logo marquee ─────────────────────────────────────── */}
      <p className="ff-trust-note">
        {hero.trustedBy}
        <svg className="ff-trust-arrow" viewBox="0 0 48 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4 C 20 6, 34 14, 40 34" />
          <path d="M31 28 L40 35 L44 25" />
        </svg>
      </p>

      {/* A static row (no scroll): the real client marks centred — tinted to one
          ink silhouette (CSS mask) so a mixed-palette set reads as one wall on
          the white band — flanked by two "you could be here" invitation slots. */}
      <div className="ff-marquee">
        <div className="ff-logos">
          <span className="ff-slot" aria-hidden="true">You could<br />be here</span>
          {clients.map((c) => (
            <span
              key={c.name} className="ff-logo" role="img" aria-label={c.name}
              style={v({ '--logo': `url(${c.src})`, '--ar': c.ar })}
            />
          ))}
          <span className="ff-slot" aria-hidden="true">You could<br />be here</span>
        </div>
      </div>
    </section>
  );
}
