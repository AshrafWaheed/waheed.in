'use client';

/**
 * Per-character / per-word reveal (the Outcrowd SplitType effect, done with
 * Framer Motion). Words stay intact (no mid-word breaks); each unit fades +
 * rises + de-blurs on a stagger.
 *
 *   <SplitReveal text="Seven crafts, one" by="char" />
 *
 * Each unit animates independently (own initial/animate + delay = index *
 * stagger), gated by a single useInView on the wrapper — no cross-component
 * variant orchestration, so the cascade always fires.
 *
 * Reduced-motion is handled in CSS (`.split-reveal` in globals.css) with an
 * !important override that forces every unit visible — a stylesheet !important
 * beats Framer's inline styles, so it's bulletproof regardless of Framer's own
 * reduced-motion timing. We deliberately render ONE structure (always the split
 * spans) so SSR and client match and never mismatch on hydration.
 */
import { Fragment, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export interface SplitRevealProps {
  text: string;
  by?: 'char' | 'word';
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  amount?: number;
  /** 'inView' = reveal when scrolled to; 'mount' = reveal immediately. */
  trigger?: 'inView' | 'mount';
}

export default function SplitReveal({
  text,
  by = 'char',
  className,
  stagger = 0.03,
  duration = 0.8,
  delay = 0,
  y = 28,
  blur = 8,
  once = true,
  amount = 0.35,
  trigger = 'inView',
}: SplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount });
  const show = trigger === 'mount' ? true : inView;

  const words = text.split(' ');
  const hidden = { opacity: 0, y, filter: `blur(${blur}px)` };
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };
  const inline: React.CSSProperties = { display: 'inline-block' };
  const wrap: React.CSSProperties = { display: 'inline-block', whiteSpace: 'nowrap' };

  let i = 0;
  const Unit = (content: string, key: number) => (
    <motion.span
      key={key}
      style={inline}
      initial={hidden}
      animate={show ? shown : hidden}
      transition={{ duration, ease: EASE, delay: delay + i++ * stagger }}
    >
      {content}
    </motion.span>
  );

  return (
    <span ref={ref} className={`split-reveal${className ? ` ${className}` : ''}`} style={inline}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {by === 'word' ? (
            Unit(word, wi)
          ) : (
            <span style={wrap}>{Array.from(word).map((ch, ci) => Unit(ch, ci))}</span>
          )}
          {wi < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}
