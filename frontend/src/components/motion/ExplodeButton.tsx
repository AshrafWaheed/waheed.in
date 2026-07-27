'use client';

/**
 * ExplodeButton — the Outcrowd cursor-fill CTA. A hidden circle sits inside the
 * button and scales up from wherever the cursor entered on hover, flipping the
 * label colour. Wrapped in Magnetic for the pull. Renders a Next <Link> when
 * `href` is set, otherwise a <button> (for forms). Styling: `.explode-host` in
 * globals.css.
 */
import Link from 'next/link';
import Magnetic from './Magnetic';

function onMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--ex-x', `${e.clientX - r.left}px`);
  el.style.setProperty('--ex-y', `${e.clientY - r.top}px`);
}

export interface ExplodeButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  magnetic?: boolean;
}

export default function ExplodeButton({
  children,
  href,
  type = 'button',
  onClick,
  disabled,
  className = 'btn btn-gold',
  magnetic = true,
}: ExplodeButtonProps) {
  const inner = href ? (
    <Link href={href} className={`explode-host ${className}`} data-cursor onMouseMove={onMove}>
      <span className="explode" aria-hidden="true" />
      <span className="ex-label">{children}</span>
    </Link>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={`explode-host ${className}`} data-cursor onMouseMove={onMove}>
      <span className="explode" aria-hidden="true" />
      <span className="ex-label">{children}</span>
    </button>
  );

  return magnetic ? <Magnetic>{inner}</Magnetic> : inner;
}
