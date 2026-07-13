// Backend config - single source of truth for environment variables.

export const JWT_SECRET =
  process.env.JWT_SECRET ?? "glamour_studio_super_secret_dev_key_2026";

export const PORT = Number(process.env.PORT ?? 4000);

export const DATABASE_URL = process.env.DATABASE_URL ?? "";

export const IS_PROD = process.env.NODE_ENV === "production";

const LOCAL_FRONTEND_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

function splitEnvList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOrigin(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
}

export const PUBLIC_BACKEND_URL =
  process.env.PUBLIC_BACKEND_URL ??
  process.env.API_URL ??
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${PORT}`);

export const APP_URL =
  process.env.APP_URL ??
  process.env.FRONTEND_URL ??
  "http://localhost:3000";

export const ALLOWED_ORIGINS = Array.from(new Set([
  normalizeOrigin(APP_URL),
  ...LOCAL_FRONTEND_ORIGINS,
  ...splitEnvList(process.env.FRONTEND_URLS).map(normalizeOrigin),
  ...splitEnvList(process.env.CORS_ORIGINS).map(normalizeOrigin),
]));

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;

  const normalized = normalizeOrigin(origin);
  return ALLOWED_ORIGINS.includes(normalized);
}

export function assertRequiredEnv() {
  const missing: string[] = [];

  if (!DATABASE_URL) missing.push("DATABASE_URL");
  if (IS_PROD && JWT_SECRET === "glamour_studio_super_secret_dev_key_2026") {
    missing.push("JWT_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
  }
}

// Web Push (VAPID)
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
export const VAPID_EMAIL = process.env.VAPID_EMAIL ?? "mailto:admin@glamourstudio.com";

// Email (Resend)
export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Glamour Studio <onboarding@resend.dev>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
