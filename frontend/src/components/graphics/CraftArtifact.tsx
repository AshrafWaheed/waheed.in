'use client';

/**
 * CraftArtifact — seven miniature *interfaces* for the Expertise bento (/home3).
 *
 * Deliberately NOT diagrams. That was CraftDash's problem: seven hairline
 * schematics in one gold tone read as a single grey texture. Each artifact here
 * is a small, recognisable product surface — a browser, a dashboard, a search
 * results page, a post grid — built from real DOM elements so it has mass, crisp
 * text and depth.
 *
 * Contrast comes from mixing light (ivory) and dark (night) panels inside the
 * same dark card, NOT from introducing new hues: the palette stays teal / gold /
 * ivory. That is the trick the reference site uses — a white screenshot sitting
 * on a near-black card is what makes the bento pop.
 *
 * `live` is flipped by the section's IntersectionObserver so nothing animates
 * off-screen. Every animation is switched off under prefers-reduced-motion by
 * the `.xa` guards in globals.css.
 */
import { useEffect, useRef, useState } from 'react';
import Khatam from './Khatam';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

/** Count 0 → target once, when the card first becomes live. */
function useCountUp(live: boolean, target: number, dur = 900) {
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!live || done.current) return;
    done.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const frame = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [live, target, dur]);
  return n;
}

/** Cycle an index every `ms` while live (used by the rotating labels/decks). */
function useCycle(live: boolean, length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!live || length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((p) => (p + 1) % length), ms);
    return () => clearInterval(t);
  }, [live, length, ms]);
  return i;
}

/* ── 01 · Web & App Development ─────────────────────────────────────────────
   A light browser window assembling itself, with a dark phone alongside. */
function WebApp() {
  return (
    <div className="xa xa-web">
      <div className="xa-browser">
        <div className="xa-chrome">
          <span /><span /><span />
          <div className="xa-url">waheed.in</div>
        </div>
        <div className="xa-viewport">
          <div className="xa-blk xa-hero" style={v({ '--d': '0s' })} />
          <div className="xa-ln w75" style={v({ '--d': '.14s' })} />
          <div className="xa-ln w52" style={v({ '--d': '.22s' })} />
          <div className="xa-tiles">
            <div className="xa-blk xa-tile" style={v({ '--d': '.34s' })} />
            <div className="xa-blk xa-tile" style={v({ '--d': '.42s' })} />
          </div>
          <div className="xa-cta" style={v({ '--d': '.56s' })}>Apply</div>
        </div>
      </div>

      <div className="xa-phone">
        <span className="xa-phone-notch" />
        <div className="xa-phone-scr">
          <div className="xa-pblk" style={v({ '--d': '.7s' })} />
          <div className="xa-pln w80" style={v({ '--d': '.78s' })} />
          <div className="xa-pln w58" style={v({ '--d': '.84s' })} />
          <div className="xa-pcta" style={v({ '--d': '.94s' })} />
        </div>
      </div>

      <span className="xa-cursor" aria-hidden="true" />
    </div>
  );
}

/* ── 02 · Custom Software Development ───────────────────────────────────────
   A dark ops dashboard: sidebar rail, two KPI tiles, a bar series that redraws. */
function Software({ live }: { live: boolean }) {
  const hours = useCountUp(live, 146, 1100);
  const bars = [38, 64, 46, 79, 55, 90, 68];
  return (
    <div className="xa xa-soft">
      <div className="xa-dash">
        <div className="xa-rail">
          <b /><span /><span /><span />
        </div>
        <div className="xa-dash-body">
          <div className="xa-kpis">
            <div className="xa-kpi">
              <em>{hours}</em>
              <span>hours saved / mo</span>
            </div>
            <div className="xa-kpi is-alt">
              <em>3.2×</em>
              <span>faster ops</span>
            </div>
          </div>
          <div className="xa-bars">
            {bars.map((h, i) => (
              <span key={i} style={v({ '--h': `${h}%`, '--d': `${i * 0.08}s` })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · Brand Strategy ────────────────────────────────────────────────────
   The girih survivor: a khatam positioning ring whose three arcs take turns. */
function BrandStrategy({ live }: { live: boolean }) {
  const labels = ['Positioning', 'Narrative', 'Identity'];
  const active = useCycle(live, 3, 2300);
  const R = 42;
  const C = 2 * Math.PI * R;
  const seg = C / 3 - 6;

  return (
    <div className="xa xa-brand">
      <div className="xa-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="xa-ring-track" cx="60" cy="60" r={R} />
          {labels.map((_, i) => (
            <circle
              key={i}
              className={`xa-arc${active === i ? ' is-on' : ''}`}
              cx="60"
              cy="60"
              r={R}
              strokeDasharray={`${seg.toFixed(2)} ${(C - seg).toFixed(2)}`}
              strokeDashoffset={(-(C / 3) * i).toFixed(2)}
            />
          ))}
        </svg>
        <span className="xa-ring-core">
          <Khatam size={17} inner={0.5} stroke="var(--rd-gold-bloom)" strokeWidth={1.5} />
          <em>{labels[active]}</em>
        </span>
      </div>
      <div className="xa-ring-legend">
        {labels.map((l, i) => (
          <span key={l} className={`xa-ring-lbl${active === i ? ' is-on' : ''}`}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 04 · SEO ───────────────────────────────────────────────────────────────
   A light SERP where the third result climbs to #1, plus a dark growth card. */
function Seo() {
  return (
    <div className="xa xa-seo">
      {/* Stage sizes to the SERP so the growth callout can anchor to its
          corner instead of drifting somewhere in the card. */}
      <div className="xa-seo-stage">
        <div className="xa-serp">
        <div className="xa-search">
          <i className="xa-mag" />
          <span>halal brand studio</span>
        </div>
          <div className="xa-results">
            <div className="xa-res r0"><i /><b /><em /></div>
            <div className="xa-res r1"><i /><b /><em /></div>
            <div className="xa-res is-target">
              <span className="xa-rank">1</span>
              <div className="xa-res-txt">
                <b />
                <em />
              </div>
            </div>
          </div>
        </div>

        <div className="xa-growth">
          <span className="xa-growth-lbl">Organic</span>
          <svg viewBox="0 0 120 52" fill="none" aria-hidden="true">
            <polyline className="xa-spark" points="4,46 26,38 48,40 70,24 92,18 116,6" />
            <circle className="xa-spark-dot" cx="116" cy="6" r="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── 05 · Social Media Marketing ────────────────────────────────────────────
   A content shelf of post tiles with engagement counters ticking up. */
function Social({ live }: { live: boolean }) {
  const reach = useCountUp(live, 128, 1200);
  const tiles = [
    { tone: 'lt', ratio: 'tall' },
    { tone: 'dk', ratio: 'wide' },
    { tone: 'gold', ratio: 'tall' },
    { tone: 'dk', ratio: 'tall' },
    { tone: 'lt', ratio: 'wide' },
  ];
  return (
    <div className="xa xa-social">
      <div className="xa-shelf">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`xa-post t-${t.tone} r-${t.ratio}`}
            style={v({ '--d': `${i * 0.09}s` })}
          >
            <span className="xa-post-bar" />
            <span className="xa-post-bar w60" />
          </div>
        ))}
      </div>
      <div className="xa-meta">
        <div className="xa-avatars">
          <i /><i /><i /><i />
        </div>
        <span className="xa-reach">
          <em>{reach}K</em> reached
        </span>
        <span className="xa-chip is-quiet">Community, then sales</span>
      </div>
    </div>
  );
}

/* ── 06 · Conversion Copywriting ────────────────────────────────────────────
   A light copy block whose headline rewrites itself. */
function Copywriting({ live }: { live: boolean }) {
  const lines = ['Words that close.', 'Curious → convinced.', 'Convinced → customer.'];
  const idx = useCycle(live, lines.length, 2600);
  return (
    <div className="xa xa-copy">
      <div className="xa-doc">
        <span className="xa-doc-eyebrow">Landing page</span>
        <h4 key={idx} className="xa-doc-h">
          {lines[idx]}
        </h4>
        <div className="xa-dln w88" />
        <div className="xa-dln w70" />
        <div className="xa-dln w76" />
        <div className="xa-doc-cta">Book a call</div>
      </div>
      <span className="xa-chip is-float">+34% reply rate</span>
    </div>
  );
}

/* ── 07 · Ad Creatives ──────────────────────────────────────────────────────
   A deck of ad frames that cycles front-to-back. */
function AdCreatives() {
  return (
    <div className="xa xa-ads">
      <div className="xa-deck">
        <div className="xa-ad a0">
          <span className="xa-ad-tag">Static</span>
          <span className="xa-ad-bar" />
          <span className="xa-ad-bar w52" />
        </div>
        <div className="xa-ad a1">
          <span className="xa-ad-tag">Motion</span>
          <span className="xa-ad-bar" />
          <span className="xa-ad-bar w64" />
        </div>
        <div className="xa-ad a2">
          <span className="xa-ad-tag">Copy</span>
          <span className="xa-ad-bar" />
          <span className="xa-ad-bar w44" />
        </div>
        {/* Inside the deck so it rides with it, rather than pinning itself to
            the corner of the card and reading as a stray label. */}
        <span className="xa-chip is-float">CTR 4.8%</span>
      </div>
    </div>
  );
}

export interface CraftArtifactProps {
  i: number;
  live?: boolean;
}

export default function CraftArtifact({ i, live = false }: CraftArtifactProps) {
  switch (i) {
    case 0:  return <WebApp />;
    case 1:  return <Software live={live} />;
    case 2:  return <BrandStrategy live={live} />;
    case 3:  return <Seo />;
    case 4:  return <Social live={live} />;
    case 5:  return <Copywriting live={live} />;
    default: return <AdCreatives />;
  }
}
