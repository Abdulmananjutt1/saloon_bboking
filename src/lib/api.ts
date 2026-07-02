// ─────────────────────────────────────────────────────────
//  Centralized API Client — Glamour Studio
//
//  Ek jagah se saari API calls manage hoti hain.
//  Base URL sirf yahan se aata hai — kisi aur file mein
//  process.env.NEXT_PUBLIC_API_URL likhne ki zaroorat nahi.
// ─────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// ── Core fetch wrapper ────────────────────────────────────

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return data as T;
}

// ── HTTP method shortcuts ─────────────────────────────────

export const api = {
  get:    <T>(path: string, options?: ApiOptions)                   => request<T>(path, { ...options, method: "GET" }),
  post:   <T>(path: string, body?: unknown, options?: ApiOptions)   => request<T>(path, { ...options, method: "POST",  body }),
  patch:  <T>(path: string, body?: unknown, options?: ApiOptions)   => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiOptions)                   => request<T>(path, { ...options, method: "DELETE" }),
};

// ── Typed helpers per domain ──────────────────────────────
// Yeh optional hain — directly api.get() bhi use kar sakte ho

export const statsApi = {
  getStats:     () => api.get("/stats"),
  getAnalytics: () => api.get("/stats/analytics"),
};

export const bookingsApi = {
  getAll:       (status?: string, email?: string) => {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (email) params.set("email", email);
    const qs = params.toString();
    return api.get(`/bookings${qs ? `?${qs}` : ""}`);
  },
  getById:      (id: string)            => api.get(`/bookings/${id}`),
  create:       (body: unknown)         => api.post("/bookings", body),
  updateStatus: (id: string, status: string) => api.patch(`/bookings/${id}`, { status }),
  delete:       (id: string)            => api.delete(`/bookings/${id}`),
};

export const clientsApi = {
  getAll:  (search?: string, sortBy?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    const qs = params.toString();
    return api.get(`/clients${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string)        => api.get(`/clients/${id}`),
  create:  (body: unknown)     => api.post("/clients", body),
  update:  (id: string, body: unknown) => api.patch(`/clients/${id}`, body),
  delete:  (id: string)        => api.delete(`/clients/${id}`),
};

export const authApi = {
  login:    (body: unknown) => api.post("/auth/login",    body),
  register: (body: unknown) => api.post("/auth/register", body),
};

export const chatApi = {
  getRooms:    ()              => api.get("/chat/rooms"),
  getMessages: (roomId: string) =>
    api.get(`/chat/messages?roomId=${encodeURIComponent(roomId)}`),
  sendMessage: (body: unknown) => api.post("/chat/messages", body),
};

export const servicesApi = {
  getAll:  ()            => api.get("/services"),
  getById: (id: string)  => api.get(`/services/${id}`),
};

export const stylistsApi = {
  getAll:  ()            => api.get("/stylists"),
  getById: (id: string)  => api.get(`/stylists/${id}`),
};

export const pushApi = {
  getVapidKey:   ()                           => api.get<{ success: boolean; publicKey: string }>("/push/vapid-key"),
  subscribe:     (body: unknown)              => api.post("/push/subscribe", body),
  unsubscribe:   (endpoint: string)           => api.delete("/push/unsubscribe", { body: { endpoint } }),
};
