interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
  className = "reveal",
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={className}
      style={{
        textAlign: centered ? "center" : "left",
        marginBottom: 56,
      }}
    >
      <span className="sal-eyebrow">{eyebrow}</span>
      <h2 className="sal-h2" style={{ marginBottom: description || children ? 14 : 0 }}>
        {title}
      </h2>
      {description && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.92rem",
            maxWidth: centered ? 480 : 520,
            margin: centered ? "0 auto" : 0,
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
