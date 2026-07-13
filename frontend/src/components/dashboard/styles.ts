export function tabBtnStyle(isActive: boolean) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: isActive ? "1px solid rgba(201,151,59,0.2)" : "1px solid transparent",
    fontSize: "0.82rem",
    fontWeight: isActive ? 700 : 500,
    cursor: "pointer",
    textDecoration: "none",
    background: isActive ? "rgba(201,151,59,0.1)" : "transparent",
    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
    transition: "all 0.2s",
    textAlign: "left" as const,
  };
}

export const pageTitleStyle = {
  fontSize: "2.4rem",
  fontWeight: 800,
  color: "var(--text-primary)",
  letterSpacing: "-0.02em",
  marginBottom: 4,
  fontFamily: "var(--font-display), Georgia, serif",
};

export const pageSubtitleStyle = {
  fontSize: "0.82rem",
  color: "var(--text-muted)",
};

export const statCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 24px",
  borderRadius: 16,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-light)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export const iconBoxStyle = {
  width: 42,
  height: 42,
  borderRadius: 10,
  background: "rgba(201,151,59,0.08)",
  border: "1px solid rgba(201,151,59,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

export const bookingRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 20px",
  borderRadius: 14,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-light)",
};

export const appointmentSkeletonBlockStyle = {
  display: "block",
  background: "var(--border-light)",
  animation: "clientPulse 1.4s ease-in-out infinite",
};

export const smallActionLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "var(--gold)",
  fontSize: "0.78rem",
  fontWeight: 800,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
};

export const smallGhostButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "8px 11px",
  borderRadius: 9,
  border: "1px solid var(--border-light)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text-primary)",
  fontSize: "0.76rem",
  fontWeight: 800,
  cursor: "pointer",
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
};

export const notificationRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 18px",
  borderRadius: 14,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-light)",
  color: "var(--text-primary)",
  textDecoration: "none",
};

export const emptyStateStyle = {
  padding: "48px 28px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.02)",
  border: "1px dashed var(--border-light)",
  textAlign: "center" as const,
};

export const modalInputStyle = {
  width: "100%",
  borderRadius: 11,
  border: "1px solid var(--border-light)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text-primary)",
  padding: "11px 12px",
  fontSize: "0.86rem",
  outline: "none",
};

export function statusBadgeStyle(status: string) {
  const meta: Record<string, { color: string; bg: string }> = {
    pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    confirmed: { color: "#10b981", bg: "rgba(16,185,129,0.08)" },
    completed: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  };
  const current = meta[status] || { color: "#fff", bg: "rgba(255,255,255,0.05)" };
  return {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    padding: "5px 12px",
    borderRadius: 99,
    color: current.color,
    background: current.bg,
  };
}

export const cancelBtnStyle = {
  padding: "6px 12px",
  borderRadius: 8,
  background: "rgba(239,68,68,0.05)",
  border: "1px solid rgba(239,68,68,0.25)",
  color: "#ef4444",
  fontSize: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};
