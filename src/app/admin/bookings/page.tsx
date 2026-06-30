"use client";

import { useState } from "react";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { Download, Plus, CalendarDays, Clock, User, Scissors, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ROUTES, STATUS_META, CLIENT_AVATAR_COLORS, type BookingStatus } from "@/constants";
import { useBookings } from "@/hooks/useBookings";

export default function AdminBookingsPage() {
  const [activeStatus, setActive] = useState("all");
  const { bookings, loading, updating, statusCounts, updateStatus } = useBookings(activeStatus);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Bookings
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{statusCounts.all} total appointments</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11, background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
            <Download style={{ width: 14, height: 14 }} /> Export
          </button>
          <Link href={ROUTES.BOOK} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(201,151,59,0.3)" }}>
            <Plus style={{ width: 14, height: 14 }} /> New Booking
          </Link>
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => {
          const meta   = STATUS_META[status as BookingStatus];
          const isAll  = status === "all";
          const active = activeStatus === status;
          return (
            <button key={status} onClick={() => setActive(status)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 10, cursor: "pointer",
              background: active ? (isAll ? "var(--grad-gold-btn)" : (meta?.bg ?? "var(--bg-card)")) : "var(--bg-card)",
              border: active ? (isAll ? "none" : `1px solid ${meta?.border ?? "var(--border-light)"}`) : "1px solid var(--border-light)",
              boxShadow: active && isAll ? "0 4px 16px rgba(201,151,59,0.25)" : "none",
              transition: "all 0.2s"
            }}>
              {!isAll && meta && <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />}
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: active ? (isAll ? "#0d0c0a" : (meta?.color ?? "var(--text-muted)")) : "var(--text-muted)", textTransform: "capitalize" }}>
                {status}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "1px 7px", borderRadius: 99, background: active && isAll ? "rgba(13,12,10,0.15)" : "rgba(255,255,255,0.06)", color: active ? (isAll ? "#0d0c0a" : (meta?.color ?? "var(--text-muted)")) : "var(--text-muted)" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No {activeStatus !== "all" ? activeStatus : ""} bookings yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  {[
                    { label: "Booking ID", icon: null },
                    { label: "Client",     icon: User },
                    { label: "Service",    icon: Scissors },
                    { label: "Stylist",    icon: null },
                    { label: "Date & Time",icon: CalendarDays },
                    { label: "Amount",     icon: null },
                    { label: "Status",     icon: null },
                    { label: "Actions",    icon: null },
                  ].map(({ label, icon: Icon }) => (
                    <th key={label} style={{ padding: "14px 20px", textAlign: "left", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {Icon && <Icon style={{ width: 11, height: 11, color: "var(--gold)", opacity: 0.7 }} />}
                        <span style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  const meta        = STATUS_META[b.status];
                  const clientColor = CLIENT_AVATAR_COLORS[i % CLIENT_AVATAR_COLORS.length];
                  return (
                    <tr key={b.id} style={{ borderBottom: i < bookings.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.15s" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 700, color: "var(--text-muted)", padding: "3px 8px", borderRadius: 6, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>{b.id}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: `${clientColor}22`, border: `1.5px solid ${clientColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, color: clientColor }}>
                            {b.customerName.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{b.customerName}</p>
                            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>{b.customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>{b.serviceName}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <Clock style={{ width: 10, height: 10, color: "var(--gold)" }} />
                          <span style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>{b.duration} min</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{b.stylistName}</span></td>
                      <td style={{ padding: "16px 20px" }}>
                        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{formatDateShort(b.date)}</p>
                        <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>{b.time}</p>
                      </td>
                      <td style={{ padding: "16px 20px" }}><span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gold)", whiteSpace: "nowrap" }}>{formatPrice(b.price)}</span></td>
                      <td style={{ padding: "16px 20px" }}>
                        {meta && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: meta.bg, border: `1px solid ${meta.border}` }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: meta.color, textTransform: "capitalize" }}>{b.status}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ position: "relative", width: "125px" }}>
                          <select
                            disabled={updating === b.id}
                            value={b.status}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                            style={{
                              appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
                              width: "100%", padding: "7px 28px 7px 12px", borderRadius: 8,
                              border: "1px solid rgba(201,151,59,0.35)", background: "var(--bg-secondary)",
                              color: "var(--gold)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer",
                              outline: "none", opacity: updating === b.id ? 0.5 : 1, transition: "all 0.2s ease"
                            }}
                          >
                            <option value="pending"   style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Pending</option>
                            <option value="confirmed" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Confirmed</option>
                            <option value="completed" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Completed</option>
                            <option value="cancelled" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Cancelled</option>
                          </select>
                          <ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 11, height: 11, color: "var(--gold)", pointerEvents: "none" }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
