"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES, APP_NAME } from "@/constants";
import {
  Scissors, LayoutDashboard, CalendarDays,
  Users, UserCheck, BarChart3, LogOut, Settings, MessageSquare, Bell, ChevronUp
} from "lucide-react";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { useAdminUnread } from "@/hooks/useAdminUnread";
import { ToastContainer, useToast } from "@/components/ui/Toast";

const NAV = [
  { label: "Dashboard",     href: ROUTES.ADMIN,           icon: LayoutDashboard },
  { label: "Bookings",      href: ROUTES.ADMIN_BOOKINGS,  icon: CalendarDays },
  { label: "Services",      href: ROUTES.ADMIN_SERVICES,  icon: Scissors },
  { label: "Stylists",      href: ROUTES.ADMIN_STYLISTS,  icon: Users },
  { label: "Clients",       href: ROUTES.ADMIN_CLIENTS,   icon: UserCheck },
  { label: "Analytics",     href: ROUTES.ADMIN_ANALYTICS, icon: BarChart3 },
  { label: "Chat",          href: "/admin/chat",          icon: MessageSquare, showUnread: true },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { totalUnread } = useAdminUnread();
  const { toasts, toast, remove } = useToast();

  // Show toast from sessionStorage (e.g. after login)
  useEffect(() => {
    const raw = sessionStorage.getItem("toast");
    if (raw) {
      try {
        const t = JSON.parse(raw);
        toast(t.type, t.title, t.message);
      } catch { /* ignore */ }
      sessionStorage.removeItem("toast");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.setItem("toast", JSON.stringify({ type: "success", title: "Logged Out", message: "You have been logged out successfully." }));
    router.push(ROUTES.LOGIN);
  };

  const active = (href: string) =>
    href === ROUTES.ADMIN ? pathname === href : pathname.startsWith(href);

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-primary)" }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-light)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border-light)" }}>
          <Link href={ROUTES.HOME} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(201,151,59,0.3)"
            }}>
              <Scissors style={{ width: 16, height: 16, color: "#0d0c0a", transform: "rotate(45deg)" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{APP_NAME}</p>
              <p style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--text-muted)", marginTop: 2 }}>Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ label, href, icon: Icon, showUnread }) => {
            const on    = active(href);
            const badge = showUnread ? totalUnread : 0;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  textDecoration: "none",
                  fontSize: "0.82rem", fontWeight: on ? 700 : 500,
                  color: on ? "var(--text-primary)" : "var(--text-muted)",
                  background: on ? "rgba(201,151,59,0.1)" : "transparent",
                  border: on ? "1px solid rgba(201,151,59,0.2)" : "1px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <Icon style={{ width: 15, height: 15, color: on ? "var(--gold)" : "var(--text-muted)", flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge > 0 && (
                  <span style={{
                    minWidth: 18, height: 18, borderRadius: 99,
                    background: "var(--grad-gold-btn)",
                    color: "#0d0c0a", fontSize: "0.6rem", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 5px", flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(201,151,59,0.4)"
                  }}>
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom - Profile popover */}
        <div style={{ padding: "12px", borderTop: "1px solid var(--border-light)", position: "relative" }}>
          
          {showProfileMenu && (
            <>
              <div 
                onClick={() => setShowProfileMenu(false)} 
                style={{ position: "fixed", inset: 0, zIndex: 40 }} 
              />
              <div style={{
                position: "absolute", bottom: "calc(100% + 10px)", left: 16, right: 16,
                background: "var(--bg-card)", border: "1px solid var(--border-light)",
                borderRadius: 12, padding: "8px", boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
                zIndex: 50, animation: "fadeIn 0.2s ease-out"
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
                    textAlign: "left", transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Toggle Theme
                </button>
                <Link href="/admin/settings" onClick={() => setShowProfileMenu(false)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, textDecoration: "none",
                  fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Settings style={{ width: 15, height: 15, color: "var(--text-muted)" }} /> Settings
                </Link>
                <div style={{ height: 1, background: "var(--border-light)", margin: "4px 0" }} />
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent",
                  fontSize: "0.82rem", fontWeight: 500, color: "#ef4444", cursor: "pointer",
                  width: "100%", textAlign: "left", transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"}
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
              cursor: "pointer", textAlign: "left", transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.85rem", color: "#0d0c0a"
            }}>A</div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Admin</p>
              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>admin@glamour.pk</p>
            </div>
            <ChevronUp style={{
              width: 14, height: 14, color: "var(--text-muted)", flexShrink: 0,
              transform: showProfileMenu ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease"
            }} />
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
