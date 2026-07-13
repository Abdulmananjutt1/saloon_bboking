// ─────────────────────────────────────────────────────────
//  Notifications Service — Glamour Studio
// ─────────────────────────────────────────────────────────

export type NotificationType = "booking" | "chat" | "system" | "status";

/** Which nav screen this notification belongs to */
export type NotificationScreen =
  | "bookings"
  | "chat"
  | "notifications"
  | "appointments"
  | "system";

export interface AppNotification {
  id:        string;
  title:     string;
  body:      string;
  type:      NotificationType;
  screen:    NotificationScreen;
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
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as AppNotification[];
          this.notifications = parsed.map((n) => ({
            ...n,
            screen: n.screen ?? this.inferScreen(n),
          }));
        }
      } catch {
        this.notifications = [];
      }
    }
  }

  private inferScreen(n: Pick<AppNotification, "type" | "url">): NotificationScreen {
    if (n.type === "chat" || n.url?.includes("/chat")) return "chat";
    if (n.type === "booking" || n.url?.includes("/bookings")) return "bookings";
    if (n.url?.includes("appointments") || n.type === "status") return "appointments";
    return "notifications";
  }

  add(payload: Omit<AppNotification, "id" | "timestamp" | "read">): AppNotification {
    const notif: AppNotification = {
      ...payload,
      screen: payload.screen ?? this.inferScreen(payload),
      id:        `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      read:      false,
    };
    this.notifications = [notif, ...this.notifications].slice(0, 50);
    this.persist();
    this.emit();
    return notif;
  }

  markAllRead(): void {
    if (this.notifications.every((n) => n.read)) return;
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.persist();
    this.emit();
  }

  markRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.persist();
    this.emit();
  }

  markReadWhere(predicate: (notification: AppNotification) => boolean): void {
    const hasUnread = this.notifications.some((n) => !n.read && predicate(n));
    if (!hasUnread) return;
    this.notifications = this.notifications.map((n) =>
      predicate(n) ? { ...n, read: true } : n
    );
    this.persist();
    this.emit();
  }

  markReadByScreen(screen: NotificationScreen): void {
    const hasUnread = this.notifications.some((n) => !n.read && n.screen === screen);
    if (!hasUnread) return;
    this.notifications = this.notifications.map((n) =>
      n.screen === screen ? { ...n, read: true } : n
    );
    this.persist();
    this.emit();
  }

  clearAll(): void {
    this.notifications = [];
    this.persist();
    this.emit();
  }

  clearWhere(predicate: (notification: AppNotification) => boolean): void {
    const next = this.notifications.filter((n) => !predicate(n));
    if (next.length === this.notifications.length) return;
    this.notifications = next;
    this.persist();
    this.emit();
  }

  getAll(): AppNotification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  getUnreadByScreen(screen: NotificationScreen): number {
    return this.notifications.filter((n) => !n.read && n.screen === screen).length;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getAll());
    return () => this.listeners.delete(listener);
  }

  private persist(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    } catch { /* storage full */ }
  }

  private emit(): void {
    const current = this.getAll();
    this.listeners.forEach((listener) => listener(current));
  }
}

export const notificationService = new NotificationService();
