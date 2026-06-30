import express    from "express";
import cors       from "cors";
import http       from "http";
import { WebSocketServer, WebSocket } from "ws";
import bookingsRouter from "./routes/bookings";
import clientsRouter  from "./routes/clients";
import authRouter     from "./routes/auth";
import servicesRouter from "./routes/services";
import stylistsRouter from "./routes/stylists";
import statsRouter    from "./routes/stats";
import chatRouter     from "./routes/chat";
import prisma         from "./db";

const app  = express();
const PORT = Number(process.env.PORT ?? 4000);

// ── Middleware ────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger ────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ────────────────────────────────────
app.use("/api/bookings", bookingsRouter);
app.use("/api/clients",  clientsRouter);
app.use("/api/auth",     authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/stylists", stylistsRouter);
app.use("/api/stats",    statsRouter);
app.use("/api/chat",     chatRouter);

// ── Health check ──────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status:    "ok",
    service:   "Glamour Studio API",
    timestamp: new Date().toISOString(),
    version:   "1.0.0",
  });
});

// ── 404 handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── HTTP Server ───────────────────────────────
const server = http.createServer(app);

// ── WebSocket Server ──────────────────────────
const wss = new WebSocketServer({ server, path: "/ws" });

// Track connected clients: Map<roomId, Set<WebSocket>>
const rooms = new Map<string, Set<WebSocket>>();
// Track admin connections
const adminClients = new Set<WebSocket>();

function broadcastToRoom(roomId: string, payload: object, excludeSocket?: WebSocket) {
  const roomSockets = rooms.get(roomId);
  const msgStr = JSON.stringify(payload);

  // Send to room participants
  if (roomSockets) {
    roomSockets.forEach((ws) => {
      if (ws !== excludeSocket && ws.readyState === WebSocket.OPEN) {
        ws.send(msgStr);
      }
    });
  }

  // Always broadcast to all admin connections
  adminClients.forEach((ws) => {
    if (ws !== excludeSocket && ws.readyState === WebSocket.OPEN) {
      ws.send(msgStr);
    }
  });
}

wss.on("connection", (ws, req) => {
  const url    = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const role   = url.searchParams.get("role")   ?? "client";   // "admin" | "client"
  const roomId = url.searchParams.get("roomId") ?? "";         // client email
  const name   = url.searchParams.get("name")   ?? "User";

  console.log(`[WS] Connected — role=${role} roomId=${roomId}`);

  if (role === "admin") {
    adminClients.add(ws);
  } else {
    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId)!.add(ws);
  }

  // Send connection ACK
  ws.send(JSON.stringify({ type: "connected", role, roomId }));

  ws.on("message", async (raw) => {
    try {
      const msg = JSON.parse(raw.toString()) as {
        type: string;
        roomId: string;
        text: string;
        sender: string;
        senderName: string;
      };

      if (msg.type === "message" && msg.roomId && msg.text?.trim()) {
        // Persist to DB
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
      }
    } catch (err) {
      console.error("[WS] message error:", err);
    }
  });

  ws.on("close", () => {
    console.log(`[WS] Disconnected — role=${role} roomId=${roomId}`);
    if (role === "admin") {
      adminClients.delete(ws);
    } else {
      rooms.get(roomId)?.delete(ws);
      if (rooms.get(roomId)?.size === 0) rooms.delete(roomId);
    }
  });

  ws.on("error", (err) => console.error("[WS] error:", err));
});

// ── Start ─────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀  Glamour Studio API running at http://localhost:${PORT}`);
  console.log(`🔌  WebSocket server at    ws://localhost:${PORT}/ws`);
  console.log(`📋  Endpoints:`);
  console.log(`    GET/POST   /api/bookings`);
  console.log(`    GET/PATCH/DELETE /api/bookings/:id`);
  console.log(`    GET/POST   /api/clients`);
  console.log(`    POST       /api/auth/register`);
  console.log(`    POST       /api/auth/login`);
  console.log(`    GET        /api/stats`);
  console.log(`    GET        /api/stats/analytics`);
  console.log(`    GET        /api/chat/rooms`);
  console.log(`    GET        /api/chat/messages?roomId=`);
  console.log(`    GET        /health\n`);
});

export default app;
