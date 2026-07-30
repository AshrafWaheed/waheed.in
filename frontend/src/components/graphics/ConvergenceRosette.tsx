'use client';

/**
 * ConvergenceRosette — eight petals burst inward from the rim and assemble into a
 * girih rosette on scroll-in (Wahda FLIP-style convergence), with a drawing ring
 * and inner khatam. Each petal's radial position is baked into a static <g rotate>,
 * so the animated transform only does the "fly-in"; reduced-motion (CSS guard on
 * `.rd-converge`) snaps petals to their assembled positions, fully visible.
 *
 * The convergence is gated by ONE useInView on the <svg>, not by per-petal
 * `whileInView`. Per-petal was a deadlock: `y: -46` is in SVG user units, and at
 * a 100-unit viewBox rendered ~520px that is −239 real px, so the initial state
 * threw every petal clear out of the viewport — where its own IntersectionObserver
 * could never fire it. The petals sat at opacity 0 forever. Gating on the wrapper
 * (which has a real CSS box and stays put) is the same fix SplitReveal documents
 * for the same class of problem.
 */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const petalHidden = { opacity: 0, y: -46, scale: 0.4 };
  const petalShown = { opacity: 0.9, y: 0, scale: 1 };
  const starHidden = { opacity: 0, scale: 0 };
  const starShown = { opacity: 1, scale: 1 };

  return (
    <svg ref={ref} viewBox="0 0 100 100" width={size} height={size} className={className} style={style}
      fill="none" stroke="var(--rd-gold-line)" strokeLinejoin="round" aria-hidden="true">
      {/* The ring keeps its own trigger: it animates pathLength only, never moves,
          so it cannot displace itself out of its own observer. */}
      <DrawPath d="M50 6 a44 44 0 1 0 0.1 0" strokeWidth={0.8} opacity={0.4} duration={1.6} amount={0.4} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45} 50 50)`}>
          <motion.path
            className="rd-converge"
            d={PETAL}
            strokeWidth={1}
            initial={petalHidden}
            animate={inView ? petalShown : petalHidden}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.06 }}
          />
        </g>
      ))}
      <motion.path
        className="rd-converge"
        d={starPath(50, 50, 13, 0.5)}
        strokeWidth={1.1}
        stroke="var(--rd-gold-bloom)"
        initial={starHidden}
        animate={inView ? starShown : starHidden}
        transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        style={{ transformBox: 'view-box', transformOrigin: '50px 50px' }}
      />
    </svg>
  );
}
