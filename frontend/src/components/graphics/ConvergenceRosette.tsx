'use client';

/**
 * ConvergenceRosette — eight petals burst inward from the rim and assemble into a
 * girih rosette on scroll-in (Wahda FLIP-style convergence), with a drawing ring
 * and inner khatam. Each petal's radial position is baked into a static <g rotate>,
 * so the animated transform only does the "fly-in"; reduced-motion (CSS guard on
 * `.rd-converge`) snaps petals to their assembled positions, fully visible.
 */
import { motion } from 'framer-motion';
import { DrawPath } from '../motion/StrokeDraw';

const EASE = [0.22, 1, 0.36, 1] as const;
const PETAL = 'M50 50 C 45 32 45 20 50 6 C 55 20 55 32 50 50 Z';

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

export interface ConvergenceRosetteProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ConvergenceRosette({ size = '100%', className, style }: ConvergenceRosetteProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style}
      fill="none" stroke="var(--rd-gold-line)" strokeLinejoin="round" aria-hidden="true">
      <DrawPath d="M50 6 a44 44 0 1 0 0.1 0" strokeWidth={0.8} opacity={0.4} duration={1.6} amount={0.4} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45} 50 50)`}>
          <motion.path
            className="rd-converge"
            d={PETAL}
            strokeWidth={1}
            initial={{ opacity: 0, y: -46, scale: 0.4 }}
            whileInView={{ opacity: 0.9, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.06 }}
          />
        </g>
      ))}
      <motion.path
        className="rd-converge"
        d={starPath(50, 50, 13, 0.5)}
        strokeWidth={1.1}
        stroke="var(--rd-gold-bloom)"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        style={{ transformBox: 'view-box', transformOrigin: '50px 50px' }}
      />
    </svg>
  );
}
