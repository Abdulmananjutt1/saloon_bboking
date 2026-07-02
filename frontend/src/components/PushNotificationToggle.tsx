"use client";

// ─────────────────────────────────────────────────────────
//  PushNotificationToggle — Glamour Studio
//  Bell button to enable/disable push notifications.
//  Used in dashboard and admin layout.
// ─────────────────────────────────────────────────────────

import { usePushNotifications } from "@/hooks/usePushNotifications";

interface Props {
  className?: string;
}

export function PushNotificationToggle({ className = "" }: Props) {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushNotifications();

  // Don't render if browser doesn't support push
  if (permission === "unsupported") return null;

  // User already denied — show info only
  if (permission === "denied") {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-gray-400 ${className}`}
        title="Push notifications blocked. Enable in browser settings."
      >
        <span>🔕</span>
        <span className="hidden sm:inline">Notifications blocked</span>
      </div>
    );
  }

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${isSubscribed
          ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400 border border-green-500/30 hover:border-red-500/30"
          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
        }
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={isSubscribed ? "Click to disable push notifications" : "Click to enable push notifications"}
    >
      {isLoading ? (
        <>
          <span className="animate-spin text-base">⏳</span>
          <span className="hidden sm:inline">Loading…</span>
        </>
      ) : isSubscribed ? (
        <>
          <span>🔔</span>
          <span className="hidden sm:inline">Notifications On</span>
        </>
      ) : (
        <>
          <span>🔕</span>
          <span className="hidden sm:inline">Enable Notifications</span>
        </>
      )}
    </button>
  );
}
