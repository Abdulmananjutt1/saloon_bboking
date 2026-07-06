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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors?: ValidationError;
  error?: string;
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

  const fetchClients = async (q = "", showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await clientsApi.getAll(q || undefined) as ApiResponse<Client[]>;
      if (data.success) setClients(data.data);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => { fetchClients(); }, []);  

  // Debounced search — skip spinner so there's no blink on every keystroke
  useEffect(() => {
    if (search === "") return; // initial empty-string change is handled by the mount effect above
    const t = setTimeout(() => fetchClients(search, false), 300);
    return () => clearTimeout(t);
  }, [search]);  

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
      const data = await clientsApi.create(form) as ApiResponse<Client>;
      if (data.errors) {
        setErrors(data.errors);
        return;
      }
      if (data.error) {
        setApiError(data.error);
        return;
      }
      setSaved(true);
      await fetchClients(search, false);
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
