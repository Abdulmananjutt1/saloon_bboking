// ─────────────────────────────────────────────────────────
//  AdminPageHeader — Shared header pattern for all admin pages
//  Usage: <AdminPageHeader title="Bookings" subtitle="120 total" actions={...} />
// ─────────────────────────────────────────────────────────

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 28,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 4,
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {actions}
        </div>
      )}
    </div>
  );
}
