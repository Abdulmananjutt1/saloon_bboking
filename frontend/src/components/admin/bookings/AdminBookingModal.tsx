"use client";

import { useState, useEffect, useMemo } from "react";
import { X, User, Scissors, Calendar, CheckCircle, ChevronRight, ChevronLeft, Clock, Search, Star, Award, Package, Plus, AlertCircle, Sparkles } from "lucide-react";
import { TIME_SLOTS } from "@/constants";
import { formatPrice, formatDuration, getTodayDate } from "@/lib/utils";
import { servicesApi, stylistsApi, bookingsApi, usersApi } from "@/lib/api";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import Image from "next/image";

// -- Types ---------------------------------------------------------------------
type ApiUser    = { id: string; name: string; email: string; phone: string };
type ApiService = { id: string; name: string; slug: string; category: string; description: string; duration: number; price: number; discountedPrice?: number | null; image: string; popular: boolean; forGender: string; isActive: boolean };
type ApiStylist = { id: string; name: string; role: string; avatar: string; bio: string; experience: number; rating: number; reviewCount: number; available: boolean; isActive: boolean; specialties: { id: string; name: string }[]; slots?: { id: string; stylistId: string; time: string }[] };
type CustomItem = { id: string; name: string; price: string; duration: string };
type Step = 1 | 2 | 3 | 4;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AdminBookingModal({ open, onClose, onCreated }: Props) {
  const { toasts, toast, remove } = useToast();

  // Data
  const [users,    setUsers]    = useState<ApiUser[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [stylists, setStylists] = useState<ApiStylist[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Form state
  const [step,            setStep]           = useState<Step>(1);
  const [selectedUser,    setSelectedUser]   = useState("");
  const [userSearch,      setUserSearch]     = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedStylist, setSelectedStylist] = useState("");
  const [selectedDate,    setSelectedDate]   = useState(getTodayDate());
  const [selectedTime,    setSelectedTime]   = useState("");
  const [notes,           setNotes]          = useState("");
  const [errors,          setErrors]         = useState<Record<string, string>>({});
  const [loading,         setLoading]        = useState(false);
  const [serviceSearch,   setServiceSearch]  = useState("");

  // Custom package state
  const [isCustomPackage,  setIsCustomPackage]  = useState(false);
  const [customServices,   setCustomServices]   = useState<string[]>([]);
  const [customItems,      setCustomItems]      = useState<CustomItem[]>([]);
  const [customItemDraft,  setCustomItemDraft]  = useState({ name: "", price: "", duration: "" });
  const [customItemErrors, setCustomItemErrors] = useState({ name: "", price: "", duration: "" });
  const [showAddItem,      setShowAddItem]      = useState(false);

  // Load data when modal opens
  useEffect(() => {
    if (!open) return;
    resetForm();
    setDataLoading(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const token  = stored ?? "";
    Promise.all([
      usersApi.getAll(token),
      servicesApi.getAll() as Promise<{ success: boolean; data: ApiService[] }>,
      stylistsApi.getAll() as Promise<{ success: boolean; data: ApiStylist[] }>,
    ]).then(([usrRes, svcRes, styRes]) => {
      if (usrRes.success)  setUsers(usrRes.data);
      if (svcRes.success)  setServices(svcRes.data);
      if (styRes.success)  setStylists(styRes.data);
    }).catch(() => {
      toast("error", "Load Failed", "Could not fetch data. Please try again.");
    }).finally(() => setDataLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function resetForm() {
    setStep(1); setSelectedUser(""); setUserSearch(""); setSelectedService("");
    setSelectedStylist(""); setSelectedDate(getTodayDate()); setSelectedTime("");
    setNotes(""); setErrors({}); setServiceSearch(""); setIsCustomPackage(false);
    setCustomServices([]); setCustomItems([]); setCustomItemDraft({ name: "", price: "", duration: "" });
    setCustomItemErrors({ name: "", price: "", duration: "" }); setShowAddItem(false);
  }

  // Derived
  const service  = services.find((s) => s.id === selectedService);
  const stylist  = stylists.find((s) => s.id === selectedStylist);
  const userObj  = users.find((u) => u.id === selectedUser);

  const customServiceObjects = services.filter((s) => customServices.includes(s.id));
  const customItemsTotal     = customItems.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
  const customItemsDuration  = customItems.reduce((sum, i) => sum + (parseInt(i.duration)  || 0), 0);
  const customPackageTotal   = customServiceObjects.reduce((sum, s) => sum + (s.discountedPrice ?? s.price), 0) + customItemsTotal;
  const customPackageDuration = customServiceObjects.reduce((sum, s) => sum + s.duration, 0) + customItemsDuration;
  const totalCustomCount     = customServices.length + customItems.length;

  const filteredServices = useMemo(() => {
    const q = serviceSearch.toLowerCase().trim();
    if (!q) return services;
    return services.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }, [services, serviceSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const toggleCustomService = (id: string) =>
    setCustomServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleAddCustomItem = () => {
    const errs = { name: "", price: "", duration: "" };
    if (!customItemDraft.name.trim())                                    errs.name     = "Service name required";
    const p = parseFloat(customItemDraft.price);
    if (!customItemDraft.price || isNaN(p) || p <= 0)                   errs.price    = "Enter a valid price";
    const d = parseInt(customItemDraft.duration);
    if (!customItemDraft.duration || isNaN(d) || d <= 0)                errs.duration = "Enter duration in minutes";
    setCustomItemErrors(errs);
    if (errs.name || errs.price || errs.duration) return;
    setCustomItems((prev) => [...prev, { id: `ci-${Date.now()}`, ...customItemDraft }]);
    setCustomItemDraft({ name: "", price: "", duration: "" });
    setShowAddItem(false);
  };

  const handleSubmit = async () => {
    const token = (typeof window !== "undefined" ? localStorage.getItem("token") : null) ?? "";
    if (!token) { toast("error", "Not Authenticated", "Please log in as admin."); return; }
    if (!selectedUser) { setErrors({ userId: "Please select a user" }); return; }

    setLoading(true);
    setErrors({});
    try {
      const payload = isCustomPackage
        ? { userId: selectedUser, serviceId: null, customServices, customItems, customPackageTotal, customPackageDuration, stylistId: selectedStylist, date: selectedDate, time: selectedTime, notes }
        : { userId: selectedUser, serviceId: selectedService, stylistId: selectedStylist, date: selectedDate, time: selectedTime, notes };

      const data = await bookingsApi.createForUser(payload, token) as { success: boolean; data: unknown; errors?: Record<string, string>; error?: string };

      if (!data.success) {
        if (data.errors) {
          setErrors(data.errors);
          if (data.errors.time) { setStep(3); toast("error", "Time Slot Unavailable", data.errors.time); }
          else toast("error", "Booking Failed", Object.values(data.errors)[0]);
        } else {
          toast("error", "Booking Failed", data.error ?? "Something went wrong.");
        }
        return;
      }

      toast("success", "Booking Created!", `Appointment booked for ${userObj?.name}.`);
      setTimeout(() => { onClose(); onCreated(); }, 1200);
    } catch {
      toast("error", "Network Error", "Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // -- Overlay style ---------------------------------------------------------
  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  };
  const modal: React.CSSProperties = {
    background: "var(--bg-card)", border: "1px solid var(--border-light)",
    borderRadius: 24, width: "100%", maxWidth: 760,
    maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(201,151,59,0.35) transparent",
  };

  // ── STEP helpers ──────────────────────────────────────────────────────────
  const steps = [
    { n: 1, label: "Client"   },
    { n: 2, label: "Service"  },
    { n: 3, label: "Stylist"  },
    { n: 4, label: "Schedule" },
  ];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .admin-booking-modal::-webkit-scrollbar { width: 5px; }
        .admin-booking-modal::-webkit-scrollbar-track { background: transparent; }
        .admin-booking-modal::-webkit-scrollbar-thumb { background: rgba(201,151,59,0.35); border-radius: 99px; }
        .admin-booking-modal::-webkit-scrollbar-thumb:hover { background: rgba(201,151,59,0.6); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <div style={modal} className="admin-booking-modal">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px 18px", borderBottom: "1px solid var(--border-light)" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>Create Booking</h2>
            <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>Book an appointment on behalf of a client</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 0, padding: "18px 28px 0", borderBottom: "1px solid var(--border-light)" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "8px 8px 0 0", background: step === s.n ? "rgba(201,151,59,0.08)" : "transparent", borderBottom: step === s.n ? "2px solid var(--gold)" : "2px solid transparent" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step > s.n ? "rgba(52,211,153,0.15)" : step === s.n ? "var(--grad-gold-btn)" : "var(--bg-secondary)", border: step > s.n ? "1px solid rgba(52,211,153,0.3)" : step === s.n ? "none" : "1px solid var(--border-light)", fontSize: "0.65rem", fontWeight: 800, color: step > s.n ? "#34d399" : step === s.n ? "#0d0c0a" : "var(--text-muted)" }}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: step === s.n ? "var(--gold)" : step > s.n ? "#34d399" : "var(--text-muted)" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: "var(--border-light)" }} />}
            </div>
          ))}
        </div>

        <div style={{ padding: "24px 28px" }}>
          {dataLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(201,151,59,0.15)", borderTopColor: "var(--gold)", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
            </div>
          ) : (
            <>
              {/* ── Step 1: Select Client ── */}
              {step === 1 && (
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 14 }}>Select Client</p>
                  {errors.userId && <p style={{ fontSize: "0.78rem", color: "#f87171", marginBottom: 12 }}>{errors.userId}</p>}
                  <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
                    {filteredUsers.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "24px 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>No users found.</p>
                    ) : filteredUsers.map((u) => {
                      const sel = selectedUser === u.id;
                      return (
                        <button key={u.id} onClick={() => setSelectedUser(u.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${sel ? "rgba(201,151,59,0.5)" : "var(--border-light)"}`, background: sel ? "rgba(201,151,59,0.06)" : "var(--bg-secondary)", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: sel ? "var(--grad-gold-btn)" : "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 800, color: sel ? "#0d0c0a" : "var(--text-muted)", flexShrink: 0 }}>{u.name.charAt(0)}</div>
                          <div>
                            <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>{u.name}</p>
                            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 }}>{u.email} · {u.phone}</p>
                          </div>
                          {sel && <CheckCircle style={{ width: 16, height: 16, color: "var(--gold)", marginLeft: "auto", flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Step 2: Select Service ── */}
              {step === 2 && (
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <button type="button" onClick={() => { setIsCustomPackage(false); setCustomServices([]); setCustomItems([]); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: !isCustomPackage ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)", background: !isCustomPackage ? "rgba(201,151,59,0.1)" : "var(--bg-secondary)", color: !isCustomPackage ? "var(--gold)" : "var(--text-muted)" }}>
                      <Scissors style={{ width: 12, height: 12, transform: "rotate(45deg)" }} /> Single Service
                    </button>
                    <button type="button" onClick={() => { setIsCustomPackage(true); setSelectedService(""); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: isCustomPackage ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)", background: isCustomPackage ? "rgba(201,151,59,0.1)" : "var(--bg-secondary)", color: isCustomPackage ? "var(--gold)" : "var(--text-muted)" }}>
                      <Package style={{ width: 12, height: 12 }} /> Custom Package
                    </button>
                  </div>
                  <input type="text" placeholder="Search services…" value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />
                  {isCustomPackage && totalCustomCount > 0 && (
                    <div style={{ background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--gold)" }}>{totalCustomCount} item{totalCustomCount > 1 ? "s" : ""} selected · {formatDuration(customPackageDuration)}</span>
                      <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(customPackageTotal)}</span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 10, maxHeight: 300, overflowY: "auto" }}>
                    {filteredServices.map((s) => {
                      const selSingle = !isCustomPackage && selectedService === s.id;
                      const selCustom = isCustomPackage && customServices.includes(s.id);
                      const isSel = selSingle || selCustom;
                      return (
                        <button key={s.id} onClick={() => isCustomPackage ? toggleCustomService(s.id) : setSelectedService(s.id)} style={{ textAlign: "left", padding: "12px 14px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${isSel ? "rgba(201,151,59,0.6)" : "var(--border-light)"}`, background: isSel ? "rgba(201,151,59,0.07)" : "var(--bg-secondary)", transition: "all 0.2s" }}>
                          <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{s.name}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock style={{ width: 10, height: 10, color: "var(--gold)" }} /><span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{formatDuration(s.duration)}</span></div>
                            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(s.discountedPrice ?? s.price)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Custom items for package */}
                  {isCustomPackage && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Custom Items</p>
                        <button type="button" onClick={() => setShowAddItem(!showAddItem)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "none", background: "rgba(201,151,59,0.1)", color: "var(--gold)", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}>
                          <Plus style={{ width: 11, height: 11 }} /> Add item
                        </button>
                      </div>
                      {showAddItem && (
                        <div style={{ padding: "14px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", marginBottom: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                          <input className="sal-input" placeholder="Service name" value={customItemDraft.name} onChange={(e) => setCustomItemDraft((d) => ({ ...d, name: e.target.value }))} />
                          {customItemErrors.name && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: -6 }}>{customItemErrors.name}</p>}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                              <input className="sal-input" type="number" placeholder="Price (PKR)" value={customItemDraft.price} onChange={(e) => setCustomItemDraft((d) => ({ ...d, price: e.target.value }))} />
                              {customItemErrors.price && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 2 }}>{customItemErrors.price}</p>}
                            </div>
                            <div>
                              <input className="sal-input" type="number" placeholder="Duration (min)" value={customItemDraft.duration} onChange={(e) => setCustomItemDraft((d) => ({ ...d, duration: e.target.value }))} />
                              {customItemErrors.duration && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 2 }}>{customItemErrors.duration}</p>}
                            </div>
                          </div>
                          <button type="button" onClick={handleAddCustomItem} style={{ alignSelf: "flex-end", padding: "7px 16px", borderRadius: 8, border: "none", background: "var(--grad-gold-btn)", color: "#0d0c0a", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>Add</button>
                        </div>
                      )}
                      {customItems.map((ci) => (
                        <div key={ci.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", marginBottom: 6 }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>{ci.name}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold)" }}>{formatPrice(parseFloat(ci.price))}</span>
                            <button type="button" onClick={() => setCustomItems((p) => p.filter((i) => i.id !== ci.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", padding: 2, display: "flex" }}><X style={{ width: 13, height: 13 }} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 3: Select Stylist ── */}
              {step === 3 && (
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 14 }}>Select Stylist</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10, maxHeight: 360, overflowY: "auto" }}>
                    {stylists.filter((s) => s.available && s.isActive).map((s) => {
                      const sel = selectedStylist === s.id;
                      return (
                        <button key={s.id} onClick={() => { setSelectedStylist(s.id); setSelectedTime(""); }} style={{ textAlign: "left", padding: "12px 14px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${sel ? "rgba(201,151,59,0.6)" : "var(--border-light)"}`, background: sel ? "rgba(201,151,59,0.07)" : "var(--bg-secondary)", transition: "all 0.2s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <Image src={s.avatar} alt={s.name} width={40} height={40} style={{ borderRadius: "50%", objectFit: "cover" }} />
                            <div>
                              <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</p>
                              <p style={{ fontSize: "0.7rem", color: "var(--gold)" }}>{s.role}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star style={{ width: 11, height: 11, color: "var(--gold)" }} />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.rating.toFixed(1)} · {s.experience}y exp</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Step 4: Date & Time ── */}
              {step === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 10 }}>Appointment Date</label>
                    <input type="date" value={selectedDate} min={getTodayDate()} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.86rem", outline: "none", maxWidth: 240 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 10 }}>Time Slot</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TIME_SLOTS.map((slot) => {
                        const sel = selectedTime === slot;
                        return (
                          <button key={slot} onClick={() => setSelectedTime(slot)} style={{ padding: "8px 14px", borderRadius: 9, fontSize: "0.76rem", fontWeight: 600, cursor: "pointer", border: sel ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)", background: sel ? "var(--grad-gold-btn)" : "var(--bg-secondary)", color: sel ? "#0d0c0a" : "var(--text-secondary)", transition: "all 0.2s" }}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {errors.time && <p style={{ fontSize: "0.78rem", color: "#f87171", marginTop: 10 }}>{errors.time}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 10 }}>Notes (optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests or notes…" rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                  {/* Booking summary */}
                  <div style={{ background: "rgba(201,151,59,0.06)", border: "1px solid rgba(201,151,59,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: 10 }}>Summary</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <Row label="Client"  value={userObj?.name ?? "—"} />
                      <Row label="Service" value={isCustomPackage ? `Custom Package (${totalCustomCount} items)` : (service?.name ?? "—")} />
                      <Row label="Stylist" value={stylist?.name ?? "—"} />
                      <Row label="Date"    value={selectedDate || "—"} />
                      <Row label="Time"    value={selectedTime || "—"} />
                      <Row label="Total"   value={formatPrice(isCustomPackage ? customPackageTotal : (service?.price ?? 0))} highlight />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Nav buttons ── */}
              <div style={{ display: "flex", justifyContent: step === 1 ? "flex-end" : "space-between", marginTop: 28, gap: 10 }}>
                {step > 1 && (
                  <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                    <ChevronLeft style={{ width: 14, height: 14 }} /> Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    disabled={
                      (step === 1 && !selectedUser) ||
                      (step === 2 && !isCustomPackage && !selectedService) ||
                      (step === 2 && isCustomPackage && totalCustomCount === 0) ||
                      (step === 3 && !selectedStylist)
                    }
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: "none", background: "var(--grad-gold-btn)", color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", opacity: (step === 1 && !selectedUser) || (step === 2 && !isCustomPackage && !selectedService) || (step === 2 && isCustomPackage && totalCustomCount === 0) || (step === 3 && !selectedStylist) ? 0.5 : 1 }}
                  >
                    Next <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading || !selectedDate || !selectedTime}
                    onClick={handleSubmit}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--grad-gold-btn)", color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: loading || !selectedDate || !selectedTime ? "not-allowed" : "pointer", opacity: loading || !selectedDate || !selectedTime ? 0.6 : 1 }}
                  >
                    {loading
                      ? <><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Booking…</>
                      : <><Sparkles style={{ width: 14, height: 14 }} /> Confirm Booking</>
                    }
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: highlight ? "0.9rem" : "0.78rem", fontWeight: highlight ? 800 : 600, color: highlight ? "var(--gold)" : "var(--text-primary)" }}>{value}</span>
    </div>
  );
}
