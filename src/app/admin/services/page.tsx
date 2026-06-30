import type { Metadata } from "next";
import Image from "next/image";
import { SERVICES } from "@/lib/data/salon";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Plus, Edit2, Trash2, Clock, Tag } from "lucide-react";

export const metadata: Metadata = { title: "Services — Admin" };

export default function AdminServicesPage() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Services
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{SERVICES.length} services total</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "11px 20px", borderRadius: 11,
          background: "var(--grad-gold-btn)", border: "none",
          color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
        }}>
          <Plus style={{ width: 15, height: 15 }} /> Add Service
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {SERVICES.map((s) => (
          <div key={s.id} style={{
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 20, overflow: "hidden",
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s"
          }}>
            {/* Image */}
            <div style={{ position: "relative", height: 180 }}>
              <Image src={s.image} alt={s.name} fill style={{ objectFit: "cover" }} sizes="33vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 55%)" }} />

              {/* SALE badge */}
              {s.discountedPrice && (
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "3px 10px", borderRadius: 6,
                  background: "var(--grad-gold-btn)", color: "#0d0c0a",
                  fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em"
                }}>
                  SALE
                </div>
              )}

              {/* Edit/Delete on hover — always visible on admin */}
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                <button style={{
                  width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                  background: "rgba(13,12,10,0.7)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-completed)"
                }}>
                  <Edit2 style={{ width: 13, height: 13 }} />
                </button>
                <button style={{
                  width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                  background: "rgba(13,12,10,0.7)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-cancelled)"
                }}>
                  <Trash2 style={{ width: 13, height: 13 }} />
                </button>
              </div>

              {/* Category */}
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 9px", borderRadius: 6,
                  background: "rgba(13,12,10,0.7)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(201,151,59,0.3)",
                  fontSize: "0.62rem", fontWeight: 700, color: "var(--gold-light)",
                  textTransform: "uppercase", letterSpacing: "0.1em"
                }}>
                  <Tag style={{ width: 9, height: 9 }} />{s.category}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 18px" }}>
              <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{s.name}</h3>
              <p style={{ fontSize: "0.77rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {s.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock style={{ width: 13, height: 13, color: "var(--gold)" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDuration(s.duration)}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  {s.discountedPrice ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textDecoration: "line-through" }}>{formatPrice(s.price)}</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(s.discountedPrice)}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(s.price)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
