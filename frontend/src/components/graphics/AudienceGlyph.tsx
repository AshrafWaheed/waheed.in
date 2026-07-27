/**
 * AudienceGlyph — four line-illustrations, one per audience segment, in the same
 * gold/teal linework language. Halal D2C · Islamic Education · NGOs & Masajid ·
 * Coaches & Educators. currentColor so the row owns the tone. Shared across variants.
 */
export interface AudienceGlyphProps {
  i: number;
  size?: number;
  className?: string;
}

export default function AudienceGlyph({ i, size = 92, className }: AudienceGlyphProps) {
  const s = {
    width: size,
    height: size,
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
  switch (i) {
    case 0: // Halal D2C — shopping bag + khatam seal + tag
      return (
        <svg {...s}>
          <path d="M28 34 h44 l4 46 a4 4 0 0 1 -4 4 H28 a4 4 0 0 1 -4 -4 Z" />
          <path d="M38 34 v-4 a12 12 0 0 1 24 0 v4" opacity="0.85" />
          {/* khatam seal */}
          <g opacity="0.9">
            <path d="M50 46 l3.2 6 6.6 1 -4.8 4.7 1.1 6.6 -6.1 -3.1 -6.1 3.1 1.1 -6.6 -4.8 -4.7 6.6 -1 Z" strokeWidth="1.4" />
          </g>
          {/* tag */}
          <g opacity="0.5"><path d="M70 24 l8 8 -10 10 -8 -8 Z" /><circle cx="72" cy="30" r="1.6" fill="currentColor" stroke="none" /></g>
        </svg>
      );
    case 1: // Islamic Education — open book under an arch
      return (
        <svg {...s}>
          <path d="M20 22 q30 -8 30 6 q0 -14 30 -6" opacity="0.5" />
          <path d="M50 40 q-14 -9 -28 -4 v40 q14 -5 28 4 q14 -9 28 -4 V36 q-14 -5 -28 4 Z" />
          <path d="M50 40 v44" opacity="0.85" />
          <g opacity="0.4"><path d="M30 52 h12" /><path d="M30 60 h12" /><path d="M58 52 h12" /><path d="M58 60 h12" /></g>
          {/* crescent above */}
          <path d="M50 14 a6 6 0 1 0 4 11 a7 7 0 1 1 -4 -11 Z" opacity="0.7" strokeWidth="1.4" />
        </svg>
      );
    case 2: // NGOs & Masajid — mosque dome + minaret + heart
      return (
        <svg {...s}>
          <path d="M24 84 V54 a16 16 0 0 1 32 0 v30" />
          <path d="M40 38 a10 10 0 0 1 0 -6" opacity="0.6" />
          <line x1="40" y1="30" x2="40" y2="26" opacity="0.8" />
          <path d="M40 54 a5 5 0 0 1 10 0" opacity="0.55" transform="translate(-5 8)" />
          {/* minaret */}
          <path d="M66 84 V44 a4 4 0 0 1 8 0 v40" opacity="0.85" />
          <path d="M66 44 a4 4 0 0 1 8 0" opacity="0.6" />
          <line x1="70" y1="40" x2="70" y2="34" opacity="0.7" />
          {/* heart / charity */}
          <path d="M60 60 c -2 -3 -7 -1 -7 3 c 0 4 7 8 7 8 c 0 0 7 -4 7 -8 c 0 -4 -5 -6 -7 -3 Z" opacity="0.5" strokeWidth="1.4" />
          <line x1="20" y1="84" x2="80" y2="84" opacity="0.7" />
        </svg>
      );
    default: // Coaches & Educators — speaker at podium + rising line
      return (
        <svg {...s}>
          <circle cx="44" cy="30" r="9" />
          <path d="M30 58 a14 14 0 0 1 28 0" />
          {/* mic */}
          <g opacity="0.7"><rect x="60" y="30" width="8" height="16" rx="4" /><path d="M56 42 a8 8 0 0 0 16 0" /><line x1="64" y1="50" x2="64" y2="58" /><line x1="58" y1="58" x2="70" y2="58" /></g>
          {/* rising growth line */}
          <polyline points="24,84 40,74 54,80 78,60" opacity="0.55" />
          <polyline points="72,60 78,58 78,66" opacity="0.55" />
        </svg>
      );
  }
}
