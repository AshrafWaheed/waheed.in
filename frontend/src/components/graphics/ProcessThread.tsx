/**
 * ProcessThread — a vertical girih thread strung through `count` khatam nodes,
 * for the Ihsan Process timeline. A faint base thread + a bright fill thread whose
 * length tracks `--p` (0→1, set by the parent on scroll). Nodes light up through
 * `active`. Reused by the cinematic/tactile variants. currentColor-free (owns gold).
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

export interface ProcessThreadProps {
  active?: number;
  count?: number;
  className?: string;
}

export default function ProcessThread({ active = 0, count = 5, className }: ProcessThreadProps) {
  const H = 560, top = 40, span = H - 80;
  const ys = Array.from({ length: count }, (_, i) => top + (span / (count - 1)) * i);
  let d = `M50 ${ys[0]}`;
  for (let i = 1; i < count; i++) {
    const cy = (ys[i - 1] + ys[i]) / 2;
    const bend = i % 2 === 1 ? 20 : 80;
    d += ` Q ${bend} ${cy} 50 ${ys[i]}`;
  }

  return (
    <svg viewBox={`0 0 100 ${H}`} className={className} fill="none" stroke="var(--rd-gold-line)" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d={d} strokeWidth={1.4} opacity={0.18} />
      <path d={d} strokeWidth={2} pathLength={1}
        style={{ strokeDasharray: '1 1', strokeDashoffset: 'calc(1 - var(--p, 0))', transition: 'stroke-dashoffset .1s linear' }} />
      {ys.map((y, i) => {
        const on = i <= active;
        return (
          <g key={i}>
            <circle cx="50" cy={y} r="15" fill="var(--rd-night)" stroke="var(--rd-gold-line)"
              strokeWidth={on ? 1.6 : 1} opacity={on ? 1 : 0.4}
              style={{ transition: 'opacity .4s ease, stroke-width .4s ease' }} />
            <path d={starPath(50, y, 8, 0.5)} strokeWidth={1.2}
              stroke={on ? 'var(--rd-gold-bloom)' : 'var(--rd-gold-line)'}
              style={{ opacity: on ? 1 : 0.45, transition: 'opacity .4s ease' }} />
          </g>
        );
      })}
    </svg>
  );
}
