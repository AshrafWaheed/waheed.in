'use client';

/**
 * BarakahCore — a symbolic, "alive" engine (not a literal machine). A glowing
 * crystal core fed by six righteous business inputs; energy flows inward as
 * particles, the core pulses, and Barakah radiates back out. Hovering an input
 * intensifies its flow and brightens the core — "the more righteous inputs, the
 * stronger the Barakah". Pure SVG + CSS + SMIL; premium gold-on-near-black.
 */
import { useState } from 'react';

const C = 320;
const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;

// Righteous business inputs (Islamic principles → business barakah).
const INPUTS = [
  { ar: 'Niyyah', en: 'Sincere intention' },
  { ar: 'Iḥsān', en: 'Excellence in craft' },
  { ar: 'Amānah', en: 'Integrity & trust' },
  { ar: 'Ḥalāl Rizq', en: 'Ethical revenue' },
  { ar: 'Ṣabr', en: 'Patient, long-term' },
  { ar: 'Itqān', en: 'Mastery & precision' },
];
const OUTPUTS = ['Compounding growth', 'Loyal community', 'Lasting impact'];

const ANGLES = [-90, -30, 30, 90, 150, 210];
const R_NODE = 230;
// Labels ride OUTBOARD of their node. They used to share R_NODE, which printed
// every one of the six on top of its own gem — all six unreadable. The node's
// glow reaches r=26, so clear it.
const R_LABEL = 278;
const R_INNER = 86;
const xy = (i: number, r: number) => {
  const a = rad(ANGLES[i]);
  return { x: r1(C + r * Math.cos(a)), y: r1(C + r * Math.sin(a)) };
};

function starPath(cx: number, cy: number, R: number, inner = 0.5): string {
  const r = R * inner;
  const v: string[] = [];
  for (let i = 0; i < 16; i++) {
    const rr = i % 2 === 0 ? R : r;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    v.push(`${r1(cx + rr * Math.cos(a))},${r1(cy + rr * Math.sin(a))}`);
  }
  return `M${v.join(' L')} Z`;
}

const ticks = Array.from({ length: 48 }, (_, i) => {
  const a = rad(i * 7.5 - 90);
  return { x1: r1(C + 274 * Math.cos(a)), y1: r1(C + 274 * Math.sin(a)), x2: r1(C + 284 * Math.cos(a)), y2: r1(C + 284 * Math.sin(a)) };
});

const DUST = [
  { x: 120, y: 90, d: '0s', s: 2 }, { x: 520, y: 140, d: '1.2s', s: 1.6 }, { x: 92, y: 420, d: '2.1s', s: 2.2 },
  { x: 560, y: 470, d: '0.6s', s: 1.5 }, { x: 300, y: 66, d: '1.7s', s: 1.8 }, { x: 66, y: 250, d: '2.6s', s: 1.4 },
  { x: 582, y: 300, d: '0.9s', s: 2 }, { x: 250, y: 566, d: '1.4s', s: 1.7 }, { x: 410, y: 542, d: '2.3s', s: 1.5 },
  { x: 172, y: 520, d: '0.3s', s: 1.9 }, { x: 470, y: 80, d: '1.9s', s: 1.6 }, { x: 44, y: 150, d: '2.8s', s: 1.5 },
];

export interface BarakahCoreProps {
  /**
   * Texture mode: drops the labels and the outputs row and lets CSS dim the
   * whole thing. Used behind the /home3 hero cluster, where the geometry is
   * meant to read as a faint guilloche rather than as the subject.
   */
  quiet?: boolean;
}

export default function BarakahCore({ quiet = false }: BarakahCoreProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className={`bc${quiet ? ' bc--quiet' : ''}${active !== null ? ' is-focused' : ''}`}
      onMouseLeave={() => setActive(null)}
      aria-hidden={quiet || undefined}
    >
      <svg className="bc-svg" viewBox="0 0 640 640" aria-hidden="true">
        <defs>
          <radialGradient id="bcCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--rd-ivory)" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#C8A14A" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#C8A14A" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#C8A14A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bcRays" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8A14A" stopOpacity="0.16" />
            <stop offset="45%" stopColor="#1E6F5C" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#C8A14A" stopOpacity="0" />
          </radialGradient>
          <filter id="bcSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* light rays / ambient glow behind */}
        <circle className="bc-rays" cx={C} cy={C} r="300" fill="url(#bcRays)" />

        {/* outward Barakah emission */}
        <circle className="bc-emit" cx={C} cy={C} r="86" fill="none" stroke="#C8A14A" strokeWidth="1.4" />
        <circle className="bc-emit bc-emit-2" cx={C} cy={C} r="86" fill="none" stroke="#C8A14A" strokeWidth="1" />

        {/* slow counter-rotating rings */}
        <g className="bc-ring-a" style={{ transformOrigin: '320px 320px' }} stroke="#C8A14A" fill="none">
          <circle cx={C} cy={C} r="284" strokeWidth="0.8" opacity="0.28" />
          <g strokeWidth="1" opacity="0.4">
            {ticks.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />)}
          </g>
        </g>
        <g className="bc-ring-b" style={{ transformOrigin: '320px 320px' }} stroke="#C8A14A" fill="none">
          <circle cx={C} cy={C} r="196" strokeWidth="1" opacity="0.2" strokeDasharray="2 12" />
          <path d={starPath(C, C, 196, 0.9)} strokeWidth="0.7" opacity="0.16" />
        </g>

        {/* connectors + inward particles */}
        {INPUTS.map((_, i) => {
          const o = xy(i, R_NODE);
          const inn = xy(i, R_INNER);
          const dx = r1(inn.x - o.x), dy = r1(inn.y - o.y);
          const on = active === i;
          return (
            <g key={`c${i}`} className={`bc-flow${on ? ' is-active' : ''}`}>
              <line className="bc-line" x1={o.x} y1={o.y} x2={inn.x} y2={inn.y} stroke="#C8A14A" strokeWidth={on ? 2 : 1.2} strokeDasharray="1 9" strokeLinecap="round" />
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={o.x} cy={o.y} r={on ? 3.4 : 2.4} fill="var(--rd-ivory)" className="bc-particle">
                  <animateMotion dur="3.4s" begin={`${(i * 0.5 + k * 1.13).toFixed(2)}s`} repeatCount="indefinite" path={`M0 0 L${dx} ${dy}`} />
                </circle>
              ))}
            </g>
          );
        })}

        {/* input node gems */}
        {INPUTS.map((_, i) => {
          const o = xy(i, R_NODE);
          const on = active === i;
          return (
            <g key={`n${i}`} className={`bc-node${on ? ' is-active' : ''}`}>
              <circle cx={o.x} cy={o.y} r="26" fill="#C8A14A" opacity={on ? 0.22 : 0.08} filter="url(#bcSoft)" />
              <circle cx={o.x} cy={o.y} r="15" fill="#0a171d" stroke="#C8A14A" strokeWidth={on ? 1.8 : 1.2} />
              <path d={starPath(o.x, o.y, 8, 0.5)} fill="none" stroke={on ? 'var(--rd-ivory)' : '#C8A14A'} strokeWidth="1.2" strokeLinejoin="round" />
            </g>
          );
        })}

        {/* core */}
        <g className="bc-core">
          <circle className="bc-core-boost" cx={C} cy={C} r="120" fill="url(#bcCoreGlow)" />
          <circle className="bc-core-glow" cx={C} cy={C} r="70" fill="url(#bcCoreGlow)" />
          <circle cx={C} cy={C} r="70" fill="#0a171d" stroke="#C8A14A" strokeWidth="1.4" opacity="0.9" />
          <circle cx={C} cy={C} r="52" fill="none" stroke="#C8A14A" strokeWidth="0.8" opacity="0.5" />
          <g className="bc-core-star" style={{ transformOrigin: '320px 320px' }}>
            <path d={starPath(C, C, 44, 0.46)} fill="none" stroke="#C8A14A" strokeWidth="1.3" strokeLinejoin="round" />
            <path d={starPath(C, C, 26, 0.5)} fill="none" stroke="var(--rd-ivory)" strokeWidth="1.1" strokeLinejoin="round" opacity="0.9" />
          </g>
          <circle className="bc-core-heart" cx={C} cy={C} r="8" fill="var(--rd-ivory)" />
        </g>

        {/* floating dust */}
        <g className="bc-dust" fill="#C8A14A">
          {DUST.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.s} style={{ animationDelay: p.d }} />
          ))}
        </g>
      </svg>

      {/* input labels (interactive) */}
      {!quiet && INPUTS.map((n, i) => {
        const o = xy(i, R_LABEL);
        return (
          <div
            key={i}
            className={`bc-label${active === i ? ' is-active' : ''}`}
            style={{ left: `${(o.x / 640) * 100}%`, top: `${(o.y / 640) * 100}%` }}
            onMouseEnter={() => setActive(i)}
          >
            <span className="bc-label-ar">{n.ar}</span>
            <span className="bc-label-en">{n.en}</span>
          </div>
        );
      })}

      {/* outputs */}
      {!quiet && (
        <div className="bc-outputs">
          <span className="bc-outputs-lead">Barakah in</span>
          {OUTPUTS.map((o) => <span key={o} className="bc-output">{o}</span>)}
        </div>
      )}
    </div>
  );
}
