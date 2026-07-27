/**
 * RefusalSeal — a khatam star inside a ring with a prohibition slash: the visual
 * stamp for "what we will not build". currentColor. Shared across variants.
 */
function starPath(cx: number, cy: number, R: number, inner: number): string {
  const r = R * inner;
  const v: string[] = [];
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    v.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M${v.join(' L')} Z`;
}

export interface RefusalSealProps {
  size?: number;
  className?: string;
}

export default function RefusalSeal({ size = 88, className }: RefusalSealProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor"
      strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="45" strokeWidth="1.6" opacity="0.7" />
      <circle cx="50" cy="50" r="38" strokeWidth="1" opacity="0.3" />
      <path d={starPath(50, 50, 30, 0.5)} strokeWidth="1.3" opacity="0.5" />
      <path d={starPath(50, 50, 15, 0.5)} strokeWidth="1.1" opacity="0.75" />
      {/* prohibition slash */}
      <line x1="22" y1="22" x2="78" y2="78" strokeWidth="2.2" opacity="0.9" />
    </svg>
  );
}
