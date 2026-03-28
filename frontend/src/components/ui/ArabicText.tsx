type FontSize = "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";

const sizeMap: Record<FontSize, string> = {
  "sm":  "text-sm",
  "base": "text-base",
  "lg":  "text-lg",
  "xl":  "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

interface ArabicTextProps {
  children: React.ReactNode;
  size?: FontSize;
  opacity?: number;
  className?: string;
}

export default function ArabicText({
  children,
  size = "xl",
  opacity = 1,
  className = "",
}: ArabicTextProps) {
  return (
    <p
      lang="ar"
      dir="rtl"
      className={[
        "font-[var(--font-amiri)] arabic text-center",
        sizeMap[size],
        className,
      ].join(" ")}
      style={{ opacity }}
    >
      {children}
    </p>
  );
}
