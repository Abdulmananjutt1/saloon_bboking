import Link from "next/link";
import { Bell, CalendarDays, ChevronUp, LogOut, MessageSquare, Scissors, Settings, Users } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { RedBadge } from "@/components/ui/RedBadge";
import type { DashboardTab } from "./types";
import { TAB_ROUTES } from "./routes";
import { tabBtnStyle } from "./styles";

type DashboardSidebarProps = {
  activeTab: DashboardTab;
  showMobileMenu: boolean;
  showProfileMenu: boolean;
  user: { name: string; email: string };
  appointmentUnread: number;
  totalNotificationUnread: number;
  unreadCount: number;
  logout: () => void;
  setShowMobileMenu: (value: boolean) => void;
  setShowProfileMenu: (value: boolean) => void;
};

export function DashboardSidebar({
  activeTab,
  showMobileMenu,
  showProfileMenu,
  user,
  appointmentUnread,
  totalNotificationUnread,
  unreadCount,
  logout,
  setShowMobileMenu,
  setShowProfileMenu,
}: DashboardSidebarProps) {
  const navItems = [
    { tab: "overview", label: "Overview", Icon: Scissors, badge: 0 },
    { tab: "appointments", label: "My Appointments", Icon: CalendarDays, badge: appointmentUnread },
    { tab: "family", label: "Family Profiles", Icon: Users, badge: 0 },
    { tab: "notifications", label: "Notifications", Icon: Bell, badge: totalNotificationUnread },
    { tab: "chat", label: "Consultation Chat", Icon: MessageSquare, badge: unreadCount },
    { tab: "settings", label: "Profile Settings", Icon: Settings, badge: 0 },
  ] as const;

  return (
    <aside className={showMobileMenu ? "client-dashboard-sidebar client-dashboard-sidebar-open" : "client-dashboard-sidebar"} style={{
      width: 240,
      background: "var(--bg-secondary)",
      borderRight: "1px solid var(--border-light)",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflow: "hidden",
    }}>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border-light)" }}>
        <Link href={ROUTES.HOME} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo size={54} />
          <div>
            <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{APP_NAME}</p>
            <p style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--text-muted)", marginTop: 2 }}>Client Portal</p>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ tab, label, Icon, badge }) => {
          const on = activeTab === tab;
          return (
            <Link
              key={tab}
              href={TAB_ROUTES[tab as DashboardTab]}
              onClick={() => setShowMobileMenu(false)}
              style={tabBtnStyle(on)}
            >
              <Icon style={{ width: 15, height: 15, color: on ? "var(--gold)" : "var(--text-muted)", flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
              <RedBadge count={badge} />
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px", borderTop: "1px solid var(--border-light)", position: "relative" }}>
        {showProfileMenu && (
          <>
            <div onClick={() => setShowProfileMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div style={{
              position: "absolute", bottom: "calc(100% + 10px)", left: 16, right: 16,
              background: "var(--bg-card)", border: "1px solid var(--border-light)",
              borderRadius: 12, padding: "8px", boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
              zIndex: 50, animation: "fadeIn 0.2s ease-out",
            }}>
              <button
                onClick={() => {
                  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
                  if (isDark) {
                    document.documentElement.setAttribute("data-theme", "light");
                    localStorage.setItem("theme", "light");
                  } else {
                    document.documentElement.removeAttribute("data-theme");
                    localStorage.setItem("theme", "dark");
                  }
                  setShowProfileMenu(false);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent",
                  fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)", cursor: "pointer",
                  textAlign: "left", transition: "background 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Toggle Theme
              </button>
              <Link
                href={TAB_ROUTES.settings}
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", textDecoration: "none",
                  fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)", cursor: "pointer",
                  textAlign: "left", transition: "background 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Settings style={{ width: 15, height: 15, color: "var(--text-muted)" }} /> Settings
              </Link>
              <div style={{ height: 1, background: "var(--border-light)", margin: "4px 0" }} />
              <button
                onClick={logout}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent",
                  fontSize: "0.82rem", fontWeight: 500, color: "#ef4444", cursor: "pointer",
                  width: "100%", textAlign: "left", transition: "background 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <LogOut style={{ width: 15, height: 15 }} /> Logout
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            padding: "10px", borderRadius: 12, border: "none", background: "transparent",
            cursor: "pointer", textAlign: "left", transition: "background 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "var(--grad-gold-btn)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.85rem", color: "#0d0c0a",
          }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
          </div>
          <ChevronUp style={{
            width: 14, height: 14, color: "var(--text-muted)", flexShrink: 0,
            transform: showProfileMenu ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.2s ease",
          }} />
        </button>
      </div>
    </aside>
  );
}
