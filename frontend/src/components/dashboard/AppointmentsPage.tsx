"use client";

import Link from "next/link";
import { CalendarDays, RotateCcw, Star } from "lucide-react";
import { ROUTES } from "@/constants";
import { appointmentSkeletonBlockStyle, bookingRowStyle, cancelBtnStyle, pageSubtitleStyle, pageTitleStyle, smallActionLinkStyle, smallGhostButtonStyle, statusBadgeStyle } from "./styles";
import { BookingTimeline } from "./shared";
import { useDashboardContext } from "./DashboardContext";

export default function AppointmentsPage() {
  const { loading, totalBookings, upcomingBookings, pastBookings, cancelBooking, cancellingId, setReviewBookingId } = useDashboardContext();

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="client-dashboard-page-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={pageTitleStyle}>My Appointments</h1>
          <p style={pageSubtitleStyle}>Manage your upcoming bookings and review past style visits.</p>
        </div>
      </div>

      {loading ? (
        <div aria-label="Appointment placeholders" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[0, 1].map((item) => (
            <div key={item} style={{ ...bookingRowStyle, minHeight: 92 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
                <span style={{ ...appointmentSkeletonBlockStyle, width: 54, height: 54, borderRadius: 12 }} />
                <div style={{ flex: 1, display: "grid", gap: 10 }}>
                  <span style={{ ...appointmentSkeletonBlockStyle, width: "min(220px, 56%)", height: 16, borderRadius: 8 }} />
                  <span style={{ ...appointmentSkeletonBlockStyle, width: "min(340px, 78%)", height: 12, borderRadius: 8 }} />
                </div>
              </div>
              <span style={{ ...appointmentSkeletonBlockStyle, width: 92, height: 28, borderRadius: 999 }} />
            </div>
          ))}
        </div>
      ) : totalBookings === 0 ? (
        <div style={{ padding: "80px 40px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-light)", textAlign: "center" }}>
          <CalendarDays style={{ width: 44, height: 44, color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>No Bookings Yet</h3>
          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginBottom: 20 }}>Book your first appointment in seconds.</p>
          <Link href={ROUTES.BOOK} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: "var(--grad-gold-btn)", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
            Book Appointment Now
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {upcomingBookings.length > 0 && (
            <section>
              <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.15em" }}>Upcoming Appointments</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {upcomingBookings.map((b) => (
                  <div key={b.id} style={bookingRowStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <DateBox date={b.date} gold />
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
                        <button onClick={() => cancelBooking(b.id)} disabled={cancellingId === b.id} style={cancelBtnStyle}>
                          {cancellingId === b.id ? "..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pastBookings.length > 0 && (
            <section>
              <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.15em" }}>Past Appointments</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0.8 }}>
                {pastBookings.map((b) => (
                  <div key={b.id} style={bookingRowStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <DateBox date={b.date} />
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
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function DateBox({ date, gold = false }: { date: string; gold?: boolean }) {
  return (
    <div style={{ width: 54, height: 54, borderRadius: 12, background: gold ? "rgba(201,151,59,0.08)" : "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: "0.62rem", textTransform: "uppercase", color: gold ? "var(--gold)" : "var(--text-muted)", fontWeight: 700 }}>{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
      <span style={{ fontSize: "1.2rem", fontWeight: 800, color: gold ? "#fff" : "var(--text-secondary)", lineHeight: 1 }}>{new Date(date).getDate()}</span>
    </div>
  );
}
