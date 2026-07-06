"use client";

// ─────────────────────────────────────────────────────────
//  useNotifications — Glamour Studio
//
//  Consumes notificationService and seeds initial data
//  from the stats API + WebSocket for live chat events.
//  All components should import from here — NOT from
//  notificationService directly — to get reactive state.
// ─────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";
import { buildWsUrl } from "@/lib/ws";
import {
  notificationService,
  type AppNotification,
} from "@/services/notifications";

export type { AppNotification };

// Legacy alias for backwards compat with NotificationsDropdown
export interface NotificationItem {
  id:    string;
  title: string;
  time:  string;
  type:  "booking" | "chat" | "system" | "status";
  read:  boolean;
  url?:  string;
}

function toItem(n: AppNotification): NotificationItem {
  return {
    id:    n.id,
    title: n.title,
    time:  n.body,
    type:  n.type,
    read:  n.read,
    url:   n.url,
  };
}

interface BookingPreview {
  id: string;
  serviceName: string;
  customerName: string;
  date: string;
}

interface StatsResponse {
  success: boolean;
  data: { recentBookings: BookingPreview[] };
}

export function useNotifications() {
  const [notifs, setNotifs]   = useState<NotificationItem[]>([]);
  const [unread, setUnread]   = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Subscribe to the service (reactive state) ─────────
  useEffect(() => {
    const unsub = notificationService.subscribe((all) => {
      setNotifs(all.map(toItem));
      setUnread(notificationService.getUnreadCount());
    });
    return unsub;
  }, []);

  // ── Seed from stats + WebSocket on mount ──────────────
  useEffect(() => {
    let wsInstance: WebSocket | null = null;

    statsApi.getStats()
      .then((res) => {
        const json = res as StatsResponse;
        if (json.success && json.data?.recentBookings?.length) {
          // Only add if no notifications exist yet (avoid re-seeding)
          if (notificationService.getAll().length === 0) {
            json.data.recentBookings.slice(0, 3).forEach((b) => {
              notificationService.add({
                title: `New booking: ${b.serviceName}`,
                body:  `by ${b.customerName} on ${b.date}`,
                type:  "booking",
                url:   "/admin/bookings",
                meta:  { bookingId: b.id },
              });
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Live chat messages via WebSocket
    try {
      wsInstance = new WebSocket(`${buildWsUrl()}?role=admin`);
      wsInstance.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === "message" && payload.sender !== "admin") {
            notificationService.add({
              title: `New message from ${payload.senderName}`,
              body:  "Just now",
              type:  "chat",
              url:   "/admin/chat",
              meta:  { roomId: payload.roomId },
            });
          }
        } catch { /* ignore malformed */ }
      };
    } catch { /* WS not available */ }

    return () => { wsInstance?.close(); };
  }, []);

  const markRead = () => notificationService.markAllRead();
  const clearAll = () => notificationService.clearAll();

  return { notifs, unread, loading, markRead, clearAll };
}
