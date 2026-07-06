// ─────────────────────────────────────────────────────────
//  Availability Utilities — Glamour Studio
//
//  Helpers for generating time slots from working hour
//  schedules (both stylist-specific and salon-wide).
// ─────────────────────────────────────────────────────────

export interface DaySchedule {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;  // "HH:MM" 24h
  endTime:   string;  // "HH:MM" 24h
}

export interface WorkingDay {
  dayOfWeek: number;
  isOpen:    boolean;
  openTime:  string;
  closeTime: string;
}

/**
 * Convert "HH:MM" 24h to "HH:MM AM/PM" display string.
 * e.g. "14:30" → "2:30 PM"
 */
export function to12h(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}

/**
 * Convert "HH:MM AM/PM" display string back to minutes from midnight.
 * e.g. "2:30 PM" → 870
 */
export function displayToMinutes(display: string): number {
  const match = display.match(/^(\d+):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * Convert "HH:MM" 24h to minutes from midnight.
 */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Generate half-hour time slot labels between startTime and endTime (exclusive of endTime).
 * Returns strings in "H:MM AM/PM" format matching the existing TIME_SLOTS constant.
 *
 * @param startTime  "HH:MM" 24h
 * @param endTime    "HH:MM" 24h
 * @param stepMins   slot step in minutes (default 30)
 */
export function generateSlots(startTime: string, endTime: string, stepMins = 30): string[] {
  const start = timeToMinutes(startTime);
  const end   = timeToMinutes(endTime);
  const slots: string[] = [];

  for (let mins = start; mins < end; mins += stepMins) {
    slots.push(to12h(`${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`));
  }
  return slots;
}

/**
 * Given a stylist's availability schedule and a date string (YYYY-MM-DD),
 * return the allowed time slots for that day.
 * Falls back to all TIME_SLOTS if no schedule defined.
 */
export function getStylistSlotsForDate(
  availability: DaySchedule[],
  dateStr: string,
  fallbackSlots: string[],
): string[] {
  if (!availability?.length) return fallbackSlots;

  const date = new Date(dateStr + "T00:00:00");
  const dayOfWeek = date.getDay();

  const daySchedule = availability.find((d) => d.dayOfWeek === dayOfWeek);
  if (!daySchedule || !daySchedule.isWorking) return []; // day off

  return generateSlots(daySchedule.startTime, daySchedule.endTime);
}

/**
 * Given salon working hours and a date string, return whether the salon is open
 * and what time slots are available.
 */
export function getSalonSlotsForDate(
  workingHours: WorkingDay[],
  dateStr: string,
  fallbackSlots: string[],
): string[] {
  if (!workingHours?.length) return fallbackSlots;

  const date = new Date(dateStr + "T00:00:00");
  const dayOfWeek = date.getDay();

  const day = workingHours.find((d) => d.dayOfWeek === dayOfWeek);
  if (!day || !day.isOpen) return [];

  return generateSlots(day.openTime, day.closeTime);
}
