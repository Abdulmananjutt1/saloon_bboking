// ─────────────────────────────────────────────────────────
//  Glamour Studio — Service Worker
//  Handles background push notifications
// ─────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ── Push event — show notification ───────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Glamour Studio", body: event.data.text() };
  }

  const { title, body, icon, badge, tag, url, data } = payload;

  const options = {
    body:    body    ?? "",
    icon:    icon    ?? "/next.svg",
    badge:   badge   ?? "/next.svg",
    tag:     tag     ?? "gs-notification",
    data:    { url: url ?? "/", ...data },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title ?? "Glamour Studio", options)
  );
});

// ── Notification click — open URL ────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // If app is already open, focus it and navigate
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
