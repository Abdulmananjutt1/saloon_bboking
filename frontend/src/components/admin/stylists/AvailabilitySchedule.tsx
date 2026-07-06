"use client";

// ─────────────────────────────────────────────────────────
//  AvailabilitySchedule — Glamour Studio
//  Per-stylist weekly schedule editor.
//  Shows 7 days (Sun–Sat) with an on/off toggle and
//  start/end time selectors for each working day.
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { stylistsApi } from "@/lib/api";

export interface DaySchedule {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_SCHEDULE: DaySchedule[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  isWorking: i !== 0,        // Sunday off by default
  startTime: "09:00",
  endTime:   i === 6 ? "17:00" : "19:00",
}));

// Half-hour time options 06:00 → 23:30
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 23) TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`);
}

interface Props {
  stylistId: string | null;  // null when creating a new stylist
  onChange: (schedule: DaySchedule[]) => void;
}

export function AvailabilitySchedule({ stylistId, onChange }: Props) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [loading, setLoading]   = useState(false);

  // Load existing schedule when editing a stylist
  useEffect(() => {
    if (!stylistId) {
      setSchedule(DEFAULT_SCHEDULE);
      onChange(DEFAULT_SCHEDULE);
      return;
    }
    setLoading(true);
    (stylistsApi.getAvailability(stylistId) as Promise<{ success: boolean; data: DaySchedule[] }>)
      .then((res) => {
        if (res.success && res.data?.length) {
          setSchedule(res.data);
          onChange(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stylistId]);

  function updateDay(dayOfWeek: number, patch: Partial<DaySchedule>) {
    const updated = schedule.map((d) =>
      d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d
    );
    setSchedule(updated);
    onChange(updated);
  }

  if (loading) {
    return (
      <div style={{ padding: "16px 0", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Loading schedule…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {schedule.map((day) => (
        <div
          key={day.dayOfWeek}
          style={{
            display: "grid",
            gridTemplateColumns: "100px 52px 1fr",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            background: day.isWorking ? "rgba(201,151,59,0.05)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${day.isWorking ? "rgba(201,151,59,0.2)" : "var(--border-light)"}`,
            transition: "all 0.2s",
          }}
        >
          {/* Day name */}
          <span style={{
            fontSize: "0.8rem", fontWeight: 700,
            color: day.isWorking ? "var(--text-primary)" : "var(--text-muted)",
          }}>
            {DAY_NAMES[day.dayOfWeek]}
          </span>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => updateDay(day.dayOfWeek, { isWorking: !day.isWorking })}
            style={{
              width: 44, height: 24, borderRadius: 12, border: "none",
              background: day.isWorking ? "var(--gold)" : "rgba(255,255,255,0.1)",
              cursor: "pointer", position: "relative", transition: "background 0.2s",
              flexShrink: 0,
            }}
            title={day.isWorking ? "Click to mark as off" : "Click to mark as working"}
          >
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: day.isWorking ? 23 : 3,
              transition: "left 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
            }} />
          </button>

          {/* Time range */}
          {day.isWorking ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock style={{ width: 13, height: 13, color: "var(--gold)", flexShrink: 0 }} />
              <select
                value={day.startTime}
                onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })}
                style={selectStyle}
                aria-label={`Start time for ${DAY_NAMES[day.dayOfWeek]}`}
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                    {formatTime(t)}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>to</span>
              <select
                value={day.endTime}
                onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })}
                style={selectStyle}
                aria-label={`End time for ${DAY_NAMES[day.dayOfWeek]}`}
              >
                {TIME_OPTIONS.filter((t) => t > day.startTime).map((t) => (
                  <option key={t} value={t} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                    {formatTime(t)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>Day off</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
  appearance: "none",
  padding: "5px 10px",
  borderRadius: 8,
  border: "1px solid var(--border-light)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  fontSize: "0.78rem",
  fontWeight: 600,
  cursor: "pointer",
  outline: "none",
  minWidth: 82,
};

/** Convert "14:30" → "2:30 PM" */
function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}
