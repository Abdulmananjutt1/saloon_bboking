"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { authApi } from "@/lib/api";
import { validatePassword, hasErrors, type ValidationError } from "@/lib/validations";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [form, setForm]             = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors]         = useState<ValidationError>({});
  const [apiError, setApiError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const fieldErrors: ValidationError = {};
    const passErr = validatePassword(form.password);
    if (passErr) fieldErrors.password = passErr;
    if (form.password !== form.confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    if (!token) {
      setApiError("Invalid reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      }) as { success: boolean; errors?: Record<string, string>; error?: string };

      if (res.success) {
        setDone(true);
        setTimeout(() => router.push(ROUTES.LOGIN), 2500);
      } else if (res.errors) {
        setErrors(res.errors);
        if (res.errors.general) setApiError(res.errors.general);
      } else {
        setApiError(res.error ?? "Failed to reset password.");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
    }}>
      {/* Left panel */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&q=80"
          alt="Glamour Studio"
          fill
          className="object-cover"
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.6) 55%, rgba(10,9,7,0.3) 100%)" }} />
        <div style={{ position: "relative", padding: "48px 56px", maxWidth: 500 }}>
          <div className="sal-glass-gold" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 99, padding: "6px 18px", marginBottom: 32 }}>
            <Sparkles style={{ width: 13, height: 13, color: "var(--gold)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Secure Reset
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 18 }}>
            Choose a New<br />
            <span className="text-gold">Password</span>
          </h2>
          <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.85 }}>
            Use at least 8 characters with uppercase, lowercase, and a number.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: "0 0 540px", maxWidth: 540, width: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "72px 64px",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-light)",
      }}>
        <Link href={ROUTES.HOME} style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 56 }}>
          <Logo size={58} />
          <div>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1 }}>{APP_NAME}</p>
            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--text-muted)", marginTop: 2 }}>Premium Salon</p>
          </div>
        </Link>

        {done ? (
          <div>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1.5px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36 }}>
              <CheckCircle style={{ width: 42, height: 42, color: "#4ade80" }} />
            </div>
            <h1 className="sal-h2" style={{ fontSize: "2rem", marginBottom: 14 }}>
              Password <span className="text-gold">Updated!</span>
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <span className="sal-eyebrow">Reset Password</span>
              <h1 className="sal-h2" style={{ fontSize: "2rem", marginBottom: 14 }}>
                Set New <span className="text-gold">Password</span>
              </h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Enter your new password below.
              </p>
            </div>

            {apiError && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--color-error-bg)", border: "1px solid rgba(248,113,113,0.25)", marginBottom: 20 }}>
                <AlertCircle style={{ width: 15, height: 15, color: "var(--color-error)", flexShrink: 0 }} />
                <p style={{ fontSize: "0.8rem", color: "var(--color-error)" }}>{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="sal-label">New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="sal-input"
                    style={{ paddingLeft: 42, paddingRight: 42, borderColor: errors.password ? "var(--color-error)" : undefined }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}>{errors.password}</p>}
              </div>

              <div>
                <label className="sal-label">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="sal-input"
                    style={{ paddingLeft: 42, paddingRight: 42, borderColor: errors.confirmPassword ? "var(--color-error)" : undefined }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    {showConfirm ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}>{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="sal-btn sal-btn-gold" disabled={loading} style={{ padding: "16px", fontSize: "0.92rem", justifyContent: "center", opacity: loading ? 0.72 : 1 }}>
                {loading ? "Updating…" : <span style={{ display: "flex", alignItems: "center", gap: 8 }}>Update Password <ArrowRight style={{ width: 15, height: 15 }} /></span>}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 32 }}>
              <Link href={ROUTES.FORGOT_PASSWORD} style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>
                Request a new reset link
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
