"use client";

import { formatPrice } from "@/lib/utils";
import { TrendingUp, DollarSign, CalendarCheck, Users, Star, BarChart3 } from "lucide-react";
import { STATUS_META } from "@/constants";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AdminAnalyticsPage() {
  const { data, loading } = useAnalytics();

  // Skeleton helper
  const skel = (w: string | number, h: number, r = 10) => ({
    width: w, height: h, borderRadius: r,
    background: "var(--border-light)",
    animation: "pulse 1.4s ease-in-out infinite",
  } as React.CSSProperties);

  const maxRevenue = data ? Math.max(...data.monthlyData.map((d) => d.revenue), 1) : 1;
  const totalRev   = data ? data.topServices.reduce((a, s) => a + s.revenue, 0) : 1;

  const kpiCards = data ? [
    {
      title: "Total Revenue",
      value: formatPrice(data.kpi.totalRevenue),
      icon: DollarSign,
      accent: "var(--gold)",
      accentBg: "rgba(201,151,59,0.1)",
      accentBorder: "rgba(201,151,59,0.2)",
      badge: { label: "Revenue",  color: "var(--gold)", bg: "rgba(201,151,59,0.1)", border: "rgba(201,151,59,0.2)" },
    },
    {
      title: "Total Bookings",
      value: data.kpi.totalBookings.toLocaleString(),
      icon: CalendarCheck,
      accent: STATUS_META.completed.color,
      accentBg: STATUS_META.completed.bg,
      accentBorder: STATUS_META.completed.border,
      badge: { label: "Bookings", color: STATUS_META.completed.color, bg: STATUS_META.completed.bg, border: STATUS_META.completed.border },
    },
    {
      title: "Total Clients",
      value: data.kpi.totalClients.toLocaleString(),
      icon: Users,
      accent: "#a78bfa",
      accentBg: "rgba(167,139,250,0.1)",
      accentBorder: "rgba(167,139,250,0.2)",
      badge: { label: "Clients",  color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
    },
    {
      title: "Avg. Rating",
      value: `${data.kpi.avgRating}★`,
      icon: Star,
      accent: STATUS_META.pending.color,
      accentBg: STATUS_META.pending.bg,
      accentBorder: STATUS_META.pending.border,
      badge: { label: "Top Rated", color: STATUS_META.pending.color, bg: STATUS_META.pending.bg, border: STATUS_META.pending.border },
    },
  ] : [];

  const statusRows = data ? [
    { label: "Confirmed", value: data.statusBreakdown.confirmed, ...STATUS_META.confirmed },
    { label: "Pending",   value: data.statusBreakdown.pending,   ...STATUS_META.pending   },
    { label: "Completed", value: data.statusBreakdown.completed, ...STATUS_META.completed },
    { label: "Cancelled", value: data.statusBreakdown.cancelled, ...STATUS_META.cancelled },
  ] : [];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-display), Georgia, serif" }}>
            Analytics
          </h1>
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Live performance overview for Glamour Studio.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 24 }}>
        {loading
          ? [0, 1, 2, 3].map((i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={skel(44, 44, 13)} />
                <div style={skel(72, 26, 99)} />
              </div>
              <div style={skel("65%", 36, 8)} />
              <div style={{ ...skel("40%", 14, 6), marginTop: 8 }} />
            </div>
          ))
          : kpiCards.map((s) => (
            <div key={s.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "22px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${s.accentBg} 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: s.accentBg, border: `1px solid ${s.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon style={{ width: 19, height: 19, color: s.accent }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: s.badge.bg, border: `1px solid ${s.badge.border}` }}>
                  <TrendingUp style={{ width: 10, height: 10, color: s.badge.color }} />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.badge.color }}>{s.badge.label}</span>
                </div>
              </div>
              <p style={{ fontSize: "1.9rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>{s.value}</p>
              <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{s.title}</p>
            </div>
          ))
        }
      </div>

      {/* Chart + Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 24, marginTop: 16 }}>

        {/* Bar Chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "24px" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Monthly Revenue</p>
          <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: 48 }}>Last 7 months — live from database</p>

          {loading ? (
            <div style={{ height: 220, display: "flex", alignItems: "flex-end", gap: 12 }}>
              {[0.6, 0.8, 0.5, 0.9, 0.7, 1.0, 0.85].map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ ...skel("100%", Math.round(h * 160), 6) }} />
                  <div style={skel(24, 10, 3)} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 220, paddingBottom: 8 }}>
              {data!.monthlyData.map((d) => (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold-light)", whiteSpace: "nowrap" }}>
                    {d.revenue > 0 ? `Rs ${(d.revenue / 1000).toFixed(0)}k` : "—"}
                  </p>
                  <div style={{
                    width: "100%",
                    height: `${Math.max((d.revenue / maxRevenue) * 160, d.revenue > 0 ? 8 : 4)}px`,
                    background: d.revenue > 0
                      ? "linear-gradient(to top, rgba(201,151,59,0.9), rgba(224,185,106,0.7))"
                      : "var(--border-light)",
                    borderRadius: "8px 8px 4px 4px",
                    boxShadow: d.revenue > 0 ? "0 4px 20px rgba(201,151,59,0.2)" : "none",
                    transition: "all 0.3s ease",
                    minHeight: 4,
                  }} />
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>{d.month}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings by Status */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "24px" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Bookings by Status</p>
          <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: 28 }}>All-time breakdown</p>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={skel(80, 14, 4)} />
                    <div style={skel(24, 14, 4)} />
                  </div>
                  <div style={skel("100%", 7, 99)} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {statusRows.map((s) => {
                const pct = data!.statusBreakdown.total > 0
                  ? Math.round((s.value / data!.statusBreakdown.total) * 100)
                  : 0;
                return (
                  <div key={s.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                        <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</span>
                    </div>
                    <div style={{ height: 7, background: "var(--border-light)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`,
                        background: `linear-gradient(to right, ${s.color}, ${s.color}cc)`,
                        borderRadius: 99, transition: "width 0.6s ease"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Top Services Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-light)" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Top Services by Revenue</p>
          <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 3 }}>Best performing services — live data</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                {["Service", "Bookings", "Revenue", "Share"].map((h) => (
                  <th key={h} style={{ padding: "12px 22px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [0, 1, 2, 3, 4].map((i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? "1px solid var(--border-light)" : "none" }}>
                    {[0, 1, 2, 3].map((j) => (
                      <td key={j} style={{ padding: "14px 22px" }}>
                        <div style={skel(j === 0 ? 160 : j === 3 ? 120 : 60, 14, 4)} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data!.topServices.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 22px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No booking data yet. Revenue will appear once bookings are completed.
                  </td>
                </tr>
              ) : (
                data!.topServices.map((s, i) => {
                  const share = totalRev > 0 ? Math.round((s.revenue / totalRev) * 100) : 0;
                  return (
                    <tr key={s.name} style={{ borderBottom: i < data!.topServices.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "var(--gold)", flexShrink: 0 }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{s.bookings}</span>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--gold)" }}>{formatPrice(s.revenue)}</span>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, maxWidth: 100, height: 6, background: "var(--border-light)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${share}%`, background: "linear-gradient(to right, #c9973b, #e0b96a)", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", width: 28, textAlign: "right" }}>{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
