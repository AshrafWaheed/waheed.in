'use client';

/**
 * DiagnosisPlate — three drawings for the sticky column on /services/brand-strategy.
 *
 * The section pins this plate and scrolls three symptoms past it; `state` is the
 * index of whichever symptom is currently level with the viewport, and the plate
 * cross-fades to match. That is the whole reason it is one component with three
 * groups rather than three components: cross-fading between siblings inside one
 * SVG keeps the frame, the stroke weight and the optical centre identical, so
 * the change reads as the SAME diagram being re-drawn rather than as three
 * unrelated pictures being swapped.
 *
 * All three are line-only, in the accent, at one stroke weight — the same
 * restraint the rest of the site's geometry uses.
 */

const W = 460;
const H = 360;

export interface DiagnosisPlateProps {
  /** 0 = sameness, 1 = price, 2 = wrong buyer. */
  state: number;
  className?: string;
}

export default function DiagnosisPlate({ state, className }: DiagnosisPlateProps) {
  return (
    <svg
      className={`dp ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* ── 0 · Everyone looks the same ──────────────────────────────────────
          Twelve identical cards. Nothing is highlighted, and the absence of a
          highlight is the drawing's argument. */}
      <g className={`dp-plate${state === 0 ? ' is-on' : ''}`}>
        {Array.from({ length: 12 }, (_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 46 + col * 96;
          const y = 62 + row * 84;
          return (
            <g key={i} className="dp-card" style={{ animationDelay: `${i * 0.045}s` }}>
              <rect x={x} y={y} width="74" height="62" rx="8"
                stroke="var(--rd-gold-line)" strokeOpacity=".3" strokeWidth="1" />
              <line x1={x + 12} y1={y + 22} x2={x + 50} y2={y + 22}
                stroke="var(--rd-gold-line)" strokeOpacity=".26" strokeWidth="3" strokeLinecap="round" />
              <line x1={x + 12} y1={y + 36} x2={x + 62} y2={y + 36}
                stroke="var(--rd-gold-line)" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
              <line x1={x + 12} y1={y + 46} x2={x + 40} y2={y + 46}
                stroke="var(--rd-gold-line)" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* ── 1 · The only lever left is price ─────────────────────────────────
          A descending stair. The axis stays put; only the line falls. */}
      <g className={`dp-plate${state === 1 ? ' is-on' : ''}`}>
        <line x1="52" y1="46" x2="52" y2="300" stroke="var(--rd-gold-line)" strokeOpacity=".28" strokeWidth="1" />
        <line x1="52" y1="300" x2="416" y2="300" stroke="var(--rd-gold-line)" strokeOpacity=".28" strokeWidth="1" />
        {[86, 152, 218, 284, 350].map((x, i) => (
          <rect key={x} className="dp-bar" x={x} y={300 - (150 - i * 27)} width="42"
            height={150 - i * 27} rx="4"
            stroke="var(--rd-gold-line)" strokeOpacity={i === 4 ? '.75' : '.34'} strokeWidth="1"
            style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
        <path className="dp-fall" d="M 107 138 L 173 165 L 239 192 L 305 219 L 371 246"
          stroke="var(--rd-gold-bloom)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="300" strokeDashoffset="300" />
        {[[107, 138], [173, 165], [239, 192], [305, 219], [371, 246]].map(([cx, cy], i) => (
          <circle key={i} className="dp-dot" cx={cx} cy={cy} r="3.2" fill="var(--rd-gold-bloom)"
            style={{ animationDelay: `${0.5 + i * 0.1}s` }} />
        ))}
      </g>

      {/* ── 2 · The wrong buyer arrives ──────────────────────────────────────
          Five approach; four glance off the target and one lands. */}
      <g className={`dp-plate${state === 2 ? ' is-on' : ''}`}>
        {[120, 160, 200].map((r, i) => (
          <circle key={r} cx="300" cy="180" r={r}
            stroke="var(--rd-gold-line)" strokeOpacity={0.3 - i * 0.08} strokeWidth="1" />
        ))}
        <circle cx="300" cy="180" r="58" stroke="var(--rd-gold-line)" strokeOpacity=".55" strokeWidth="1" />
        {/* Four that deflect. */}
        {[
          'M 20 58 C 130 92, 196 118, 232 168 C 248 200, 214 240, 150 250',
          'M 12 176 C 120 176, 180 176, 226 190 C 262 202, 250 262, 176 300',
          'M 24 300 C 130 268, 190 240, 228 206 C 254 182, 214 132, 150 112',
          'M 30 128 C 132 132, 190 148, 228 178 C 258 202, 236 250, 178 274',
        ].map((d, i) => (
          <path key={i} className="dp-miss" d={d}
            stroke="var(--rd-ivory)" strokeOpacity=".22" strokeWidth="1" strokeLinecap="round"
            strokeDasharray="420" strokeDashoffset="420"
            style={{ animationDelay: `${i * 0.14}s` }} />
        ))}
        {/* The one that lands. */}
        <path className="dp-hit" d="M 16 232 C 132 226, 214 208, 300 180"
          stroke="var(--rd-gold-bloom)" strokeWidth="1.8" strokeLinecap="round"
          strokeDasharray="320" strokeDashoffset="320" />
        <circle className="dp-dot" cx="300" cy="180" r="5" fill="var(--rd-gold-bloom)"
          style={{ animationDelay: '1.1s' }} />
      </g>
    </svg>
  );
}
