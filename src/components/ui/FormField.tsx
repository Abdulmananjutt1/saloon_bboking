// ─────────────────────────────────────────────────────────
//  FormField — Reusable labeled input with icon + error
//  Used in: login, register, booking, client modal, etc.
// ─────────────────────────────────────────────────────────
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  /** Rendered inside the field on the right side (e.g. show/hide password toggle) */
  rightSlot?: React.ReactNode;
  /** Extra content below the input (e.g. password strength bar) */
  below?: React.ReactNode;
  /** Right side of label row (e.g. "Forgot password?" link) */
  labelRight?: React.ReactNode;
  disabled?: boolean;
}

export default function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  icon,
  rightSlot,
  below,
  labelRight,
  disabled,
}: FormFieldProps) {
  return (
    <div>
      {/* Label row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label className="sal-label" style={{ margin: 0 }}>{label}</label>
        {labelRight}
      </div>

      {/* Input wrapper */}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        )}

        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="sal-input"
          style={{
            paddingLeft: icon ? 40 : undefined,
            paddingRight: rightSlot ? 44 : undefined,
            borderColor: error ? "var(--color-error)" : undefined,
          }}
        />

        {rightSlot && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </span>
        )}
      </div>

      {below}

      {/* Error message */}
      {error && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: "0.7rem",
            color: "var(--color-error)",
            marginTop: 5,
          }}
        >
          <AlertCircle style={{ width: 11, height: 11 }} />
          {error}
        </p>
      )}
    </div>
  );
}
