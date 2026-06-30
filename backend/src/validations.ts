// ════════════════════════════════════════
//  Validation Rules
// ════════════════════════════════════════
import type { ValidationError } from "./types";

export const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:    /^(\+92|0092|0)?[-.\s]?[3][0-9]{2}[-.\s]?[0-9]{7}$/,
  name:     /^[a-zA-Z\u0600-\u06FF\s'-]{2,60}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  date:     /^\d{4}-\d{2}-\d{2}$/,
};

export function validateName(v: string): string | null {
  if (!v?.trim())            return "Name is required";
  if (v.trim().length < 2)   return "Name must be at least 2 characters";
  if (v.trim().length > 60)  return "Name must be under 60 characters";
  if (!REGEX.name.test(v.trim())) return "Name contains invalid characters";
  return null;
}

export function validateEmail(v: string): string | null {
  if (!v?.trim())            return "Email is required";
  if (!REGEX.email.test(v.trim().toLowerCase())) return "Please enter a valid email address";
  return null;
}

export function validatePhone(v: string): string | null {
  if (!v?.trim()) return "Phone number is required";
  const cleaned = v.replace(/[\s\-().]/g, "");
  if (!REGEX.phone.test(v.trim()) && !(cleaned.length >= 10 && cleaned.length <= 13)) {
    return "Enter a valid Pakistani phone number (e.g. 0300-1234567)";
  }
  return null;
}

export function validatePassword(v: string): string | null {
  if (!v)              return "Password is required";
  if (v.length < 8)   return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(v)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(v)) return "Password must contain at least one lowercase letter";
  if (!/\d/.test(v))   return "Password must contain at least one number";
  return null;
}

export function validateDate(v: string): string | null {
  if (!v) return "Date is required";
  if (!REGEX.date.test(v)) return "Invalid date format";
  const selected = new Date(v);
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) return "Please select a future date";
  return null;
}

export function hasErrors(e: ValidationError): boolean {
  return Object.keys(e).length > 0;
}

// ── Booking ──────────────────────────────────
export function validateBooking(body: Record<string, any>): ValidationError {
  const e: ValidationError = {};
  const isCustom = body.serviceId === null || body.serviceId === "custom" || body.customServices?.length > 0 || body.customItems?.length > 0;
  if (!isCustom && !body.serviceId) e.serviceId = "Please select a service";
  if (!body.stylistId) e.stylistId = "Please select a stylist";
  const dErr = validateDate(body.date);   if (dErr) e.date = dErr;
  if (!body.time)      e.time = "Please select a time slot";
  const nErr = validateName(body.name);   if (nErr) e.name = nErr;
  const eErr = validateEmail(body.email); if (eErr) e.email = eErr;
  const pErr = validatePhone(body.phone); if (pErr) e.phone = pErr;
  if (body.notes && body.notes.length > 500) e.notes = "Notes must be under 500 characters";
  return e;
}

// ── Auth ─────────────────────────────────────
export function validateLogin(body: Record<string, string>): ValidationError {
  const e: ValidationError = {};
  const eErr = validateEmail(body.email);
  if (eErr) e.email = eErr;
  if (!body.password) e.password = "Password is required";
  return e;
}

export function validateRegister(body: Record<string, string>): ValidationError {
  const e: ValidationError = {};
  const nErr = validateName(body.name);       if (nErr) e.name = nErr;
  const eErr = validateEmail(body.email);     if (eErr) e.email = eErr;
  const pErr = validatePhone(body.phone);     if (pErr) e.phone = pErr;
  const passErr = validatePassword(body.password); if (passErr) e.password = passErr;
  if (!body.confirmPassword) {
    e.confirmPassword = "Please confirm your password";
  } else if (body.confirmPassword !== body.password) {
    e.confirmPassword = "Passwords do not match";
  }
  return e;
}

// ── Client ───────────────────────────────────
export function validateClient(body: Record<string, string>): ValidationError {
  const e: ValidationError = {};
  const nErr = validateName(body.name);   if (nErr) e.name = nErr;
  const eErr = validateEmail(body.email); if (eErr) e.email = eErr;
  const pErr = validatePhone(body.phone); if (pErr) e.phone = pErr;
  return e;
}
