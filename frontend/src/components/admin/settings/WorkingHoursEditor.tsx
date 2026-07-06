"use client";

// ─────────────────────────────────────────────────────────
//  WorkingHoursEditor — Glamour Studio
//  Salon-wide working hours configuration.
//  Admin can toggle each day open/closed and set hours.
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { settingsApi } from "@/lib/api";

export interface WorkingDay {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DEFAULT_HOURS: WorkingDay[] = [
  { dayOfWeek: 0, dayName: "Sunday",    isOpen: false, openTime: "10:00", closeTime: "19:00" },
  { dayOfWeek: 1, dayName: "Monday",    isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 2, dayName: "Tuesday",   isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 3, dayName: "Wednesday", isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 4, dayName: "Thursday",  isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 5, dayName: "Friday",    isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 6, dayName: "Saturday",  isOpen: true,  openTime: "09:00", closeTime: "19:00" },
];

// Half-hour slots 06:00 → 23:30
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 23) TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`);
}

interface Props {
  onSaved?: () => void;
}

export function WorkingHoursEditor({ onSaved }: Props) {
  const [hours,  setHours]  = useState<WorkingDay[]>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  // Load from backend
  useEffect(() => {
    (settingsApi.getKey("working_hours") as Promise<{ success: boolean; data: WorkingDay[] }>)
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length) {
          setHours(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateDay(dayOfWeek: number, patch: Partial<WorkingDay>) {
    setHours((prev) => prev.map((d) => d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await settingsApi.setKey("working_hours", hours);
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "24px 0", textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        Loading working hours…
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>Salon Working Hours</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
            These are the overall salon open hours. Stylist-specific schedules can be set on each stylist's profile.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 20px", borderRadius: 10, border: "none",
            background: saved ? "rgba(52,211,153,0.15)" : "var(--grad-gold-btn)",
            color: saved ? "#34d399" : "#0d0c0a",
            fontSize: "0.8rem", fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "all 0.2s",
          }}
        >
          {saved
            ? <><CheckCircle style={{ width: 14, height: 14 }} /> Saved!</>
            : saving
            ? "Saving…"
            : "Save Hours"
          }
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {hours.map((day) => (
          <div
            key={day.dayOfWeek}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 52px 1fr",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 12,
              background: day.isOpen ? "rgba(201,151,59,0.04)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${day.isOpen ? "rgba(201,151,59,0.18)" : "var(--border-light)"}`,
              transition: "all 0.2s",
            }}
          >
            <div>
              <span style={{
                fontSize: "0.85rem", fontWeight: 700,
                color: day.isOpen ? "var(--text-primary)" : "var(--text-muted)",
              }}>
                {day.dayName}
              </span>
            </div>

            {/* Open/closed toggle */}
            <button
              type="button"
              onClick={() => updateDay(day.dayOfWeek, { isOpen: !day.isOpen })}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none",
                background: day.isOpen ? "var(--gold)" : "rgba(255,255,255,0.1)",
                cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}
              title={day.isOpen ? "Mark as closed" : "Mark as open"}
            >
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3,
                left: day.isOpen ? 23 : 3,
                transition: "left 0.2s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
              }} />
            </button>

            {/* Time pickers */}
            {day.isOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock style={{ width: 13, height: 13, color: "var(--gold)", flexShrink: 0 }} />
                <select
                  value={day.openTime}
                  onChange={(e) => updateDay(day.dayOfWeek, { openTime: e.target.value })}
                  style={selectStyle}
                  aria-label={`Opening time for ${day.dayName}`}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                      {formatTime(t)}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>to</span>
                <select
                  value={day.closeTime}
                  onChange={(e) => updateDay(day.dayOfWeek, { closeTime: e.target.value })}
                  style={selectStyle}
                  aria-label={`Closing time for ${day.dayName}`}
                >
                  {TIME_OPTIONS.filter((t) => t > day.openTime).map((t) => (
                    <option key={t} value={t} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                      {formatTime(t)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  appearance: "none",
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid var(--border-light)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  outline: "none",
  minWidth: 88,
};

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}
