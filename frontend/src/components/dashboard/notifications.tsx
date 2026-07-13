import { Bell, CalendarDays, MessageSquare } from "lucide-react";
import type { ClientBooking } from "@/hooks/useClientDashboard";
import type { AppNotification } from "@/services/notifications";
import { normalizeDashboardUrl, TAB_ROUTES } from "./routes";

export type ClientNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: AppNotification["type"];
  label: string;
  timestamp: number;
  read: boolean;
  url?: string;
  source: "local" | "booking";
};

export function buildClientNotificationFeed(
  localNotifications: AppNotification[],
  upcomingBookings: ClientBooking[],
  pastBookings: ClientBooking[],
): ClientNotificationItem[] {
  const bookingItems = [...upcomingBookings, ...pastBookings]
    .filter((booking) => booking.status !== "pending")
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12)
    .map((booking) => ({
      id: `booking-${booking.id}`,
      title: bookingStatusTitle(booking.status),
      body: `${bookingServiceLabel(booking)} with ${bookingStylistLabel(booking)} • ${formatBookingDate(booking.date)} at ${booking.time}`,
      type: "status" as const,
      label: "Booking",
      timestamp: new Date(booking.createdAt).getTime(),
      read: booking.status !== "pending",
      url: TAB_ROUTES.appointments,
      source: "booking" as const,
    }));

  const localItems = localNotifications
    .filter((notification) => notification.type !== "chat" && notification.screen !== "chat")
    .map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      label: notificationLabel(notification.type),
      timestamp: notification.timestamp,
      read: notification.read,
      url: normalizeDashboardUrl(notification.url),
      source: "local" as const,
    }));

  return [...localItems, ...bookingItems]
    .filter((item, index, all) => all.findIndex((n) => n.id === item.id) === index)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function cleanLabel(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === "undefined") return undefined;
  return trimmed;
}

function bookingServiceLabel(booking: ClientBooking) {
  return cleanLabel(booking.serviceName) ?? cleanLabel(booking.service?.name) ?? "Appointment";
}

function bookingStylistLabel(booking: ClientBooking) {
  return cleanLabel(booking.stylistName) ?? cleanLabel(booking.stylist?.name) ?? "Glamour Studio";
}

function bookingStatusTitle(status: string) {
  const labels: Record<string, string> = {
    pending: "Booking request received",
    confirmed: "Booking confirmed",
    completed: "Visit completed",
    cancelled: "Booking cancelled",
  };
  return labels[status] ?? "Booking update";
}

function notificationLabel(type: AppNotification["type"]) {
  const labels: Record<AppNotification["type"], string> = {
    booking: "Booking",
    chat: "Chat",
    status: "Status",
    system: "System",
  };
  return labels[type];
}

export function notificationIcon(type: AppNotification["type"]) {
  const style = { width: 16, height: 16, color: "var(--gold)" };
  if (type === "chat") return <MessageSquare style={style} />;
  if (type === "booking" || type === "status") return <CalendarDays style={style} />;
  return <Bell style={style} />;
}

export function notificationPillStyle(type: AppNotification["type"]) {
  const colors: Record<AppNotification["type"], { color: string; bg: string }> = {
    booking: { color: "var(--gold)", bg: "rgba(201,151,59,0.1)" },
    status: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
    chat: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    system: { color: "var(--text-muted)", bg: "rgba(255,255,255,0.06)" },
  };
  return {
    color: colors[type].color,
    background: colors[type].bg,
    borderRadius: 999,
    padding: "3px 8px",
    fontSize: "0.62rem",
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  };
}

function formatBookingDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function timeAgo(timestamp: number) {
  const diff = Math.max(0, Date.now() - timestamp);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "Now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}
