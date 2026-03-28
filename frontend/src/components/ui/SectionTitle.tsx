interface SectionTitleProps {
  children: React.ReactNode;
  /** Italic coloured word(s) to highlight within the title */
  emphasis?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export default function SectionTitle({
  children,
  emphasis,
  as: Tag = "h2",
  className = "",
}: SectionTitleProps) {
  return (
    <Tag
      className={`font-[var(--font-cormorant)] text-[var(--text-dark)] leading-tight ${className}`}
    >
      {children}
      {emphasis && (
        <>
          {" "}
          <em className="not-italic italic text-[var(--green)]">{emphasis}</em>
        </>
      )}
    </Tag>
  );
}
