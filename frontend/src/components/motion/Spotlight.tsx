'use client';

/**
 * Spotlight wrapper (Outcrowd). Tracks the cursor as `--mouse-x`/`--mouse-y` CSS
 * vars on the element; the `.spotlight` class in globals.css paints a radial gold
 * glow that follows the pointer. Wrap any card. No JS animation → cheap.
 */
import { useRef } from 'react';

export interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Spotlight({ children, className = '', style }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} className={`spotlight ${className}`} style={style} onMouseMove={onMove}>
      {children}
    </div>
  );
}
