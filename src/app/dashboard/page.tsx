"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scissors, CalendarDays,
  MessageSquare, Settings, LogOut, Clock3,
  ChevronRight, ChevronUp, Star, Send, Plus, Wifi, WifiOff,
  User, Mail, Phone, ShieldAlert
} from "lucide-react";

import { ROUTES, APP_NAME } from "@/constants";
import { useClientDashboard } from "@/hooks/useClientDashboard";

import { ToastContainer, useToast } from "@/components/ui/Toast";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "chat" | "settings">("overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  const {
    user, loading,
    upcomingBookings, pastBookings,
    cancellingId, cancelBooking,
    totalSpent, loyaltyPoints, totalBookings,
    chatMessages, newMessage, setNewMessage,
    wsStatus, sendMessage, chatEndRef,
    unreadCount, markChatRead, markChatClosed,
    logout,
  } = useClientDashboard();

  // Sync tab from URL query param on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab === "appointments" || tab === "chat" || tab === "settings") {
      setActiveTab(tab);
    }
  }, []);

  // Mark chat read when chat tab is open, closed otherwise
  useEffect(() => {
    if (activeTab === "chat") {
      markChatRead();
    } else {
      markChatClosed();
    }
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
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
      display: "flex"
    }}>
      <ToastContainer toasts={toasts} onRemove={remove} />
      {/* ── SIDEBAR ── */}
      <aside style={{
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
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(201,151,59,0.3)"
            }}>
              <Scissors style={{ width: 15, height: 15, color: "#0d0c0a", transform: "rotate(45deg)" }} />
            </div>
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
            { tab: "appointments",  label: "My Appointments",     Icon: CalendarDays,  badge: 0 },
            { tab: "chat",          label: "Consultation Chat",   Icon: MessageSquare, badge: unreadCount },
            { tab: "settings",      label: "Profile Settings",    Icon: Settings,      badge: 0 },
          ].map(({ tab, label, Icon, badge }) => {
            const on = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                style={tabBtnStyle(on)}
              >
                <Icon style={{ width: 15, height: 15, color: on ? "var(--gold)" : "var(--text-muted)", flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                {badge > 0 && (
                  <span style={{
                    minWidth: 18, height: 18, borderRadius: 99,
                    background: "var(--grad-gold-btn)",
                    color: "#0d0c0a", fontSize: "0.6rem", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 5px", flexShrink: 0
                  }}>
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
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
      <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto", maxHeight: "100vh" }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
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

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 40 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 28 }}>
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
                    {unreadCount > 0 && (
                      <span style={{
                        marginLeft: 4,
                        minWidth: 18, height: 18, borderRadius: 99,
                        background: "#0d0c0a",
                        color: "var(--gold)", fontSize: "0.6rem", fontWeight: 800,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        padding: "0 5px"
                      }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
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
                display: "flex", alignItems: "center", gap: 10
              }}>
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

              {[
                { label: "Full Name",     value: user.name,  Icon: User  },
                { label: "Email Address", value: user.email, Icon: Mail  },
                { label: "Phone Number",  value: user.phone, Icon: Phone },
              ].map(({ label, value, Icon }, i, arr) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "15px 22px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none"
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 3 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {value || <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>Not provided</span>}
                    </p>
                  </div>
                  <span style={{
                    fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                    padding: "3px 8px", borderRadius: 99,
                    background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
                    color: "var(--text-muted)", flexShrink: 0
                  }}>
                    Read only
                  </span>
                </div>
              ))}
            </div>

            {/* ── Info notice ── */}
            <div style={{
              padding: "15px 18px", borderRadius: 14,
              background: "rgba(201,151,59,0.05)",
              border: "1px solid rgba(201,151,59,0.18)",
              display: "flex", gap: 13, alignItems: "flex-start"
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1
              }}>
                <ShieldAlert style={{ width: 13, height: 13, color: "var(--gold)" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gold)", marginBottom: 4 }}>
                  Want to update your details?
                </p>
                <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  To change your registered phone number or email, contact our support team at{" "}
                  <a href="mailto:hello@glamourstudio.pk" style={{ color: "var(--gold-light)", fontWeight: 600, textDecoration: "none" }}>
                    hello@glamourstudio.pk
                  </a>{" "}
                  for identity verification.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
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
