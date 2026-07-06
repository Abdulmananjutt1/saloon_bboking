"use client";

// ─────────────────────────────────────────────────────────
//  useServices — Glamour Studio
//  Admin hook for full CRUD on the services catalogue.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { servicesApi } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────

export type ServiceCategory =
  | "HAIRCUT" | "BEARD" | "COLOR" | "FACIAL"
  | "MASSAGE" | "NAILS" | "BRIDAL" | "WAXING" | "KERATIN";

export type Gender = "MALE" | "FEMALE" | "UNISEX";

export interface Service {
  id:              string;
  name:            string;
  slug:            string;
  category:        ServiceCategory;
  description:     string;
  duration:        number;   // minutes
  price:           number;   // PKR
  discountedPrice: number | null;
  image:           string;
  popular:         boolean;
  forGender:       Gender;
  isActive:        boolean;
  createdAt:       string;
  updatedAt:       string;
}

export interface ServiceFormData {
  name:            string;
  category:        ServiceCategory;
  description:     string;
  duration:        number;
  price:           number;
  discountedPrice: number | "";
  image:           string;
  popular:         boolean;
  forGender:       Gender;
  isActive:        boolean;
}

export const EMPTY_SERVICE_FORM: ServiceFormData = {
  name:            "",
  category:        "HAIRCUT",
  description:     "",
  duration:        30,
  price:           0,
  discountedPrice: "",
  image:           "",
  popular:         false,
  forGender:       "UNISEX",
  isActive:        true,
};

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "HAIRCUT",  label: "Haircut"    },
  { value: "BEARD",    label: "Beard"      },
  { value: "COLOR",    label: "Hair Color" },
  { value: "FACIAL",   label: "Facial"     },
  { value: "MASSAGE",  label: "Massage"    },
  { value: "NAILS",    label: "Nails"      },
  { value: "BRIDAL",   label: "Bridal"     },
  { value: "WAXING",   label: "Waxing"     },
  { value: "KERATIN",  label: "Keratin"    },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "UNISEX", label: "Unisex" },
  { value: "MALE",   label: "Male"   },
  { value: "FEMALE", label: "Female" },
];

interface ApiResponse<T> {
  success: boolean;
  data:    T;
  error?:  string;
}

type MutationResult = { ok: boolean; error?: string };

// ── Hook ─────────────────────────────────────────────────

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesApi.getAllAdmin() as ApiResponse<Service[]>;
      if (res.success) setServices(res.data);
      else setError(res.error ?? "Failed to load services");
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const createService = async (data: ServiceFormData): Promise<MutationResult> => {
    try {
      const res = await servicesApi.create(data) as ApiResponse<Service>;
      if (res.success) { await fetchServices(); return { ok: true }; }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const updateService = async (id: string, data: ServiceFormData): Promise<MutationResult> => {
    try {
      const res = await servicesApi.update(id, data) as ApiResponse<Service>;
      if (res.success) { await fetchServices(); return { ok: true }; }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const deleteService = async (id: string): Promise<MutationResult> => {
    try {
      const res = await servicesApi.delete(id) as ApiResponse<null>;
      if (res.success) { await fetchServices(); return { ok: true }; }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const toggleActive = async (id: string, isActive: boolean): Promise<MutationResult> => {
    return updateService(id, { ...EMPTY_SERVICE_FORM, isActive } as ServiceFormData);
  };

  return {
    services, loading, error,
    fetchServices,
    createService, updateService, deleteService, toggleActive,
  };
}
