// ─────────────────────────────────────────────────────────
//  Session helpers — single place for localStorage auth logic
//  Used by: login page, register page, dashboard, admin layout
// ─────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "CLIENT" | "admin" | "client";
}

export function saveSession(user: SessionUser, token: string): void {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function clearSession(): void {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "ADMIN" || user?.role === "admin";
}

/** Read a one-time toast from sessionStorage (set before redirect) */
export function popSessionToast(): { type: string; title: string; message: string } | null {
  try {
    const raw = sessionStorage.getItem("toast");
    if (!raw) return null;
    sessionStorage.removeItem("toast");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Queue a toast to be shown after the next page load */
export function pushSessionToast(type: string, title: string, message: string): void {
  sessionStorage.setItem("toast", JSON.stringify({ type, title, message }));
}
