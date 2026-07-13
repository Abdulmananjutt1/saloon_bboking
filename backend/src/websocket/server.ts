// ─────────────────────────────────────────────────────────
//  WebSocket Server — Glamour Studio
//  Real-time chat: clients ↔ admin
// ─────────────────────────────────────────────────────────

import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import prisma from "../db";
import { notifyAdmins, notifyClient } from "../lib/push";

// Track connected clients: Map<roomId, Set<WebSocket>>
const rooms       = new Map<string, Set<WebSocket>>();
const adminSockets = new Set<WebSocket>();

function broadcastToRoom(roomId: string, payload: object, exclude?: WebSocket) {
  const msgStr    = JSON.stringify(payload);
  const roomSocks = rooms.get(roomId);

  // Send to room participants
  roomSocks?.forEach((ws) => {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) ws.send(msgStr);
  });

  // Always broadcast to all admin connections
  adminSockets.forEach((ws) => {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) ws.send(msgStr);
  });
}

export function attachWebSocketServer(server: Server, port: number): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const host = req.headers.host ?? `localhost:${port}`;
    const proto = req.headers["x-forwarded-proto"]?.toString().split(",")[0] ?? "http";
    const url = new URL(req.url ?? "/", `${proto}://${host}`);
    const role   = url.searchParams.get("role")   ?? "client";
    const roomId = url.searchParams.get("roomId") ?? "";

    console.log(`[WS] Connected — role=${role} roomId=${roomId}`);

    if (role === "admin") {
      adminSockets.add(ws);
    } else {
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId)!.add(ws);
    }

    // ACK
    ws.send(JSON.stringify({ type: "connected", role, roomId }));

    ws.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as {
          type:       string;
          roomId:     string;
          text:       string;
          sender:     string;
          senderName: string;
        };

        if (msg.type === "message" && msg.roomId && msg.text?.trim()) {
          const saved = await prisma.chatMessage.create({
            data: {
              roomId:     msg.roomId,
              sender:     msg.sender,
              senderName: msg.senderName ?? msg.sender,
              text:       msg.text.trim(),
            },
          });

          const payload = {
            type:       "message",
            id:         saved.id,
            roomId:     saved.roomId,
            sender:     saved.sender,
            senderName: saved.senderName,
            text:       saved.text,
            createdAt:  saved.createdAt,
          };

          // Echo back to sender
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));

          // Broadcast to room + admins (excluding sender)
          broadcastToRoom(msg.roomId, payload, ws);

          // ── Push notifications ──────────────────────────────
          if (msg.sender === "admin") {
            // Admin sent message → notify the client in that room
            notifyClient(msg.roomId, {
              title: "💬 New message from Glamour Studio",
              body:  msg.text.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text,
              tag:   `chat-${msg.roomId}`,
              url:   "/dashboard",
              data:  { roomId: msg.roomId },
            }).catch(() => {});
          } else {
            // Client sent message → notify all admins
            notifyAdmins({
              title: `💬 ${msg.senderName ?? msg.sender}`,
              body:  msg.text.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text,
              tag:   `chat-admin-${msg.roomId}`,
              url:   "/admin/chat",
              data:  { roomId: msg.roomId },
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.error("[WS] message error:", err);
      }
    });

    ws.on("close", () => {
      console.log(`[WS] Disconnected — role=${role} roomId=${roomId}`);
      if (role === "admin") {
        adminSockets.delete(ws);
      } else {
        rooms.get(roomId)?.delete(ws);
        if (rooms.get(roomId)?.size === 0) rooms.delete(roomId);
      }
    });

    ws.on("error", (err) => console.error("[WS] error:", err));
  });

  return wss;
}
