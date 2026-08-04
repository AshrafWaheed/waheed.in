'use client';

/**
 * DiagnosisPlate — three drawings for the sticky column on /services/brand-strategy.
 *
 * The section pins this plate and scrolls three symptoms past it; `state` is the
 * index of whichever symptom is level with the viewport, and the plate swaps to
 * match. One component with three groups rather than three components, so the
 * frame, the optical centre and the card language stay identical and the change
 * reads as the same board being re-laid rather than three unrelated pictures.
 *
 * ── Rebuilt in the homepage's floating-card language (`ff-`) ─────────────────
 * The first version was line art: 1px strokes at 0.16–0.3 opacity on a near
 * black section. On a screen that is not a designer's it read as a faint
 * transparent wireframe — the exact failure the `wa-` layer on 01 was rebuilt
 * to avoid. These are SOLID light cards standing on the dark gradient, lifted
 * by shadow alone, with their contents drawn as teal at three fixed alphas.
 *
 * THE RULES THIS FILE KEEPS:
 *
 *   · Nothing is a hairline stroke on the dark. Objects are filled shapes.
 *   · Depth comes from the drop-shadow filter, never from a border.
 *   · Inner shapes use teal at .62 / .26 / .12 — heading, body, muted — the
 *     same three steps the homepage chips use, so a card here and a card there
 *     are visibly the same species.
 *   · The accent is BLUE (`--rd-gold-line` is a misnomer kept for ~200 rules).
 *     It marks the one thing each drawing is about, and nothing else.
 *   · All three scenes fill the SAME optical box — roughly y 28→304 of 330 —
 *     so the swap never makes the column jump or leaves a hole under the art.
 *
 * Each scene argues its symptom:
 *   0  six cards where only the logo differs
 *   1  a falling bar chart with a discount tag stuck on top
 *   2  an inbox where four enquiries are wrong and one is right
 */

const W = 460;
const H = 330;

/** Teal at the three alphas every inner shape uses. */
const INK = 'rgba(37,72,81,.62)';
const BODY = 'rgba(37,72,81,.26)';
const MUTE = 'rgba(37,72,81,.12)';

export interface DiagnosisPlateProps {
  /** 0 = sameness, 1 = price, 2 = wrong buyer. */
  state: number;
  className?: string;
}

/**
 * Six different logo marks for scene 0.
 *
 * The marks are the ONLY thing that differs between those six cards, and that
 * is the drawing's entire argument: "you could swap logos and nothing would
 * change". Six identical cards would have argued it less clearly and read as a
 * loading skeleton besides — six different marks over identical copy reads as
 * six real brands saying the same thing.
 */
function Mark({ i, cx, cy }: { i: number; cx: number; cy: number }) {
  switch (i) {
    case 0:
      return <circle cx={cx} cy={cy} r="11" fill={INK} />;
    case 1:
      return <rect x={cx - 10} y={cy - 10} width="20" height="20" rx="5" fill={INK} />;
    case 2:
      return <path d={`M ${cx} ${cy - 12} L ${cx + 11} ${cy + 8} L ${cx - 11} ${cy + 8} Z`} fill={INK} />;
    case 3:
      return <path d={`M ${cx} ${cy - 12} L ${cx + 12} ${cy} L ${cx} ${cy + 12} L ${cx - 12} ${cy} Z`} fill={INK} />;
    case 4:
      return (
        <path
          d={`M ${cx - 5.5} ${cy - 10} L ${cx + 5.5} ${cy - 10} L ${cx + 11} ${cy} L ${cx + 5.5} ${cy + 10} L ${cx - 5.5} ${cy + 10} L ${cx - 11} ${cy} Z`}
          fill={INK}
        />
      );
    default:
      return (
        <g fill={INK}>
          <rect x={cx - 11} y={cy - 10} width="22" height="8" rx="4" />
          <rect x={cx - 11} y={cy + 2} width="14" height="8" rx="4" />
        </g>
      );
  }
}

export default function DiagnosisPlate({ state, className }: DiagnosisPlateProps) {
  return (
    <svg
      className={`dp ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* The only source of depth in here. A border would put a hairline back
            on the dark, which is what this rebuild exists to remove. */}
        <filter id="dp-lift" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#000" floodOpacity=".55" />
        </filter>
        <filter id="dp-lift-sm" x="-60%" y="-60%" width="220%" height="240%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity=".6" />
        </filter>
      </defs>

      {/* ── 0 · You could swap logos and nothing would change ────────────────
          Six brand cards. Only the MARK differs; the wordmark, the claim and
          the button are pixel-identical across all six. There is no highlight,
          because the absence of one is the point — none of these is winning. */}
      <g className={`dp-plate${state === 0 ? ' is-on' : ''}`}>
        {Array.from({ length: 6 }, (_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 23 + col * 144;
          const y = 30 + row * 148;
          return (
            <g key={i} className="dp-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <g filter="url(#dp-lift)">
                <rect x={x} y={y} width="126" height="126" rx="14" fill="var(--rd-white)" />
              </g>
              {/* the one thing that is different */}
              <Mark i={i} cx={x + 27} cy={y + 32} />
              {/* …and everything that is not */}
              <rect x={x + 46} y={y + 27} width="52" height="9" rx="4.5" fill={BODY} />
              <rect x={x + 18} y={y + 64} width="90" height="7" rx="3.5" fill={BODY} />
              <rect x={x + 18} y={y + 79} width="72" height="7" rx="3.5" fill={MUTE} />
              <rect x={x + 18} y={y + 96} width="46" height="11" rx="5.5" fill={MUTE} />
            </g>
          );
        })}
      </g>

      {/* ── 1 · Every deal ends in a discount ────────────────────────────────
          The bars fall and a discount tag is stuck over the last one. The tag
          is a separate floating card, because that is what a discount is: not
          part of the plan, applied on top of it. */}
      <g className={`dp-plate${state === 1 ? ' is-on' : ''}`}>
        <g filter="url(#dp-lift)">
          <rect x="34" y="28" width="392" height="276" rx="16" fill="var(--rd-ivory)" />
        </g>

        {/* card header: what the chart is */}
        <rect x="58" y="56" width="96" height="9" rx="4.5" fill={INK} />
        <rect x="58" y="73" width="62" height="7" rx="3.5" fill={MUTE} />

        {/* baseline */}
        <rect x="58" y="264" width="344" height="2" rx="1" fill={MUTE} />

        {/* Five quotes, each lower than the last. The final one is the accent —
            it is the only one the drawing is making a point about. */}
        {[
          { x: 66, h: 148 },
          { x: 136, h: 122 },
          { x: 206, h: 96 },
          { x: 276, h: 70 },
          { x: 346, h: 44 },
        ].map((bar, i) => (
          <rect
            key={bar.x}
            className="dp-bar"
            x={bar.x}
            y={264 - bar.h}
            width="56"
            height={bar.h}
            rx="6"
            fill={i === 4 ? 'var(--rd-gold-line)' : 'rgba(37,72,81,.34)'}
            style={{ transformOrigin: `${bar.x + 28}px 264px`, animationDelay: `${i * 0.07}s` }}
          />
        ))}

        {/* The discount tag, stuck on top. */}
        <g className="dp-tag" filter="url(#dp-lift-sm)">
          <rect x="286" y="104" width="118" height="54" rx="12" fill="var(--rd-white)" />
        </g>
        <g className="dp-tag">
          <text x="303" y="130" className="dp-num" fill="var(--rd-gold-ink)">−32%</text>
          <rect x="303" y="139" width="62" height="6" rx="3" fill={MUTE} />
        </g>
      </g>

      {/* ── 2 · The wrong people keep enquiring ──────────────────────────────
          An inbox. Four enquiries are the wrong shape and one is right — and
          the four are not faded out, they are solid and present, because the
          cost is that they arrive and have to be dealt with. */}
      <g className={`dp-plate${state === 2 ? ' is-on' : ''}`}>
        <g filter="url(#dp-lift)">
          <rect x="34" y="28" width="392" height="276" rx="16" fill="var(--rd-white)" />
        </g>

        {/* inbox header */}
        <rect x="58" y="54" width="84" height="9" rx="4.5" fill={INK} />
        <rect x="58" y="71" width="54" height="7" rx="3.5" fill={MUTE} />
        <rect x="58" y="94" width="344" height="1.5" rx="1" fill={MUTE} />

        {/* Five enquiries. Index 2 is the one worth having. */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 114 + i * 38;
          const right = i === 2;
          return (
            <g key={i} className="dp-row" style={{ animationDelay: `${i * 0.07}s` }}>
              {right && <rect x="46" y={y - 8} width="368" height="34" rx="9" fill="rgba(79,147,214,.14)" />}
              <circle cx="70" cy={y + 9} r="11" fill={right ? 'var(--rd-gold-line)' : MUTE} />
              <rect x="92" y={y + 1} width={right ? 118 : 96} height="8" rx="4"
                fill={right ? INK : BODY} />
              <rect x="92" y={y + 14} width={right ? 168 : 138} height="6" rx="3" fill={MUTE} />
              {/* verdict pill — a shape, not a tick, so it reads at any size */}
              <rect x="352" y={y + 2} width={right ? 46 : 30} height="14" rx="7"
                fill={right ? 'var(--rd-gold-line)' : 'rgba(37,72,81,.18)'} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
