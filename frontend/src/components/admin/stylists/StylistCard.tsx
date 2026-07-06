"use client";

import Image from "next/image";
import { Award, Star, Edit2, Trash2 } from "lucide-react";
import type { Stylist } from "@/hooks/useStylists";

interface StylistCardProps {
  stylist: Stylist;
  onEdit: (s: Stylist) => void;
  onDelete: (s: Stylist) => void;
}

export function StylistCard({ stylist: s, onEdit, onDelete }: StylistCardProps) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-light)",
      borderRadius: 20,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ position: "relative", height: 220, flexShrink: 0 }}>
        {s.avatar.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.avatar} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Image src={s.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"} alt={s.name} fill style={{ objectFit: "cover" }} sizes="33vw" loading="eager" />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.2) 50%, transparent 100%)" }} />

        <div style={{
          position: "absolute", top: 12, left: 12,
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 99,
          background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(201,151,59,0.3)",
        }}>
          <Award style={{ width: 11, height: 11, color: "var(--gold)" }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold-light)" }}>{s.experience}y exp</span>
        </div>

        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(s)}
            title="Edit"
            style={{
              width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
              background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--status-completed)",
            }}
          >
            <Edit2 style={{ width: 13, height: 13 }} />
          </button>
          <button
            onClick={() => onDelete(s)}
            title="Remove"
            style={{
              width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
              background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--status-cancelled)",
            }}
          >
            <Trash2 style={{ width: 13, height: 13 }} />
          </button>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px" }}>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f5f0e8", marginBottom: 2 }}>{s.name}</p>
          <p style={{ fontSize: "0.72rem", color: "var(--gold-light)" }}>{s.role}</p>
        </div>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} style={{ width: 13, height: 13, color: "var(--status-pending)", fill: n <= Math.round(s.rating) ? "var(--status-pending)" : "transparent" }} />
            ))}
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", marginLeft: 4 }}>{s.rating}</span>
          </div>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99,
            textTransform: "uppercase", letterSpacing: "0.1em",
            background: s.available ? "var(--status-confirmed-bg)" : "rgba(100,116,139,0.1)",
            color: s.available ? "var(--status-confirmed)" : "var(--text-muted)",
            border: `1px solid ${s.available ? "var(--status-confirmed-border)" : "rgba(100,116,139,0.2)"}`,
          }}>
            {s.available ? "Available" : "On Leave"}
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {s.specialties.map((sp) => (
            <span key={sp.id} style={{
              fontSize: "0.65rem", fontWeight: 600, padding: "3px 9px", borderRadius: 99,
              background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.18)",
              color: "var(--gold-light)",
            }}>
              {sp.name}
            </span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Reviews", value: s.reviewCount.toLocaleString() },
            { label: "Rating",  value: `${s.rating}★` },
            { label: "Slots",   value: s.available ? s.slots.length : 0 },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: "10px 8px", borderRadius: 12, textAlign: "center",
              background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
            }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{stat.value}</p>
              <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
