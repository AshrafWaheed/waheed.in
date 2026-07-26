'use client';

/**
 * Self-drawing SVG stroke (the Wahda signature). Drop <DrawPath> inside any <svg>
 * and its path draws itself via pathLength when scrolled into view (or on mount).
 *
 * Reduced-motion is handled in CSS (`.rd-draw` in globals.css): a stylesheet
 * !important forces the stroke fully drawn + visible, which beats Framer's inline
 * pathLength styles. We render ONE structure so SSR/client never mismatch.
 */
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

type MotionPathProps = ComponentProps<typeof motion.path>;

export interface DrawPathProps
  extends Omit<MotionPathProps, 'initial' | 'animate' | 'whileInView' | 'transition'> {
  d: string;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  trigger?: 'inView' | 'mount';
}

export function DrawPath({
  d,
  duration = 1.6,
  delay = 0,
  once = true,
  amount = 0.4,
  trigger = 'inView',
  className,
  ...rest
}: DrawPathProps) {
  const anim =
    trigger === 'mount'
      ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once, amount },
        };

  return (
    <motion.path
      className={`rd-draw${className ? ` ${className}` : ''}`}
      d={d}
      {...anim}
      transition={{
        pathLength: { duration, delay, ease: EASE },
        opacity: { duration: 0.001, delay },
      }}
      {...rest}
    />
  );
}

export default DrawPath;
