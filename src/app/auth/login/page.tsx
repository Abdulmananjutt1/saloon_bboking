"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Scissors, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { validateLoginForm, hasErrors, type ValidationError } from "@/lib/validations";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { authApi } from "@/lib/api";
import { saveSession, pushSessionToast, isAdmin } from "@/lib/session";

function LoginPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({ email: "", password: "" });
  const [errors, setErrors]       = useState<ValidationError>({});
  const [apiError, setApiError]   = useState("");
  const { toasts, toast, remove } = useToast();

  // Show toast from sessionStorage (e.g. after logout)
  useEffect(() => {
    const raw = sessionStorage.getItem("toast");
    if (raw) {
      try {
        const t = JSON.parse(raw);
        toast(t.type, t.title, t.message);
      } catch { /* ignore */ }
      sessionStorage.removeItem("toast");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateLoginForm(form);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const data = await authApi.login(form) as any;

      if (data.errors?.general) { setApiError(data.errors.general); return; }
      if (data.errors)           { setErrors(data.errors); return; }
      if (!data.success)         { setApiError(data.error ?? "Login failed. Please try again."); return; }

      saveSession(data.data, data.token ?? "");
      pushSessionToast("success", "Login Successful", `Welcome back, ${data.data.name}!`);

      if (redirectTo) {
        window.location.href = decodeURIComponent(redirectTo);
      } else {
        window.location.href = isAdmin(data.data) ? ROUTES.ADMIN : ROUTES.DASHBOARD;
      }
    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex" }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* ── Left panel: image ── */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80"
          alt="Glamour Studio"
          fill
          className="object-cover"
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.55) 60%, rgba(10,9,7,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(201,151,59,0.1) 0%, transparent 60%)" }} />

        {/* Centered text overlay */}
        <div style={{ position: "relative", textAlign: "center", padding: "40px 52px", maxWidth: 480 }}>
          <div className="sal-glass-gold" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            borderRadius: 99, padding: "6px 18px", marginBottom: 28
          }}>
            <Sparkles style={{ width: 13, height: 13, color: "var(--gold)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Islamabad&apos;s #1 Salon
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
            Your Beauty Journey<br />
            <span className="text-gold">Starts Here</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 40 }}>
            50+ premium services · Expert stylists · Online booking in 2 minutes.
          </p>

          {/* Mini stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 36, paddingTop: 32, borderTop: "1px solid rgba(201,151,59,0.2)" }}>
            {[["8.5K+", "Clients"], ["4.9★", "Rating"], ["50+", "Services"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div style={{
        flex: "0 0 540px", maxWidth: 540,
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "72px 60px",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-light)",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <Link href={ROUTES.HOME} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          textDecoration: "none", marginBottom: 56
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "var(--grad-gold-btn)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(201,151,59,0.35)"
          }}>
            <Scissors style={{ width: 18, height: 18, color: "#0d0c0a", transform: "rotate(45deg)" }} />
          </div>
          <div>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1 }}>{APP_NAME}</p>
            <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)" }}>Premium Salon</p>
          </div>
        </Link>

        {/* Heading */}
        <div style={{ marginBottom: 36 }}>
          <span className="sal-eyebrow">Welcome Back</span>
          <h1 className="sal-h2" style={{ fontSize: "2rem", marginBottom: 8 }}>Sign In to <span className="text-gold">Your Account</span></h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Manage your bookings and appointments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* General API error */}
          {apiError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--color-error-bg)", border: "1px solid rgba(248,113,113,0.25)" }}>
              <AlertCircle style={{ width: 15, height: 15, color: "var(--color-error)", flexShrink: 0 }} />
              <p style={{ fontSize: "0.8rem", color: "var(--color-error)" }}>{apiError}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="sal-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="sal-input"
                style={{ paddingLeft: 40, borderColor: errors.email ? "var(--color-error)" : undefined }}
              />
            </div>
            {errors.email && (
              <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}>
                <AlertCircle style={{ width: 11, height: 11 }} />{errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="sal-label" style={{ margin: 0 }}>Password</label>
              <Link href={ROUTES.FORGOT_PASSWORD} style={{ fontSize: "0.72rem", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                className="sal-input"
                style={{ paddingLeft: 40, paddingRight: 44, borderColor: errors.password ? "var(--color-error)" : undefined }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
                {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}>
                <AlertCircle style={{ width: 11, height: 11 }} />{errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="sal-btn sal-btn-gold" disabled={loading} style={{ marginTop: 8, padding: "14px", fontSize: "0.9rem", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
            {loading
              ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block", marginRight: 8 }} />Signing in…</>
              : "Sign In"
            }
          </button>
        </form>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>



        {/* Footer link */}
        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 28 }}>
          Don&apos;t have an account?{" "}
          <Link
            href={redirectTo ? `${ROUTES.REGISTER}?redirect=${encodeURIComponent(redirectTo)}` : ROUTES.REGISTER}
            style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <LoginPageInner />
    </Suspense>
  );
}

