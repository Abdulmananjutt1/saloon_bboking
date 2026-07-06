import express    from "express";
import cors       from "cors";
import http       from "http";
import bookingsRouter  from "./routes/bookings";
import clientsRouter   from "./routes/clients";
import authRouter      from "./routes/auth";
import servicesRouter  from "./routes/services";
import stylistsRouter  from "./routes/stylists";
import statsRouter     from "./routes/stats";
import chatRouter      from "./routes/chat";
import pushRouter      from "./routes/push";
import settingsRouter  from "./routes/settings";
import payrollRouter   from "./routes/payroll";
import contactRouter   from "./routes/contact";
import { attachWebSocketServer } from "./websocket/server";

const app  = express();
const PORT = Number(process.env.PORT ?? 4000);

// ── Middleware ────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
app.use("/api/push",     pushRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/payroll",  payrollRouter);
app.use("/api/contact",  contactRouter);

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

// ── HTTP + WebSocket Server ───────────────────
const server = http.createServer(app);
attachWebSocketServer(server, PORT);

server.listen(PORT, () => {
  console.log(`\n🚀  Glamour Studio API running at http://localhost:${PORT}`);
  console.log(`🔌  WebSocket server at    ws://localhost:${PORT}/ws`);
  console.log(`📋  Endpoints:`);
  console.log(`    GET/POST             /api/bookings`);
  console.log(`    GET/PATCH/DELETE     /api/bookings/:id`);
  console.log(`    GET/POST/PATCH/DELETE /api/clients`);
  console.log(`    POST                 /api/auth/register`);
  console.log(`    POST                 /api/auth/login`);
  console.log(`    GET                  /api/stats`);
  console.log(`    GET                  /api/stats/analytics`);
  console.log(`    GET                  /api/chat/rooms`);
  console.log(`    GET                  /api/chat/messages?roomId=`);
  console.log(`    GET                  /health\n`);
});

export default app;
