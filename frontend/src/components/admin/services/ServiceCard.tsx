"use client";

// ─────────────────────────────────────────────────────────
//  ServiceCard — Admin
//  Displays one service with edit / delete actions.
// ─────────────────────────────────────────────────────────

import Image from "next/image";
import { Edit2, Trash2, Clock, Tag, Flame } from "lucide-react";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Service } from "@/hooks/useServices";

interface Props {
  service:  Service;
  onEdit:   (s: Service) => void;
  onDelete: (s: Service) => void;
}

export function ServiceCard({ service: s, onEdit, onDelete }: Props) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${s.isActive ? "var(--border-light)" : "rgba(239,68,68,0.2)"}`,
      borderRadius: 20,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      opacity: s.isActive ? 1 : 0.6,
      transition: "opacity 0.2s",
    }}>

      {/* ── Image ── */}
      <div style={{ position: "relative", height: 175, flexShrink: 0 }}>
        {s.image ? (
          s.image.startsWith("data:")
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Image src={s.image} alt={s.name} fill style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Tag style={{ width: 36, height: 36, color: "var(--text-muted)" }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 55%)" }} />

        {/* SALE badge */}
        {s.discountedPrice && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            padding: "3px 9px", borderRadius: 6,
            background: "var(--grad-gold-btn)", color: "#0d0c0a",
            fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            SALE
          </div>
        )}

        {/* Inactive badge */}
        {!s.isActive && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            padding: "3px 9px", borderRadius: 6,
            background: "rgba(239,68,68,0.9)", color: "#fff",
            fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
          }}>
            Inactive
          </div>
        )}

        {/* Action buttons */}
        <div style={{ position: "absolute", top: 10, right: s.discountedPrice ? 68 : 10, display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(s)}
            title="Edit service"
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
            title="Delete service"
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

        {/* Category chip */}
        <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 9px", borderRadius: 6,
            background: "rgba(13,12,10,0.75)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(201,151,59,0.3)",
            fontSize: "0.6rem", fontWeight: 700, color: "var(--gold-light)",
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            <Tag style={{ width: 9, height: 9 }} />{s.category}
          </span>
          {s.popular && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "3px 8px", borderRadius: 6,
              background: "rgba(201,151,59,0.85)",
              fontSize: "0.6rem", fontWeight: 800, color: "#0d0c0a",
              textTransform: "uppercase",
            }}>
              <Flame style={{ width: 9, height: 9 }} /> Hot
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 5 }}>
          {s.name}
        </h3>
        <p style={{
          fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6,
          marginBottom: 12, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {s.description}
        </p>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock style={{ width: 12, height: 12, color: "var(--gold)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{formatDuration(s.duration)}</span>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginLeft: 4, padding: "2px 6px", borderRadius: 4, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
              {s.forGender}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            {s.discountedPrice ? (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textDecoration: "line-through" }}>{formatPrice(s.price)}</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(s.discountedPrice)}</span>
              </div>
            ) : (
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(s.price)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
