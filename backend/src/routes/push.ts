// ─────────────────────────────────────────────────────────
//  Push Subscription Routes — Glamour Studio
//  POST /api/push/subscribe   — save subscription
//  DELETE /api/push/unsubscribe — remove subscription
//  GET  /api/push/vapid-key   — get public VAPID key
// ─────────────────────────────────────────────────────────

import { Router, Request, Response } from "express";
import prisma from "../db";
import { VAPID_PUBLIC_KEY } from "../lib/config";

const router = Router();

// GET /api/push/vapid-key — public key for frontend
router.get("/vapid-key", (_req: Request, res: Response) => {
  res.json({ success: true, publicKey: VAPID_PUBLIC_KEY });
});

// POST /api/push/subscribe
router.post("/subscribe", async (req: Request, res: Response) => {
  try {
    const { subscription, role, email, userId } = req.body as {
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
      role:         string;  // "admin" | "client"
      email?:       string;
      userId?:      string;
    };

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(422).json({ success: false, error: "Invalid subscription object" });
    }

    // Upsert — same endpoint can change role/email on re-subscribe
    await prisma.pushSubscription.upsert({
      where:  { endpoint: subscription.endpoint },
      update: {
        p256dh:    subscription.keys.p256dh,
        auth:      subscription.keys.auth,
        role:      role ?? "client",
        email:     email?.toLowerCase() ?? null,
        userId:    userId ?? null,
        updatedAt: new Date(),
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh:   subscription.keys.p256dh,
        auth:     subscription.keys.auth,
        role:     role ?? "client",
        email:    email?.toLowerCase() ?? null,
        userId:   userId ?? null,
      },
    });

    res.json({ success: true, message: "Subscribed to push notifications" });
  } catch (err) {
    console.error("[POST /push/subscribe]", err);
    res.status(500).json({ success: false, error: "Failed to save subscription" });
  }
});

// DELETE /api/push/unsubscribe
router.delete("/unsubscribe", async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.body as { endpoint: string };
    if (!endpoint) {
      return res.status(422).json({ success: false, error: "endpoint is required" });
    }

    await prisma.pushSubscription
      .delete({ where: { endpoint } })
      .catch(() => {}); // ignore if not found

    res.json({ success: true, message: "Unsubscribed from push notifications" });
  } catch (err) {
    console.error("[DELETE /push/unsubscribe]", err);
    res.status(500).json({ success: false, error: "Failed to remove subscription" });
  }
});

export default router;
