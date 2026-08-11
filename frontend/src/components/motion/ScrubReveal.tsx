'use client';

/**
 * ScrubReveal — a block whose opacity + offset are scrubbed against a shared
 * scroll `progress` MotionValue (from useScrollProgress) over the sub-range
 * [from, to]. Lets a parent stagger children by giving each a different window
 * while sharing one progress source.
 *
 * `x`/`y` are the START offsets (in px) that ease to 0 as progress crosses the
 * window; opacity eases 0→1 over the same window. Renders a motion.div, so it
 * can serve as a grid/flex child (pass the layout class via `className`).
 */
import { motion, useTransform, type MotionValue } from 'framer-motion';

export interface ScrubRevealProps {
  progress: MotionValue<number>;
  from?: number;
  to?: number;
  x?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
}

export default function ScrubReveal({
  progress, from = 0, to = 1, x = 0, y = 0, className, children,
}: ScrubRevealProps) {
  const opacity = useTransform(progress, [from, to], [0, 1], { clamp: true });
  const tx = useTransform(progress, [from, to], [x, 0], { clamp: true });
  const ty = useTransform(progress, [from, to], [y, 0], { clamp: true });
  return (
    <motion.div className={className} style={{ opacity, x: tx, y: ty }}>
      {children}
    </motion.div>
  );
}
