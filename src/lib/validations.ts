// ════════════════════════════════════════
//  Shared Validation Rules & Helpers
// ════════════════════════════════════════

export type ValidationError = Record<string, string>;

// ── Regex ──────────────────────────────
export const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:    /^(\+92|0092|0)?[-.\s]?[3][0-9]{2}[-.\s]?[0-9]{7}$/,
  name:     /^[a-zA-Z\u0600-\u06FF\s'-]{2,60}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  date:     /^\d{4}-\d{2}-\d{2}$/,
};

// ── Field validators ───────────────────
export function validateName(v: string): string | null {
  if (!v.trim()) return "Name is required";
  if (v.trim().length < 2) return "Name must be at least 2 characters";
  if (v.trim().length > 60) return "Name must be under 60 characters";
  if (!REGEX.name.test(v.trim())) return "Name contains invalid characters";
  return null;
}

export function validateEmail(v: string): string | null {
  if (!v.trim()) return "Email is required";
  if (!REGEX.email.test(v.trim().toLowerCase())) return "Please enter a valid email address";
  return null;
}

export function validatePhone(v: string): string | null {
  if (!v.trim()) return "Phone number is required";
  // Strip all formatting characters
  const cleaned = v.trim().replace(/[\s\-().+]/g, "");
  // Accept Pakistani numbers: 03XXXXXXXXX (11 digits), 3XXXXXXXXX (10 digits),
  // or with country code 923XXXXXXXXX / 00923XXXXXXXXX
  if (cleaned.length < 10 || cleaned.length > 13) {
    return "Enter a valid phone number (e.g. 0300-1234567)";
  }
  // Must contain only digits after stripping
  if (!/^\d+$/.test(cleaned)) {
    return "Phone number can only contain digits, spaces, and dashes";
  }
  return null;
}

export function validatePassword(v: string): string | null {
  if (!v) return "Password is required";
  if (v.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(v)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(v)) return "Password must contain at least one lowercase letter";
  if (!/\d/.test(v)) return "Password must contain at least one number";
  return null;
}

export function validateConfirmPassword(v: string, original: string): string | null {
  if (!v) return "Please confirm your password";
  if (v !== original) return "Passwords do not match";
  return null;
}

export function validateRequired(v: string, label: string): string | null {
  if (!v || !v.trim()) return `${label} is required`;
  return null;
}

export function validateDate(v: string): string | null {
  if (!v) return "Date is required";
  if (!REGEX.date.test(v)) return "Invalid date format";
  const selected = new Date(v);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) return "Please select a future date";
  return null;
}

// ── Booking form validation ────────────
export interface BookingFormData {
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export function validateBookingForm(data: BookingFormData): ValidationError {
  const errors: ValidationError = {};

  if (!data.serviceId)  errors.serviceId  = "Please select a service";
  if (!data.stylistId)  errors.stylistId  = "Please select a stylist";

  const dateErr = validateDate(data.date);
  if (dateErr) errors.date = dateErr;

  if (!data.time) errors.time = "Please select a time slot";

  const nameErr = validateName(data.name);
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(data.phone);
  if (phoneErr) errors.phone = phoneErr;

  if (data.notes && data.notes.length > 500) {
    errors.notes = "Notes must be under 500 characters";
  }

  return errors;
}

// ── Auth validation ────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export function validateLoginForm(data: LoginFormData): ValidationError {
  const errors: ValidationError = {};

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  if (!data.password) errors.password = "Password is required";

  return errors;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function validateRegisterForm(data: RegisterFormData): ValidationError {
  const errors: ValidationError = {};

  const nameErr = validateName(data.name);
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(data.phone);
  if (phoneErr) errors.phone = phoneErr;

  const passErr = validatePassword(data.password);
  if (passErr) errors.password = passErr;

  const confirmErr = validateConfirmPassword(data.confirmPassword, data.password);
  if (confirmErr) errors.confirmPassword = confirmErr;

  return errors;
}

// ── Client validation ──────────────────
export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export function validateClientForm(data: ClientFormData): ValidationError {
  const errors: ValidationError = {};

  const nameErr = validateName(data.name);
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(data.phone);
  if (phoneErr) errors.phone = phoneErr;

  return errors;
}

// ── Helper: check if errors object is empty ──
export function hasErrors(errors: ValidationError): boolean {
  return Object.keys(errors).length > 0;
}
