// ════════════════════════════════════════
//  JSON file-based data store
// ════════════════════════════════════════
import fs   from "fs";
import path from "path";
import type { Booking, BookingStatus, Client, User } from "./types";

const DATA_DIR = path.join(__dirname, "../../data");

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, "utf8")) as T; }
  catch { return fallback; }
}

function write<T>(file: string, data: T): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf8");
}

// ── Bookings ──────────────────────────────────────────────
export function getBookings(): Booking[] {
  return read<Booking[]>("bookings.json", []);
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

export function createBooking(data: Omit<Booking, "id" | "createdAt" | "status" | "updatedAt">): Booking {
  const all = getBookings();
  const now = new Date().toISOString();
  const booking: Booking = {
    ...data,
    id:        `BK${String(all.length + 1).padStart(3, "0")}`,
    status:    "pending",
    createdAt: now,
    updatedAt: now,
  };
  write("bookings.json", [...all, booking]);
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking | null {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
  write("bookings.json", all);
  return all[idx];
}

export function deleteBooking(id: string): boolean {
  const all      = getBookings();
  const filtered = all.filter((b) => b.id !== id);
  if (filtered.length === all.length) return false;
  write("bookings.json", filtered);
  return true;
}

// ── Clients ───────────────────────────────────────────────
export function getClients(): Client[] {
  return read<Client[]>("clients.json", []);
}

export function getClientById(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function getClientByEmail(email: string): Client | undefined {
  return getClients().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function createClient(data: Pick<Client, "name" | "email" | "phone" | "notes">): Client {
  const all = getClients();
  const now = new Date().toISOString();
  const client: Client = {
    ...data,
    id:          `CL${String(all.length + 1).padStart(3, "0")}`,
    totalVisits: 0,
    totalSpent:  0,
    createdAt:   now,
    updatedAt:   now,
  };
  write("clients.json", [...all, client]);
  return client;
}

export function updateClient(
  id: string,
  data: Partial<Pick<Client, "name" | "phone" | "notes">>
): Client | null {
  const all = getClients();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
  write("clients.json", all);
  return all[idx];
}

export function deleteClient(id: string): boolean {
  const all      = getClients();
  const filtered = all.filter((c) => c.id !== id);
  if (filtered.length === all.length) return false;
  write("clients.json", filtered);
  return true;
}

export function upsertClientFromBooking(
  name: string, email: string, phone: string,
  price: number, date: string
): Client {
  const all = getClients();
  const now = new Date().toISOString();
  const idx = all.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());

  if (idx !== -1) {
    all[idx] = {
      ...all[idx], name, phone,
      totalVisits: all[idx].totalVisits + 1,
      totalSpent:  all[idx].totalSpent  + price,
      lastVisit:   date,
      updatedAt:   now,
    };
    write("clients.json", all);
    return all[idx];
  }

  const client: Client = {
    id: `CL${String(all.length + 1).padStart(3, "0")}`,
    name, email, phone,
    totalVisits: 1, totalSpent: price,
    lastVisit: date, createdAt: now, updatedAt: now,
  };
  write("clients.json", [...all, client]);
  return client;
}

// ── Users / Auth ──────────────────────────────────────────
export function getUsers(): User[] {
  return read<User[]>("users.json", []);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const all = getUsers();
  if (getUserByEmail(data.email)) throw new Error("EMAIL_EXISTS");
  const user: User = {
    ...data,
    id:        `USR${String(all.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  write("users.json", [...all, user]);
  return user;
}
