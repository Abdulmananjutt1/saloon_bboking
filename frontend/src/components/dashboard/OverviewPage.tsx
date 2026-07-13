"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, MessageSquare, Plus, Scissors, Star } from "lucide-react";
import type { ReactNode } from "react";
import { ROUTES } from "@/constants";
import { RedBadge } from "@/components/ui/RedBadge";
import { TAB_ROUTES } from "./routes";
import { bookingRowStyle, cancelBtnStyle, iconBoxStyle, pageSubtitleStyle, pageTitleStyle, statCardStyle, statusBadgeStyle } from "./styles";
import { BookingTimeline, ServiceMemoryCard } from "./shared";
import { useDashboardContext } from "./DashboardContext";

export default function OverviewPage() {
  const {
    user, loading, upcomingBookings, pastBookings, totalBookings, loyaltyPoints, totalSpent,
    cancelBooking, cancellingId, unreadCount,
  } = useDashboardContext();

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="client-dashboard-page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
        <div>
          <h1 style={pageTitleStyle}>Hello, {user?.name}</h1>
          <p style={pageSubtitleStyle}>Welcome back to your client dashboard.</p>
        </div>
        <Link href={ROUTES.BOOK} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 22px", borderRadius: 11, background: "var(--grad-gold-btn)",
          color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
          textDecoration: "none", boxShadow: "0 6px 20px rgba(201,151,59,0.3)",
          letterSpacing: "0.02em",
        }}>
          <Plus style={{ width: 14, height: 14 }} /> Book New Appointment
        </Link>
      </div>

      <ServiceMemoryCard pastBookings={pastBookings} />

      <div className="client-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 40 }}>
        <StatCard label="Total Appointments" value={String(totalBookings)} icon={<CalendarDays style={{ width: 18, height: 18, color: "var(--gold)" }} />} />
        <StatCard label="Loyalty Points" value={String(loyaltyPoints)} suffix="pts" gold icon={<Star style={{ width: 18, height: 18, color: "var(--gold)" }} />} />
        <StatCard label="Total Spent" value={`Rs. ${totalSpent.toLocaleString()}`} icon={<Scissors style={{ width: 18, height: 18, color: "var(--gold)", transform: "rotate(45deg)" }} />} />
      </div>

      <div className="client-overview-grid" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 28 }}>
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 18, fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.01em" }}>Upcoming Sessions</h2>
          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading appointments...</p>
          ) : upcomingBookings.length === 0 ? (
            <div style={{ padding: "40px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-light)", textAlign: "center" }}>
              <Clock3 style={{ width: 32, height: 32, color: "var(--text-muted)", margin: "0 auto 12px" }} />
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 14 }}>No upcoming bookings scheduled.</p>
              <Link href={ROUTES.BOOK} style={{ fontSize: "0.82rem", color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>Book one now <ChevronRight style={{ width: 12, height: 12, display: "inline" }} /></Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {upcomingBookings.slice(0, 3).map((b) => (
                <div key={b.id} style={bookingRowStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(201,151,59,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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
                      <button onClick={() => cancelBooking(b.id)} disabled={cancellingId === b.id} style={cancelBtnStyle}>
                        {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 18, fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.01em" }}>Quick Consultation</h2>
          <div style={{ padding: "24px", borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border-light)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,151,59,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 4px 16px rgba(201,151,59,0.3)" }}>
              <MessageSquare style={{ width: 17, height: 17, color: "#0d0c0a" }} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8, color: "var(--text-primary)", fontFamily: "var(--font-display), Georgia, serif" }}>Have questions about a service?</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 20 }}>
              Discuss your styling queries, hair coloring preferences or check stylist availability directly with our support team.
            </p>
            <Link href={TAB_ROUTES.chat} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "11px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none",
              color: "#0d0c0a", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s", textDecoration: "none", boxShadow: "0 4px 16px rgba(201,151,59,0.25)", letterSpacing: "0.03em",
            }}>
              <MessageSquare style={{ width: 13, height: 13 }} />
              Start Chatting
              <RedBadge count={unreadCount} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, icon, gold = false }: { label: string; value: string; suffix?: string; icon: ReactNode; gold?: boolean }) {
  return (
    <div style={statCardStyle}>
      <div>
        <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 10 }}>{label}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <p style={{ fontSize: "2.2rem", fontWeight: 900, color: gold ? "var(--gold)" : "var(--text-primary)", lineHeight: 1, fontFamily: "var(--font-display), Georgia, serif" }}>{value}</p>
          {suffix && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>{suffix}</span>}
        </div>
      </div>
      <div style={iconBoxStyle}>{icon}</div>
    </div>
  );
}
