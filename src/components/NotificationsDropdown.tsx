"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, MessageSquare, CalendarDays } from "lucide-react";
import { ROUTES } from "@/constants";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsDropdown() {
  const [showNotifs, setShowNotifs] = useState(false);
  const { notifs, unread, markRead, clearAll } = useNotifications();

  const handleOpen = () => {
    setShowNotifs((v) => !v);
    if (!showNotifs) markRead();
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleOpen}
        style={{
          position: "relative", width: 36, height: 36, borderRadius: 9,
          background: "var(--bg-card)", border: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--text-muted)", transition: "all 0.2s"
        }}
        title="Notifications"
      >
        <Bell style={{ width: 15, height: 15 }} />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--gold)", border: "2px solid var(--bg-card)"
          }} />
        )}
      </button>

      {showNotifs && (
        <>
          <div onClick={() => setShowNotifs(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{
            position: "absolute", top: 48, right: 0, width: 320,
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 14, boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            zIndex: 50, overflow: "hidden", animation: "fadeIn 0.2s ease-out"
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>Notifications</h4>
              <span style={{ fontSize: "0.7rem", color: "var(--gold)", cursor: "pointer" }} onClick={clearAll}>
                Clear all
              </span>
            </div>

            <div style={{ maxHeight: 350, overflowY: "auto", padding: "8px 0" }}>
              {notifs.length === 0 ? (
                <p style={{ padding: "20px", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  No new notifications.
                </p>
              ) : (
                notifs.map((n, i) => (
                  <div key={n.id + i} style={{
                    padding: "12px 16px", display: "flex", gap: 12,
                    borderBottom: i < notifs.length - 1 ? "1px solid var(--border-light)" : "none",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: n.type === "chat" ? "var(--status-confirmed-bg)" : "rgba(201,151,59,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {n.type === "chat"
                        ? <MessageSquare style={{ width: 14, height: 14, color: "var(--status-confirmed)" }} />
                        : <CalendarDays  style={{ width: 14, height: 14, color: "var(--gold)" }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{n.title}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifs.length > 0 && (
              <div style={{ padding: "12px", borderTop: "1px solid var(--border-light)", textAlign: "center" }}>
                <Link
                  href={ROUTES.ADMIN_BOOKINGS}
                  onClick={() => setShowNotifs(false)}
                  style={{ fontSize: "0.75rem", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}
                >
                  View all activity
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
