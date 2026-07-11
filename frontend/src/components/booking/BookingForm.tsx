"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { TIME_SLOTS, ROUTES } from "@/constants";
import { formatPrice, formatDuration, getTodayDate } from "@/lib/utils";
import { getStylistSlotsForDate } from "@/lib/availability";
import {
  Scissors, Clock, User, CheckCircle,
  ChevronRight, ChevronLeft, Calendar,
  Sparkles, Award, Star, AlertCircle,
  Search, Package, X, Plus
} from "lucide-react";
import { validateBookingForm, hasErrors, type ValidationError } from "@/lib/validations";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { servicesApi, stylistsApi, bookingsApi } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
type ApiService = {
  id: string; name: string; slug: string; category: string;
  description: string; duration: number; price: number;
  discountedPrice?: number | null; image: string; popular: boolean;
  forGender: string; isActive: boolean;
};
type ApiStylistAvailability = {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime:   string;
};
type ApiStylist = {
  id: string; name: string; role: string; avatar: string;
  bio: string; experience: number; rating: number;
  reviewCount: number; available: boolean; isActive: boolean;
  specialties: { id: string; name: string }[];
  slots?: { id: string; stylistId: string; time: string }[];
  availability?: ApiStylistAvailability[];
};

interface StepDef { n: number; label: string; icon: React.ComponentType<{ style?: React.CSSProperties }> }

// ── Step Indicator (outside component to avoid re-mount on render) ────────────
function StepIndicator({ steps, step }: { steps: StepDef[]; step: number }) {
  return (
    <div className="booking-steps" role="list" aria-label="Booking progress">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        const Icon = s.icon;
        return (
          <div key={s.n} className="booking-step-wrap" role="listitem">
            <div className="booking-step-node">
              <div
                className={`booking-step-circle${active ? " booking-step-circle--active" : ""}${done ? " booking-step-circle--done" : ""}`}
              >
                {done
                  ? <CheckCircle style={{ width: 18, height: 18, color: "#34d399" }} />
                  : <Icon style={{ width: 16, height: 16, color: active ? "#0d0c0a" : "var(--text-muted)", transform: s.n === 1 ? "rotate(45deg)" : "none" }} />
                }
              </div>
              <span className={`booking-step-label${active ? " booking-step-label--active" : ""}${done ? " booking-step-label--done" : ""}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`booking-step-line${step > s.n ? " booking-step-line--done" : ""}`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Nav Buttons (outside component to avoid re-mount on render) ───────────────
function NavButtons({ step, loading, nextDisabled, onNext, onBack, submitMode }: {
  step: number; loading?: boolean; nextDisabled?: boolean;
  onNext?: () => void; onBack?: () => void; submitMode?: boolean;
}) {
  return (
    <div className={`booking-nav-buttons${step === 1 ? " booking-nav-buttons--end" : ""}`}>
      {step > 1 && (
        <button type="button" onClick={onBack} className="booking-btn-back">
          <ChevronLeft style={{ width: 15, height: 15, flexShrink: 0 }} /> Back
        </button>
      )}
      <button
        type={submitMode ? "submit" : "button"}
        onClick={!submitMode ? onNext : undefined}
        disabled={nextDisabled}
        className="booking-btn-next"
      >
        {submitMode
          ? loading
            ? <><span className="booking-btn-spinner" /> Confirming…</>
            : <><Scissors style={{ width: 14, height: 14, flexShrink: 0, transform: "rotate(45deg)" }} /> Confirm Booking</>
          : <>Next <ChevronRight style={{ width: 15, height: 15, flexShrink: 0 }} /></>
        }
      </button>
    </div>
  );
}

interface Props {
  preSelectedService?: string;
  preSelectedStylist?: string;
}

type Step = 1 | 2 | 3 | 4;

export default function BookingForm({ preSelectedService, preSelectedStylist }: Props) {
  const [step, setStep] = useState<Step>(preSelectedService ? 2 : 1);
  const [selectedService, setSelectedService] = useState(preSelectedService ?? "");
  const [selectedStylist, setSelectedStylist] = useState(preSelectedStylist ?? "");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<ValidationError>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [waitlistRequested, setWaitlistRequested] = useState(false);
  const { toasts, toast, remove } = useToast();

  // Custom package state
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  const [customServices, setCustomServices] = useState<string[]>([]);

  // Custom user-defined items in package
  type CustomItem = { id: string; name: string; price: string; duration: string };
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [customItemDraft, setCustomItemDraft] = useState({ name: "", price: "", duration: "" });
  const [customItemErrors, setCustomItemErrors] = useState({ name: "", price: "", duration: "" });
  const [showAddItem, setShowAddItem] = useState(false);

  // Search state
  const [serviceSearch, setServiceSearch] = useState("");

  const [user, setUser] = useState<{ email: string; name: string; phone?: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // API-fetched data replacing static imports
  const [SERVICES, setServices] = useState<ApiService[]>([]);
  const [STYLISTS, setStylists] = useState<ApiStylist[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setForm((f) => ({
          ...f,
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || ""
        }));
      }
    } catch (e) {
      console.error(e);
    }
    setCheckingAuth(false);

    Promise.all([
      servicesApi.getAll() as Promise<{ success: boolean; data: ApiService[] }>,
      stylistsApi.getAll() as Promise<{ success: boolean; data: ApiStylist[] }>,
    ]).then(([svcRes, styRes]) => {
      if (svcRes.success) setServices(svcRes.data);
      if (styRes.success) setStylists(styRes.data);
    }).catch(() => {
      toast("error", "Failed to load services", "Could not connect to the server. Please refresh.");
    }).finally(() => setDataLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (preSelectedStylist || selectedStylist || STYLISTS.length === 0) return;
    const favoriteId = localStorage.getItem("gs_favorite_stylist_id");
    if (favoriteId && STYLISTS.some((s) => s.id === favoriteId && s.available)) {
      setSelectedStylist(favoriteId);
      if (!preSelectedService) setStep(2);
    }
  }, [STYLISTS, preSelectedStylist, preSelectedService, selectedStylist]);

  const service = SERVICES.find((s) => s.id === selectedService);
  const stylist = STYLISTS.find((s) => s.id === selectedStylist);

  // Custom package computed values
  const customServiceObjects = SERVICES.filter((s) => customServices.includes(s.id));
  const customItemsTotal = customItems.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
  const customItemsDuration = customItems.reduce((sum, i) => sum + (parseInt(i.duration) || 0), 0);
  const customPackageTotal = customServiceObjects.reduce(
    (sum, s) => sum + (s.discountedPrice ?? s.price), 0
  ) + customItemsTotal;
  const customPackageDuration = customServiceObjects.reduce((sum, s) => sum + s.duration, 0) + customItemsDuration;
  const totalCustomCount = customServices.length + customItems.length;

  // Add custom item handler
  const handleAddCustomItem = () => {
    const errs = { name: "", price: "", duration: "" };
    if (!customItemDraft.name.trim()) errs.name = "Service name required";
    const p = parseFloat(customItemDraft.price);
    if (!customItemDraft.price || isNaN(p) || p <= 0) errs.price = "Enter a valid price";
    const d = parseInt(customItemDraft.duration);
    if (!customItemDraft.duration || isNaN(d) || d <= 0) errs.duration = "Enter duration in minutes";
    setCustomItemErrors(errs);
    if (errs.name || errs.price || errs.duration) return;
    setCustomItems((prev) => [
      ...prev,
      { id: `ci-${Date.now()}`, ...customItemDraft }
    ]);
    setCustomItemDraft({ name: "", price: "", duration: "" });
    setShowAddItem(false);
  };

  const removeCustomItem = (id: string) =>
    setCustomItems((prev) => prev.filter((i) => i.id !== id));

  // Filtered services based on search
  const filteredServices = useMemo(() => {
    const q = serviceSearch.toLowerCase().trim();
    if (!q) return SERVICES;
    return SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [SERVICES, serviceSearch]);

  // Toggle a service in custom package
  const toggleCustomService = (id: string) => {
    setCustomServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const steps: StepDef[] = [
    { n: 1, label: "Service",    icon: Scissors },
    { n: 2, label: "Stylist",    icon: User },
    { n: 3, label: "Date & Time",icon: Calendar },
    { n: 4, label: "Details",    icon: CheckCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const effectiveServiceId = isCustomPackage ? "custom" : selectedService;

    // Client-side validation first
    const validationErrors = validateBookingForm({
      serviceId: effectiveServiceId,
      stylistId: selectedStylist,
      date: selectedDate,
      time: selectedTime,
      name: form.name,
      email: form.email,
      phone: form.phone,
      notes: form.notes,
    });

    if (isCustomPackage && customServices.length === 0 && customItems.length === 0) {
      toast("error", "No Services Selected", "Please select at least one service or add a custom item for your package.");
      return;
    }

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      // Scroll to first error field so user can see what's wrong
      const firstErrorKey = Object.keys(validationErrors)[0];
      setTimeout(() => {
        const el = document.querySelector(`[data-field="${firstErrorKey}"]`) as HTMLElement;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      toast("error", "Please fix the errors", Object.values(validationErrors)[0] as string);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = isCustomPackage
        ? {
            serviceId: null,
            customServices,
            customItems,
            customPackageTotal,
            customPackageDuration,
            stylistId: selectedStylist,
            date: selectedDate,
            time: selectedTime,
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
          }
        : {
            serviceId: selectedService,
            stylistId: selectedStylist,
            date: selectedDate,
            time: selectedTime,
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
          };

      const data = await bookingsApi.create(payload) as { success: boolean; data: unknown; errors?: ValidationError; error?: string };

      if (!data.success) {
        if (data.errors) {
          setErrors(data.errors);
          if (data.errors.time) {
            setStep(3);
            toast("error", "Time Slot Unavailable", data.errors.time);
          } else {
            toast("error", "Booking Failed", Object.values(data.errors)[0] as string);
          }
        } else {
          const msg = data.error ?? "Something went wrong. Please try again.";
          setApiError(msg);
          toast("error", "Booking Failed", msg);
        }
        return;
      }

      toast("success", "Appointment Confirmed! 🎉", `Your booking has been successfully placed.`);
      setDone(true);
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      setApiError(msg);
      toast("error", "Connection Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const requestWaitlist = () => {
    setWaitlistRequested(true);
    toast("success", "Waitlist request saved", "We will notify you if a slot opens for this stylist.");
  };

  /* ── Confirmed screen ── */
  if (done) {
    return (
      <div style={{
        background: "var(--bg-card)", border: "1px solid rgba(52,211,153,0.25)",
        borderRadius: 28, padding: "56px 40px", textAlign: "center",
        boxShadow: "0 20px 60px rgba(52,211,153,0.08)"
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px"
        }}>
          <CheckCircle style={{ width: 38, height: 38, color: "#34d399" }} />
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, fontFamily: "var(--font-display), Georgia, serif" }}>
          Booking Confirmed!
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 4 }}>
          Thank you, <strong style={{ color: "var(--text-primary)" }}>{form.name}</strong>
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.8 }}>
          {isCustomPackage ? (
            <>
              Your custom package ({[
                ...customServiceObjects.map((s) => s.name),
                ...customItems.map((i) => i.name)
              ].join(", ")}) with{" "}
              <span style={{ color: "var(--gold)" }}>{stylist?.name}</span> on{" "}
              <strong style={{ color: "var(--text-secondary)" }}>{selectedDate}</strong> at{" "}
              <strong style={{ color: "var(--text-secondary)" }}>{selectedTime}</strong> is confirmed.
            </>
          ) : (
            <>
              Your appointment for <span style={{ color: "var(--gold)" }}>{service?.name}</span> with{" "}
              <span style={{ color: "var(--gold)" }}>{stylist?.name}</span> on{" "}
              <strong style={{ color: "var(--text-secondary)" }}>{selectedDate}</strong> at{" "}
              <strong style={{ color: "var(--text-secondary)" }}>{selectedTime}</strong> is confirmed.
            </>
          )}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 32 }}>
          Confirmation sent to {form.email}
        </p>
        <a href={ROUTES.HOME} className="sal-btn sal-btn-gold" style={{ display: "inline-flex" }}>
          <Sparkles style={{ width: 15, height: 15 }} />
          Back to Home
        </a>
      </div>
    );
  }

  if (!checkingAuth && !user) {
    const redirectUrl = typeof window !== "undefined"
      ? encodeURIComponent(window.location.pathname + window.location.search)
      : "";

    return (
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-light)",
        borderRadius: 28, padding: "56px 40px", textAlign: "center",
        boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <User style={{ width: 32, height: 32, color: "var(--gold)" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>
            Login Required
          </h2>
          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
            Please sign in or create an account to book your appointment. This allows you to track your booking history, manage status, and chat with your stylist.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
          <a href={`${ROUTES.LOGIN}?redirect=${redirectUrl}`} className="sal-btn sal-btn-gold" style={{ padding: "12px 28px", fontSize: "0.8rem" }}>
            Sign In
          </a>
          <a href={`${ROUTES.REGISTER}?redirect=${redirectUrl}`} className="sal-btn sal-btn-outline" style={{ padding: "11px 26px", fontSize: "0.8rem" }}>
            Create Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <StepIndicator steps={steps} step={step} />

      <div className="booking-form-card">

        {/* ══ STEP 1 — Service ══ */}
        {step === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scissors style={{ width: 16, height: 16, color: "var(--gold)", transform: "rotate(45deg)" }} />
              </div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Choose a Service</h2>
            </div>

            {dataLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 16 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(201,151,59,0.15)", borderTopColor: "var(--gold)", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Loading services...</p>
              </div>
            ) : (
              <>
                {/* ── Mode toggle ── */}
                <div className="booking-mode-toggle">
                  <button
                    type="button"
                    onClick={() => { setIsCustomPackage(false); setCustomServices([]); setCustomItems([]); setShowAddItem(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 18px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      border: !isCustomPackage ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)",
                      background: !isCustomPackage ? "rgba(201,151,59,0.1)" : "var(--bg-secondary)",
                      color: !isCustomPackage ? "var(--gold)" : "var(--text-muted)",
                    }}
                  >
                    <Scissors style={{ width: 13, height: 13, transform: "rotate(45deg)" }} />
                    Single Service
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCustomPackage(true); setSelectedService(""); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 18px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      border: isCustomPackage ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)",
                      background: isCustomPackage ? "rgba(201,151,59,0.1)" : "var(--bg-secondary)",
                      color: isCustomPackage ? "var(--gold)" : "var(--text-muted)",
                    }}
                  >
                    <Package style={{ width: 13, height: 13 }} />
                    Custom Package
                  </button>
                </div>

                {/* ── Search field ── */}
                <div style={{ position: "relative", marginBottom: 16 }}>
                  <Search style={{
                    position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                    width: 15, height: 15, color: "var(--text-muted)", pointerEvents: "none"
                  }} />
                  <input
                    type="text"
                    placeholder="Search services (e.g. facial, haircut, massage…)"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    style={{
                      width: "100%", paddingLeft: 38, paddingRight: serviceSearch ? 36 : 14,
                      paddingTop: 10, paddingBottom: 10,
                      background: "var(--bg-secondary)", border: "1.5px solid var(--border-light)",
                      borderRadius: 11, fontSize: "0.84rem", color: "var(--text-primary)",
                      outline: "none", transition: "border-color 0.2s",
                    }}
                  />
                  {serviceSearch && (
                    <button
                      type="button"
                      onClick={() => setServiceSearch("")}
                      style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", padding: 2,
                        color: "var(--text-muted)"
                      }}
                    >
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  )}
                </div>

                {/* ── Custom package summary bar ── */}
                {isCustomPackage && totalCustomCount > 0 && (
                  <div style={{
                    background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.25)",
                    borderRadius: 12, padding: "12px 16px", marginBottom: 14,
                    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Package style={{ width: 14, height: 14, color: "var(--gold)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--gold)" }}>
                        {totalCustomCount} item{totalCustomCount > 1 ? "s" : ""} in package
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        · {formatDuration(customPackageDuration)}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "var(--gold)" }}>
                      {formatPrice(customPackageTotal)}
                    </span>
                  </div>
                )}

                {/* ── No results ── */}
                {filteredServices.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: "0.84rem" }}>
                    No services found for &ldquo;{serviceSearch}&rdquo;
                  </div>
                )}

                {/* ── Service grid ── */}
                <div className="booking-service-grid">
                  {filteredServices.map((s) => {
                    const selectedSingle = !isCustomPackage && selectedService === s.id;
                    const selectedCustom = isCustomPackage && customServices.includes(s.id);
                    const isSelected = selectedSingle || selectedCustom;

                    return (
                      <button key={s.id} onClick={() => {
                        if (isCustomPackage) {
                          toggleCustomService(s.id);
                        } else {
                          setSelectedService(s.id);
                        }
                      }} style={{
                        textAlign: "left", padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                        border: isSelected ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)",
                        background: isSelected ? "rgba(201,151,59,0.07)" : "var(--bg-secondary)",
                        boxShadow: isSelected ? "0 4px 20px rgba(201,151,59,0.12)" : "none",
                        transition: "all 0.2s ease", position: "relative"
                      }}>
                        {/* Custom package checkbox indicator */}
                        {isCustomPackage && (
                          <div style={{
                            position: "absolute", top: 10, right: 10,
                            width: 20, height: 20, borderRadius: 6,
                            border: selectedCustom ? "none" : "1.5px solid var(--border-light)",
                            background: selectedCustom ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s"
                          }}>
                            {selectedCustom && <CheckCircle style={{ width: 12, height: 12, color: "#0d0c0a" }} />}
                            {!selectedCustom && <Plus style={{ width: 11, height: 11, color: "var(--text-muted)" }} />}
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, paddingRight: isCustomPackage ? 28 : 0 }}>
                          <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{s.name}</p>
                          {s.discountedPrice && (
                            <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "2px 7px", borderRadius: 5, background: "var(--grad-gold-btn)", color: "#0d0c0a", textTransform: "uppercase", flexShrink: 0, marginLeft: 6 }}>SALE</span>
                          )}
                        </div>
                        <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>{s.description.slice(0, 60)}…</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Clock style={{ width: 11, height: 11, color: "var(--gold)" }} />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{formatDuration(s.duration)}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            {s.discountedPrice && (
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textDecoration: "line-through" }}>{formatPrice(s.price)}</span>
                            )}
                            <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(s.discountedPrice ?? s.price)}</span>
                          </div>
                        </div>
                        {isSelected && !isCustomPackage && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(201,151,59,0.2)" }}>
                            <CheckCircle style={{ width: 12, height: 12, color: "var(--gold)" }} />
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold)" }}>Selected</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── Add Your Own Item (custom package only) ── */}
                {isCustomPackage && (
                  <div style={{ marginTop: 20 }}>
                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        Or Add Your Own
                      </span>
                      <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
                    </div>

                    {/* Existing custom items list */}
                    {customItems.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                        {customItems.map((item) => (
                          <div key={item.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 14px", borderRadius: 11,
                            background: "rgba(201,151,59,0.06)", border: "1px solid rgba(201,151,59,0.2)",
                            gap: 8
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                background: "rgba(201,151,59,0.15)", border: "1px solid rgba(201,151,59,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                                <Sparkles style={{ width: 13, height: 13, color: "var(--gold)" }} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>
                                  {parseInt(item.duration)} min
                                </p>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                              <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gold)" }}>
                                {formatPrice(parseFloat(item.price))}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCustomItem(item.id)}
                                style={{
                                  background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                                  borderRadius: 7, width: 26, height: 26,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  cursor: "pointer", flexShrink: 0
                                }}
                              >
                                <X style={{ width: 12, height: 12, color: "#f87171" }} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add item form */}
                    {showAddItem ? (
                      <div style={{
                        background: "var(--bg-secondary)", border: "1.5px solid rgba(201,151,59,0.3)",
                        borderRadius: 14, padding: "16px 18px"
                      }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gold)", marginBottom: 14 }}>
                          Custom Service Details
                        </p>
                        <div className="booking-custom-fields">
                          {/* Name */}
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 6 }}>
                              Service Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Hair Oiling, Eyebrow Tint…"
                              value={customItemDraft.name}
                              onChange={(e) => {
                                setCustomItemDraft((d) => ({ ...d, name: e.target.value }));
                                if (customItemErrors.name) setCustomItemErrors((e2) => ({ ...e2, name: "" }));
                              }}
                              style={{
                                width: "100%", background: "var(--bg-card)",
                                border: `1.5px solid ${customItemErrors.name ? "#f87171" : "var(--border-light)"}`,
                                borderRadius: 10, padding: "9px 12px",
                                fontSize: "0.84rem", color: "var(--text-primary)", outline: "none"
                              }}
                            />
                            {customItemErrors.name && (
                              <p style={{ fontSize: "0.67rem", color: "#f87171", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <AlertCircle style={{ width: 10, height: 10 }} />{customItemErrors.name}
                              </p>
                            )}
                          </div>
                          {/* Price */}
                          <div>
                            <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 6 }}>
                              Price (PKR) *
                            </label>
                            <input
                              type="number"
                              placeholder="1500"
                              min="1"
                              value={customItemDraft.price}
                              onChange={(e) => {
                                setCustomItemDraft((d) => ({ ...d, price: e.target.value }));
                                if (customItemErrors.price) setCustomItemErrors((e2) => ({ ...e2, price: "" }));
                              }}
                              style={{
                                width: "100%", background: "var(--bg-card)",
                                border: `1.5px solid ${customItemErrors.price ? "#f87171" : "var(--border-light)"}`,
                                borderRadius: 10, padding: "9px 12px",
                                fontSize: "0.84rem", color: "var(--text-primary)", outline: "none"
                              }}
                            />
                            {customItemErrors.price && (
                              <p style={{ fontSize: "0.67rem", color: "#f87171", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <AlertCircle style={{ width: 10, height: 10 }} />{customItemErrors.price}
                              </p>
                            )}
                          </div>
                          {/* Duration */}
                          <div>
                            <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 6 }}>
                              Duration (mins) *
                            </label>
                            <input
                              type="number"
                              placeholder="30"
                              min="1"
                              value={customItemDraft.duration}
                              onChange={(e) => {
                                setCustomItemDraft((d) => ({ ...d, duration: e.target.value }));
                                if (customItemErrors.duration) setCustomItemErrors((e2) => ({ ...e2, duration: "" }));
                              }}
                              style={{
                                width: "100%", background: "var(--bg-card)",
                                border: `1.5px solid ${customItemErrors.duration ? "#f87171" : "var(--border-light)"}`,
                                borderRadius: 10, padding: "9px 12px",
                                fontSize: "0.84rem", color: "var(--text-primary)", outline: "none"
                              }}
                            />
                            {customItemErrors.duration && (
                              <p style={{ fontSize: "0.67rem", color: "#f87171", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <AlertCircle style={{ width: 10, height: 10 }} />{customItemErrors.duration}
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            onClick={handleAddCustomItem}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "9px 18px", borderRadius: 9, fontSize: "0.78rem", fontWeight: 700,
                              cursor: "pointer", background: "var(--grad-gold-btn)", border: "none",
                              color: "#0d0c0a", boxShadow: "0 3px 12px rgba(201,151,59,0.25)"
                            }}
                          >
                            <Plus style={{ width: 13, height: 13 }} />
                            Add to Package
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowAddItem(false); setCustomItemDraft({ name: "", price: "", duration: "" }); setCustomItemErrors({ name: "", price: "", duration: "" }); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "9px 16px", borderRadius: 9, fontSize: "0.78rem", fontWeight: 600,
                              cursor: "pointer", background: "var(--bg-card)", border: "1px solid var(--border-light)",
                              color: "var(--text-muted)"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddItem(true)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, width: "100%",
                          padding: "11px 16px", borderRadius: 11, fontSize: "0.8rem", fontWeight: 600,
                          cursor: "pointer", transition: "all 0.2s",
                          border: "1.5px dashed rgba(201,151,59,0.35)",
                          background: "rgba(201,151,59,0.03)",
                          color: "var(--text-muted)",
                          justifyContent: "center"
                        }}
                      >
                        <Plus style={{ width: 14, height: 14, color: "var(--gold)" }} />
                        Add a custom service item
                      </button>
                    )}
                  </div>
                )}

                <NavButtons
                  step={step}
                  nextDisabled={isCustomPackage ? totalCustomCount === 0 : !selectedService}
                  onNext={() => setStep(2)}
                />
              </>
            )}
          </div>
        )}

        {/* ══ STEP 2 — Stylist ══ */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User style={{ width: 16, height: 16, color: "var(--gold)" }} />
              </div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Choose a Stylist</h2>
            </div>

            <div className="booking-stylist-grid">
              {STYLISTS.map((s) => {
                const selected = selectedStylist === s.id;
                const unavail = !s.available;
                return (
                  <button key={s.id} onClick={() => { if (s.available) { setSelectedStylist(s.id); setSelectedTime(""); } }} disabled={unavail} style={{
                    textAlign: "left", padding: "14px 16px", borderRadius: 14,
                    cursor: unavail ? "not-allowed" : "pointer",
                    border: selected ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)",
                    background: selected ? "rgba(201,151,59,0.07)" : unavail ? "var(--bg-secondary)" : "var(--bg-secondary)",
                    opacity: unavail ? 0.45 : 1,
                    boxShadow: selected ? "0 4px 20px rgba(201,151,59,0.12)" : "none",
                    transition: "all 0.2s ease"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <Image src={s.avatar} alt={s.name} width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover", border: selected ? "2px solid rgba(201,151,59,0.6)" : "2px solid var(--border-light)" }} />
                      <div>
                        <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--gold)", marginTop: 1 }}>{s.role}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {[1,2,3,4,5].map((n) => (
                          <Star key={n} style={{ width: 11, height: 11, color: "#f59e0b", fill: n <= Math.round(s.rating) ? "#f59e0b" : "transparent" }} />
                        ))}
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 3 }}>{s.rating}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Award style={{ width: 11, height: 11, color: "var(--text-muted)" }} />
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{s.experience}y</span>
                      </div>
                    </div>
                    {unavail && (
                      <p style={{ fontSize: "0.66rem", color: "var(--text-muted)", marginTop: 8, fontStyle: "italic" }}>Currently unavailable</p>
                    )}
                    {selected && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(201,151,59,0.2)" }}>
                        <CheckCircle style={{ width: 12, height: 12, color: "var(--gold)" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold)" }}>Selected</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <NavButtons step={step} nextDisabled={!selectedStylist} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          </div>
        )}

        {/* ══ STEP 3 — Date & Time ══ */}
        {step === 3 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar style={{ width: 16, height: 16, color: "var(--gold)" }} />
              </div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Choose Date & Time</h2>
            </div>

            {/* Date input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 8 }}>
                Select Date
              </label>
              <input type="date" value={selectedDate} min={getTodayDate()}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
                style={{
                  width: "100%", maxWidth: 260,
                  background: "var(--bg-secondary)", border: "1.5px solid var(--border-light)",
                  borderRadius: 11, padding: "11px 16px",
                  fontSize: "0.88rem", color: "var(--text-primary)",
                  outline: "none", cursor: "pointer"
                }}
              />
            </div>

            {/* Time slots */}
            <div>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 12 }}>
                Available Slots
              </label>
              {/* Compute slots based on stylist availability for the selected date */}
              {(() => {
                const dynamicSlots = getStylistSlotsForDate(
                  stylist?.availability ?? [],
                  selectedDate,
                  TIME_SLOTS,
                );
                if (dynamicSlots.length === 0) {
                  return (
                    <div style={{ padding: "24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed var(--border-light)" }}>
                      <AlertCircle style={{ width: 26, height: 26, color: "var(--gold)", margin: "0 auto 10px" }} />
                      <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                        This stylist is fully booked or unavailable on the selected day.
                      </p>
                      <button type="button" onClick={requestWaitlist} disabled={waitlistRequested} style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "10px 15px", borderRadius: 10,
                        border: "1px solid rgba(201,151,59,0.35)",
                        background: waitlistRequested ? "rgba(52,211,153,0.1)" : "rgba(201,151,59,0.1)",
                        color: waitlistRequested ? "#34d399" : "var(--gold)",
                        fontWeight: 800, fontSize: "0.78rem", cursor: waitlistRequested ? "default" : "pointer"
                      }}>
                        {waitlistRequested ? <CheckCircle style={{ width: 14, height: 14 }} /> : <Clock style={{ width: 14, height: 14 }} />}
                        {waitlistRequested ? "Waitlist Added" : "Notify When Available"}
                      </button>
                    </div>
                  );
                }
                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {dynamicSlots.map((slot) => {
                      const selected = selectedTime === slot;
                      return (
                        <button key={slot} onClick={() => setSelectedTime(slot)} style={{
                          padding: "9px 16px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 600,
                          cursor: "pointer",
                          border: selected ? "1.5px solid rgba(201,151,59,0.6)" : "1.5px solid var(--border-light)",
                          background: selected ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
                          color: selected ? "#0d0c0a" : "var(--text-secondary)",
                          boxShadow: selected ? "0 3px 14px rgba(201,151,59,0.25)" : "none",
                          transition: "all 0.2s"
                        }}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            <NavButtons step={step} nextDisabled={!selectedDate || !selectedTime} onNext={() => setStep(4)} onBack={() => setStep(2)} />
          </div>
        )}

        {/* ══ STEP 4 — Details ══ */}
        {step === 4 && (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle style={{ width: 16, height: 16, color: "var(--gold)" }} />
              </div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Your Details</h2>
            </div>

            {/* Summary card */}
            <div style={{ background: "rgba(201,151,59,0.06)", border: "1px solid rgba(201,151,59,0.2)", borderRadius: 16, padding: "18px 20px", marginBottom: 24 }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: 14 }}>
                Booking Summary
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {isCustomPackage ? (
                  <>
                    {/* Selected salon services */}
                    {customServiceObjects.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Salon Services</span>
                        <div style={{ textAlign: "right", maxWidth: "60%" }}>
                          {customServiceObjects.map((s) => (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: 600 }}>{s.name}</span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>({formatPrice(s.discountedPrice ?? s.price)})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* User-added custom items */}
                    {customItems.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Custom Items</span>
                        <div style={{ textAlign: "right", maxWidth: "60%" }}>
                          {customItems.map((item) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: 600 }}>{item.name}</span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>({formatPrice(parseFloat(item.price))})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {[
                      ["Stylist",  stylist?.name],
                      ["Date",     selectedDate],
                      ["Time",     selectedTime],
                      ["Duration", formatDuration(customPackageDuration)],
                    ].map(([label, value]) => (
                      <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{label}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(201,151,59,0.2)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                      <span style={{ fontSize: "1rem", fontWeight: 900, color: "var(--gold)" }}>
                        {formatPrice(customPackageTotal)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      ["Service",  service?.name],
                      ["Stylist",  stylist?.name],
                      ["Date",     selectedDate],
                      ["Time",     selectedTime],
                      ["Duration", service && formatDuration(service.duration)],
                    ].map(([label, value]) => (
                      <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{label}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(201,151,59,0.2)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                      <span style={{ fontSize: "1rem", fontWeight: 900, color: "var(--gold)" }}>
                        {service && formatPrice(service.discountedPrice ?? service.price)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Form fields */}
            <div className="booking-fields-grid">
              {[
                { label: "Full Name",     key: "name",  type: "text",  placeholder: "Fatima Khan",      inputMode: undefined as React.HTMLAttributes<HTMLInputElement>["inputMode"] },
                { label: "Email Address", key: "email", type: "email", placeholder: "you@email.com",     inputMode: undefined as React.HTMLAttributes<HTMLInputElement>["inputMode"] },
                { label: "Phone Number",  key: "phone", type: "tel",   placeholder: "0300-1234567",      inputMode: "numeric" as const },
              ].map(({ label, key, type, placeholder, inputMode }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 7 }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    data-field={key}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => {
                      let val = e.target.value;
                      // Phone: only allow digits, +, -, spaces
                      if (key === "phone") val = val.replace(/[^0-9+\-\s]/g, "");
                      setForm({ ...form, [key]: val });
                      if (errors[key]) setErrors({ ...errors, [key]: "" });
                    }}
                    style={{
                      width: "100%", background: "var(--bg-secondary)",
                      border: `1.5px solid ${errors[key] ? "#f87171" : "var(--border-light)"}`,
                      borderRadius: 11,
                      padding: "11px 14px", fontSize: "0.86rem", color: "var(--text-primary)",
                      outline: "none", transition: "border-color 0.2s"
                    }}
                  />
                  {errors[key] && (
                    <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "#f87171", marginTop: 5 }}>
                      <AlertCircle style={{ width: 11, height: 11, flexShrink: 0 }} />
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 7 }}>
                Notes (Optional)
              </label>
              <textarea rows={3} placeholder="Any special requests or preferences…"
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{
                  width: "100%", background: "var(--bg-secondary)",
                  border: "1.5px solid var(--border-light)", borderRadius: 11,
                  padding: "11px 14px", fontSize: "0.86rem", color: "var(--text-primary)",
                  outline: "none", resize: "none", fontFamily: "inherit",
                  transition: "border-color 0.2s"
                }}
              />
              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 4, textAlign: "right" }}>
                {form.notes.length}/500
              </p>
            </div>

            {/* API error */}
            {apiError && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 16px", borderRadius: 10, marginBottom: 8,
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)"
              }}>
                <AlertCircle style={{ width: 15, height: 15, color: "#f87171", flexShrink: 0 }} />
                <p style={{ fontSize: "0.8rem", color: "#f87171" }}>{apiError}</p>
              </div>
            )}

            {/* ── Confirm Booking buttons (inline to avoid React re-mount bug) ── */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "11px 22px", borderRadius: 11,
                  background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
                  color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer"
                }}
              >
                <ChevronLeft style={{ width: 15, height: 15 }} /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "12px 28px", borderRadius: 11,
                  background: loading ? "var(--bg-secondary)" : "var(--grad-gold-btn)",
                  border: loading ? "1px solid var(--border-light)" : "none",
                  color: loading ? "var(--text-muted)" : "#0d0c0a",
                  fontSize: "0.82rem", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(201,151,59,0.3)",
                  transition: "all 0.2s", opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 14, height: 14, borderRadius: "50%",
                      border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a",
                      animation: "spin 0.7s linear infinite", display: "inline-block"
                    }} />
                    Confirming…
                  </>
                ) : (
                  <>
                    <Scissors style={{ width: 14, height: 14, transform: "rotate(45deg)" }} />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </>
  );
}
