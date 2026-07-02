"use client";

import { useState, useEffect } from "react";
import { bookingsApi } from "@/lib/api";
import { type BookingStatus } from "@/constants";

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
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [allBookings, setAll]   = useState<AdminBooking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async (status = "all") => {
    setLoading(true);
    try {
      const data = await bookingsApi.getAll(status) as any;
      if (data.success) setBookings(data.data);
    } finally {
      setLoading(false);
    }
  };

  // Always keep an unfiltered count for status tabs
  const fetchAll = async () => {
    try {
      const data = await bookingsApi.getAll() as any;
      if (data.success) setAll(data.data);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchBookings(statusFilter); }, [statusFilter]);
  // Refresh all-count whenever filtered list changes
  useEffect(() => { fetchAll(); }, [bookings]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const data = await bookingsApi.updateStatus(id, newStatus) as any;
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
