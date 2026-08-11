'use client';

/**
 * SoftwareRig — bespoke hero artwork for Custom Software Development.
 *
 * The craft is ERPs, automations and integrations, so the scene is a central
 * system (a dashboard) wired to the operations it connects: tooling (wrench),
 * automation (a bot), commerce (a cart) and data (a database). Data flows along
 * the gold connectors toward the dashboard, whose chart builds on mount.
 *
 * One self-contained SVG so the connectors stay pinned to the nodes at any size.
 * Animation is CSS (`sw-` in globals) and killed under reduced motion. Glyphs are
 * lucide path data, stroked. `aria-hidden`: it restates the copy beside it.
 */

/** A lucide-style glyph (24-unit) placed centred at (cx, cy) on a node card. */
function Glyph({ cx, cy, children }: { cx: number; cy: number; children: React.ReactNode }) {
  return (
    <g
      transform={`translate(${cx - 14} ${cy - 14}) scale(1.167)`}
      fill="none"
      stroke="#1a363d"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  );
}

interface Node {
  x: number; y: number;              // card top-left
  glyph: React.ReactNode;
  label: string;
  from: [number, number];           // connector start (dashboard edge)
  delay: number;
}

const S = 64;                        // node card size

const NODES: Node[] = [
  {
    x: 24, y: 40, label: 'Tooling', delay: 0, from: [140, 138],
    glyph: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  },
  {
    x: 352, y: 48, label: 'Automation', delay: 0.18, from: [300, 148],
    glyph: (
      <>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </>
    ),
  },
  {
    x: 30, y: 250, label: 'Commerce', delay: 0.36, from: [150, 232],
    glyph: (
      <>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </>
    ),
  },
  {
    x: 346, y: 250, label: 'Data', delay: 0.54, from: [300, 214],
    glyph: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </>
    ),
  },
];

export default function SoftwareRig() {
  return (
    <div className="sw-rig" aria-hidden="true">
      <svg viewBox="0 0 440 360" fill="none" role="img">
        <defs>
          <filter id="sw-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#04141a" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Connectors — data flows toward the dashboard. */}
        {NODES.map((n, i) => {
          const nx = n.x + S / 2;
          const ny = n.y + S / 2;
          return (
            <path
              key={`c${i}`}
              className="sw-flow"
              style={{ animationDelay: `${n.delay}s` }}
              d={`M ${nx} ${ny} C ${(nx + n.from[0]) / 2} ${ny}, ${(nx + n.from[0]) / 2} ${n.from[1]}, ${n.from[0]} ${n.from[1]}`}
              stroke="var(--rd-gold-line)"
              strokeWidth="1.6"
            />
          );
        })}

        {/* Central dashboard — the custom system. */}
        <g className="sw-dash" filter="url(#sw-shadow)">
          <rect x="132" y="104" width="176" height="152" rx="16" fill="#FFFDF9" />
          {/* header */}
          <rect x="150" y="122" width="58" height="8" rx="4" fill="#254851" />
          <circle className="sw-live" cx="292" cy="126" r="4" fill="var(--rd-gold)" />
          {/* two data rows */}
          <rect x="150" y="146" width="140" height="5" rx="2.5" fill="#d7dee4" />
          <rect x="150" y="158" width="104" height="5" rx="2.5" fill="#e4e9ee" />
          {/* mini bar chart */}
          <g className="sw-bars">
            <rect className="sw-bar" style={{ ['--h' as string]: '34px', animationDelay: '.15s' }} x="152" y="196" width="24" height="34" rx="4" fill="#335C67" />
            <rect className="sw-bar" style={{ ['--h' as string]: '54px', animationDelay: '.28s' }} x="186" y="176" width="24" height="54" rx="4" fill="#335C67" />
            <rect className="sw-bar" style={{ ['--h' as string]: '44px', animationDelay: '.41s' }} x="220" y="186" width="24" height="44" rx="4" fill="var(--rd-gold)" />
            <rect className="sw-bar" style={{ ['--h' as string]: '62px', animationDelay: '.54s' }} x="254" y="168" width="24" height="62" rx="4" fill="#335C67" />
          </g>
          <line x1="150" y1="234" x2="290" y2="234" stroke="#e4e9ee" strokeWidth="1.5" />
        </g>

        {/* Satellite nodes. */}
        {NODES.map((n, i) => (
          <g key={`n${i}`} className="sw-node" style={{ animationDelay: `${0.4 + n.delay}s` }}>
            <rect x={n.x} y={n.y} width={S} height={S} rx="16" fill="#FFFDF9" filter="url(#sw-shadow)" />
            <Glyph cx={n.x + S / 2} cy={n.y + S / 2 - 3} >{n.glyph}</Glyph>
            <text className="sw-label" x={n.x + S / 2} y={n.y + S - 12} textAnchor="middle">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
