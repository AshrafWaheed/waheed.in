/**
 * CraftDash — the seven per-craft technical schematics for the Expertise section,
 * one visual language: thin gold linework on teal, `currentColor` so the card owns
 * the tone, three depth layers (hairline structure → mid detail → bright foreground)
 * plus punch-through panels in the card colour. viewBox 260×210 fills the card's top
 * band. The `da-flow`/`da-ping`/`da-sweep`/`da-twinkle` hooks animate via globals.css,
 * turning each schematic into a live dashboard. Shared across all three variants.
 */
const CARD_BG = '#11272e';

export interface CraftDashProps {
  i: number;
  className?: string;
}

export default function CraftDash({ i, className }: CraftDashProps) {
  const s = {
    viewBox: '0 0 260 210',
    preserveAspectRatio: 'xMidYMax meet',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
  const glow = (
    <defs>
      <radialGradient id={`daGlow${i}`} cx="50%" cy="42%" r="66%">
        <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.13" />
        <stop offset="42%" stopColor="#39616d" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#11272e" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
  const ground = <rect x="0" y="0" width="260" height="210" fill={`url(#daGlow${i})`} stroke="none" />;

  switch (i) {
    case 0: // Web & App Development — responsive layout system
      return (
        <svg {...s}>
          {glow}{ground}
          <g fill="currentColor" stroke="none" opacity="0.32">
            <circle cx="8" cy="20" r="2" /><circle cx="158" cy="20" r="2" />
            <circle cx="8" cy="140" r="2" /><circle cx="158" cy="140" r="2" />
          </g>
          <g strokeWidth="1.6" opacity="0.9">
            <rect x="8" y="20" width="150" height="120" rx="7" />
            <line x1="8" y1="42" x2="158" y2="42" />
          </g>
          <g fill="currentColor" stroke="none" opacity="0.7">
            <circle cx="20" cy="31" r="1.7" /><circle cx="28" cy="31" r="1.7" /><circle cx="36" cy="31" r="1.7" />
          </g>
          <g strokeWidth="1.2" opacity="0.38">
            <rect x="20" y="54" width="126" height="28" rx="3" />
            <line x1="20" y1="94" x2="112" y2="94" />
            <line x1="20" y1="102" x2="88" y2="102" />
            <rect x="20" y="112" width="58" height="18" rx="3" />
            <rect x="88" y="112" width="58" height="18" rx="3" />
          </g>
          <rect x="176" y="46" width="74" height="150" rx="13" strokeWidth="1.6" opacity="0.9" />
          <line x1="203" y1="54" x2="223" y2="54" strokeWidth="1.4" opacity="0.5" />
          <g strokeWidth="1.2" opacity="0.38">
            <rect x="186" y="66" width="54" height="22" rx="3" />
            <line x1="186" y1="98" x2="240" y2="98" />
            <line x1="186" y1="106" x2="228" y2="106" />
            <rect x="186" y="116" width="54" height="18" rx="3" />
            <rect x="186" y="140" width="54" height="18" rx="3" />
            <line x1="200" y1="186" x2="226" y2="186" />
          </g>
          <g opacity="0.6" strokeWidth="1.3">
            <line className="da-flow" x1="160" y1="108" x2="174" y2="108" strokeDasharray="2 6" />
            <polyline points="164,104 160,108 164,112" />
            <polyline points="170,104 174,108 170,112" />
          </g>
          <circle className="da-ping" cx="213" cy="116" r="8" strokeWidth="1.3" style={{ animationDelay: '0s' }} />
        </svg>
      );
    case 1: // Custom Software Development — system architecture
      return (
        <svg {...s}>
          {glow}{ground}
          <g strokeWidth="1" opacity="0.16">
            <line x1="46" y1="36" x2="228" y2="34" />
            <line x1="228" y1="34" x2="208" y2="166" />
            <line x1="208" y1="166" x2="52" y2="164" />
            <line x1="52" y1="164" x2="46" y2="36" />
          </g>
          <g className="da-flow" strokeWidth="1.3" opacity="0.44" strokeDasharray="2 6">
            <line x1="108" y1="88" x2="60" y2="44" />
            <line x1="152" y1="88" x2="212" y2="44" />
            <line x1="108" y1="122" x2="60" y2="158" />
            <line x1="152" y1="122" x2="200" y2="158" />
          </g>
          <g strokeWidth="1.5" opacity="0.58">
            <rect x="26" y="24" width="52" height="34" rx="6" />
            <line x1="34" y1="38" x2="66" y2="38" /><line x1="34" y1="46" x2="58" y2="46" />
            <circle cx="212" cy="40" r="20" />
            <ellipse cx="52" cy="150" rx="26" ry="8" />
            <path d="M26 150 V174 A26 8 0 0 0 78 174 V150" />
            <path d="M26 162 A26 8 0 0 0 78 162" opacity="0.7" />
            <rect x="172" y="146" width="64" height="36" rx="6" />
            <line x1="182" y1="174" x2="182" y2="162" /><line x1="192" y1="174" x2="192" y2="156" />
            <line x1="202" y1="174" x2="202" y2="166" /><line x1="212" y1="174" x2="212" y2="154" />
          </g>
          <rect x="100" y="82" width="60" height="46" rx="9" strokeWidth="1.7" opacity="0.95" fill={CARD_BG} />
          <g strokeWidth="1.6" opacity="0.95">
            <polyline points="120,96 113,105 120,114" />
            <polyline points="140,96 147,105 140,114" />
            <line x1="133" y1="94" x2="127" y2="116" />
          </g>
          <g fill="currentColor" stroke="none" opacity="0.8">
            <circle cx="212" cy="40" r="3" /><circle cx="60" cy="44" r="2.4" />
            <circle cx="212" cy="44" r="2.4" /><circle cx="60" cy="158" r="2.4" /><circle cx="200" cy="158" r="2.4" />
          </g>
          <circle className="da-ping" cx="130" cy="105" r="9" strokeWidth="1.3" style={{ animationDelay: '1s' }} />
        </svg>
      );
    case 2: // Brand Strategy — positioning radar
      return (
        <svg {...s}>
          {glow}{ground}
          <g strokeWidth="1.2">
            <circle cx="130" cy="104" r="90" opacity="0.13" />
            <circle cx="130" cy="104" r="64" opacity="0.2" />
            <circle cx="130" cy="104" r="40" opacity="0.28" />
            <circle cx="130" cy="104" r="18" opacity="0.4" />
          </g>
          <g strokeWidth="1" opacity="0.22">
            <line x1="130" y1="12" x2="130" y2="196" />
            <line x1="38" y1="104" x2="222" y2="104" />
          </g>
          <g strokeWidth="1" opacity="0.11">
            <line x1="64" y1="38" x2="196" y2="170" />
            <line x1="196" y1="38" x2="64" y2="170" />
          </g>
          <g className="da-sweep" opacity="0.55" style={{ transformBox: 'view-box', transformOrigin: '130px 104px' }}>
            <line x1="130" y1="104" x2="130" y2="18" strokeWidth="1.3" />
            <line x1="130" y1="104" x2="104" y2="28" strokeWidth="1" opacity="0.5" />
            <line x1="130" y1="104" x2="156" y2="28" strokeWidth="1" opacity="0.3" />
          </g>
          <g strokeWidth="1.2" opacity="0.5">
            <circle cx="86" cy="66" r="3.2" /><circle cx="182" cy="78" r="3.2" />
            <circle cx="74" cy="150" r="3.2" /><circle cx="192" cy="150" r="3.2" /><circle cx="150" cy="164" r="3.2" />
          </g>
          <line className="da-flow" x1="130" y1="104" x2="156" y2="70" strokeWidth="1.4" opacity="0.6" strokeDasharray="2 6" />
          <path d="M156 52 L160 66 L174 70 L160 74 L156 88 L152 74 L138 70 L152 66 Z" strokeWidth="1.6" opacity="0.95" fill={CARD_BG} />
          <circle cx="130" cy="104" r="2.4" fill="currentColor" stroke="none" opacity="0.85" />
          <circle className="da-ping" cx="156" cy="70" r="9" strokeWidth="1.3" style={{ animationDelay: '2s' }} />
        </svg>
      );
    case 3: // SEO — search ranking + growth
      return (
        <svg {...s}>
          {glow}{ground}
          <g strokeWidth="1.5" opacity="0.85">
            <rect x="18" y="14" width="188" height="28" rx="14" />
            <circle cx="188" cy="28" r="7" />
            <line x1="193" y1="33" x2="199" y2="39" />
          </g>
          <line x1="34" y1="28" x2="120" y2="28" strokeWidth="1.2" opacity="0.33" />
          <g strokeWidth="1.4">
            <rect x="16" y="62" width="76" height="22" rx="4" opacity="0.85" />
            <rect x="16" y="92" width="76" height="22" rx="4" opacity="0.5" />
            <rect x="16" y="122" width="76" height="22" rx="4" opacity="0.4" />
          </g>
          <g fill="currentColor" stroke="none">
            <circle cx="28" cy="73" r="2.4" opacity="0.9" />
            <circle cx="28" cy="103" r="2.2" opacity="0.5" />
            <circle cx="28" cy="133" r="2.2" opacity="0.4" />
          </g>
          <g strokeWidth="1.1" opacity="0.4">
            <line x1="40" y1="73" x2="84" y2="73" />
            <line x1="40" y1="103" x2="78" y2="103" />
            <line x1="40" y1="133" x2="80" y2="133" />
          </g>
          <g strokeWidth="1" opacity="0.17">
            <line x1="112" y1="70" x2="112" y2="164" />
            <line x1="112" y1="164" x2="244" y2="164" />
            <line x1="112" y1="140" x2="244" y2="140" />
            <line x1="112" y1="112" x2="244" y2="112" />
            <line x1="112" y1="84" x2="244" y2="84" />
          </g>
          <g opacity="0.38" strokeWidth="1.3">
            <rect x="122" y="132" width="16" height="32" />
            <rect x="150" y="112" width="16" height="52" />
            <rect x="178" y="96" width="16" height="68" />
            <rect x="206" y="76" width="16" height="88" />
          </g>
          <polyline points="130,128 158,108 186,92 214,72" strokeWidth="1.7" opacity="0.9" />
          <polyline points="207,74 214,66 221,73" strokeWidth="1.7" opacity="0.9" />
          <g fill="currentColor" stroke="none" opacity="0.9">
            <circle cx="130" cy="128" r="2.4" /><circle cx="158" cy="108" r="2.4" />
            <circle cx="186" cy="92" r="2.4" /><circle cx="214" cy="72" r="2.4" />
          </g>
          <circle className="da-ping" cx="214" cy="72" r="7" strokeWidth="1.3" style={{ animationDelay: '0.5s' }} />
        </svg>
      );
    case 4: // Social Media Marketing — content engine network
      return (
        <svg {...s}>
          {glow}{ground}
          <g className="da-flow" strokeWidth="1.2" opacity="0.32" strokeDasharray="2 6">
            <line x1="130" y1="104" x2="40" y2="40" /><line x1="130" y1="104" x2="126" y2="24" />
            <line x1="130" y1="104" x2="216" y2="42" /><line x1="130" y1="104" x2="30" y2="108" />
            <line x1="130" y1="104" x2="232" y2="112" /><line x1="130" y1="104" x2="58" y2="176" />
            <line x1="130" y1="104" x2="142" y2="192" /><line x1="130" y1="104" x2="214" y2="178" />
          </g>
          <g strokeWidth="1" opacity="0.13">
            <line x1="40" y1="40" x2="126" y2="24" /><line x1="216" y1="42" x2="232" y2="112" />
            <line x1="214" y1="178" x2="142" y2="192" /><line x1="58" y1="176" x2="30" y2="108" />
          </g>
          <g strokeWidth="1.4" opacity="0.58">
            <circle cx="40" cy="40" r="8" /><circle cx="126" cy="24" r="7" /><circle cx="216" cy="42" r="9" />
            <circle cx="30" cy="108" r="6" /><circle cx="232" cy="112" r="7" /><circle cx="58" cy="176" r="8" />
            <circle cx="142" cy="192" r="6" /><circle cx="214" cy="178" r="8" />
          </g>
          <g fill="currentColor" stroke="none" opacity="0.5">
            <circle cx="126" cy="24" r="2.4" /><circle cx="232" cy="112" r="2.4" /><circle cx="58" cy="176" r="2.4" />
          </g>
          <path d="M204 38 c -2.4 -3 -7 -0.8 -7 2.6 c 0 3.4 7 6.8 7 6.8 c 0 0 7 -3.4 7 -6.8 c 0 -3.4 -4.6 -5.6 -7 -2.6 z"
            strokeWidth="1.2" opacity="0.7" />
          <rect x="104" y="84" width="52" height="40" rx="8" strokeWidth="1.7" opacity="0.95" fill={CARD_BG} />
          <polyline points="123,96 123,112 138,104 123,96" strokeWidth="1.5" opacity="0.95" fill={CARD_BG} />
          <circle className="da-ping" cx="130" cy="104" r="10" strokeWidth="1.3" style={{ animationDelay: '1.5s' }} />
        </svg>
      );
    case 5: // Conversion Copywriting — words into a funnel
      return (
        <svg {...s}>
          {glow}{ground}
          <g strokeWidth="1.3" opacity="0.4">
            <line x1="64" y1="24" x2="212" y2="24" />
            <line x1="64" y1="34" x2="190" y2="34" />
            <line x1="64" y1="44" x2="202" y2="44" />
          </g>
          <g strokeWidth="1.5" opacity="0.9">
            <path d="M46 12 L58 24 L44 38 L36 40 L38 30 Z" fill={CARD_BG} />
            <line x1="42" y1="16" x2="54" y2="28" />
          </g>
          <path d="M52 60 L208 60 L150 118 L150 150 L110 150 L110 118 Z" strokeWidth="1.5" opacity="0.6" />
          <g className="da-flow" strokeWidth="1.2" opacity="0.42" strokeDasharray="2 6">
            <line x1="96" y1="74" x2="122" y2="104" />
            <line x1="130" y1="72" x2="130" y2="106" />
            <line x1="164" y1="74" x2="138" y2="104" />
          </g>
          <line x1="130" y1="150" x2="130" y2="164" strokeWidth="1.4" opacity="0.6" />
          <circle cx="130" cy="182" r="16" strokeWidth="1.7" opacity="0.95" fill={CARD_BG} />
          <polyline points="122,182 128,189 139,175" strokeWidth="1.8" opacity="0.95" />
          <g strokeWidth="1.2" opacity="0.5">
            <line x1="152" y1="170" x2="160" y2="166" />
            <line x1="154" y1="182" x2="163" y2="182" />
            <line x1="152" y1="194" x2="160" y2="198" />
          </g>
          <circle className="da-ping" cx="130" cy="182" r="10" strokeWidth="1.3" style={{ animationDelay: '2.5s' }} />
        </svg>
      );
    default: // Ad Creatives — layered creative canvas
      return (
        <svg {...s}>
          {glow}{ground}
          <g className="da-flow" strokeWidth="1.2" opacity="0.3" strokeDasharray="2 6">
            <path d="M196 150 q 30 -6 40 -40" />
            <path d="M188 162 q 40 -6 54 -52" />
          </g>
          <rect x="70" y="28" width="150" height="104" rx="8" strokeWidth="1.3" opacity="0.22" fill={CARD_BG} />
          <rect x="56" y="42" width="150" height="104" rx="8" strokeWidth="1.4" opacity="0.42" fill={CARD_BG} />
          <rect x="40" y="56" width="150" height="104" rx="8" strokeWidth="1.7" opacity="0.9" fill={CARD_BG} />
          <g strokeWidth="1.4" opacity="0.58">
            <circle cx="70" cy="84" r="6" />
            <polyline points="48,142 84,106 108,126 140,94 184,134" />
          </g>
          <circle cx="116" cy="112" r="17" strokeWidth="1.6" opacity="0.92" fill={CARD_BG} />
          <polyline points="111,103 111,121 127,112 111,103" strokeWidth="1.5" opacity="0.92" fill={CARD_BG} />
          <path className="da-twinkle" d="M214 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" strokeWidth="1.4" fill={CARD_BG} style={{ animationDelay: '0s' }} />
          <path className="da-twinkle" d="M30 46 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z" strokeWidth="1.4" fill={CARD_BG} style={{ animationDelay: '0.9s' }} />
          <path className="da-twinkle" d="M228 152 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" strokeWidth="1.4" fill={CARD_BG} style={{ animationDelay: '1.7s' }} />
          <g strokeWidth="1.3" opacity="0.4">
            <line x1="206" y1="96" x2="230" y2="96" />
            <line x1="206" y1="108" x2="230" y2="108" />
            <line x1="206" y1="120" x2="224" y2="120" />
          </g>
          <circle className="da-ping" cx="116" cy="112" r="10" strokeWidth="1.3" style={{ animationDelay: '0.8s' }} />
        </svg>
      );
  }
}
