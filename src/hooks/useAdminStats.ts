"use client";

import { useState, useCallback, useEffect } from "react";
import { API_ENDPOINTS } from "@/constants";

export interface AdminStatsData {
  totalRevenue: number;
  totalBookings: number;
  totalClients: number;
  revenueGrowth: number;
  bookingsGrowth: number;
  clientGrowth: number;
  recentBookings: {
    id: string;
    confirmationNumber: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    date: string;
    price: number;
    status: string;
  }[];
  stylists: {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
    bookingCount: number;
  }[];
}

export function useAdminStats() {
  const [stats, setStats]       = useState<AdminStatsData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.STATS}`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {
      // silently fail — stale data stays
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, refreshing, refresh: () => fetchStats(true) };
}
