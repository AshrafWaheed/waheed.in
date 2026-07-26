'use client';

/**
 * Seamless infinite marquee (Wahda scrolling-text). Renders the children twice in
 * a track and translates -50% forever, so the loop is gapless. Pauses under
 * reduced-motion. Style the items + gold sheen via `.rd-marquee` in globals.css.
 */
import { motion, useReducedMotion } from 'framer-motion';

export interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full cycle (lower = faster). */
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ children, speed = 40, reverse = false, className = '' }: MarqueeProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`rd-marquee ${className}`}>
      <motion.div
        className="rd-marquee-track"
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <div className="rd-marquee-group" aria-hidden={false}>{children}</div>
        <div className="rd-marquee-group" aria-hidden={true}>{children}</div>
      </motion.div>
    </div>
  );
}
