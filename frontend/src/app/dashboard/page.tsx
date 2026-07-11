"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Scissors, CalendarDays,
  MessageSquare, Settings, LogOut, Clock3,
  ChevronRight, ChevronUp, Star, Send, Plus, Wifi, WifiOff,
  User, Mail, Phone, Pencil, Check, X, Menu,
  Bell, Gift, Heart, RotateCcw, CalendarPlus, Users
} from "lucide-react";

import { ROUTES, APP_NAME } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { useClientDashboard, type ChatMessage, type ClientBooking } from "@/hooks/useClientDashboard";
import { RedBadge } from "@/components/ui/RedBadge";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { popSessionToast } from "@/lib/session";
import { notificationService, type AppNotification } from "@/services/notifications";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "notifications" | "chat" | "settings">("overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [favoriteStylistId, setFavoriteStylistId] = useState("");
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [notificationUnread, setNotificationUnread] = useState(0);
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const { toasts, toast, remove } = useToast();

  // Show toast from sessionStorage (e.g. after login)
  useEffect(() => {
    const t = popSessionToast();
    if (t) toast(t.type as "success" | "error" | "info", t.title, t.message);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    user, loading,
    upcomingBookings, pastBookings,
    cancellingId, cancelBooking,
    totalSpent, loyaltyPoints, totalBookings,
    chatMessages, newMessage, setNewMessage,
    wsStatus, sendMessage, chatEndRef,
    unreadCount, markChatRead, markChatClosed,
    appointmentUnread, markAppointmentsRead,
    logout, updateProfile,
  } = useClientDashboard();

  const dashboardNotifications = useMemo(
    () => buildClientNotificationFeed(notifs, upcomingBookings, pastBookings, chatMessages),
    [notifs, upcomingBookings, pastBookings, chatMessages]
  );
  const totalNotificationUnread = notificationUnread + appointmentUnread + unreadCount;

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [profileErrors, setProfileErrors] = useState<{ name?: string; phone?: string; general?: string }>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync form when user loads
  useEffect(() => {
    if (user) setProfileForm({ name: user.name, phone: user.phone ?? "" });
  }, [user]);

  // Sync tab from URL query param on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab === "appointments" || tab === "notifications" || tab === "chat" || tab === "settings") {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("gs_favorite_stylist_id");
    if (stored) setFavoriteStylistId(stored);
  }, []);

  useEffect(() => {
    return notificationService.subscribe((items) => {
      setNotifs(items);
      setNotificationUnread(items.filter((n) => !n.read).length);
    });
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gs_family_profiles");
      if (stored) setFamilyProfiles(JSON.parse(stored) as FamilyProfile[]);
    } catch {
      setFamilyProfiles([]);
    }
  }, []);

  const saveFamilyProfile = (profile: Omit<FamilyProfile, "id">) => {
    const next = [...familyProfiles, { ...profile, id: `fp-${Date.now()}` }];
    setFamilyProfiles(next);
    localStorage.setItem("gs_family_profiles", JSON.stringify(next));
    setShowFamilyModal(false);
    toast("success", "Profile added", `${profile.name} is ready for quicker bookings.`);
  };

  // Mark chat / appointments read when tab is open
  useEffect(() => {
    if (activeTab === "chat") {
      markChatRead();
    } else {
      markChatClosed();
    }
    if (activeTab === "appointments") {
      markAppointmentsRead();
    }
    setShowMobileMenu(false);
    setShowProfileMenu(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", border: "4px solid rgba(201,151,59,0.2)", borderTopColor: "var(--gold)", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className="client-dashboard-shell" style={{
      height: "100vh",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
      display: "flex",
      overflow: "hidden"
    }}>
      <ToastContainer toasts={toasts} onRemove={remove} />
      {showMobileMenu && (
        <button
          aria-label="Close menu"
          className="client-mobile-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      {/* ── SIDEBAR ── */}
      <aside className={showMobileMenu ? "client-dashboard-sidebar client-dashboard-sidebar-open" : "client-dashboard-sidebar"} style={{
        width: 260,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border-light)" }}>
          <Link href={ROUTES.HOME} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo size={54} />
            <div>
              <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.88rem", lineHeight: 1, fontFamily: "var(--font-display), Georgia, serif" }}>{APP_NAME}</p>
              <p style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--text-muted)", marginTop: 3 }}>Client Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav List */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { tab: "overview",      label: "Overview",            Icon: Scissors,      badge: 0 },
            { tab: "appointments",  label: "My Appointments",     Icon: CalendarDays,  badge: appointmentUnread },
            { tab: "notifications", label: "Notifications",       Icon: Bell,          badge: totalNotificationUnread },
            { tab: "chat",          label: "Consultation Chat",   Icon: MessageSquare, badge: unreadCount },
            { tab: "settings",      label: "Profile Settings",    Icon: Settings,      badge: 0 },
          ].map(({ tab, label, Icon, badge }) => {
            const on = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as typeof activeTab);
                  setShowMobileMenu(false);
                }}
                style={tabBtnStyle(on)}
              >
                <Icon style={{ width: 15, height: 15, color: on ? "var(--gold)" : "var(--text-muted)", flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                <RedBadge count={badge} />
              </button>
            );
          })}
        </nav>

        {/* Profile footer */}
        <div style={{ padding: "12px", borderTop: "1px solid var(--border-light)", position: "relative" }}>

          {/* Popover menu */}
          {showProfileMenu && (
            <>
              <div
                onClick={() => setShowProfileMenu(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
              />
              <div style={{
                position: "absolute", bottom: "calc(100% + 10px)", left: 12, right: 12,
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
                <button
                  onClick={() => { setActiveTab("settings"); setShowProfileMenu(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent",
                    fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)", cursor: "pointer",
                    textAlign: "left", transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Settings style={{ width: 15, height: 15, color: "var(--text-muted)" }} /> Settings
                </button>
                <div style={{ height: 1, background: "var(--border-light)", margin: "4px 0" }} />
                <button
                  onClick={logout}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent",
                    fontSize: "0.82rem", fontWeight: 500, color: "#ef4444", cursor: "pointer",
                    width: "100%", textAlign: "left", transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <LogOut style={{ width: 15, height: 15 }} /> Logout
                </button>
              </div>
            </>
          )}

          {/* Profile trigger button */}
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
              transition: "transform 0.2s ease"
            }} />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", minHeight: 0, overflow: "hidden" }}>
        <header className="client-mobile-header">
          <Link href={ROUTES.HOME} className="client-mobile-brand">
            <Logo size={36} />
            <span>{APP_NAME}</span>
          </Link>
          <button
            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            className="client-mobile-menu-button"
            onClick={() => setShowMobileMenu((v) => !v)}
          >
            {showMobileMenu ? <X size={19} /> : <Menu size={19} />}
          </button>
        </header>

      <main className="client-dashboard-main" style={{ flex: 1, minHeight: 0, padding: "40px 48px", overflowY: "auto", overflowX: "hidden" }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div className="client-dashboard-page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
              <div>
                <span style={{
                  display: "block",
                  fontSize: "0.68rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.25em",
                  color: "var(--gold)", marginBottom: 8
                }}>
                  Welcome Back
                </span>
                <h1 style={{
                  fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-display), Georgia, serif",
                  color: "var(--text-primary)"
                }}>
                  Hello, {user.name}
                </h1>
              </div>
              <Link href={ROUTES.BOOK} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 22px", borderRadius: 11, background: "var(--grad-gold-btn)",
                color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
                textDecoration: "none", boxShadow: "0 6px 20px rgba(201,151,59,0.3)",
                letterSpacing: "0.02em"
              }}>
                <Plus style={{ width: 14, height: 14 }} /> Book New Appointment
              </Link>
            </div>

            <AppointmentHeroCard
              booking={upcomingBookings[0]}
              cancellingId={cancellingId}
              onCancel={cancelBooking}
            />

            <OffersStrip />

            <ServiceMemoryCard
              pastBookings={pastBookings}
            />

            {/* Stat Cards */}
            <div className="client-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 40 }}>
              <div style={statCardStyle}>
                <div>
                  <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 10 }}>Total Appointments</p>
                  <p style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, fontFamily: "var(--font-display), Georgia, serif" }}>{totalBookings}</p>
                </div>
                <div style={iconBoxStyle}><CalendarDays style={{ width: 18, height: 18, color: "var(--gold)" }} /></div>
              </div>

              <div style={statCardStyle}>
                <div>
                  <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 10 }}>Loyalty Points</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <p style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--gold)", lineHeight: 1, fontFamily: "var(--font-display), Georgia, serif" }}>{loyaltyPoints}</p>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>pts</span>
                  </div>
                </div>
                <div style={iconBoxStyle}><Star style={{ width: 18, height: 18, color: "var(--gold)" }} /></div>
              </div>

              <div style={statCardStyle}>
                <div>
                  <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 10 }}>Total Spent</p>
                  <p style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, fontFamily: "var(--font-display), Georgia, serif" }}>Rs. {totalSpent.toLocaleString()}</p>
                </div>
                <div style={iconBoxStyle}><Scissors style={{ width: 18, height: 18, color: "var(--gold)", transform: "rotate(45deg)" }} /></div>
              </div>
            </div>

            {/* Upcoming Appointments Section */}
            <div className="client-overview-grid" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 28 }}>
              <div>
                <h2 style={{
                  fontSize: "1rem", fontWeight: 700, marginBottom: 18,
                  fontFamily: "var(--font-display), Georgia, serif",
                  letterSpacing: "-0.01em"
                }}>Upcoming Sessions</h2>
                
                {loading ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading appointments...</p>
                ) : upcomingBookings.length === 0 ? (
                  <div style={{
                    padding: "40px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                    border: "1px dashed var(--border-light)", textAlign: "center"
                  }}>
                    <Clock3 style={{ width: 32, height: 32, color: "var(--text-muted)", margin: "0 auto 12px" }} />
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 14 }}>No upcoming bookings scheduled.</p>
                    <Link href={ROUTES.BOOK} style={{ fontSize: "0.82rem", color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>Book one now <ChevronRight style={{ width: 12, height: 12, display: "inline" }} /></Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {upcomingBookings.slice(0, 3).map((b) => (
                      <div key={b.id} style={bookingRowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{
                            width: 50, height: 50, borderRadius: 12, background: "rgba(201,151,59,0.08)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                          }}>
                            <span style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>{new Date(b.date).toLocaleDateString("en-US", { month: "short" })}</span>
                            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{new Date(b.date).getDate()}</span>
                          </div>
                          <div>
                            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{b.serviceName}</h4>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>with {b.stylistName} &bull; {b.time}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <span style={statusBadgeStyle(b.status)}>{b.status}</span>
                          <BookingTimeline status={b.status} compact />
                          {b.status !== "cancelled" && (
                            <button 
                              onClick={() => cancelBooking(b.id)}
                              disabled={cancellingId === b.id}
                              style={cancelBtnStyle}
                            >
                              {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar consultation callout */}
              <div>
                <h2 style={{
                  fontSize: "1rem", fontWeight: 700, marginBottom: 18,
                  fontFamily: "var(--font-display), Georgia, serif",
                  letterSpacing: "-0.01em"
                }}>Quick Consultation</h2>
                <div style={{
                  padding: "24px", borderRadius: 16,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  position: "relative", overflow: "hidden"
                }}>
                  {/* Subtle gold glow top-right */}
                  <div style={{
                    position: "absolute", top: -30, right: -30,
                    width: 100, height: 100, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,151,59,0.15) 0%, transparent 70%)",
                    pointerEvents: "none"
                  }} />

                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: "var(--grad-gold-btn)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                    boxShadow: "0 4px 16px rgba(201,151,59,0.3)"
                  }}>
                    <MessageSquare style={{ width: 17, height: 17, color: "#0d0c0a" }} />
                  </div>
                  <h3 style={{
                    fontSize: "0.95rem", fontWeight: 700, marginBottom: 8,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-display), Georgia, serif"
                  }}>Have questions about a service?</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 20 }}>
                    Discuss your styling queries, hair coloring preferences or check stylist availability directly with our support team.
                  </p>
                  <button
                    onClick={() => setActiveTab("chat")}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "11px", borderRadius: 10,
                      background: "var(--grad-gold-btn)",
                      border: "none",
                      color: "#0d0c0a",
                      fontSize: "0.78rem", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: "0 4px 16px rgba(201,151,59,0.25)",
                      letterSpacing: "0.03em"
                    }}
                  >
                    <MessageSquare style={{ width: 13, height: 13 }} />
                    Start Chatting
                    <RedBadge count={unreadCount} />
                  </button>
                </div>
                <FamilyProfilesCard
                  profiles={familyProfiles}
                  onAdd={() => setShowFamilyModal(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <h1 style={{
              fontSize: "2rem", fontWeight: 800, marginBottom: 6,
              fontFamily: "var(--font-display), Georgia, serif",
              letterSpacing: "-0.02em"
            }}>My Appointments</h1>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>Manage your upcoming bookings and review past style visits.</p>

            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Loading sessions...</p>
            ) : totalBookings === 0 ? (
              <div style={{
                padding: "80px 40px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                border: "1px dashed var(--border-light)", textAlign: "center"
              }}>
                <CalendarDays style={{ width: 44, height: 44, color: "var(--text-muted)", margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>No Bookings Yet</h3>
                <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginBottom: 20 }}>Book your first appointment in seconds.</p>
                <Link href={ROUTES.BOOK} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 10, background: "var(--grad-gold-btn)",
                  color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none"
                }}>
                  Book Appointment Now
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                
                {/* Upcoming */}
                {upcomingBookings.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.15em" }}>Upcoming Appointments</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {upcomingBookings.map((b) => (
                        <div key={b.id} style={bookingRowStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div style={{
                              width: 54, height: 54, borderRadius: 12, background: "rgba(201,151,59,0.08)",
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}>
                              <span style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>{new Date(b.date).toLocaleDateString("en-US", { month: "short" })}</span>
                              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{new Date(b.date).getDate()}</span>
                            </div>
                            <div>
                              <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{b.serviceName}</h4>
                              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 3 }}>
                                with <strong>{b.stylistName}</strong> &bull; {b.time} &bull; duration: {b.duration}m
                              </p>
                              {b.notes && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>&ldquo;{b.notes}&rdquo;</p>}
                              <BookingTimeline status={b.status} />
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <p style={{ fontSize: "0.95rem", fontWeight: 700, marginRight: 10 }}>Rs. {b.price.toLocaleString()}</p>
                            <span style={statusBadgeStyle(b.status)}>{b.status}</span>
                            {b.status !== "cancelled" && (
                              <button 
                                onClick={() => cancelBooking(b.id)}
                                disabled={cancellingId === b.id}
                                style={cancelBtnStyle}
                              >
                                {cancellingId === b.id ? "..." : "Cancel"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past / Cancelled */}
                {pastBookings.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.15em" }}>Past Appointments</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0.8 }}>
                      {pastBookings.map((b) => (
                        <div key={b.id} style={bookingRowStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div style={{
                              width: 54, height: 54, borderRadius: 12, background: "rgba(255,255,255,0.03)",
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}>
                              <span style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>{new Date(b.date).toLocaleDateString("en-US", { month: "short" })}</span>
                              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-secondary)", lineHeight: 1 }}>{new Date(b.date).getDate()}</span>
                            </div>
                            <div>
                              <h4 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{b.serviceName}</h4>
                              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                                with {b.stylistName} &bull; {b.date} &bull; {b.time}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>Rs. {b.price.toLocaleString()}</p>
                            <span style={statusBadgeStyle(b.status)}>{b.status}</span>
                            <Link href={`${ROUTES.BOOK}?service=${b.serviceId}&stylist=${b.stylistId}`} style={smallActionLinkStyle}>
                              <RotateCcw style={{ width: 13, height: 13 }} /> Book Again
                            </Link>
                            {b.status === "completed" && (
                              <button onClick={() => setReviewBookingId(b.id)} style={smallGhostButtonStyle}>
                                <Star style={{ width: 13, height: 13 }} /> Rate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div className="client-dashboard-page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 6, fontFamily: "var(--font-display), Georgia, serif" }}>Notifications</h1>
                <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>Booking updates, chat alerts and account reminders in one place.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => {
                  notificationService.markAllRead();
                  markAppointmentsRead();
                  markChatRead();
                }} style={smallGhostButtonStyle}>Mark read</button>
                <button onClick={() => notificationService.clearAll()} style={smallGhostButtonStyle}>Clear all</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
              <NotificationStat label="Unread" value={totalNotificationUnread} />
              <NotificationStat label="Appointments" value={upcomingBookings.length} />
              <NotificationStat label="Messages" value={unreadCount} />
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
                    href={n.url ?? "/dashboard?tab=notifications"}
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
        )}

        {/* TAB 3: CONSULTATION CHAT */}
        {activeTab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", animation: "fadeIn 0.3s ease-out" }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{
                  fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)",
                  fontFamily: "var(--font-display), Georgia, serif",
                  letterSpacing: "-0.02em"
                }}>Support Chat</h1>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 5 }}>Chat with Glamour Studio support</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99,
                background: wsStatus === "connected" ? "var(--status-confirmed-bg)" : "var(--status-cancelled-bg)",
                border: `1px solid ${wsStatus === "connected" ? "var(--status-confirmed-border)" : "var(--status-cancelled-border)"}` }}>
                {wsStatus === "connected"
                  ? <Wifi    style={{ width: 13, height: 13, color: "var(--status-confirmed)" }} />
                  : <WifiOff style={{ width: 13, height: 13, color: "var(--status-cancelled)" }} />}
                <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                  color: wsStatus === "connected" ? "var(--status-confirmed)" : "var(--status-cancelled)" }}>
                  {wsStatus}
                </span>
              </div>
            </div>

            <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Chat header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: "#0d0c0a" }}>
                  GS
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>Glamour Studio Support</h4>
                  <p style={{ fontSize: "0.7rem", color: "var(--gold)", marginTop: 2 }}>Typically replies in a few minutes</p>
                </div>
                {/* Total message count in this chat */}
                {chatMessages.length > 0 && (
                  <span style={{
                    fontSize: "0.68rem", color: "var(--text-muted)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                    padding: "3px 10px", borderRadius: 99
                  }}>
                    {chatMessages.length} message{chatMessages.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                {chatMessages.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <MessageSquare style={{ width: 32, height: 32, color: "var(--text-muted)" }} />
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Send a message to start the conversation.</p>
                  </div>
                ) : (
                  chatMessages.map((m) => {
                    const isUser = m.sender === user?.email;
                    return (
                      <div key={m.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                        {!isUser && (
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                            background: "var(--grad-gold-btn)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.62rem", fontWeight: 800, color: "#0d0c0a",
                            marginRight: 8, alignSelf: "flex-end", marginBottom: 2
                          }}>
                            GS
                          </div>
                        )}
                        <div style={{ maxWidth: "62%" }}>
                          {!isUser && (
                            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4, marginLeft: 2 }}>
                              Glamour Studio Support
                            </p>
                          )}
                          <div style={{
                            padding: "11px 15px",
                            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isUser ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
                            border: isUser ? "none" : "1px solid var(--border-light)",
                            color: isUser ? "#0d0c0a" : "var(--text-primary)",
                            boxShadow: isUser ? "0 4px 12px rgba(201,151,59,0.2)" : "none"
                          }}>
                            <p style={{ fontSize: "0.85rem", lineHeight: 1.55, color: isUser ? "#0d0c0a" : "var(--text-primary)" }}>
                              {m.text}
                            </p>
                            <p style={{
                              fontSize: "0.6rem", marginTop: 5, textAlign: "right",
                              color: isUser ? "rgba(13,12,10,0.55)" : "var(--text-muted)"
                            }}>
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} style={{ display: "flex", gap: 12, padding: "18px 20px", borderTop: "1px solid var(--border-light)", background: "var(--bg-card)" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  style={{
                    flex: 1, padding: "15px 20px", borderRadius: 14,
                    background: "var(--bg-secondary)",
                    border: "1.5px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem", outline: "none",
                    fontFamily: "inherit", minHeight: 52,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(201,151,59,0.5)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-light)"}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || wsStatus !== "connected"}
                  style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0, alignSelf: "center",
                    background: newMessage.trim() && wsStatus === "connected" ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
                    border: newMessage.trim() && wsStatus === "connected" ? "none" : "1.5px solid var(--border-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: newMessage.trim() && wsStatus === "connected" ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    boxShadow: newMessage.trim() && wsStatus === "connected" ? "0 4px 16px rgba(201,151,59,0.35)" : "none"
                  }}
                >
                  <Send style={{ width: 17, height: 17, color: newMessage.trim() && wsStatus === "connected" ? "#0d0c0a" : "var(--text-muted)" }} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ animation: "fadeIn 0.3s ease-out", maxWidth: 680 }}>

            {/* ── Page header ── */}
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--gold)" }}>
                Account
              </span>
              <h1 style={{
                fontSize: "2rem", fontWeight: 800, marginTop: 6,
                fontFamily: "var(--font-display), Georgia, serif",
                letterSpacing: "-0.02em", color: "var(--text-primary)"
              }}>Profile Settings</h1>
            </div>

            {/* ── Avatar hero card ── */}
            <div style={{
              borderRadius: 20, overflow: "hidden", marginBottom: 16,
              border: "1px solid var(--border-light)",
              background: "var(--bg-card)"
            }}>
              {/* Gold banner strip */}
              <div style={{
                height: 80,
                background: "linear-gradient(135deg, rgba(201,151,59,0.22) 0%, rgba(201,151,59,0.06) 60%, transparent 100%)",
                borderBottom: "1px solid rgba(201,151,59,0.12)",
                position: "relative"
              }}>
                <div style={{ position: "absolute", top: -20, right: 40, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,151,59,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 10, right: 130, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
              </div>

              {/* Avatar + name */}
              <div style={{ padding: "0 28px 28px", marginTop: -36 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginBottom: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
                    background: "var(--grad-gold-btn)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", fontWeight: 900, color: "#0d0c0a",
                    border: "3px solid var(--bg-card)",
                    boxShadow: "0 8px 24px rgba(201,151,59,0.35)",
                    fontFamily: "var(--font-display), Georgia, serif"
                  }}>
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2, fontFamily: "var(--font-display), Georgia, serif" }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: 4 }}>{user.email}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[
                    { label: "Bookings",      value: String(totalBookings) },
                    { label: "Loyalty Points",value: `${loyaltyPoints} pts` },
                    { label: "Total Spent",   value: `Rs. ${totalSpent.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      padding: "12px 14px", borderRadius: 12, textAlign: "center",
                      background: "var(--bg-secondary)", border: "1px solid var(--border-light)"
                    }}>
                      <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--gold)", fontFamily: "var(--font-display), Georgia, serif", lineHeight: 1 }}>{value}</p>
                      <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginTop: 5 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Personal Information card ── */}
            <div style={{
              borderRadius: 16, background: "var(--bg-card)",
              border: "1px solid var(--border-light)", marginBottom: 14,
              overflow: "hidden"
            }}>
              <div style={{
                padding: "14px 22px", borderBottom: "1px solid var(--border-light)",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <User style={{ width: 12, height: 12, color: "var(--gold)" }} />
                  </div>
                  <h3 style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Personal Information
                  </h3>
                </div>
                {!editMode ? (
                  <button
                    onClick={() => { setEditMode(true); setProfileSaved(false); setProfileErrors({}); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, cursor: "pointer", background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)", color: "var(--gold)", fontSize: "0.74rem", fontWeight: 700 }}
                  >
                    <Pencil style={{ width: 11, height: 11 }} /> Edit
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { setEditMode(false); setProfileErrors({}); if (user) setProfileForm({ name: user.name, phone: user.phone ?? "" }); }}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, cursor: "pointer", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.74rem", fontWeight: 700 }}
                    >
                      <X style={{ width: 11, height: 11 }} /> Cancel
                    </button>
                    <button
                      onClick={async () => {
                        setProfileErrors({});
                        setProfileSaving(true);
                        const res = await updateProfile(profileForm.name, profileForm.phone);
                        setProfileSaving(false);
                        if (res.success) {
                          setEditMode(false);
                          setProfileSaved(true);
                          toast("success", "Profile Updated", "Your information has been saved.");
                          setTimeout(() => setProfileSaved(false), 3000);
                        } else if (res.errors) {
                          setProfileErrors(res.errors);
                        } else {
                          setProfileErrors({ general: res.error ?? "Something went wrong." });
                        }
                      }}
                      disabled={profileSaving}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, cursor: profileSaving ? "not-allowed" : "pointer", background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.74rem", fontWeight: 700, opacity: profileSaving ? 0.7 : 1 }}
                    >
                      {profileSaving
                        ? <><span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Saving…</>
                        : <><Check style={{ width: 11, height: 11 }} /> Save</>
                      }
                    </button>
                  </div>
                )}
              </div>

              {profileErrors.general && (
                <div style={{ margin: "12px 22px 0", padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.78rem", color: "#f87171" }}>
                  {profileErrors.general}
                </div>
              )}

              {profileSaved && !editMode && (
                <div style={{ margin: "12px 22px 0", padding: "10px 14px", borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", fontSize: "0.78rem", color: "#34d399", display: "flex", alignItems: "center", gap: 8 }}>
                  <Check style={{ width: 13, height: 13 }} /> Profile updated successfully.
                </div>
              )}

              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 22px", borderBottom: "1px solid var(--border-light)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 5 }}>Full Name</p>
                  {editMode ? (
                    <>
                      <input value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} style={{ width: "100%", background: "var(--bg-secondary)", border: `1.5px solid ${profileErrors.name ? "#f87171" : "rgba(201,151,59,0.35)"}`, borderRadius: 9, padding: "8px 12px", fontSize: "0.86rem", color: "var(--text-primary)", outline: "none" }} />
                      {profileErrors.name && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{profileErrors.name}</p>}
                    </>
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>{user?.name}</p>
                  )}
                </div>
              </div>

              {/* Email — always read only */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 22px", borderBottom: "1px solid var(--border-light)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 5 }}>Email Address</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>{user?.email}</p>
                </div>
                <span style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 99, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-muted)", flexShrink: 0 }}>
                  Read only
                </span>
              </div>

              {/* Phone */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 22px" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 5 }}>Phone Number</p>
                  {editMode ? (
                    <>
                      <input value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} style={{ width: "100%", background: "var(--bg-secondary)", border: `1.5px solid ${profileErrors.phone ? "#f87171" : "rgba(201,151,59,0.35)"}`, borderRadius: 9, padding: "8px 12px", fontSize: "0.86rem", color: "var(--text-primary)", outline: "none" }} />
                      {profileErrors.phone && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{profileErrors.phone}</p>}
                    </>
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {user?.phone || <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>Not provided</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <FavoriteStylistCard
              bookings={[...upcomingBookings, ...pastBookings]}
              favoriteStylistId={favoriteStylistId}
              onChange={(id) => {
                setFavoriteStylistId(id);
                localStorage.setItem("gs_favorite_stylist_id", id);
                toast("success", "Favorite stylist saved", "Your next booking can start with this stylist selected.");
              }}
            />

          </div>
        )}
      </main>
      </div>
      {reviewBookingId && (
        <ReviewModal
          booking={pastBookings.find((b) => b.id === reviewBookingId)}
          onClose={() => setReviewBookingId(null)}
          onSubmit={() => {
            toast("success", "Review saved", "Thank you for rating your visit.");
            setReviewBookingId(null);
          }}
        />
      )}
      {showFamilyModal && (
        <FamilyProfileModal
          onClose={() => setShowFamilyModal(false)}
          onSubmit={saveFamilyProfile}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .client-mobile-header,
        .client-mobile-overlay {
          display: none;
        }
        @media (max-width: 768px) {
          .client-dashboard-shell {
            display: block !important;
          }
          .client-dashboard-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 60 !important;
            width: min(84vw, 300px) !important;
            height: 100dvh !important;
            transform: translateX(-100%);
            transition: transform 0.24s ease;
            box-shadow: 20px 0 45px rgba(0,0,0,0.28);
          }
          .client-dashboard-sidebar-open {
            transform: translateX(0);
          }
          .client-mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 50;
            border: 0;
            background: rgba(13, 12, 10, 0.45);
            backdrop-filter: blur(2px);
          }
          .client-mobile-header {
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 16px;
            border-bottom: 1px solid var(--border-light);
            background: var(--bg-secondary);
            position: sticky;
            top: 0;
            z-index: 30;
          }
          .client-mobile-brand {
            display: flex;
            align-items: center;
            gap: 9px;
            color: var(--text-primary);
            text-decoration: none;
            font-size: 0.86rem;
            font-weight: 800;
          }
          .client-mobile-menu-button {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1px solid rgba(201,151,59,0.22);
            background: rgba(201,151,59,0.08);
            color: var(--gold);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .client-dashboard-main {
            padding: 18px 16px !important;
            height: calc(100dvh - 64px);
          }
          .client-dashboard-page-head {
            align-items: flex-start !important;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px !important;
          }
          .client-dashboard-page-head h1 {
            font-size: 1.85rem !important;
          }
          .client-dashboard-page-head a {
            width: 100%;
            justify-content: center;
          }
          .client-stat-grid,
          .client-overview-grid {
            grid-template-columns: 1fr !important;
          }
          .client-stat-grid {
            margin-bottom: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── INLINE STYLES ──

function tabBtnStyle(isActive: boolean) {
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
    background: isActive ? "rgba(201,151,59,0.1)" : "transparent",
    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
    transition: "all 0.2s ease",
    textAlign: "left" as const
  };
}

const statCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 24px",
  borderRadius: 16,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-light)",
  transition: "border-color 0.2s, box-shadow 0.2s"
};

const iconBoxStyle = {
  width: 42,
  height: 42,
  borderRadius: 10,
  background: "rgba(201,151,59,0.08)",
  border: "1px solid rgba(201,151,59,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const bookingRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 20px",
  borderRadius: 14,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-light)"
};

const smallActionLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "var(--gold)",
  fontSize: "0.78rem",
  fontWeight: 800,
  textDecoration: "none",
  whiteSpace: "nowrap" as const
};

const smallGhostButtonStyle = {
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
  whiteSpace: "nowrap" as const
};

const notificationRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 18px",
  borderRadius: 14,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-light)",
  color: "var(--text-primary)",
  textDecoration: "none"
};

const emptyStateStyle = {
  padding: "48px 28px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.02)",
  border: "1px dashed var(--border-light)",
  textAlign: "center" as const
};

type ClientNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: AppNotification["type"];
  label: string;
  timestamp: number;
  read: boolean;
  url?: string;
  source: "local" | "booking" | "chat";
};

function buildClientNotificationFeed(
  localNotifications: AppNotification[],
  upcomingBookings: ClientBooking[],
  pastBookings: ClientBooking[],
  chatMessages: ChatMessage[],
): ClientNotificationItem[] {
  const bookingItems = [...upcomingBookings, ...pastBookings]
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12)
    .map((booking) => ({
      id: `booking-${booking.id}`,
      title: bookingStatusTitle(booking.status),
      body: `${booking.serviceName} with ${booking.stylistName} • ${formatBookingDate(booking.date)} at ${booking.time}`,
      type: "status" as const,
      label: "Booking",
      timestamp: new Date(booking.createdAt).getTime(),
      read: booking.status !== "pending",
      url: "/dashboard?tab=appointments",
      source: "booking" as const,
    }));

  const chatItems = chatMessages
    .filter((message) => message.sender === "admin")
    .slice(-8)
    .map((message) => ({
      id: `chat-${message.id}`,
      title: `Message from ${message.senderName || "Glamour Studio"}`,
      body: message.text,
      type: "chat" as const,
      label: "Chat",
      timestamp: new Date(message.createdAt).getTime(),
      read: true,
      url: "/dashboard?tab=chat",
      source: "chat" as const,
    }));

  const localItems = localNotifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    label: notificationLabel(notification.type),
    timestamp: notification.timestamp,
    read: notification.read,
    url: notification.url,
    source: "local" as const,
  }));

  return [...localItems, ...bookingItems, ...chatItems]
    .filter((item, index, all) => all.findIndex((n) => n.id === item.id) === index)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function bookingStatusTitle(status: string) {
  const labels: Record<string, string> = {
    pending: "Booking request received",
    confirmed: "Booking confirmed",
    completed: "Visit completed",
    cancelled: "Booking cancelled",
  };
  return labels[status] ?? "Booking update";
}

function notificationLabel(type: AppNotification["type"]) {
  const labels: Record<AppNotification["type"], string> = {
    booking: "Booking",
    chat: "Chat",
    status: "Status",
    system: "System",
  };
  return labels[type];
}

function notificationIcon(type: AppNotification["type"]) {
  const style = { width: 16, height: 16, color: "var(--gold)" };
  if (type === "chat") return <MessageSquare style={style} />;
  if (type === "booking" || type === "status") return <CalendarDays style={style} />;
  return <Bell style={style} />;
}

function notificationPillStyle(type: AppNotification["type"]) {
  const colors: Record<AppNotification["type"], { color: string; bg: string }> = {
    booking: { color: "var(--gold)", bg: "rgba(201,151,59,0.1)" },
    status: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
    chat: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    system: { color: "var(--text-muted)", bg: "rgba(255,255,255,0.06)" },
  };
  return {
    color: colors[type].color,
    background: colors[type].bg,
    borderRadius: 999,
    padding: "3px 8px",
    fontSize: "0.62rem",
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  };
}

function formatBookingDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function timeAgo(timestamp: number) {
  const diff = Math.max(0, Date.now() - timestamp);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "Now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

function NotificationStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
      <p style={{ fontSize: "0.66rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: "1.45rem", color: "var(--text-primary)", fontWeight: 900, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

const modalInputStyle = {
  width: "100%",
  borderRadius: 11,
  border: "1px solid var(--border-light)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text-primary)",
  padding: "11px 12px",
  fontSize: "0.86rem",
  outline: "none"
};

type FamilyProfile = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

function addToCalendarUrl(booking: ClientBooking) {
  const start = parseBookingDateTime(booking.date, booking.time);
  if (!start) {
    return ROUTES.MY_BOOKINGS;
  }
  const end = new Date(start.getTime() + booking.duration * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${booking.serviceName} at Glamour Studio`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Stylist: ${booking.stylistName}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function parseBookingDateTime(date: string, time: string) {
  const datePart = date.includes("T") ? date.split("T")[0] : date;
  const timeMatch = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!datePart || !timeMatch) {
    const fallback = new Date(date);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const parsed = new Date(`${datePart}T${paddedHours}:${paddedMinutes}:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function AppointmentHeroCard({ booking, cancellingId, onCancel }: {
  booking?: ClientBooking;
  cancellingId: string | null;
  onCancel: (id: string) => void;
}) {
  if (!booking) return null;
  return (
    <section style={{ marginBottom: 18, padding: "24px", borderRadius: 16, background: "linear-gradient(135deg, rgba(201,151,59,0.18), rgba(255,255,255,0.035))", border: "1px solid rgba(201,151,59,0.28)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "0.68rem", color: "var(--gold)", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Next visit</p>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 900, fontFamily: "var(--font-display), Georgia, serif", marginBottom: 8 }}>{booking.serviceName}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            {new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {booking.time} with {booking.stylistName}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href={addToCalendarUrl(booking)} target="_blank" style={smallGhostButtonStyle}><CalendarPlus style={{ width: 14, height: 14 }} /> Add to Calendar</Link>
          <Link href={`${ROUTES.BOOK}?service=${booking.serviceId}&stylist=${booking.stylistId}`} style={smallGhostButtonStyle}><Pencil style={{ width: 14, height: 14 }} /> Reschedule</Link>
          <button onClick={() => onCancel(booking.id)} disabled={cancellingId === booking.id} style={smallGhostButtonStyle}>
            <X style={{ width: 14, height: 14 }} /> {cancellingId === booking.id ? "Cancelling" : "Cancel"}
          </button>
        </div>
      </div>
      <BookingTimeline status={booking.status} />
    </section>
  );
}

function BookingTimeline({ status, compact = false }: { status: string; compact?: boolean }) {
  const steps = ["pending", "confirmed", "completed"];
  const activeIndex = status === "cancelled" ? 0 : Math.max(0, steps.indexOf(status));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 5 : 8, marginTop: compact ? 0 : 18 }}>
      {steps.map((step, idx) => {
        const active = idx <= activeIndex && status !== "cancelled";
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: compact ? 5 : 8 }}>
            <span style={{ width: compact ? 8 : 10, height: compact ? 8 : 10, borderRadius: "50%", background: active ? "var(--gold)" : "rgba(255,255,255,0.16)" }} />
            {!compact && <span style={{ fontSize: "0.72rem", color: active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 800, textTransform: "capitalize" }}>{step}</span>}
            {idx < steps.length - 1 && <span style={{ width: compact ? 16 : 34, height: 1, background: idx < activeIndex ? "var(--gold)" : "rgba(255,255,255,0.12)" }} />}
          </div>
        );
      })}
    </div>
  );
}

function OffersStrip() {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
      {[
        ["GLAM20", "20% off on your next color refresh"],
        ["TRIMTIME", "Free consultation with any haircut booking"],
      ].map(([code, text]) => (
        <div key={code} style={{ padding: "16px 18px", borderRadius: 14, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={iconBoxStyle}><Gift style={{ width: 16, height: 16, color: "var(--gold)" }} /></div>
          <div>
            <p style={{ color: "var(--gold)", fontWeight: 900, fontSize: "0.82rem", letterSpacing: "0.12em" }}>{code}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 3 }}>{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function ServiceMemoryCard({ pastBookings }: { pastBookings: ClientBooking[] }) {
  const lastCompleted = pastBookings.find((b) => b.status === "completed");
  if (!lastCompleted) return null;
  const weeks = Math.max(1, Math.round((Date.now() - new Date(lastCompleted.date).getTime()) / (7 * 24 * 60 * 60 * 1000)));
  return (
    <div style={{ marginBottom: 28, padding: "14px 18px", borderRadius: 14, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>Last {lastCompleted.serviceName}: {weeks} weeks ago. Time for a refresh?</p>
      <Link href={`${ROUTES.BOOK}?service=${lastCompleted.serviceId}&stylist=${lastCompleted.stylistId}`} style={smallActionLinkStyle}>Book a trim <ChevronRight style={{ width: 13, height: 13 }} /></Link>
    </div>
  );
}

function FavoriteStylistCard({ bookings, favoriteStylistId, onChange }: {
  bookings: ClientBooking[];
  favoriteStylistId: string;
  onChange: (id: string) => void;
}) {
  const stylists = Array.from(new Map(bookings.map((b) => [b.stylistId, b.stylistName])).entries());
  if (stylists.length === 0) return null;
  return (
    <section style={{ marginBottom: 24, padding: "18px", borderRadius: 14, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 12 }}>Favorite stylist</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {stylists.map(([id, name]) => (
          <button key={id} onClick={() => onChange(id)} style={{ ...smallGhostButtonStyle, borderColor: favoriteStylistId === id ? "rgba(201,151,59,0.5)" : "var(--border-light)", color: favoriteStylistId === id ? "var(--gold)" : "var(--text-primary)" }}>
            <Heart style={{ width: 14, height: 14, fill: favoriteStylistId === id ? "var(--gold)" : "none" }} /> {name}
          </button>
        ))}
      </div>
    </section>
  );
}

function FamilyProfilesCard({ profiles, onAdd }: { profiles: FamilyProfile[]; onAdd: () => void }) {
  return (
    <div style={{ marginTop: 18, padding: "18px", borderRadius: 14, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Users style={{ width: 17, height: 17, color: "var(--gold)" }} />
        <h3 style={{ fontSize: "0.92rem", fontWeight: 800 }}>Family profiles</h3>
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>Save family members for quicker bookings from one account.</p>
      {profiles.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {profiles.slice(0, 3).map((profile) => (
            <div key={profile.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 10px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>{profile.name}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{profile.relation}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onAdd} style={smallGhostButtonStyle}><Plus style={{ width: 13, height: 13 }} /> Add profile</button>
    </div>
  );
}

function ReviewModal({ booking, onClose, onSubmit }: { booking?: ClientBooking; onClose: () => void; onSubmit: () => void }) {
  const [rating, setRating] = useState(5);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(460px, 100%)", borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: 24 }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: 6 }}>Rate your visit</h2>
        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: 18 }}>{booking?.serviceName ?? "Completed appointment"} with {booking?.stylistName ?? "your stylist"}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} style={{ border: 0, background: "transparent", cursor: "pointer", padding: 2 }}>
              <Star style={{ width: 28, height: 28, color: "var(--gold)", fill: n <= rating ? "var(--gold)" : "none" }} />
            </button>
          ))}
        </div>
        <textarea placeholder="Share a quick note" style={{ width: "100%", minHeight: 96, borderRadius: 12, border: "1px solid var(--border-light)", background: "rgba(255,255,255,0.03)", color: "var(--text-primary)", padding: 12, resize: "vertical", marginBottom: 16 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={smallGhostButtonStyle}>Later</button>
          <button onClick={onSubmit} style={{ ...smallGhostButtonStyle, background: "var(--grad-gold-btn)", color: "#0d0c0a", borderColor: "transparent" }}>Submit review</button>
        </div>
      </div>
    </div>
  );
}

function FamilyProfileModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (profile: Omit<FamilyProfile, "id">) => void;
}) {
  const [form, setForm] = useState({ name: "", relation: "", phone: "" });
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      relation: form.relation.trim() || "Family",
      phone: form.phone.trim(),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form onSubmit={submit} style={{ width: "min(430px, 100%)", borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: 24 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 900, marginBottom: 6 }}>Add family profile</h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 18 }}>Keep family details ready for faster future bookings.</p>
        <div style={{ display: "grid", gap: 12 }}>
          <input
            value={form.name}
            onChange={(e) => { setForm((prev) => ({ ...prev, name: e.target.value })); setError(""); }}
            placeholder="Name"
            style={modalInputStyle}
          />
          <input
            value={form.relation}
            onChange={(e) => setForm((prev) => ({ ...prev, relation: e.target.value }))}
            placeholder="Relation"
            style={modalInputStyle}
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone optional"
            style={modalInputStyle}
          />
        </div>
        {error && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: 10 }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button type="button" onClick={onClose} style={smallGhostButtonStyle}>Cancel</button>
          <button type="submit" style={{ ...smallGhostButtonStyle, background: "var(--grad-gold-btn)", color: "#0d0c0a", borderColor: "transparent" }}>Save profile</button>
        </div>
      </form>
    </div>
  );
}

function statusBadgeStyle(status: string) {
  const meta: Record<string, { color: string; bg: string }> = {
    pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    confirmed: { color: "#10b981", bg: "rgba(16,185,129,0.08)" },
    completed: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.08)" }
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
    background: current.bg
  };
}

const cancelBtnStyle = {
  padding: "6px 12px",
  borderRadius: 8,
  background: "rgba(239,68,68,0.05)",
  border: "1px solid rgba(239,68,68,0.25)",
  color: "#ef4444",
  fontSize: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s"
};
