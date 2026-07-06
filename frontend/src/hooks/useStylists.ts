"use client";

import { useState, useEffect, useCallback } from "react";
import { stylistsApi } from "@/lib/api";

export interface Stylist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  specialties: { id: string; name: string }[];
  slots: { id: string; time: string }[];
  availability: {
    id: string;
    dayOfWeek: number;
    isWorking: boolean;
    startTime: string;
    endTime: string;
  }[];
}

export interface StylistFormData {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experience: number;
  available: boolean;
  specialties: string[];
}

export const EMPTY_STYLIST_FORM: StylistFormData = {
  name: "",
  role: "",
  avatar: "",
  bio: "",
  experience: 1,
  available: true,
  specialties: [],
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export function useStylists() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await stylistsApi.getAll() as ApiResponse<Stylist[]>;
      if (res.success) setStylists(res.data);
      else setError(res.error ?? "Failed to load stylists");
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStylists(); }, [fetchStylists]);

  const createStylist = async (data: StylistFormData): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await stylistsApi.create(data) as ApiResponse<Stylist>;
      if (res.success) { await fetchStylists(); return { ok: true }; }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const updateStylist = async (id: string, data: StylistFormData): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await stylistsApi.update(id, data) as ApiResponse<Stylist>;
      if (res.success) { await fetchStylists(); return { ok: true }; }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const deleteStylist = async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await stylistsApi.delete(id) as ApiResponse<null>;
      if (res.success) { await fetchStylists(); return { ok: true }; }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  return {
    stylists, loading, error,
    fetchStylists, createStylist, updateStylist, deleteStylist,
  };
}
