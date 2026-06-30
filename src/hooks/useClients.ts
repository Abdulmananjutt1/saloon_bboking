"use client";

import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/constants";
import { validateClientForm, hasErrors, type ValidationError } from "@/lib/validations";

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
}

const EMPTY_FORM = { name: "", email: "", phone: "", notes: "" };

export function useClients() {
  const [clients, setClients]   = useState<Client[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [errors, setErrors]       = useState<ValidationError>({});
  const [apiError, setApiError]   = useState("");
  const [form, setFormState]      = useState(EMPTY_FORM);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchClients = async (q = "") => {
    setLoading(true);
    try {
      const url  = `${baseUrl}${API_ENDPOINTS.CLIENTS}${q ? `?search=${encodeURIComponent(q)}` : ""}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.success) setClients(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchClients(search), 300);
    return () => clearTimeout(t);
  }, [search]);  // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key: keyof typeof form, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (apiError)    setApiError("");
  };

  const openModal  = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSaved(false);
    setErrors({});
    setApiError("");
    setFormState(EMPTY_FORM);
  };

  const createClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const ve = validateClientForm(form);
    if (hasErrors(ve)) { setErrors(ve); return; }
    setErrors({});
    setSaving(true);
    try {
      const res  = await fetch(`${baseUrl}${API_ENDPOINTS.CLIENTS}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setApiError(data.error ?? "Failed to create client.");
        return;
      }
      setSaved(true);
      await fetchClients(search);
      setTimeout(closeModal, 1200);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return {
    // Data
    clients, loading, search, setSearch,
    // Modal
    showModal, openModal, closeModal,
    // Form
    form, setField, errors, apiError, saving, saved,
    createClient,
  };
}
