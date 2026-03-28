interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
  /** Cream line + cream/70 text — for dark green backgrounds */
  light?: boolean;
  /** Yellow line + yellow text — for dark green backgrounds needing accent */
  accent?: boolean;
}

export default function SectionTag({
  children,
  className = "",
  light = false,
  accent = false,
}: SectionTagProps) {
  const lineColor = accent
    ? "bg-[var(--yellow)]"
    : light
    ? "bg-[var(--cream)]/50"
    : "bg-[var(--green)]";

  const textColor = accent
    ? "text-[var(--yellow)]"
    : light
    ? "text-[var(--cream)]/70"
    : "text-[var(--green)]";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`block w-8 h-px ${lineColor}`} aria-hidden="true" />
      <span className={`text-xs font-semibold uppercase tracking-widest font-[var(--font-dm-sans)] ${textColor}`}>
        {children}
      </span>
    </div>
  );
}
