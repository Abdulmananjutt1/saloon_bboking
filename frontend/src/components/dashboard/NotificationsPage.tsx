"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { notificationService } from "@/services/notifications";
import { TAB_ROUTES } from "./routes";
import { emptyStateStyle, iconBoxStyle, notificationRowStyle, pageSubtitleStyle, pageTitleStyle, smallGhostButtonStyle } from "./styles";
import { NotificationStat } from "./shared";
import { notificationIcon, notificationPillStyle, timeAgo } from "./notifications";
import { useDashboardContext } from "./DashboardContext";

export default function NotificationsPage() {
  const { dashboardNotifications, totalNotificationUnread, upcomingBookings, markAppointmentsRead } = useDashboardContext();

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="client-dashboard-page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={pageTitleStyle}>Notifications</h1>
          <p style={pageSubtitleStyle}>Booking updates and account reminders in one place.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => {
            notificationService.markReadWhere((n) => n.type !== "chat" && n.screen !== "chat");
            markAppointmentsRead();
          }} style={smallGhostButtonStyle}>Mark read</button>
          <button onClick={() => notificationService.clearWhere((n) => n.type !== "chat" && n.screen !== "chat")} style={smallGhostButtonStyle}>Clear all</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
        <NotificationStat label="Unread" value={totalNotificationUnread} />
        <NotificationStat label="Appointments" value={upcomingBookings.length} />
        <NotificationStat label="Updates" value={dashboardNotifications.length} />
      </div>
      {dashboardNotifications.length === 0 ? (
        <div style={{ ...emptyStateStyle, marginTop: 16 }}>
          <Bell style={{ width: 36, height: 36, color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No updates yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {dashboardNotifications.map((n) => (
            <Link
              key={n.id}
              href={n.url ?? TAB_ROUTES.notifications}
              onClick={() => {
                if (n.source === "local") notificationService.markRead(n.id);
              }}
              style={{ ...notificationRowStyle, opacity: n.read ? 0.72 : 1 }}
            >
              <div style={iconBoxStyle}>{notificationIcon(n.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <h3 style={{ fontSize: "0.92rem", fontWeight: 800 }}>{n.title}</h3>
                  <span style={notificationPillStyle(n.type)}>{n.label}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{n.body}</p>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", whiteSpace: "nowrap" }}>{timeAgo(n.timestamp)}</span>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
