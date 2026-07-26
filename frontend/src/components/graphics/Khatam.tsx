/**
 * Khatam — the parametric 8-point star that is WAHEED's recurring motif.
 * Used as the custom cursor, list bullets, graph nodes, radar sweeps and
 * decorative sparks across all three homepage variants. Pure geometry, no deps.
 */

export interface KhatamProps {
  /** Rendered pixel size (square). */
  size?: number;
  /** Number of star points. 8 = the rub-el-hizb khatam. */
  points?: number;
  /** Inner-radius ratio (0–1); lower = spikier. */
  inner?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  /** Draw a faint concentric ring + centre dot. */
  ring?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function starPath(points: number, inner: number): string {
  const cx = 50, cy = 50, R = 47, r = 47 * inner;
  const verts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / points) * i - Math.PI / 2;
    verts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${verts.join(' L')} Z`;
}

export default function Khatam({
  size = 24,
  points = 8,
  inner = 0.6,
  stroke = 'currentColor',
  fill = 'none',
  strokeWidth = 1.5,
  ring = false,
  className,
  style,
}: KhatamProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ring && <circle cx="50" cy="50" r="47" opacity="0.28" />}
      <path d={starPath(points, inner)} />
      {ring && <circle cx="50" cy="50" r="3" fill={stroke} stroke="none" />}
    </svg>
  );
}
