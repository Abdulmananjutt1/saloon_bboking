import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import { ROUTES } from "@/constants";
import type { ClientBooking } from "@/hooks/useClientDashboard";
import { smallActionLinkStyle, smallGhostButtonStyle } from "./styles";

export function NotificationStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
      <p style={{ fontSize: "0.66rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: "1.45rem", color: "var(--text-primary)", fontWeight: 900, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

export function BookingTimeline({ status, compact = false }: { status: string; compact?: boolean }) {
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

export function ServiceMemoryCard({ pastBookings }: { pastBookings: ClientBooking[] }) {
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

export function FavoriteStylistCard({ bookings, favoriteStylistId, onChange }: {
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
