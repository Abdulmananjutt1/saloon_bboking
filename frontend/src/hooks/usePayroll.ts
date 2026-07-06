"use client";

import { useState, useEffect, useCallback } from "react";
import { payrollApi } from "@/lib/api";
import { getToken } from "@/lib/session";

export type PaymentStatus = "pending" | "paid" | "overdue";

export interface PayRate {
  id:            string;
  stylistId:     string;
  rateType:      "FLAT" | "COMMISSION";
  flatAmount:    number | null;
  commissionPct: number | null;
  baseSalary:    number | null;
}

export interface StylistPayrollSummary {
  id:               string;
  name:             string;
  role:             string;
  avatar:           string;
  completedBookings:number;
  totalRevenue:     number;
  earnedAmount:     number;
  payRate:          PayRate | null;
}

export interface InvoiceItem {
  id:          string;
  bookingId:   string | null;
  description: string;
  amount:      number;
  date:        string;
}

export interface Invoice {
  id:          string;
  stylistId:   string;
  periodStart: string;
  periodEnd:   string;
  totalAmount: number;
  status:      PaymentStatus;
  notes:       string | null;
  paidAt:      string | null;
  createdAt:   string;
  stylist:     { id: string; name: string; role: string; avatar: string };
  items:       InvoiceItem[];
}

interface ApiResponse<T> { success: boolean; data: T; error?: string; errors?: Record<string, string> }

export function usePayroll() {
  const [stylists,        setStylists]        = useState<StylistPayrollSummary[]>([]);
  const [invoices,        setInvoices]        = useState<Invoice[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [activeTab,       setActiveTab]       = useState<"overview" | "invoices">("overview");
  const [filterStylist,   setFilterStylist]   = useState("all");
  const [filterStatus,    setFilterStatus]    = useState("all");

  // Generate invoice modal state
  const [genModal,        setGenModal]        = useState(false);
  const [genForm,         setGenForm]         = useState({
    stylistId: "", periodStart: "", periodEnd: "", notes: "",
  });
  const [genErrors,       setGenErrors]       = useState<Record<string, string>>({});
  const [generating,      setGenerating]      = useState(false);

  // Pay rate modal
  const [rateModal,       setRateModal]       = useState(false);
  const [rateStylist,     setRateStylist]     = useState<StylistPayrollSummary | null>(null);
  const [rateForm,        setRateForm]        = useState({ rateType: "COMMISSION" as "FLAT" | "COMMISSION", flatAmount: "", commissionPct: "", baseSalary: "" });
  const [rateErrors,      setRateErrors]      = useState<Record<string, string>>({});
  const [rateSaving,      setRateSaving]      = useState(false);

  // Invoice detail modal
  const [detailInvoice,   setDetailInvoice]   = useState<Invoice | null>(null);
  const [updatingId,      setUpdatingId]      = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    try {
      const [styRes, invRes] = await Promise.all([
        payrollApi.getStylists(token ?? "") as Promise<ApiResponse<StylistPayrollSummary[]>>,
        payrollApi.getInvoices(undefined, undefined, token ?? "") as Promise<ApiResponse<Invoice[]>>,
      ]);
      if (styRes.success) setStylists(styRes.data);
      if (invRes.success) setInvoices(invRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (filterStylist !== "all" && inv.stylistId !== filterStylist) return false;
    if (filterStatus  !== "all" && inv.status    !== filterStatus)  return false;
    return true;
  });

  // Generate invoice
  const openGenModal = (stylistId = "") => {
    setGenForm({ stylistId, periodStart: "", periodEnd: "", notes: "" });
    setGenErrors({});
    setGenModal(true);
  };

  const generateInvoice = async (): Promise<{ ok: boolean; error?: string }> => {
    const errors: Record<string, string> = {};
    if (!genForm.stylistId)   errors.stylistId   = "Select a stylist";
    if (!genForm.periodStart) errors.periodStart = "Select start date";
    if (!genForm.periodEnd)   errors.periodEnd   = "Select end date";
    if (genForm.periodStart && genForm.periodEnd && genForm.periodStart > genForm.periodEnd)
      errors.periodEnd = "End date must be after start date";
    setGenErrors(errors);
    if (Object.keys(errors).length) return { ok: false, error: "Validation failed" };

    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };
    setGenerating(true);
    try {
      const res = await payrollApi.generate(genForm, token) as ApiResponse<Invoice>;
      if (res.success) {
        setInvoices((prev) => [res.data, ...prev]);
        setGenModal(false);
        setActiveTab("invoices");
        return { ok: true };
      } else {
        if (res.errors) setGenErrors(res.errors);
        else setGenErrors({ general: res.error ?? "Failed to generate invoice" });
        return { ok: false, error: res.error ?? "Failed to generate invoice" };
      }
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setGenerating(false);
    }
  };

  // Pay rate
  const openRateModal = (stylist: StylistPayrollSummary) => {
    setRateStylist(stylist);
    setRateErrors({});
    setRateForm({
      rateType:      stylist.payRate?.rateType ?? "COMMISSION",
      flatAmount:    stylist.payRate?.flatAmount?.toString() ?? "",
      commissionPct: stylist.payRate?.commissionPct?.toString() ?? "",
      baseSalary:    stylist.payRate?.baseSalary?.toString() ?? "",
    });
    setRateModal(true);
  };

  const savePayRate = async (): Promise<{ ok: boolean; error?: string }> => {
    if (!rateStylist) return { ok: false, error: "No stylist selected" };
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };

    // Frontend validation
    const errs: Record<string, string> = {};
    if (rateForm.rateType === "COMMISSION") {
      const pct = parseFloat(rateForm.commissionPct);
      if (!rateForm.commissionPct) errs.commissionPct = "Commission percentage is required";
      else if (isNaN(pct) || pct < 0 || pct > 100) errs.commissionPct = "Must be between 0 and 100";
    }
    if (rateForm.rateType === "FLAT") {
      const amt = parseFloat(rateForm.flatAmount);
      if (!rateForm.flatAmount) errs.flatAmount = "Flat amount is required";
      else if (isNaN(amt) || amt < 0) errs.flatAmount = "Must be 0 or more";
    }
    if (rateForm.baseSalary) {
      const sal = parseFloat(rateForm.baseSalary);
      if (isNaN(sal) || sal < 0) errs.baseSalary = "Base salary must be 0 or more";
    }
    setRateErrors(errs);
    if (Object.keys(errs).length) return { ok: false, error: "Validation failed" };

    setRateSaving(true);
    try {
      const body = {
        rateType:      rateForm.rateType,
        flatAmount:    rateForm.rateType === "FLAT"       ? parseFloat(rateForm.flatAmount)    : undefined,
        commissionPct: rateForm.rateType === "COMMISSION" ? parseFloat(rateForm.commissionPct) : undefined,
        baseSalary:    rateForm.baseSalary ? parseFloat(rateForm.baseSalary) : undefined,
      };
      const res = await payrollApi.setPayRate(rateStylist.id, body, token) as ApiResponse<PayRate>;
      if (res.success) {
        setStylists((prev) => prev.map((s) =>
          s.id === rateStylist.id ? { ...s, payRate: res.data } : s
        ));
        setRateModal(false);
        return { ok: true };
      }
      if (res.errors) setRateErrors(res.errors);
      return { ok: false, error: res.error ?? "Failed to save pay rate" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setRateSaving(false);
    }
  };

  // Update invoice status
  const updateInvoiceStatus = async (id: string, status: string): Promise<{ ok: boolean; error?: string }> => {
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };
    setUpdatingId(id);
    try {
      const res = await payrollApi.updateStatus(id, status, token) as ApiResponse<Invoice>;
      if (res.success) {
        setInvoices((prev) => prev.map((inv) => inv.id === id ? res.data : inv));
        if (detailInvoice?.id === id) setDetailInvoice(res.data);
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Failed to update invoice status" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete invoice
  const deleteInvoice = async (id: string): Promise<{ ok: boolean; error?: string }> => {
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };
    try {
      const res = await payrollApi.deleteInvoice(id, token) as { success: boolean; error?: string };
      if (res.success) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        if (detailInvoice?.id === id) setDetailInvoice(null);
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Failed to delete invoice" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    }
  };

  // Totals
  const totalPaid    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.totalAmount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.totalAmount, 0);

  return {
    stylists, invoices: filteredInvoices, allInvoices: invoices, loading,
    activeTab, setActiveTab,
    filterStylist, setFilterStylist,
    filterStatus,  setFilterStatus,
    totalPaid, totalPending, totalOverdue,
    // generate modal
    genModal, openGenModal, closeGenModal: () => setGenModal(false),
    genForm, setGenForm, genErrors, generating, generateInvoice,
    // rate modal
    rateModal, openRateModal, closeRateModal: () => setRateModal(false),
    rateStylist, rateForm, setRateForm, rateErrors, setRateErrors, rateSaving, savePayRate,
    // detail
    detailInvoice, setDetailInvoice,
    updatingId, updateInvoiceStatus, deleteInvoice,
    refresh: fetchAll,
  };
}
