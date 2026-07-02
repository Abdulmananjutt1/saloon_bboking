// ─────────────────────────────────────────────────────────
//  ApiErrorAlert — Inline error banner shown in forms
//  Usage: <ApiErrorAlert message={apiError} />
// ─────────────────────────────────────────────────────────
import { AlertCircle } from "lucide-react";

interface ApiErrorAlertProps {
  message: string;
}

export default function ApiErrorAlert({ message }: ApiErrorAlertProps) {
  if (!message) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 10,
        background: "var(--color-error-bg)",
        border: "1px solid rgba(248,113,113,0.25)",
      }}
    >
      <AlertCircle style={{ width: 15, height: 15, color: "var(--color-error)", flexShrink: 0 }} />
      <p style={{ fontSize: "0.8rem", color: "var(--color-error)" }}>{message}</p>
    </div>
  );
}
