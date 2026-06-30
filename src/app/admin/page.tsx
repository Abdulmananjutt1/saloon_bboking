"use client";

import Link from "next/link";
import Image from "next/image";
import { ROUTES, STATUS_META } from "@/constants";
import { formatPrice, formatDateShort, getStatusColor } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, DollarSign, CalendarCheck, Users,
  Scissors, ChevronRight, ArrowUpRight, BarChart3, RefreshCw
} from "lucide-react";
import DashboardChart from "@/components/DashboardChart";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminDashboard() {
  const { stats, loading, refreshing, refresh } = useAdminStats();

  const quickActions = [
    { label: "New Booking",  href: ROUTES.BOOK,            icon: CalendarCheck, ...STATUS_META.confirmed  },
    { label: "Add Service",  href: ROUTES.ADMIN_SERVICES,  icon: Scissors,      ...STATUS_META.completed  },
    { label: "Add Stylist",  href: ROUTES.ADMIN_STYLISTS,  icon: Users,         color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
    { label: "Analytics",    href: ROUTES.ADMIN_ANALYTICS, icon: BarChart3,     ...STATUS_META.confirmed  },
  ];

  const statCards = stats ? [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      trend: stats.revenueGrowth,
      trendLabel: "vs last month",
      accent: "var(--gold)",
      accentBg: "rgba(201,151,59,0.1)",
      accentBorder: "rgba(201,151,59,0.2)",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: CalendarCheck,
      trend: stats.bookingsGrowth,
      trendLabel: "vs last month",
      accent: STATUS_META.completed.color,
      accentBg: STATUS_META.completed.bg,
      accentBorder: STATUS_META.completed.border,
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toLocaleString(),
      icon: Users,
      trend: stats.clientGrowth,
      trendLabel: "vs last month",
      accent: "#a78bfa",
      accentBg: "rgba(167,139,250,0.1)",
      accentBorder: "rgba(167,139,250,0.2)",
    },
  ] : [];

  // Skeleton pulse style
  const skel = (w: string | number, h: number, r = 10) => ({
    width: w, height: h, borderRadius: r,
    background: "var(--border-light)",
    animation: "pulse 1.4s ease-in-out infinite",
  } as React.CSSProperties);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{
            fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)",
            letterSpacing: "-0.02em", marginBottom: 4,
            fontFamily: "var(--font-display), Georgia, serif"
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Welcome back, Admin — here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => refresh()}
            disabled={refreshing}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10, cursor: refreshing ? "not-allowed" : "pointer",
              background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)",
              color: "var(--gold)", fontSize: "0.74rem", fontWeight: 600,
              opacity: refreshing ? 0.6 : 1, transition: "all 0.2s"
            }}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 16px", borderRadius: 99,
            background: "var(--status-confirmed-bg)",
            border: "1px solid var(--status-confirmed-border)"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--status-confirmed)", boxShadow: "0 0 8px var(--status-confirmed)" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--status-confirmed)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 24 }}>
        {loading
          ? [0, 1, 2].map((i) => (
            <div key={i} style={{
              background: "var(--bg-card)", border: "1px solid var(--border-light)",
              borderRadius: 20, padding: "22px 22px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={skel(44, 44, 13)} />
                <div style={skel(64, 26, 99)} />
              </div>
              <div style={skel("60%", 36, 8)} />
              <div style={{ ...skel("40%", 14, 6), marginTop: 8 }} />
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>
                <div style={skel("50%", 10, 4)} />
              </div>
            </div>
          ))
          : statCards.map((s) => {
            const isPositive = s.trend >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            return (
              <div key={s.title} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: 20, padding: "22px 22px",
                position: "relative", overflow: "hidden",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}>
                <div style={{
                  position: "absolute", top: -40, right: -40,
                  width: 130, height: 130, borderRadius: "50%",
                  background: `radial-gradient(circle, ${s.accentBg} 0%, transparent 70%)`,
                  pointerEvents: "none"
                }} />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: s.accentBg, border: `1px solid ${s.accentBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <s.icon style={{ width: 19, height: 19, color: s.accent }} />
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 99,
                    background: isPositive ? STATUS_META.confirmed.bg : STATUS_META.cancelled.bg,
                    border: `1px solid ${isPositive ? STATUS_META.confirmed.border : STATUS_META.cancelled.border}`,
                  }}>
                    <TrendIcon style={{ width: 10, height: 10, color: isPositive ? STATUS_META.confirmed.color : STATUS_META.cancelled.color }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: isPositive ? STATUS_META.confirmed.color : STATUS_META.cancelled.color }}>
                      {isPositive ? "+" : ""}{s.trend}%
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: "2rem", fontWeight: 900, color: "var(--text-primary)",
                  lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 4,
                  fontFamily: "var(--font-display), Georgia, serif"
                }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>{s.title}</p>

                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>
                  <p style={{ fontSize: "0.67rem", color: "var(--text-muted)", opacity: 0.7 }}>{s.trendLabel}</p>
                </div>
              </div>
            );
          })}
      </div>

      {/* ── Chart ── */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-light)",
        borderRadius: 20, padding: "24px 24px 16px", marginBottom: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Performance Overview</p>
            <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Revenue trend — last 7 months</p>
          </div>
          <Link href={ROUTES.ADMIN_ANALYTICS} style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: "0.74rem", fontWeight: 600, color: "var(--gold)",
            textDecoration: "none", padding: "7px 14px", borderRadius: 9,
            background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)",
            transition: "all 0.2s"
          }}>
            Full Report <ArrowUpRight style={{ width: 13, height: 13 }} />
          </Link>
        </div>
        <DashboardChart />
      </div>

      {/* ── Recent Bookings ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border-light)",
          borderRadius: 20, overflow: "hidden"
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 22px", borderBottom: "1px solid var(--border-light)"
          }}>
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Recent Bookings</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Latest appointment activity</p>
            </div>
            <Link href={ROUTES.ADMIN_BOOKINGS} style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: "0.74rem", fontWeight: 600, color: "var(--gold)",
              textDecoration: "none", padding: "6px 12px", borderRadius: 8,
              background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)"
            }}>
              View all <ChevronRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "24px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={skel(34, 34, 99)} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={skel("40%", 14, 5)} />
                    <div style={skel("25%", 10, 4)} />
                  </div>
                  <div style={skel(60, 14, 5)} />
                  <div style={skel(70, 24, 99)} />
                </div>
              ))}
            </div>
          ) : !stats || stats.recentBookings.length === 0 ? (
            <div style={{ padding: "40px 22px", textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No bookings yet</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {["Client", "Service", "Date", "Amount", "Status"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 22px", textAlign: "left",
                        fontSize: "0.65rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.15em",
                        color: "var(--text-muted)", whiteSpace: "nowrap"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((b, i) => (
                    <tr key={b.id} style={{
                      borderBottom: i < stats.recentBookings.length - 1 ? "1px solid var(--border-light)" : "none",
                      transition: "background 0.15s"
                    }}>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "rgba(201,151,59,0.12)", border: "1px solid rgba(201,151,59,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", fontWeight: 800, color: "var(--gold)", flexShrink: 0
                          }}>                            {b.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{b.customerName}</p>
                            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>{b.customerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{b.serviceName}</p>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{formatDateShort(b.date)}</p>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gold)", whiteSpace: "nowrap" }}>{formatPrice(b.price)}</p>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Stylists + Quick Actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 8 }}>

        {/* Stylists */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border-light)" }}>
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Stylists</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Team availability</p>
            </div>
            <Link href={ROUTES.ADMIN_STYLISTS} style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: "0.74rem", fontWeight: 600, color: "var(--gold)",
              textDecoration: "none", padding: "6px 12px", borderRadius: 8,
              background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)"
            }}>
              View all <ChevronRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
            {loading ? [0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px" }}>
                <div style={skel(40, 40, 99)} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={skel("55%", 14, 5)} />
                  <div style={skel("35%", 10, 4)} />
                </div>
                <div style={skel(60, 26, 99)} />
              </div>
            )) : stats?.stylists.slice(0, 3).map((s) => (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 10px", borderRadius: 13,
                border: "1px solid transparent",
                transition: "all 0.2s"
              }}>
                {s.avatar ? (
                  <Image
                    src={s.avatar} alt={s.name}
                    width={40} height={40}
                    style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid var(--border-light)" }}
                  />
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(201,151,59,0.12)", border: "2px solid var(--border-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 800, color: "var(--gold)"
                  }}>
                    {s.name.charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.name}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>{s.role}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold)", marginBottom: 3 }}>
                    {s.bookingCount} bookings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "18px 22px" }}>
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Quick Actions</p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Shortcuts to common tasks</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {quickActions.map((a) => (
              <Link key={a.label} href={a.href} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                gap: 12, padding: "18px 16px", borderRadius: 14,
                background: a.bg, border: `1px solid ${a.border}`,
                textDecoration: "none", transition: "all 0.25s ease"
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <a.icon style={{ width: 18, height: 18, color: a.color }} />
                </div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{a.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
