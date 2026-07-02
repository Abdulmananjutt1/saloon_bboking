"use client";

// ─────────────────────────────────────────────────────────
//  usePushNotifications — Glamour Studio
//  Handles service worker registration, permission request,
//  and subscription management for Web Push API.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { getSession } from "@/lib/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/** Convert a base64 VAPID public key to Uint8Array for PushManager */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding  = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64   = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData  = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export type PermissionState = "default" | "granted" | "denied" | "unsupported";

export interface UsePushNotificationsReturn {
  permission:   PermissionState;
  isSubscribed: boolean;
  isLoading:    boolean;
  subscribe:    () => Promise<void>;
  unsubscribe:  () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission,   setPermission]   = useState<PermissionState>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [swReg,        setSwReg]        = useState<ServiceWorkerRegistration | null>(null);

  // ── Check current state on mount ─────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission as PermissionState);

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then(async (reg) => {
        setSwReg(reg);
        // Check if already subscribed
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      })
      .catch((err) => {
        console.error("[PushNotifications] SW registration failed:", err);
        setPermission("unsupported");
      });
  }, []);

  // ── Subscribe ─────────────────────────────────────────────
  const subscribe = useCallback(async () => {
    if (!swReg || !VAPID_KEY) return;
    setIsLoading(true);

    try {
      // Ask for permission
      const perm = await Notification.requestPermission();
      setPermission(perm as PermissionState);
      if (perm !== "granted") return;

      // Create push subscription
      const sub = await swReg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      });

      // Determine role + email from session
      const session = getSession();
      const role    = session?.role === "ADMIN" || session?.role === "admin" ? "admin" : "client";
      const email   = session?.email ?? null;
      const userId  = session?.id ?? null;

      // Save to backend
      await fetch(`${API_BASE}/push/subscribe`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ subscription: sub.toJSON(), role, email, userId }),
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error("[PushNotifications] subscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [swReg]);

  // ── Unsubscribe ───────────────────────────────────────────
  const unsubscribe = useCallback(async () => {
    if (!swReg) return;
    setIsLoading(true);

    try {
      const sub = await swReg.pushManager.getSubscription();
      if (sub) {
        // Remove from backend
        await fetch(`${API_BASE}/push/unsubscribe`, {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("[PushNotifications] unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [swReg]);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe };
}
