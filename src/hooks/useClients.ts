"use client";

import { useState, useEffect } from "react";
import { clientsApi } from "@/lib/api";
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
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [errors, setErrors]       = useState<ValidationError>({});
  const [apiError, setApiError]   = useState("");
  const [form, setFormState]      = useState(EMPTY_FORM);

  const fetchClients = async (q = "") => {
    setLoading(true);
    try {
      const data = await clientsApi.getAll(q || undefined) as any;
      if (data.success) setClients(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchClients(search), 300);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const data = await clientsApi.create(form) as any;
      if (data.errors) {
        setErrors(data.errors);
        return;
      }
      if (data.error) {
        setApiError(data.error);
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
    clients, loading, search, setSearch,
    showModal, openModal, closeModal,
    form, setField, errors, apiError, saving, saved,
    createClient,
  };
}
