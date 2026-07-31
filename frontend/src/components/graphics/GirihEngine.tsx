'use client';

/**
 * The "Barakah Engine" — a self-drawing 8-fold sacred-geometry rosette that reads
 * as both Islamic girih and a technical HUD instrument. Concentric rings + dial
 * ticks + two interlaced 8-point khatam stars + radial spokes + pulsing nodes.
 *
 * Layers draw themselves on view/mount (DrawPath), then rotate slowly in opposite
 * directions for depth. Gold filament on a dark canvas. Reused across all variants.
 */
import { DrawPath } from '../motion/StrokeDraw';

const C = 200; // centre of the 400×400 viewBox

// Round computed coords to 2dp so SSR and client stringify identically
// (raw floats differ in the last digit → React hydration mismatch).
const r2 = (v: number) => Math.round(v * 100) / 100;

function circlePath(r: number): string {
  return `M ${C - r} ${C} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
}
function starPath(points: number, R: number, innerRatio: number): string {
  const r = R * innerRatio;
  const v: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / points) * i - Math.PI / 2;
    v.push(`${(C + rad * Math.cos(a)).toFixed(1)},${(C + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M${v.join(' L')} Z`;
}
function radial(n: number, rInner: number, rOuter: number, offset = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI / n) * i - Math.PI / 2 + offset;
    return {
      x1: r2(C + rInner * Math.cos(a)), y1: r2(C + rInner * Math.sin(a)),
      x2: r2(C + rOuter * Math.cos(a)), y2: r2(C + rOuter * Math.sin(a)),
    };
  });
}
function ring(n: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI / n) * i - Math.PI / 2;
    return { cx: r2(C + r * Math.cos(a)), cy: r2(C + r * Math.sin(a)) };
  });
}

export interface GirihEngineProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
  /** Reveal the stroke draw on mount vs when scrolled into view. */
  draw?: 'mount' | 'inView';
  /** Continuous slow rotation of the geometry layers. */
  spin?: boolean;
}

export default function GirihEngine({
  size = '100%',
  className,
  style,
  stroke = 'var(--rd-gold-line, #4f93d6)',
  draw = 'mount',
  spin = true,
}: GirihEngineProps) {
  const spinA = spin ? { animation: 'rd-spin 70s linear infinite' } : undefined;
  const spinB = spin ? { animation: 'rd-spin 48s linear infinite reverse' } : undefined;
  const origin: React.CSSProperties = { transformBox: 'view-box', transformOrigin: '200px 200px' };

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* concentric rings */}
      <DrawPath d={circlePath(190)} strokeWidth={0.9} opacity={0.5} duration={2.4} trigger={draw} />
      <DrawPath d={circlePath(150)} strokeWidth={0.7} opacity={0.32} duration={2.2} delay={0.15} trigger={draw} />
      <DrawPath d={circlePath(96)} strokeWidth={0.7} opacity={0.4} duration={2.0} delay={0.3} trigger={draw} />
      <DrawPath d={circlePath(52)} strokeWidth={0.7} opacity={0.5} duration={1.8} delay={0.45} trigger={draw} />

      {/* dial ticks around the rim */}
      <g opacity={0.3} strokeWidth={0.8}>
        {radial(48, 178, 190).map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>

      {/* radial spokes — faint HUD grid, slow spin */}
      <g style={{ ...origin, ...spinA, opacity: 0.14 }} strokeWidth={0.7}>
        {radial(16, 52, 178).map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>

      {/* two interlaced khatam stars, counter-rotating */}
      <g style={{ ...origin, ...spinB }}>
        <DrawPath d={starPath(8, 178, 0.42)} strokeWidth={0.9} opacity={0.85} duration={2.6} delay={0.2} trigger={draw} />
      </g>
      <g style={{ ...origin, ...spinA }}>
        <DrawPath d={starPath(8, 178, 0.42)} strokeWidth={0.6} opacity={0.5} duration={2.6} delay={0.35} trigger={draw}
          transform="rotate(22.5 200 200)" />
      </g>

      {/* inner rosette */}
      <g style={{ ...origin, ...spinB }}>
        <DrawPath d={starPath(8, 44, 0.5)} strokeWidth={0.8} opacity={0.8} duration={2.0} delay={0.5} trigger={draw} />
      </g>

      {/* pulsing nodes at the star points */}
      <g fill={stroke} stroke="none">
        {ring(8, 178).map((n, i) => (
          <circle key={i} className="da-twinkle" cx={n.cx} cy={n.cy} r={2.6}
            style={{ animationDelay: `${i * 0.28}s` }} />
        ))}
        {ring(8, 96).map((n, i) => (
          <circle key={`m${i}`} cx={n.cx} cy={n.cy} r={1.6} opacity={0.6} />
        ))}
        <circle cx={C} cy={C} r={2.4} />
      </g>
    </svg>
  );
}
