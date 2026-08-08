'use client';

/**
 * StackButton — the three-layer button from the Figma redesign (Page 2).
 *
 * A gold face with two shells stacked behind it, each offset up-and-right and
 * each carrying its own dark outline, so the button reads as three printed
 * plates slightly out of register rather than as a button with a shadow. The
 * order back-to-front is WHITE → BLUE → GOLD; that is what produces the two
 * thin crescents along the top edge and around the right cap.
 *
 * Offsets are measured off the Figma file, not invented. Four instances of the
 * button exist there and they agree to within a pixel or two:
 *
 *              face          blue           white
 *   hero       517,580       +3, -3         +11, -7
 *   nav        1017,81       +5, -3         + 9, -7
 *   solutions  530,1726      +6, -3         +10, -7
 *   packages   149,4445      +6, -3         +11, -7
 *
 * So: blue (+5, -3), white (+10, -7). The small disagreements are hand-drawing
 * noise — the widths differ by 1–3px too — and are deliberately normalised
 * here, because three plates that are the same size is the whole point of the
 * effect and a 2px width difference just reads as a mistake.
 *
 * ── The interaction ─────────────────────────────────────────────────────────
 * At rest the shells sit at those fixed offsets. On hover the offsets are
 * dropped and replaced by a cursor-driven pull: the shells now emerge on
 * whichever side the pointer is, at up to 4px (blue) and 8px (white). Pointer
 * dead-centre therefore collapses the stack to a plain gold pill — which is
 * the "collapse" half — and moving toward an edge pulls the plates out in that
 * direction, with the white travelling twice as far as the blue so the stack
 * parallaxes instead of sliding as one slab.
 *
 * The spring is the same one `motion/Magnetic.tsx` uses (stiffness 150,
 * damping 15, mass 0.1), so this feels like the rest of the site rather than
 * like a component with its own opinion about weight.
 *
 * ── Colour ──────────────────────────────────────────────────────────────────
 * The four colours are declared as `--stk-*` on the component itself rather
 * than pulled from `--rd-*`. That is deliberate and temporary: the site's
 * accent ramp is currently BLUE (`--rd-gold-line` is #4f93d6 — the token names
 * say gold and mean accent), and the redesign moves it to gold. Until that
 * migration happens, a button that reached for `--rd-gold` would come out blue
 * on blue and invisible. When the palette moves, these four lines point at the
 * real tokens and nothing else here changes.
 */

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Rest offsets, px. Measured — see the header table. */
const REST = {
  mid: { x: 5, y: -3 },
  back: { x: 10, y: -7 },
};

/** Maximum cursor-driven travel on hover, px. White moves twice as far. */
const PULL = { mid: 4, back: 8 };

const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

type Common = {
  children: React.ReactNode;
  /** md ≈ 40px tall (the design's default), sm ≈ 34px for dense chrome. */
  size?: 'md' | 'sm';
  /** Trailing arrow, as on the nav's "Talk to us". */
  arrow?: boolean;
  className?: string;
};

type AsLink = Common & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
};

type AsButton = Common & {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export type StackButtonProps = AsLink | AsButton;

function Arrow() {
  return (
    <svg
      className="stk-arrow"
      viewBox="0 0 24 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 6 H21 M16 1.5 L21.5 6 L16 10.5" />
    </svg>
  );
}

export default function StackButton(props: StackButtonProps) {
  const { children, size = 'md', arrow = false, className } = props;

  const wrap = useRef<HTMLSpanElement>(null);
  const [engaged, setEngaged] = useState(false);

  // One motion value per shell axis. Seeded at the REST offsets so the first
  // server-rendered paint is already correct — no collapse-then-settle flash.
  const midX = useMotionValue(REST.mid.x);
  const midY = useMotionValue(REST.mid.y);
  const backX = useMotionValue(REST.back.x);
  const backY = useMotionValue(REST.back.y);

  const sMidX = useSpring(midX, SPRING);
  const sMidY = useSpring(midY, SPRING);
  const sBackX = useSpring(backX, SPRING);
  const sBackY = useSpring(backY, SPRING);

  function rest() {
    setEngaged(false);
    midX.set(REST.mid.x);
    midY.set(REST.mid.y);
    backX.set(REST.back.x);
    backY.set(REST.back.y);
  }

  /** Collapse to centre — used on keyboard focus, which has no coordinates. */
  function collapse() {
    setEngaged(true);
    midX.set(0);
    midY.set(0);
    backX.set(0);
    backY.set(0);
  }

  function onMove(e: React.PointerEvent) {
    // Touch and pen have no hover state; leaving the stack at rest is the
    // correct look there, and chasing a finger that is already pressing the
    // button is noise. The CSS carries the reduced-motion guard.
    if (e.pointerType !== 'mouse') return;

    const el = wrap.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    // Normalised to [-1, 1] from the centre, rather than raw pixel offset:
    // a button is small and wide, and raw offset would make the horizontal
    // pull four times the vertical purely because of the aspect ratio.
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));

    setEngaged(true);
    midX.set(nx * PULL.mid);
    midY.set(ny * PULL.mid);
    backX.set(nx * PULL.back);
    backY.set(ny * PULL.back);
  }

  const cls = [
    'stk',
    size === 'sm' ? 'stk--sm' : '',
    engaged ? 'is-engaged' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const face = (
    <>
      <span className="stk-label">{children}</span>
      {arrow && <Arrow />}
    </>
  );

  return (
    <span
      ref={wrap}
      className={cls}
      onPointerMove={onMove}
      onPointerLeave={rest}
      onFocus={collapse}
      onBlur={rest}
    >
      {/* Decorative. The face carries the accessible name; announcing three
          empty spans would be three pieces of nothing for a screen reader. */}
      <motion.span
        className="stk-shell stk-shell--back"
        style={{ x: sBackX, y: sBackY }}
        aria-hidden="true"
      />
      <motion.span
        className="stk-shell stk-shell--mid"
        style={{ x: sMidX, y: sMidY }}
        aria-hidden="true"
      />

      {props.href !== undefined ? (
        <Link href={props.href} className="stk-face" data-cursor>
          {face}
        </Link>
      ) : (
        <button
          type={props.type ?? 'button'}
          className="stk-face"
          onClick={props.onClick}
          disabled={props.disabled}
          data-cursor
        >
          {face}
        </button>
      )}
    </span>
  );
}
