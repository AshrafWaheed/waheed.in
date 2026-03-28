interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTag({ children, className = "" }: SectionTagProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="block w-8 h-px bg-[var(--green)]" aria-hidden="true" />
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--green)] font-[var(--font-dm-sans)]">
        {children}
      </span>
    </div>
  );
}
