"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
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

// ── Per-type visual config — uses CSS variables / Tailwind tokens, no raw hex ──
const TOAST_META: Record<ToastType, {
  icon: React.ReactNode;
  borderClass: string;    // left accent border colour
  borderColorClass: string; // container border
  bgClass: string;        // container background tint
}> = {
  success: {
    icon:             <CheckCircle className="w-[18px] h-[18px] shrink-0 text-emerald-400" />,
    borderClass:      "border-l-emerald-400",
    borderColorClass: "border-emerald-500/20",
    bgClass:          "bg-emerald-500/[0.06]",
  },
  error: {
    icon:             <AlertCircle className="w-[18px] h-[18px] shrink-0 text-red-400" />,
    borderClass:      "border-l-red-400",
    borderColorClass: "border-red-500/20",
    bgClass:          "bg-red-500/[0.06]",
  },
  info: {
    icon:             <Info className="w-[18px] h-[18px] shrink-0 text-blue-400" />,
    borderClass:      "border-l-blue-400",
    borderColorClass: "border-blue-500/20",
    bgClass:          "bg-blue-500/[0.06]",
  },
};

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const meta = TOAST_META[toast.type];

  useEffect(() => {
    const enter   = setTimeout(() => setVisible(true), 10);
    const dismiss = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), TOAST_CONFIG.ANIMATE_MS);
    }, TOAST_CONFIG.DURATION_MS);
    return () => { clearTimeout(enter); clearTimeout(dismiss); };
  }, [toast.id, onRemove]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), TOAST_CONFIG.ANIMATE_MS);
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-[14px_16px] rounded-[14px]",
        "min-w-[300px] max-w-[380px] backdrop-blur-[16px]",
        "border border-l-[3px] shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        "[background:var(--bg-secondary,#1a1916)]",
        meta.bgClass,
        meta.borderClass,
        meta.borderColorClass,
        "transition-[transform,opacity] duration-[350ms]",
        visible ? "translate-x-0 opacity-100" : "translate-x-[120px] opacity-0",
      )}
    >
      {meta.icon}

      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] font-bold text-white leading-snug">{toast.title}</p>
        {toast.message && (
          <p className="text-[0.76rem] text-[var(--text-muted)] mt-1 leading-[1.4]">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="shrink-0 flex items-center p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
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
