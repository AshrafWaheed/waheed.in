interface IslamicGeometryProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

/**
 * Classic Islamic 8-pointed star (khatam).
 *
 * Opacity is controlled entirely by the top-level SVG `style.opacity` prop.
 * Individual shapes have NO per-element fillOpacity/strokeOpacity so the
 * caller's `opacity` value is the only multiplier — e.g. opacity={0.06}
 * renders all geometry at exactly 6%, making it visible but decorative.
 */
export default function IslamicGeometry({
  size = 600,
  color = "#F5F0E8",
  opacity = 0.06,
  className = "",
}: IslamicGeometryProps) {
  const cx = 300;
  const cy = 300;
  const outerR = 230;
  const innerR = 95;

  // 8-pointed star: 16 alternating outer / inner vertices
  const starPoints = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  // Inner octagon — at the inner vertices
  const octPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2 + Math.PI / 8;
    return `${(cx + innerR * Math.cos(angle)).toFixed(2)},${(cy + innerR * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  // Outer octagon ring — at the outer vertices
  const outerOctPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    return `${(cx + outerR * Math.cos(angle)).toFixed(2)},${(cy + outerR * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  // Radial guide lines: inner octagon corner → outer star point
  const radialLines = Array.from({ length: 8 }, (_, i) => {
    const outerAngle = (Math.PI / 4) * i - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 8;
    return {
      x1: (cx + innerR * Math.cos(innerAngle)).toFixed(2),
      y1: (cy + innerR * Math.sin(innerAngle)).toFixed(2),
      x2: (cx + outerR * Math.cos(outerAngle)).toFixed(2),
      y2: (cy + outerR * Math.sin(outerAngle)).toFixed(2),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      // opacity is the ONLY multiplier — no per-element opacity overrides below
      style={{ opacity, color }}
    >
      {/* Solid star fill — gives the shape presence at low opacity */}
      <polygon
        points={starPoints}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner octagon outline */}
      <polygon
        points={octPoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Outer octagon ring */}
      <polygon
        points={outerOctPoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Radial structural lines */}
      {radialLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}

      {/* Outer bounding circle */}
      <circle
        cx={cx} cy={cy} r="270"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r="5" fill="currentColor" />
    </svg>
  );
}
