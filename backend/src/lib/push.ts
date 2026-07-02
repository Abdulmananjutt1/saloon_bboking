// ─────────────────────────────────────────────────────────
//  Web Push Service — Glamour Studio
//  Handles sending browser push notifications via VAPID
// ─────────────────────────────────────────────────────────

import webpush from "web-push";
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } from "./config";
import prisma from "../db";

// Configure VAPID details once at startup
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushPayload {
  title:   string;
  body:    string;
  icon?:   string;
  badge?:  string;
  tag?:    string;
  url?:    string;
  data?:   Record<string, unknown>;
}

// ── Send to a single subscription ────────────────────────
async function sendToSubscription(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload),
    );
    return true;
  } catch (err: any) {
    // 410 Gone = subscription expired/removed — delete it
    if (err?.statusCode === 410 || err?.statusCode === 404) {
      await prisma.pushSubscription
        .delete({ where: { endpoint: sub.endpoint } })
        .catch(() => {});
    }
    return false;
  }
}

// ── Send to all admin subscriptions ──────────────────────
export async function notifyAdmins(payload: PushPayload): Promise<void> {
  try {
    const subs = await prisma.pushSubscription.findMany({
      where: { role: "admin" },
    });
    await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)));
  } catch (err) {
    console.error("[Push] notifyAdmins error:", err);
  }
}

// ── Send to a specific client by email ───────────────────
export async function notifyClient(email: string, payload: PushPayload): Promise<void> {
  try {
    const subs = await prisma.pushSubscription.findMany({
      where: { email: email.toLowerCase() },
    });
    await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)));
  } catch (err) {
    console.error("[Push] notifyClient error:", err);
  }
}

// ── Send to everyone (broadcast) ─────────────────────────
export async function notifyAll(payload: PushPayload): Promise<void> {
  try {
    const subs = await prisma.pushSubscription.findMany();
    await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)));
  } catch (err) {
    console.error("[Push] notifyAll error:", err);
  }
}
