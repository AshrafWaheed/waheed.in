'use client';

/**
 * FoundingGlyph — the crafted brand illustration for the Founding Story panel.
 *
 * A single illuminated medallion in the language of an Islamic manuscript plate:
 * a rub-el-hizb (two overlapping squares → the eight-point khatam) held inside
 * concentric guilloché rings, with six "message threads" carrying motes inward
 * from the rim to the centre. That convergence IS the founding story in one
 * glyph — scattered requests from halal organisations resolving into one place,
 * one standard, one intent (waheed = oneness / tawhid). Pure geometry, no photo.
 *
 * Motion: the outer tick-rings counter-rotate, the rosette breathes, and the
 * motes stream inward on a loop. All continuous motion is gated by
 * `useReducedMotion()` — reduced-motion users get the fully-assembled static
 * plate.
 */
import { motion, useReducedMotion } from 'framer-motion';

const C = 100; // centre of the 200×200 viewBox

/** Point on a circle centred at (C,C). Angle in degrees, 0° = east, +y = down. */
function pt(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [+(C + r * Math.cos(a)).toFixed(2), +(C + r * Math.sin(a)).toFixed(2)];
}

/** Closed square path: four corners on radius R, first corner at `base` degrees. */
function square(base: number, R: number): string {
  const v = [0, 90, 180, 270].map((d) => pt(base + d, R).join(','));
  return `M${v.join(' L')} Z`;
}

/** N-point star (khatam) path. */
function star(points: number, R: number, inner: number): string {
  const v: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : R * inner;
    const [x, y] = pt((180 / points) * i - 90, rad);
    v.push(`${x},${y}`);
  }
  return `M${v.join(' L')} Z`;
}

const GOLD = 'var(--rd-gold)';
const LINE = 'var(--rd-gold-line)';
const BLOOM = 'var(--rd-gold-bloom)';

// Six radial threads: rim → inner. Top first, then every 60°.
const THREADS = [-90, -30, 30, 90, 150, 210].map((deg) => ({
  deg,
  rim: pt(deg, 86),
  hub: pt(deg, 30),
}));

export default function FoundingGlyph() {
  const still = useReducedMotion();

  return (
    <svg
      className="fg"
      viewBox="0 0 200 200"
      fill="none"
      stroke={LINE}
      strokeLinejoin="round"
      role="img"
      aria-label="An eight-point khatam medallion — scattered requests converging into one standard"
    >
      {/* ── Concentric guilloché rings ─────────────────────────────────────── */}
      <circle cx={C} cy={C} r="94" stroke={GOLD} strokeWidth="0.5" opacity="0.14" />
      <circle cx={C} cy={C} r="66" strokeWidth="0.7" opacity="0.4" />
      <circle cx={C} cy={C} r="48" stroke={GOLD} strokeWidth="0.6" opacity="0.3" />

      {/* Counter-rotating tick-rings — the "listening" rim. */}
      <motion.circle
        cx={C} cy={C} r="88" strokeWidth="1" strokeDasharray="0.6 6.4" opacity="0.55"
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
        animate={still ? undefined : { rotate: 360 }}
        transition={{ duration: 70, ease: 'linear', repeat: Infinity }}
      />
      <motion.circle
        cx={C} cy={C} r="80" stroke={GOLD} strokeWidth="0.7" strokeDasharray="2 10" opacity="0.35"
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
        animate={still ? undefined : { rotate: -360 }}
        transition={{ duration: 95, ease: 'linear', repeat: Infinity }}
      />

      {/* ── Message threads + inbound motes ────────────────────────────────── */}
      {THREADS.map((t, i) => (
        <line
          key={`thread-${i}`}
          x1={t.rim[0]} y1={t.rim[1]} x2={t.hub[0]} y2={t.hub[1]}
          stroke={GOLD} strokeWidth="0.5" opacity="0.22"
        />
      ))}
      {THREADS.map((t, i) => {
        const [x0, y0] = t.rim;
        const [x1, y1] = t.hub;
        if (still) {
          const [xm, ym] = pt(t.deg, 52);
          return <circle key={`mote-${i}`} cx={xm} cy={ym} r="1.7" fill={BLOOM} stroke="none" opacity="0.8" />;
        }
        return (
          <motion.circle
            key={`mote-${i}`}
            r="1.7" fill={BLOOM} stroke="none"
            initial={{ cx: x0, cy: y0, opacity: 0 }}
            animate={{ cx: [x0, x1], cy: [y0, y1], opacity: [0, 0.9, 0.9, 0] }}
            transition={{
              duration: 3.2, ease: 'easeIn', repeat: Infinity,
              repeatDelay: 1.1, delay: i * 0.42,
              times: [0, 0.15, 0.85, 1],
            }}
          />
        );
      })}

      {/* ── Rub-el-hizb rosette — two squares → the eight-point khatam ──────── */}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
        animate={still ? undefined : { rotate: 360 }}
        transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
      >
        <path d={square(0, 40)} stroke={GOLD} strokeWidth="1.1" opacity="0.85" />
        <path d={square(45, 40)} stroke={GOLD} strokeWidth="1.1" opacity="0.85" />
      </motion.g>

      {/* Inner khatam + breathing bloom at the point of convergence. */}
      <path d={star(8, 22, 0.46)} stroke={BLOOM} strokeWidth="1" opacity="0.9" />
      <motion.circle
        cx={C} cy={C} r="7" fill={GOLD} stroke="none"
        animate={still ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.12, 1] }}
        transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
      />
      <circle cx={C} cy={C} r="2.6" fill="var(--rd-white)" stroke="none" opacity="0.9" />
    </svg>
  );
}
