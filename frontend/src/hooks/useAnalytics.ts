"use client";

import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";

export interface AnalyticsData {
  kpi: {
    totalRevenue: number;
    totalBookings: number;
    totalClients: number;
    avgRating: number;
  };
  monthlyData: { month: string; revenue: number; bookings: number }[];
  statusBreakdown: {
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
    total: number;
  };
  topServices: { name: string; bookings: number; revenue: number }[];
}

export function useAnalytics() {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const json = await statsApi.getAnalytics() as any;
        if (json.success) setData(json.data);
        else setError("Failed to load analytics data.");
      } catch {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
