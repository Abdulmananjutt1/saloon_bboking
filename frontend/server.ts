// ─────────────────────────────────────────────────────────
//  Custom Next.js Server — Glamour Studio
//  Adds WebSocket support on top of Next.js HTTP server
// ─────────────────────────────────────────────────────────

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import prisma from "./src/server/db";
import { notifyAdmins, notifyClient } from "./src/server/lib/push";

const dev  = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT ?? 3000);
const app  = next({ dev });
const handle = app.getRequestHandler();

// ── WebSocket state ───────────────────────────────────────
const rooms        = new Map<string, Set<WebSocket>>();
const adminSockets = new Set<WebSocket>();

function broadcastToRoom(roomId: string, payload: object, exclude?: WebSocket) {
  const msgStr    = JSON.stringify(payload);
  const roomSocks = rooms.get(roomId);
  roomSocks?.forEach((ws) => {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) ws.send(msgStr);
  });
  adminSockets.forEach((ws) => {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) ws.send(msgStr);
  });
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  });

  // ── Attach WebSocket server ─────────────────────────────
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const host  = req.headers.host ?? `localhost:${port}`;
    const proto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0] ?? "http";
    const url   = new URL(req.url ?? "/", `${proto}://${host}`);
    const role   = url.searchParams.get("role")   ?? "client";
    const roomId = url.searchParams.get("roomId") ?? "";

    console.log(`[WS] Connected — role=${role} roomId=${roomId}`);

    if (role === "admin") {
      adminSockets.add(ws);
    } else {
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId)!.add(ws);
    }

    ws.send(JSON.stringify({ type: "connected", role, roomId }));

    ws.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as {
          type: string; roomId: string; text: string; sender: string; senderName: string;
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
            type: "message", id: saved.id, roomId: saved.roomId,
            sender: saved.sender, senderName: saved.senderName,
            text: saved.text, createdAt: saved.createdAt,
          };

          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
          broadcastToRoom(msg.roomId, payload, ws);

          if (msg.sender === "admin") {
            notifyClient(msg.roomId, {
              title: "💬 New message from Glamour Studio",
              body:  msg.text.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text,
              tag:   `chat-${msg.roomId}`, url: "/dashboard",
              data:  { roomId: msg.roomId },
            }).catch(() => {});
          } else {
            notifyAdmins({
              title: `💬 ${msg.senderName ?? msg.sender}`,
              body:  msg.text.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text,
              tag:   `chat-admin-${msg.roomId}`, url: "/admin/chat",
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

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
