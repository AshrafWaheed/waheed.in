'use client';

/**
 * CompoundCurve — rented attention against owned attention, over 24 months.
 *
 * The /services/seo hero sits on top of this, and it is the page's argument in
 * one drawing: a paid line that is flat while the money runs and gone the month
 * it stops, against an organic line that starts slower, crosses it, and is still
 * climbing at month 24.
 *
 * The shape is generated rather than hand-drawn so the two claims stay honest
 * — organic is `m^1.9`, a genuine compounding curve, not a hockey stick drawn
 * to flatter. It crosses paid at month ~11, which is roughly when it does.
 *
 * No axis numbers. Putting figures on this would be inventing a case study;
 * the shape is the claim, and the shape is defensible.
 *
 * `preserveAspectRatio="none"` lets it stretch across a full-bleed hero — which
 * also stretches strokes, hence `vector-effect="non-scaling-stroke"` on every
 * one of them. Nothing round is drawn here for the same reason: a circle under
 * a non-uniform scale is an ellipse.
 */

const W = 1200;
const H = 340;
const X0 = 40;
const X1 = W - 40;
const BASE = H - 42;      // the zero line
const MONTHS = 24;
/** Month the ad budget is switched off. */
const STOP = 17;

const x = (m: number) => X0 + (m / MONTHS) * (X1 - X0);

/** Paid: level while it runs, then back to where it started. */
function paidY(m: number): number {
  const level = BASE - 88;
  if (m <= STOP) return level;
  const t = Math.min(1, (m - STOP) / 2.2);
  return level + t * 88;
}

/** Organic: compounding. Slow, then not. */
function organicY(m: number): number {
  return BASE - Math.pow(m / MONTHS, 1.9) * (BASE - 34);
}

function path(f: (m: number) => number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 96; i++) {
    const m = (i / 96) * MONTHS;
    pts.push(`${x(m).toFixed(1)},${f(m).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

export default function CompoundCurve({ className }: { className?: string }) {
  const organic = path(organicY);
  const paid = path(paidY);

  return (
    <svg
      className={`cc ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="cc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--rd-gold-line)" stopOpacity=".26" />
          <stop offset="1" stopColor="var(--rd-gold-line)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Faint month grid — enough to read this as a chart, not a squiggle. */}
      <g stroke="var(--rd-ivory)" strokeOpacity=".07" strokeWidth="1">
        {[0, 6, 12, 18, 24].map((m) => (
          <line key={m} x1={x(m)} y1="18" x2={x(m)} y2={BASE} vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={X0} y1={BASE} x2={X1} y2={BASE} strokeOpacity=".16" vectorEffect="non-scaling-stroke" />
      </g>

      {/* The moment the budget stops. */}
      <line
        className="cc-stop"
        x1={x(STOP)} y1="18" x2={x(STOP)} y2={BASE}
        stroke="var(--rd-ivory)" strokeOpacity=".3" strokeWidth="1" strokeDasharray="3 5"
        vectorEffect="non-scaling-stroke"
      />

      <path className="cc-area" d={`${organic} L ${X1},${BASE} L ${X0},${BASE} Z`} fill="url(#cc-fill)" />

      <path
        className="cc-line cc-paid"
        d={paid}
        stroke="var(--rd-ivory)" strokeOpacity=".42" strokeWidth="1.6" vectorEffect="non-scaling-stroke"
        strokeLinecap="round" strokeDasharray="1400" strokeDashoffset="1400"
      />
      <path
        className="cc-line cc-organic"
        d={organic}
        stroke="var(--rd-gold-bloom)" strokeWidth="2.2" vectorEffect="non-scaling-stroke"
        strokeLinecap="round" strokeDasharray="1500" strokeDashoffset="1500"
      />

    </svg>
  );
}
