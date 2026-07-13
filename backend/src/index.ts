import express from "express";
import cors from "cors";
import http from "http";
import bookingsRouter from "./routes/bookings";
import clientsRouter from "./routes/clients";
import authRouter from "./routes/auth";
import servicesRouter from "./routes/services";
import stylistsRouter from "./routes/stylists";
import statsRouter from "./routes/stats";
import chatRouter from "./routes/chat";
import pushRouter from "./routes/push";
import settingsRouter from "./routes/settings";
import payrollRouter from "./routes/payroll";
import contactRouter from "./routes/contact";
import { attachWebSocketServer } from "./websocket/server";
import { ALLOWED_ORIGINS, PORT, PUBLIC_BACKEND_URL, assertRequiredEnv, isAllowedOrigin } from "./lib/config";

assertRequiredEnv();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api/bookings", bookingsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/stylists", stylistsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/push", pushRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/contact", contactRouter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Glamour Studio API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

const server = http.createServer(app);
attachWebSocketServer(server, PORT);

server.listen(PORT, () => {
  console.log(`\nGlamour Studio API running at ${PUBLIC_BACKEND_URL}`);
  console.log(`WebSocket server at ${PUBLIC_BACKEND_URL.replace(/^http/, "ws")}/ws`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
  console.log("Endpoints:");
  console.log("    GET/POST              /api/bookings");
  console.log("    GET/PATCH/DELETE      /api/bookings/:id");
  console.log("    GET/POST/PATCH/DELETE /api/clients");
  console.log("    POST                  /api/auth/register");
  console.log("    POST                  /api/auth/login");
  console.log("    GET                   /api/stats");
  console.log("    GET                   /api/stats/analytics");
  console.log("    GET                   /api/chat/rooms");
  console.log("    GET                   /api/chat/messages?roomId=");
  console.log("    GET                   /health\n");
});

export default app;
