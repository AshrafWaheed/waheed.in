interface ArabicTextProps {
  children: React.ReactNode;
  opacity?: number;
  className?: string;
}

export default function ArabicText({
  children,
  opacity = 1,
  className = "",
}: ArabicTextProps) {
  return (
    <span
      lang="ar"
      dir="rtl"
      className={`font-[var(--font-amiri)] arabic ${className}`}
      style={{ opacity }}
    >
      {children}
    </span>
  );
}
