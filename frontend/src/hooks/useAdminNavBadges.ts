"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { useAdminUnread } from "@/hooks/useAdminUnread";
import { notificationService } from "@/services/notifications";

/** Combined badge counts for admin sidebar + clear badges on screen visit */
export function useAdminNavBadges() {
  const pathname = usePathname();
  const { byScreen, unread: notifUnread } = useNotifications();
  const { totalUnread: chatUnread, unreadMap } = useAdminUnread();

  // Clear badges when visiting a screen — only depends on pathname
  useEffect(() => {
    if (pathname.startsWith("/admin/bookings")) {
      notificationService.markReadByScreen("bookings");
    } else if (pathname.startsWith("/admin/chat")) {
      notificationService.markReadByScreen("chat");
    } else if (pathname.startsWith("/admin/notifications")) {
      notificationService.markAllRead();
    }
  }, [pathname]);

  return {
    chatUnread,
    chatRoomUnread: unreadMap,
    bookingsBadge:  byScreen.bookings,
    chatBadge:      chatUnread,
    notifBadge:     notifUnread,
    getBadge: (href: string): number => {
      if (href.includes("/bookings"))      return byScreen.bookings;
      if (href.includes("/chat"))          return chatUnread;
      if (href.includes("/notifications")) return notifUnread;
      return 0;
    },
  };
}
