"use client";

import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";
import { buildWsUrl } from "@/lib/ws";

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: "booking" | "chat";
}

interface BookingPreview {
  id: string;
  serviceName: string;
  customerName: string;
  date: string;
}

export function useNotifications() {
  const [notifs, setNotifs]   = useState<NotificationItem[]>([]);
  const [unread, setUnread]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Seed with recent bookings from stats endpoint
    statsApi.getStats()
      .then((json: any) => {
        if (json.success && json.data?.recentBookings) {
          const initial: NotificationItem[] = json.data.recentBookings
            .slice(0, 3)
            .map((b: BookingPreview) => ({
              id:    b.id,
              title: `New booking: ${b.serviceName}`,
              time:  `by ${b.customerName} on ${b.date}`,
              type:  "booking" as const,
            }));
          setNotifs(initial);
          if (initial.length) setUnread(1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // 2. Listen for live chat messages via WebSocket
    const sock = new WebSocket(`${buildWsUrl()}?role=admin`);

    sock.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "message" && payload.sender !== "admin") {
          const newNotif: NotificationItem = {
            id:    payload.id,
            title: `New message from ${payload.senderName}`,
            time:  "Just now",
            type:  "chat",
          };
          setNotifs((prev) => [newNotif, ...prev].slice(0, 10));
          setUnread((u) => u + 1);
        }
      } catch { /* ignore */ }
    };

    return () => sock.close();
  }, []);

  const markRead = () => setUnread(0);
  const clearAll = () => { setNotifs([]); setUnread(0); };

  return { notifs, unread, loading, markRead, clearAll };
}
