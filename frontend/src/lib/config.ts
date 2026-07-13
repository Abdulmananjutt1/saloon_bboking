const DEFAULT_API_BASE_URL = "http://localhost:4000/api";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const raw = trimTrailingSlashes(process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_BASE_URL);
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}

export function getWsBaseUrl(): string {
  const apiUrl = new URL(getApiBaseUrl());
  apiUrl.pathname = apiUrl.pathname.replace(/\/api$/, "/ws");
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  apiUrl.search = "";
  apiUrl.hash = "";
  return trimTrailingSlashes(apiUrl.toString());
}

export const API_BASE_URL = getApiBaseUrl();
