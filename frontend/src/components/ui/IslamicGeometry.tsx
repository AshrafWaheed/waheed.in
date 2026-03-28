interface IslamicGeometryProps {
  /** Size in pixels */
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

/**
 * Eight-pointed star (khatam) — a classic Islamic geometric motif.
 * Rendered as an inline SVG so colour and opacity are fully controllable.
 */
export default function IslamicGeometry({
  size = 120,
  color = "var(--green)",
  opacity = 0.15,
  className = "",
}: IslamicGeometryProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ opacity, color }}
    >
      {/* Outer octagon ring */}
      <polygon
        points="60,4 78,22 102,22 102,46 118,60 102,74 102,98 78,98 60,116 42,98 18,98 18,74 2,60 18,46 18,22 42,22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner star */}
      <polygon
        points="60,22 68,46 94,46 74,62 82,86 60,70 38,86 46,62 26,46 52,46"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Centre diamond */}
      <polygon
        points="60,42 72,60 60,78 48,60"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  );
}
