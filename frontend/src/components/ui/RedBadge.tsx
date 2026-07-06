"use client";

/** Red unread count badge — admin & client nav */
export function RedBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span style={{
      minWidth: 18, height: 18, borderRadius: 99,
      background: "#ef4444",
      color: "#fff", fontSize: "0.6rem", fontWeight: 800,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 5px", flexShrink: 0,
      boxShadow: "0 2px 8px rgba(239,68,68,0.45)",
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
