interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
  /** Use on dark backgrounds — switches colours to cream */
  light?: boolean;
}

export default function SectionTag({ children, className = "", light = false }: SectionTagProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`block w-8 h-px ${light ? "bg-[var(--cream)]/50" : "bg-[var(--green)]"}`}
        aria-hidden="true"
      />
      <span
        className={`text-xs font-semibold uppercase tracking-widest font-[var(--font-dm-sans)] ${
          light ? "text-[var(--cream)]/70" : "text-[var(--green)]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
