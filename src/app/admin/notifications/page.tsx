"use client";

import { MessageSquare, CalendarDays, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifs, loading, clearAll } = useNotifications();

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out", maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-display), Georgia, serif" }}>
            Notifications
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
            All your latest alerts and messages.
          </p>
        </div>
        {notifs.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)",
              color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <CheckCircle2 style={{ width: 14, height: 14 }} /> Mark all as read
          </button>
        )}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Loading notifications...
          </div>
        ) : notifs.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(201,151,59,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 style={{ width: 24, height: 24, color: "var(--gold)" }} />
            </div>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>You&apos;re all caught up!</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>There are no new notifications at the moment.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {notifs.map((n, i) => (
              <div key={n.id + i} style={{
                padding: "20px 24px", display: "flex", gap: 16, alignItems: "center",
                borderBottom: i < notifs.length - 1 ? "1px solid var(--border-light)" : "none",
                transition: "background 0.2s"
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: n.type === "chat" ? "var(--status-confirmed-bg)" : "rgba(201,151,59,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {n.type === "chat"
                    ? <MessageSquare style={{ width: 18, height: 18, color: "var(--status-confirmed)" }} />
                    : <CalendarDays  style={{ width: 18, height: 18, color: "var(--gold)" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>{n.title}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
