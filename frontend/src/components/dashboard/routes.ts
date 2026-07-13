import type { DashboardTab } from "./types";

export const DASHBOARD_TABS: DashboardTab[] = ["overview", "appointments", "family", "notifications", "chat", "settings"];

export const TAB_ROUTES: Record<DashboardTab, string> = {
  overview: "/dashboard",
  appointments: "/dashboard/appointments",
  family: "/dashboard/family",
  notifications: "/dashboard/notifications",
  chat: "/dashboard/chat",
  settings: "/dashboard/settings",
};

export function normalizeDashboardUrl(url?: string) {
  if (!url) return undefined;
  const tab = url.startsWith("/dashboard?") ? new URLSearchParams(url.split("?")[1]).get("tab") : null;
  return DASHBOARD_TABS.includes(tab as DashboardTab) ? TAB_ROUTES[tab as DashboardTab] : url;
}
