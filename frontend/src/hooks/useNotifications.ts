"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { statsApi, bookingsApi } from "@/lib/api";
import { buildWsUrl } from "@/lib/ws";
import {
  notificationService,
  type AppNotification,
  type NotificationScreen,
} from "@/services/notifications";

export type { AppNotification };

export interface NotificationItem {
  id:    string;
  title: string;
  time:  string;
  type:  AppNotification["type"];
  screen: NotificationScreen;
  read:  boolean;
  url?:  string;
}

function toItem(n: AppNotification): NotificationItem {
  return {
    id:     n.id,
    title:  n.title,
    time:   n.body,
    type:   n.type,
    screen: n.screen,
    read:   n.read,
    url:    n.url,
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

const SEEN_BOOKINGS_KEY = "gs_seen_booking_ids";
const isChatNotification = (n: AppNotification) => n.type === "chat" || n.screen === "chat";

export function useNotifications() {
  const [notifs, setNotifs]     = useState<NotificationItem[]>([]);
  const [unread, setUnread]       = useState(0);
  const [byScreen, setByScreen]   = useState<Record<NotificationScreen, number>>({
    bookings: 0, chat: 0, notifications: 0, appointments: 0, system: 0,
  });
  const [loading, setLoading]     = useState(true);
  const seenBookingsRef           = useRef<Set<string> | null>(null);

  const refreshCounts = () => {
    const visibleUnread = notificationService.getAll().filter((n) => !n.read && !isChatNotification(n)).length;
    setUnread(visibleUnread);
    setByScreen({
      bookings:      notificationService.getUnreadByScreen("bookings"),
      chat:          notificationService.getUnreadByScreen("chat"),
      notifications: visibleUnread,
      appointments:  notificationService.getUnreadByScreen("appointments"),
      system:        notificationService.getUnreadByScreen("system"),
    });
  };

  useEffect(() => {
    const unsub = notificationService.subscribe((all) => {
      setNotifs(all.filter((n) => !isChatNotification(n)).map(toItem));
      refreshCounts();
    });
    return unsub;
  }, []);

  // Seed + poll new pending bookings for admin
  useEffect(() => {
    let wsInstance: WebSocket | null = null;

    statsApi.getStats()
      .then((res) => {
        const json = res as StatsResponse;
        if (json.success && json.data?.recentBookings?.length) {
          if (notificationService.getAll().length === 0) {
            json.data.recentBookings.slice(0, 3).forEach((b) => {
              notificationService.add({
                title: `New booking: ${b.serviceName}`,
                body:  `by ${b.customerName} on ${b.date}`,
                type:  "booking",
                screen: "bookings",
                url:   "/admin/bookings",
                meta:  { bookingId: b.id },
              });
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const pollBookings = async () => {
      try {
        const res = await bookingsApi.getAll("pending") as { success: boolean; data: { id: string; customerName: string; serviceName?: string; date: string }[] };
        if (!res.success) return;

        const ids = res.data.map((b) => b.id);
        if (seenBookingsRef.current === null) {
          seenBookingsRef.current = new Set(
            JSON.parse(localStorage.getItem(SEEN_BOOKINGS_KEY) ?? "[]") as string[]
          );
          ids.forEach((id) => seenBookingsRef.current!.add(id));
          localStorage.setItem(SEEN_BOOKINGS_KEY, JSON.stringify([...seenBookingsRef.current]));
          return;
        }

        for (const b of res.data) {
          if (!seenBookingsRef.current.has(b.id)) {
            seenBookingsRef.current.add(b.id);
            notificationService.add({
              title: `New booking request`,
              body:  `${b.customerName} — ${b.date}`,
              type:  "booking",
              screen: "bookings",
              url:   "/admin/bookings",
              meta:  { bookingId: b.id },
            });
          }
        }
        localStorage.setItem(SEEN_BOOKINGS_KEY, JSON.stringify([...seenBookingsRef.current]));
      } catch { /* silent */ }
    };

    pollBookings();
    const interval = setInterval(pollBookings, 30_000);

    try {
      wsInstance = new WebSocket(`${buildWsUrl()}?role=admin`);
      wsInstance.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === "message" && payload.sender !== "admin") {
            notificationService.add({
              title: `New message from ${payload.senderName}`,
              body:  payload.text?.slice(0, 80) ?? "New message",
              type:  "chat",
              screen: "chat",
              url:   "/admin/chat",
              meta:  { roomId: payload.roomId },
            });
          }
        } catch { /* ignore */ }
      };
    } catch { /* WS unavailable */ }

    return () => {
      clearInterval(interval);
      wsInstance?.close();
    };
  }, []);

  const markRead       = useCallback(() => notificationService.markReadWhere((n) => !isChatNotification(n)), []);
  const markScreenRead = useCallback(
    (screen: NotificationScreen) => notificationService.markReadByScreen(screen),
    []
  );
  const clearAll       = useCallback(() => notificationService.clearWhere((n) => !isChatNotification(n)), []);

  return { notifs, unread, byScreen, loading, markRead, markScreenRead, clearAll };
}
