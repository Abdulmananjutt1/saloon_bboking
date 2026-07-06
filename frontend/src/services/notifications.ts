// ─────────────────────────────────────────────────────────
//  Notifications Service — Glamour Studio
//
//  Single source of truth for all in-app notifications.
//  Replaces scattered notification logic across files.
//
//  Usage:
//    import { notificationService } from "@/services/notifications";
//    notificationService.add({ title: "New Booking", body: "..." });
//    notificationService.subscribe(listener);
// ─────────────────────────────────────────────────────────

export type NotificationType = "booking" | "chat" | "system" | "status";

export interface AppNotification {
  id:        string;
  title:     string;
  body:      string;
  type:      NotificationType;
  timestamp: number;
  read:      boolean;
  url?:      string;
  meta?:     Record<string, unknown>;
}

type Listener = (notifications: AppNotification[]) => void;

class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<Listener> = new Set();
  private storageKey = "gs_notifications";

  constructor() {
    // Load persisted notifications from localStorage (client-side only)
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.notifications = JSON.parse(stored);
        }
      } catch {
        this.notifications = [];
      }
    }
  }

  // ── Add a new notification ────────────────────────────
  add(payload: Omit<AppNotification, "id" | "timestamp" | "read">): AppNotification {
    const notif: AppNotification = {
      ...payload,
      id:        `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      read:      false,
    };
    // Keep latest 50 notifications
    this.notifications = [notif, ...this.notifications].slice(0, 50);
    this.persist();
    this.emit();
    return notif;
  }

  // ── Mark all as read ─────────────────────────────────
  markAllRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.persist();
    this.emit();
  }

  // ── Mark a single notification as read ───────────────
  markRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.persist();
    this.emit();
  }

  // ── Clear all notifications ───────────────────────────
  clearAll(): void {
    this.notifications = [];
    this.persist();
    this.emit();
  }

  // ── Get current notifications ─────────────────────────
  getAll(): AppNotification[] {
    return [...this.notifications];
  }

  // ── Get unread count ──────────────────────────────────
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  // ── Subscribe to updates ──────────────────────────────
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state
    listener(this.getAll());
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  // ── Private: persist to localStorage ─────────────────
  private persist(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    } catch { /* storage may be full */ }
  }

  // ── Private: emit to all listeners ───────────────────
  private emit(): void {
    const current = this.getAll();
    this.listeners.forEach((listener) => listener(current));
  }
}

// Singleton export — one instance for the whole app
export const notificationService = new NotificationService();
