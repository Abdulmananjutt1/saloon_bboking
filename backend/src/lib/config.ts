// ─────────────────────────────────────────────────────────
//  Backend Config — single source of truth for all env vars
//  Import from here instead of reading process.env directly
// ─────────────────────────────────────────────────────────

export const JWT_SECRET =
  process.env.JWT_SECRET ?? "glamour_studio_super_secret_dev_key_2026";

export const PORT = Number(process.env.PORT ?? 4000);

export const DATABASE_URL = process.env.DATABASE_URL ?? "";

export const IS_PROD = process.env.NODE_ENV === "production";

// ── Web Push (VAPID) ──────────────────────────────────────
export const VAPID_PUBLIC_KEY  = process.env.VAPID_PUBLIC_KEY  ?? "";
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
export const VAPID_EMAIL       = process.env.VAPID_EMAIL       ?? "mailto:admin@glamourstudio.com";

// ── Email (Resend) ────────────────────────────────────────
export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const EMAIL_FROM     = process.env.EMAIL_FROM     ?? "Glamour Studio <onboarding@resend.dev>";
export const APP_URL        = process.env.APP_URL        ?? "http://localhost:3000";
export const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "";
