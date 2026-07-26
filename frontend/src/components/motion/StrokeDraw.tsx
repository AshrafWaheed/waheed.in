'use client';

/**
 * Self-drawing SVG stroke (the Wahda signature). Drop <DrawPath> inside any <svg>
 * and its path draws itself via pathLength when scrolled into view (or on mount).
 * Under reduced-motion it renders fully drawn, no animation.
 */
import { motion, useReducedMotion } from 'framer-motion';
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
  ...rest
}: DrawPathProps) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.path d={d} {...rest} />;

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
