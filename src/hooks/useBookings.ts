"use client";

import { useState, useEffect } from "react";
import { API_ENDPOINTS, type BookingStatus } from "@/constants";

export interface AdminBooking {
  id: string;
  customerName: string;
  customerEmail: string;
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
}

export function useBookings(statusFilter = "all") {
  const [bookings, setBookings]   = useState<AdminBooking[]>([]);
  const [allBookings, setAll]     = useState<AdminBooking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchBookings = async (status = "all") => {
    setLoading(true);
    try {
      const url  = status === "all"
        ? `${baseUrl}${API_ENDPOINTS.BOOKINGS}`
        : `${baseUrl}${API_ENDPOINTS.BOOKINGS}?status=${status}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } finally {
      setLoading(false);
    }
  };

  // Always keep an unfiltered count for status tabs
  const fetchAll = async () => {
    try {
      const res  = await fetch(`${baseUrl}${API_ENDPOINTS.BOOKINGS}`);
      const data = await res.json();
      if (data.success) setAll(data.data);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchBookings(statusFilter); }, [statusFilter]);
  // Refresh all-count whenever filtered list changes
  useEffect(() => { fetchAll(); }, [bookings]);  // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res  = await fetch(`${baseUrl}${API_ENDPOINTS.BOOKING(id)}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => b.id === id ? { ...b, status: newStatus as BookingStatus } : b)
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  const statusCounts = {
    all:       allBookings.length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    pending:   allBookings.filter((b) => b.status === "pending").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  return { bookings, loading, updating, statusCounts, updateStatus };
}
