interface IslamicGeometryProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

/**
 * Classic Islamic 8-pointed star (khatam) built from:
 *   - An outer octagram polygon (16-point star)
 *   - An inner octagon
 *   - Radial lines connecting them
 * All geometry is mathematically derived; the pattern tiles cleanly.
 */
export default function IslamicGeometry({
  size = 600,
  color = "#F5F0E8",
  opacity = 0.06,
  className = "",
}: IslamicGeometryProps) {
  const cx = 300;
  const cy = 300;

  // 8-pointed star: 16 alternating outer/inner vertices
  const outerR = 230;
  const innerR  = 95;
  const starPoints = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI / 8) * i - Math.PI / 2; // start from top
    const r = i % 2 === 0 ? outerR : innerR;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  // Inner octagon (same vertices as the inner points of the star)
  const octPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2 + Math.PI / 8;
    const r = innerR;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  // Outer ring octagon
  const outerOctPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    return `${(cx + outerR * Math.cos(angle)).toFixed(2)},${(cy + outerR * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  // Radial guide lines from center to each outer star point
  const outerStarPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    return {
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
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
      style={{ opacity, color }}
    >
      {/* Main 8-pointed star fill */}
      <polygon
        points={starPoints}
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Inner octagon */}
      <polygon
        points={octPoints}
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Outer octagon */}
      <polygon
        points={outerOctPoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />

      {/* Radial lines from inner octagon corners to outer ring */}
      {outerStarPoints.map((pt, i) => {
        const innerAngle = (Math.PI / 4) * i - Math.PI / 2 + Math.PI / 8;
        const ix = cx + innerR * Math.cos(innerAngle);
        const iy = cy + innerR * Math.sin(innerAngle);
        return (
          <line
            key={i}
            x1={ix.toFixed(2)}
            y1={iy.toFixed(2)}
            x2={pt.x.toFixed(2)}
            y2={pt.y.toFixed(2)}
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.4"
          />
        );
      })}

      {/* Second outer ring circle */}
      <circle
        cx={cx}
        cy={cy}
        r="270"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.25"
      />

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r="4" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}
