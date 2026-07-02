// ─────────────────────────────────────────────────────────
//  WebSocket URL builder — shared utility
//  Converts the REST API base URL to a ws:// / wss:// URL
// ─────────────────────────────────────────────────────────

/**
 * Builds the WebSocket base URL from NEXT_PUBLIC_API_URL.
 *
 * Example:
 *   http://localhost:4000/api  →  ws://localhost:4000/ws
 *   https://api.example.com/api  →  wss://api.example.com/ws
 */
export function buildWsUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "";
  return api
    .replace("http://",  "ws://")
    .replace("https://", "wss://")
    .replace("/api", "") + "/ws";
}
