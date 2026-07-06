"use client";

import { AlertTriangle, X } from "lucide-react";
import type { Stylist } from "@/hooks/useStylists";

interface DeleteConfirmModalProps {
  stylist: Stylist | null;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({ stylist, deleting, onConfirm, onClose }: DeleteConfirmModalProps) {
  if (!stylist) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1001,
        width: "min(94vw,420px)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          width: 30, height: 30, borderRadius: 8, border: "none",
          background: "rgba(255,255,255,0.05)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)",
        }}>
          <X style={{ width: 15, height: 15 }} />
        </button>

        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          <AlertTriangle style={{ width: 26, height: 26, color: "#f87171" }} />
        </div>

        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
          Remove Stylist?
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to remove{" "}
          <strong style={{ color: "var(--text-primary)" }}>{stylist.name}</strong>?
          {" "}This action cannot be undone.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            border: "1px solid var(--border-light)", background: "transparent",
            color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: "rgba(239,68,68,0.15)", color: "#f87171",
            fontSize: "0.85rem", fontWeight: 700,
            cursor: deleting ? "not-allowed" : "pointer",
            opacity: deleting ? 0.7 : 1,
          }}>
            {deleting ? "Removing\u2026" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </>
  );
}
