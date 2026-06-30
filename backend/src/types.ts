// ════════════════════════════════════════
//  Shared Types
// ════════════════════════════════════════

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type ServiceCategory =
  | "haircut" | "beard" | "color" | "facial"
  | "massage" | "nails" | "bridal" | "waxing" | "keratin";

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "admin" | "client";
  createdAt: string;
}

export type ValidationError = Record<string, string>;
