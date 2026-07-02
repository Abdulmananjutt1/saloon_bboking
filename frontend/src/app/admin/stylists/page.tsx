import type { Metadata } from "next";
import Image from "next/image";
import { STYLISTS } from "@/lib/data/salon";
import { Plus, Edit2, Trash2, Award, Star } from "lucide-react";

export const metadata: Metadata = { title: "Stylists — Admin" };

export default function AdminStylistsPage() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Stylists
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            {STYLISTS.length} stylists · {STYLISTS.filter((s) => s.available).length} available
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "11px 20px", borderRadius: 11,
          background: "var(--grad-gold-btn)",
          border: "none", color: "#0d0c0a",
          fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
        }}>
          <Plus style={{ width: 15, height: 15 }} /> Add Stylist
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {STYLISTS.map((s) => (
          <div key={s.id} style={{
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 20, overflow: "hidden",
            transition: "transform 0.25s ease, box-shadow 0.25s ease"
          }}>
            {/* Image */}
            <div style={{ position: "relative", height: 220 }}>
              <Image src={s.avatar} alt={s.name} fill style={{ objectFit: "cover" }} sizes="33vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.2) 50%, transparent 100%)" }} />

              {/* Experience badge */}
              <div style={{
                position: "absolute", top: 12, left: 12,
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 99,
                background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,151,59,0.3)"
              }}>
                <Award style={{ width: 11, height: 11, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold-light)" }}>{s.experience}y exp</span>
              </div>

              {/* Action buttons */}
              <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                <button style={{
                  width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                  background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--status-completed)", transition: "all 0.2s"
                }}>
                  <Edit2 style={{ width: 13, height: 13 }} />
                </button>
                <button style={{
                  width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                  background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--status-cancelled)", transition: "all 0.2s"
                }}>
                  <Trash2 style={{ width: 13, height: 13 }} />
                </button>
              </div>

              {/* Name overlay */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px" }}>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f5f0e8", marginBottom: 2 }}>{s.name}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--gold-light)" }}>{s.role}</p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 18px" }}>

              {/* Rating + Status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} style={{ width: 13, height: 13, color: "var(--status-pending)", fill: n <= Math.round(s.rating) ? "var(--status-pending)" : "transparent" }} />
                  ))}
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", marginLeft: 2 }}>{s.rating}</span>
                </div>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  background: s.available ? "var(--status-confirmed-bg)" : "rgba(100,116,139,0.1)",
                  color: s.available ? "var(--status-confirmed)" : "var(--text-muted)",
                  border: `1px solid ${s.available ? "var(--status-confirmed-border)" : "rgba(100,116,139,0.2)"}`
                }}>
                  {s.available ? "Available" : "On Leave"}
                </span>
              </div>

              {/* Specialties */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {s.specialties.map((sp) => (
                  <span key={sp} style={{
                    fontSize: "0.65rem", fontWeight: 600, padding: "3px 9px", borderRadius: 99,
                    background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.18)",
                    color: "var(--gold-light)"
                  }}>{sp}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Reviews", value: s.reviewCount.toLocaleString() },
                  { label: "Rating",  value: `${s.rating}★` },
                  { label: "Slots",   value: s.available ? s.slots.length : 0 },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    padding: "10px 8px", borderRadius: 12, textAlign: "center",
                    background: "var(--bg-secondary)", border: "1px solid var(--border-light)"
                  }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{stat.value}</p>
                    <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
