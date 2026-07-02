"use client";

import { useState, useCallback, useEffect } from "react";
import { statsApi } from "@/lib/api";

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
      const data = await statsApi.getStats() as { success: boolean; data: AdminStatsData };
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
