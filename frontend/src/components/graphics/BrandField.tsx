'use client';

/**
 * BrandField — the crowded market, and the one mark that resolves out of it.
 *
 * This is the /services/brand-strategy hero backdrop, and it is the page's whole
 * argument in one object: forty marks that look the same, and one that does not.
 * It replaces the CraftArtifact the other service heroes use, because a brand
 * page opening on a product screenshot would be arguing against itself.
 *
 * The jitter is HASHED, not random. A `Math.random()` here would place the marks
 * differently on the server and on the client and React would blow the hydration
 * — so `n()` is a cheap deterministic hash of the index, giving the same
 * scattered-but-not-gridded field on both sides.
 *
 * Everything animates via CSS on `.bf-*` (globals.css) so `prefers-reduced-motion`
 * can switch it off with the existing `!important` guards rather than a JS branch.
 */

const COLS = 8;
const ROWS = 5;
/** The crowd slot nearest dead centre. Skipped, so nothing sits on the mark. */
const HERO = 2 * COLS + 3;

/** Deterministic ±1 from an integer. Same value on server and client. */
function n(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** An 8-point girih star as a polygon point list — the site's own mark. */
function star(cx: number, cy: number, r: number, inner = 0.5, rot = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 ? r * inner : r;
    const a = (Math.PI / 8) * i + rot;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function BrandField({ className }: { className?: string }) {
  const W = 1200;
  const H = 620;
  const gx = W / (COLS + 1);
  const gy = H / (ROWS + 1);

  const marks = Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    return {
      i,
      x: gx * (col + 1) + n(i, 1) * gx * 0.3,
      y: gy * (row + 1) + n(i, 2) * gy * 0.3,
      r: 13 + n(i, 3) * 3,
      rot: n(i, 4) * 0.4,
    };
  });

  /**
   * The resolving mark is placed explicitly rather than taken from a grid slot,
   * because it has to be dead centre and — more importantly — big enough to
   * FRAME the copy block rather than sit inside it. At the crowd's scale it read
   * as an object colliding with the sub-heading; at this scale the star and its
   * two rings are concentric geometry the headline stands inside.
   */
  const hero = { x: W / 2, y: H * 0.46 };

  return (
    <svg
      className={`bf ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="bf-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--rd-gold-line)" stopOpacity=".38" />
          <stop offset="1" stopColor="var(--rd-gold-line)" stopOpacity="0" />
        </radialGradient>
        {/* Fades the field out at the edges so it never fights the headline. */}
        <radialGradient id="bf-vig" cx="50%" cy="50%" r="62%">
          <stop offset=".58" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="bf-mask">
          <rect width={W} height={H} fill="url(#bf-vig)" />
        </mask>
      </defs>

      <g mask="url(#bf-mask)">
        {/* The crowd. Identical stroke, identical weight — that IS the point. */}
        <g fill="none" stroke="var(--rd-ivory)" strokeWidth="1" strokeLinejoin="round">
          {marks.map((m) =>
            m.i === HERO ? null : (
              <polygon
                key={m.i}
                className="bf-mark"
                points={star(m.x, m.y, m.r, 0.5, m.rot)}
                style={{ animationDelay: `${(m.i % 13) * 0.06 + 0.2}s` }}
              />
            ),
          )}
        </g>

        {/* The one that resolves — concentric, and large enough that the copy
            stands inside it. Only ONE star: a second, smaller one landed in the
            middle of the sub-heading and read as debris rather than as detail. */}
        <g className="bf-hero">
          <circle cx={hero.x} cy={hero.y} r="470" fill="url(#bf-halo)" className="bf-halo" />
          {/* Two stars at one radius, offset by half a point, is how the site's
              Khatam is constructed — and at this scale a single 8-point star
              read as a lone badge outline rather than as the brand's geometry. */}
          <polygon
            className="bf-hero-mark"
            points={star(hero.x, hero.y, 252, 0.74)}
            fill="none" stroke="var(--rd-gold-bloom)" strokeOpacity=".5"
            strokeWidth="1.3" strokeLinejoin="round"
          />
          <polygon
            className="bf-hero-mark bf-hero-mark--in"
            points={star(hero.x, hero.y, 252, 0.74, Math.PI / 8)}
            fill="none" stroke="var(--rd-gold-bloom)" strokeOpacity=".32"
            strokeWidth="1.1" strokeLinejoin="round"
          />
          <circle
            className="bf-ring"
            cx={hero.x} cy={hero.y} r="300"
            fill="none" stroke="var(--rd-gold-line)" strokeWidth="1"
            strokeDasharray="1885" strokeDashoffset="1885"
          />
          <circle
            className="bf-ring bf-ring--2"
            cx={hero.x} cy={hero.y} r="362"
            fill="none" stroke="var(--rd-gold-line)" strokeOpacity=".55" strokeWidth="1"
            strokeDasharray="2275" strokeDashoffset="2275"
          />
        </g>
      </g>
    </svg>
  );
}
