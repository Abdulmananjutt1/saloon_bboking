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
  put:    <T>(path: string, body?: unknown, options?: ApiOptions)   => request<T>(path, { ...options, method: "PUT",   body }),
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
  createForUser: (body: unknown, token: string) =>
    api.post("/bookings/admin", body, { headers: { Authorization: `Bearer ${token}` } }),
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
  updateProfile: (body: { name: string; phone: string }, token: string) =>
    api.patch("/auth/profile", body, { headers: { Authorization: `Bearer ${token}` } }),
};

export const chatApi = {
  getRooms:    ()              => api.get("/chat/rooms"),
  getMessages: (roomId: string) =>
    api.get(`/chat/messages?roomId=${encodeURIComponent(roomId)}`),
  sendMessage: (body: unknown) => api.post("/chat/messages", body),
};

export const servicesApi = {
  getAll:    ()                           => api.get("/services"),
  getAllAdmin: ()                          => api.get("/services/all"),
  getById:   (id: string)                 => api.get(`/services/${id}`),
  create:    (body: unknown)              => api.post("/services", body),
  update:    (id: string, body: unknown)  => api.patch(`/services/${id}`, body),
  delete:    (id: string)                 => api.delete(`/services/${id}`),
};

export const stylistsApi = {
  getAll:            ()                           => api.get("/stylists"),
  getById:           (id: string)                 => api.get(`/stylists/${id}`),
  create:            (body: unknown)              => api.post("/stylists", body),
  update:            (id: string, body: unknown)  => api.patch(`/stylists/${id}`, body),
  delete:            (id: string)                 => api.delete(`/stylists/${id}`),
  getAvailability:   (id: string)                 => api.get(`/stylists/${id}/availability`),
  saveAvailability:  (id: string, schedule: unknown) =>
    api.put(`/stylists/${id}/availability`, { schedule }),
};

export const pushApi = {
  getVapidKey:   ()                           => api.get<{ success: boolean; publicKey: string }>("/push/vapid-key"),
  subscribe:     (body: unknown)              => api.post("/push/subscribe", body),
  unsubscribe:   (endpoint: string)           => api.delete("/push/unsubscribe", { body: { endpoint } }),
};

export const settingsApi = {
  getAll:  ()                              => api.get("/settings"),
  getKey:  (key: string)                   => api.get(`/settings/${key}`),
  setKey:  (key: string, value: unknown)   => api.put(`/settings/${key}`, { value }),
  patch:   (data: Record<string, unknown>) => api.patch("/settings", data),
};

export const usersApi = {
  getAll: (token: string) =>
    api.get<{ success: boolean; data: { id: string; name: string; email: string; phone: string }[] }>(
      "/auth/users",
      { headers: { Authorization: `Bearer ${token}` } }
    ),
};

export const payrollApi = {
  getInvoices:  (stylistId?: string, status?: string, token?: string) => {
    const p = new URLSearchParams();
    if (stylistId) p.set("stylistId", stylistId);
    if (status && status !== "all") p.set("status", status);
    const qs = p.toString();
    return api.get(`/payroll${qs ? `?${qs}` : ""}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  },
  getStylists:  (token?: string)                             => api.get("/payroll/stylists", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
  getById:      (id: string)                                 => api.get(`/payroll/${id}`),
  generate:     (body: unknown, token: string)               => api.post("/payroll", body, { headers: { Authorization: `Bearer ${token}` } }),
  updateStatus: (id: string, status: string, token: string)  =>
    api.patch(`/payroll/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } }),
  deleteInvoice:(id: string, token: string)                  => api.delete(`/payroll/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  setPayRate:   (stylistId: string, body: unknown, token: string) =>
    api.put(`/payroll/rate/${stylistId}`, body, { headers: { Authorization: `Bearer ${token}` } }),
};
