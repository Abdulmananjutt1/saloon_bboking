"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from "@/lib/api";
import { buildWsUrl } from "@/lib/ws";

// localStorage key prefix — per-room last-read timestamps
const LAST_READ_PREFIX = "gs_admin_read_";

interface UnreadMap {
  [roomId: string]: number; // count of unread client messages per room
}

/**
 * Lightweight hook used by the admin layout sidebar to show total unread
 * client messages across all rooms. Also exposes per-room counts so the
 * chat page rooms list can show individual badges.
 *
 * Strategy:
 *  - On mount, fetch all rooms + their message counts from the API.
 *  - Compare each room's messageCount against the last-read count stored in
 *    localStorage for that room.
 *  - Listen to the admin WS for live new messages and increment accordingly.
 *  - markRoomRead(roomId) saves current count to localStorage → zeroes badge.
 */
export function useAdminUnread() {
  const [unreadMap, setUnreadMap] = useState<UnreadMap>({});
  const ws = useRef<WebSocket | null>(null);

  // ── Compute unread from rooms API ─────────────────────────────────────────
  const computeFromRooms = useCallback(async () => {
    try {
      const json = await chatApi.getRooms() as { success: boolean; data: { roomId: string; messageCount: number; lastSender: string }[] };
      if (!json.success) return;

      const map: UnreadMap = {};
      for (const room of json.data) {
        const key      = `${LAST_READ_PREFIX}${room.roomId}`;
        const lastRead = parseInt(localStorage.getItem(key) ?? "0", 10);
        const unread   = Math.max(0, room.messageCount - lastRead);
        if (unread > 0 && room.lastSender !== "admin") {
          map[room.roomId] = unread;
        }
      }
      setUnreadMap(map);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { computeFromRooms(); }, [computeFromRooms]);

  // ── Listen for live client messages via WS ────────────────────────────────
  useEffect(() => {
    const sock = new WebSocket(`${buildWsUrl()}?role=admin`);
    ws.current = sock;

    sock.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type !== "message") return;
        // Only increment if the message is from a client (not admin)
        if (payload.sender === "admin") return;

        const roomId = payload.roomId as string;
        // Check if admin currently has this room open (last-read === current)
        const key      = `${LAST_READ_PREFIX}${roomId}`;
        const lastRead = parseInt(localStorage.getItem(key) ?? "0", 10);

        // We don't know the exact count here, so just +1
        setUnreadMap((prev) => {
          // If admin is currently reading this room (count stored as -1 sentinel)
          if (localStorage.getItem(`${key}_open`) === "1") return prev;
          return { ...prev, [roomId]: (prev[roomId] ?? 0) + 1 };
        });

        // Keep lastRead in sync — bump stored count so we can diff later
        localStorage.setItem(key, String(lastRead)); // don't move forward yet
      } catch { /* ignore */ }
    };

    return () => sock.close();
  }, []);

  // ── Mark a single room as read ────────────────────────────────────────────
  const markRoomRead = useCallback((roomId: string) => {
    // 1. Clear badge IMMEDIATELY — no waiting for API
    setUnreadMap((prev) => {
      const next = { ...prev };
      delete next[roomId];
      return next;
    });

    // 2. Mark room as open so live WS messages don't re-increment
    localStorage.setItem(`${LAST_READ_PREFIX}${roomId}_open`, "1");

    // 3. Background: persist last-read count so it survives page refresh
    chatApi.getMessages(roomId)
      .then((json: { success: boolean; data: unknown[] }) => {
        if (json.success) {
          const count = json.data.length;
          localStorage.setItem(`${LAST_READ_PREFIX}${roomId}`, String(count));
        }
      })
      .catch(() => { /* silent */ });
  }, []);

  // Mark room as closed (admin navigated away)
  const markRoomClosed = useCallback((roomId: string) => {
    localStorage.removeItem(`${LAST_READ_PREFIX}${roomId}_open`);
  }, []);

  // Total unread across all rooms
  const totalUnread = Object.values(unreadMap).reduce((s, n) => s + n, 0);

  return { unreadMap, totalUnread, markRoomRead, markRoomClosed };
}
