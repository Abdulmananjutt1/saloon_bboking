export function getApiBaseUrl(): string {
  // In unified mode, API is always on the same origin at /api
  return "/api";
}

export function getWsBaseUrl(): string {
  // WebSocket connects to the same host — works in both dev and production
  if (typeof window === "undefined") return "ws://localhost:3000/ws";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws`;
}

// Used by api.ts and other frontend files
export const API_BASE_URL = getApiBaseUrl();
