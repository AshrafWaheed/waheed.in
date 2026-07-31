'use client';

/**
 * BarakahCurrent — the soft counterpart to GirihEngine.
 *
 * The engine is the brand's *hard* mark: rings, spokes, dial ticks, straight
 * star edges. That reads beautifully at the edge of a composition and terribly
 * behind body text — every straight segment that crosses a word reads as a
 * strikethrough, and the eye keeps trying to resolve the letterform against the
 * line. So the engine moves to the margin, and this takes over the field behind
 * the words: long, slow, undulating filaments with no straight edge and no
 * corner anywhere in them.
 *
 * Two mechanisms keep it from ever competing with the copy:
 *
 * 1. THE HOLE. Filaments that cross the text band (`band="text"`) are stroked
 *    with a gradient that goes gold → transparent → gold across the width, so
 *    each one dissolves in the middle third — exactly where centred copy sits —
 *    and reappears in the outer margins. The filament still reads as one
 *    continuous current because your eye completes the curve; it just has no
 *    ink where a letter is.
 * 2. THE DRIFT IS TRANSFORM-ONLY. Each filament sits in its own <g> that
 *    translates and rotates on its own clock. Paths never re-render, so the
 *    layer rasterizes once and the browser just moves it — this sits behind a
 *    pinned GSAP scrub on the homepage and must not cost a rasterization per
 *    frame. That also rules out an SVG blur filter, which would re-run on every
 *    animated frame; the softness comes from the stroke gradients instead.
 *
 * Durations are deliberately coprime-ish (37/43/53/47/61/41/59s) so the whole
 * field never resettles into the same arrangement twice in any watchable span —
 * the thing that makes a looping background read as a loop is all the layers
 * coming home together.
 *
 * Paths run from x=-160 to x=1600 in a 1440-wide viewBox: the ±30px drift can
 * never pull an endpoint into frame.
 */

const GOLD = 'var(--rd-gold-line, #4f93d6)';

type Band = 'text' | 'free';

interface Filament {
  d: string;
  band: Band;
  /** Peak stroke opacity, before the gradient's own falloff. */
  o: number;
  w: number;
  /** Drift animation: seconds, and the keyframe name suffix. */
  dur: number;
  flow: 1 | 2 | 3;
}

/* y-baselines: three above the copy, two through it, three below. The two
   `text` filaments are the only ones that need the hole. */
const FILAMENTS: Filament[] = [
  { d: 'M -160 118 C 140 38, 430 152, 720 94 S 1250 26, 1600 106',   band: 'free', o: 0.30, w: 1.1, dur: 37, flow: 1 },
  { d: 'M -160 212 C 180 128, 392 254, 704 188 S 1262 118, 1600 206', band: 'free', o: 0.22, w: 1.4, dur: 53, flow: 2 },
  { d: 'M -160 304 C 206 216, 468 334, 762 266 S 1284 206, 1600 294', band: 'free', o: 0.14, w: 0.9, dur: 43, flow: 3 },
  { d: 'M -160 472 C 224 378, 486 524, 782 438 S 1302 366, 1600 464', band: 'text', o: 0.34, w: 1.5, dur: 61, flow: 2 },
  { d: 'M -160 578 C 202 498, 504 634, 802 550 S 1292 486, 1600 580', band: 'text', o: 0.24, w: 1.1, dur: 47, flow: 1 },
  { d: 'M -160 716 C 184 638, 474 762, 772 690 S 1304 628, 1600 722', band: 'free', o: 0.16, w: 0.9, dur: 59, flow: 3 },
  { d: 'M -160 828 C 222 748, 462 872, 782 798 S 1312 738, 1600 830', band: 'free', o: 0.26, w: 1.3, dur: 41, flow: 2 },
];

/* Drifting motes — the current has to look like it is carrying something, or
   it is just wallpaper. Kept out of the middle third for the same reason as
   the hole. */
const MOTES = [
  { cx: 118, cy: 166, r: 2.2, dur: 29, flow: 1 },
  { cx: 372, cy: 268, r: 1.5, dur: 44, flow: 3 },
  { cx: 1108, cy: 132, r: 1.8, dur: 36, flow: 2 },
  { cx: 1286, cy: 302, r: 2.4, dur: 51, flow: 1 },
  { cx: 236, cy: 742, r: 1.9, dur: 39, flow: 2 },
  { cx: 1042, cy: 808, r: 2.1, dur: 46, flow: 3 },
  { cx: 1330, cy: 676, r: 1.4, dur: 33, flow: 1 },
];

export interface BarakahCurrentProps {
  className?: string;
}

export default function BarakahCurrent({ className }: BarakahCurrentProps) {
  return (
    <svg
      className={`bcur-svg${className ? ` ${className}` : ''}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="none"
      aria-hidden="true"
    >
      <defs>
        {/* Ends only. Nothing terminates in a visible stub. */}
        <linearGradient id="bc-free" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
          <stop offset="0" stopColor={GOLD} stopOpacity="0" />
          <stop offset="0.16" stopColor={GOLD} stopOpacity="1" />
          <stop offset="0.84" stopColor={GOLD} stopOpacity="1" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>

        {/* Ends AND the middle third — the copy's column. The 0.34→0.66 window
            is sized to the widest centred measure on either page that uses
            this (the homepage quote's 22ch), with margin. */}
        <linearGradient id="bc-text" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
          <stop offset="0" stopColor={GOLD} stopOpacity="0" />
          <stop offset="0.13" stopColor={GOLD} stopOpacity="1" />
          <stop offset="0.26" stopColor={GOLD} stopOpacity="1" />
          <stop offset="0.36" stopColor={GOLD} stopOpacity="0" />
          <stop offset="0.64" stopColor={GOLD} stopOpacity="0" />
          <stop offset="0.74" stopColor={GOLD} stopOpacity="1" />
          <stop offset="0.87" stopColor={GOLD} stopOpacity="1" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
      </defs>

      {FILAMENTS.map((f, i) => (
        <g key={i} className={`bcur-drift bcur-flow${f.flow}`} style={{ animationDuration: `${f.dur}s` }}>
          <path
            d={f.d}
            stroke={`url(#bc-${f.band})`}
            strokeWidth={f.w}
            strokeLinecap="round"
            opacity={f.o}
          />
        </g>
      ))}

      <g fill={GOLD} stroke="none">
        {MOTES.map((m, i) => (
          <g key={i} className={`bcur-drift bcur-flow${m.flow}`} style={{ animationDuration: `${m.dur}s` }}>
            <circle cx={m.cx} cy={m.cy} r={m.r} className="bcur-mote" style={{ animationDelay: `${i * 1.7}s` }} />
          </g>
        ))}
      </g>
    </svg>
  );
}
