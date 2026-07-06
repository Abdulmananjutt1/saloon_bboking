"use client";

// ─────────────────────────────────────────────────────────
//  ServiceDeleteModal — Admin
//  Confirmation dialog before soft-deleting a service.
// ─────────────────────────────────────────────────────────

import { Trash2, AlertTriangle } from "lucide-react";
import type { Service } from "@/hooks/useServices";

interface Props {
  service:   Service | null;
  deleting:  boolean;
  onConfirm: () => void;
  onClose:   () => void;
}

export function ServiceDeleteModal({ service, deleting, onConfirm, onClose }: Props) {
  if (!service) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1001,
        width: "min(94vw,440px)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        textAlign: "center",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <AlertTriangle style={{ width: 22, height: 22, color: "#f87171" }} />
        </div>

        <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
          Remove Service?
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text-primary)" }}>{service.name}</strong> will be marked inactive and hidden from clients. You can reactivate it anytime.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 22px", borderRadius: 10,
              border: "1px solid var(--border-light)", background: "transparent",
              color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 22px", borderRadius: 10, border: "none",
              background: deleting ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.85)",
              color: "#fff", fontSize: "0.85rem", fontWeight: 700,
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            <Trash2 style={{ width: 14, height: 14 }} />
            {deleting ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </>
  );
}
