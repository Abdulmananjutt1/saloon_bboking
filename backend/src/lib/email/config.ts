// ─────────────────────────────────────────────────────────
//  Email Config — Resend + app URLs
// ─────────────────────────────────────────────────────────

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Glamour Studio <onboarding@resend.dev>";

export const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export const EMAIL_ENABLED = Boolean(RESEND_API_KEY);
