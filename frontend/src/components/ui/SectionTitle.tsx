import type { CSSProperties } from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  /** Italic coloured word(s) appended after children */
  emphasis?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  style?: CSSProperties;
  /** Cream body text + yellow emphasis — for dark green backgrounds */
  light?: boolean;
}

export default function SectionTitle({
  children,
  emphasis,
  as: Tag = "h2",
  className = "",
  style,
  light = false,
}: SectionTitleProps) {
  return (
    <Tag
      className={[
        "font-[var(--font-cormorant)] leading-tight",
        light ? "text-[var(--cream)]" : "text-[var(--text-dark)]",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
      {emphasis && (
        <>
          {" "}
          <em className={`not-italic italic ${light ? "text-[var(--yellow)]" : "text-[var(--green)]"}`}>
            {emphasis}
          </em>
        </>
      )}
    </Tag>
  );
}
