"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { TOAST_CONFIG } from "@/constants";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const TOAST_META: Record<ToastType, {
  icon: React.ReactNode;
  accent: string;
  glow: string;
  progress: string;
  bg: string;
  border: string;
}> = {
  success: {
    icon:     <CheckCircle style={{ width: 20, height: 20, flexShrink: 0, color: "#4ade80" }} />,
    accent:   "#4ade80",
    glow:     "rgba(74,222,128,0.12)",
    progress: "linear-gradient(90deg, #4ade80, #22c55e)",
    bg:       "rgba(74,222,128,0.06)",
    border:   "rgba(74,222,128,0.2)",
  },
  error: {
    icon:     <AlertCircle style={{ width: 20, height: 20, flexShrink: 0, color: "#f87171" }} />,
    accent:   "#f87171",
    glow:     "rgba(248,113,113,0.12)",
    progress: "linear-gradient(90deg, #f87171, #ef4444)",
    bg:       "rgba(248,113,113,0.06)",
    border:   "rgba(248,113,113,0.2)",
  },
  info: {
    icon:     <Info style={{ width: 20, height: 20, flexShrink: 0, color: "#60a5fa" }} />,
    accent:   "#60a5fa",
    glow:     "rgba(96,165,250,0.12)",
    progress: "linear-gradient(90deg, #60a5fa, #3b82f6)",
    bg:       "rgba(96,165,250,0.06)",
    border:   "rgba(96,165,250,0.2)",
  },
};

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div style={{
      position: "fixed",
      top: 24,
      right: 24,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meta = TOAST_META[toast.type];

  const dismiss = () => {
    setVisible(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => onRemove(toast.id), TOAST_CONFIG.ANIMATE_MS);
  };

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);

    // progress bar countdown
    const step = 100 / (TOAST_CONFIG.DURATION_MS / 30);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) { clearInterval(intervalRef.current!); return 0; }
        return p - step;
      });
    }, 30);

    const autoDismiss = setTimeout(dismiss, TOAST_CONFIG.DURATION_MS);

    return () => {
      clearTimeout(enter);
      clearTimeout(autoDismiss);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  return (
    <div
      style={{
        pointerEvents: "auto",
        minWidth: 320,
        maxWidth: 400,
        borderRadius: 16,
        overflow: "hidden",
        background: `var(--bg-secondary, #1a1916)`,
        border: `1px solid ${meta.border}`,
        borderLeft: `3px solid ${meta.accent}`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px ${meta.border}, inset 0 0 40px ${meta.glow}`,
        backdropFilter: "blur(20px)",
        transition: `transform ${TOAST_CONFIG.ANIMATE_MS}ms cubic-bezier(0.34,1.56,0.64,1), opacity ${TOAST_CONFIG.ANIMATE_MS}ms ease`,
        transform: visible ? "translateX(0) scale(1)" : "translateX(110%) scale(0.95)",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Main content */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px 12px",
      }}>
        {/* Icon with glow bg */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: meta.bg,
          border: `1px solid ${meta.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {meta.icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <p style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
            marginBottom: toast.message ? 4 : 0,
          }}>
            {toast.title}
          </p>
          {toast.message && (
            <p style={{
              fontSize: "0.775rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}>
              {toast.message}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            transition: "background 0.15s, color 0.15s",
            marginTop: 2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3,
        background: "rgba(255,255,255,0.05)",
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: meta.progress,
          transition: "width 30ms linear",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>
    </div>
  );
}

// ── Hook for easy usage ───────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = (type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, toast, remove };
}
