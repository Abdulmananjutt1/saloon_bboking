"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  User, Mail, Phone, Lock,
  Eye, EyeOff, Sparkles, CheckCircle, ArrowRight, AlertCircle,
} from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { validateRegisterForm, hasErrors, type ValidationError } from "@/lib/validations";
import { authApi } from "@/lib/api";
import { pushSessionToast, saveSession, type SessionUser } from "@/lib/session";

const PERKS = [
  "Instant booking confirmation â€” no waiting",
  "Full booking history at your fingertips",
  "Exclusive member offers & early access deals",
  "Free cancellation up to 2 hours before",
];

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState<"form" | "verify">("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors]     = useState<ValidationError>({});
  const [apiError, setApiError] = useState("");

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (apiError) setApiError("");
  };

  // Password strength 0-4
  const passStrength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "var(--status-cancelled)", "#f59e0b", "#84cc16", "var(--status-confirmed)"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateRegisterForm(form);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const data = await authApi.register(form) as {
        success: boolean;
        requiresVerification?: boolean;
        email?: string;
        message?: string;
        error?: string;
        errors?: Record<string, string>;
      };

      if (data.errors) { setErrors(data.errors); return; }
      if (!data.success) { setApiError(data.error ?? "Registration failed. Please try again."); return; }

      if (data.requiresVerification) {
        setRegisteredEmail(data.email ?? form.email);
        setStep("verify");
        return;
      }
    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const createGuestAccount = async () => {
    setGuestLoading(true);
    setApiError("");
    try {
      const res = await authApi.createGuest() as {
        success: boolean;
        data?: SessionUser;
        token?: string;
        error?: string;
      };

      if (!res.success || !res.data || !res.token) {
        setApiError(res.error ?? "Could not create guest account. Please try again.");
        return;
      }

      saveSession(res.data, res.token);
      pushSessionToast("success", "Guest Account Created", `Welcome, ${res.data.name}. You are signed in now.`);
      window.location.href = ROUTES.DASHBOARD;
    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
    }}>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LEFT â€” image + perks panel
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div style={{
        flex: 1, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", minHeight: "100vh",
      }}>
        <Image
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80"
          alt="Glamour Studio"
          fill
          className="object-cover"
          priority
        />
        {/* layered overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.6) 60%, rgba(10,9,7,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(201,151,59,0.1) 0%, transparent 60%)" }} />

        {/* Content */}
        <div style={{ position: "relative", padding: "60px 56px", maxWidth: 520, width: "100%" }}>

          {/* Top badge */}
          <div className="sal-glass-gold" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            borderRadius: 99, padding: "6px 18px", marginBottom: 32
          }}>
            <Sparkles style={{ width: 13, height: 13, color: "var(--gold)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Join the Family
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
            Premium Beauty<br />
            <span className="text-gold">Awaits You</span>
          </h2>

          <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 40, maxWidth: 380 }}>
            Create your free account and start booking with Islamabad&apos;s most trusted salon team today.
          </p>

          {/* Perks list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            {PERKS.map((p) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: "var(--grad-gold-btn)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(201,151,59,0.35)"
                }}>
                  <CheckCircle style={{ width: 13, height: 13, color: "#0d0c0a" }} />
                </div>
                <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Mini stats */}
          <div style={{
            display: "flex", gap: 28,
            paddingTop: 32, borderTop: "1px solid rgba(201,151,59,0.2)"
          }}>
            {[["8.5K+", "Happy Clients"], ["4.9â˜…", "Avg Rating"], ["50+", "Services"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.16em", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          RIGHT â€” form panel
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div style={{
        flex: "0 0 560px", maxWidth: 560, width: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-light)",
        overflowY: "auto",
      }}>

        {/* Logo */}
        <Link href={ROUTES.HOME} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          textDecoration: "none", marginBottom: 52
        }}>
          <Logo size={58} />
          <div>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1 }}>{APP_NAME}</p>
            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--text-muted)", marginTop: 2 }}>Premium Salon</p>
          </div>
        </Link>

        {/* Heading / Form / Verify step */}
        {step === "verify" ? (
          <div>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, boxShadow: "0 12px 40px rgba(201,151,59,0.35)" }}>
              <Mail style={{ width: 32, height: 32, color: "#0d0c0a" }} />
            </div>
            <span className="sal-eyebrow">Almost There</span>
            <h1 className="sal-h2" style={{ fontSize: "1.9rem", marginBottom: 12 }}>
              Verify Your <span className="text-gold">Email</span>
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
              We sent a verification link to <strong style={{ color: "var(--text-primary)" }}>{registeredEmail}</strong>.
              Click the link in your email, then sign in to continue.
            </p>
            <Link href={ROUTES.LOGIN} className="sal-btn sal-btn-gold" style={{ justifyContent: "center", padding: "15px", fontSize: "0.92rem", display: "flex" }}>
              Go to Sign In
            </Link>
            <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 20 }}>
              Didn&apos;t get it? Check spam or{" "}
              <button type="button" onClick={() => setStep("form")} style={{ background: "none", border: "none", color: "var(--gold)", fontWeight: 600, cursor: "pointer", fontSize: "0.78rem" }}>
                try again
              </button>
            </p>
          </div>
        ) : (
        <>
        <div style={{ marginBottom: 36 }}>
          <span className="sal-eyebrow">New Here?</span>
          <h1 className="sal-h2" style={{ fontSize: "1.9rem", marginBottom: 8 }}>
            Create Your <span className="text-gold">Account</span>
          </h1>
          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Join 8,500+ clients. Takes less than a minute.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* API error */}
          {apiError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: "var(--color-error-bg)", border: "1px solid rgba(248,113,113,0.25)" }}>
              <AlertCircle style={{ width: 15, height: 15, color: "var(--color-error)", flexShrink: 0 }} />
              <p style={{ fontSize: "0.8rem", color: "var(--color-error)" }}>{apiError}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="sal-label">Full Name</label>
            <div style={{ position: "relative" }}>
              <User style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input type="text" required placeholder="Fatima Khan"
                value={form.name} onChange={(e) => setField("name", e.target.value)}
                className="sal-input" style={{ paddingLeft: 42, borderColor: errors.name ? "var(--color-error)" : undefined }} />
            </div>
            {errors.name && <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}><AlertCircle style={{ width: 11, height: 11 }} />{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="sal-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input type="email" required placeholder="you@email.com"
                value={form.email} onChange={(e) => setField("email", e.target.value)}
                className="sal-input" style={{ paddingLeft: 42, borderColor: errors.email ? "var(--color-error)" : undefined }} />
            </div>
            {errors.email && <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}><AlertCircle style={{ width: 11, height: 11 }} />{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="sal-label">Phone Number</label>
            <div style={{ position: "relative" }}>
              <Phone style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input type="tel" required placeholder="0300-1234567"
                value={form.phone} onChange={(e) => setField("phone", e.target.value)}
                className="sal-input" style={{ paddingLeft: 42, borderColor: errors.phone ? "var(--color-error)" : undefined }} />
            </div>
            {errors.phone && <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}><AlertCircle style={{ width: 11, height: 11 }} />{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="sal-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input type={showPass ? "text" : "password"} required placeholder="Min 8 chars, uppercase & number"
                value={form.password} onChange={(e) => setField("password", e.target.value)}
                className="sal-input" style={{ paddingLeft: 42, paddingRight: 44, borderColor: errors.password ? "var(--color-error)" : undefined }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
                {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
              </button>
            </div>
            {/* Strength bar */}
            {form.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[1,2,3,4].map((n) => (
                    <div key={n} style={{ flex: 1, height: 3, borderRadius: 99, background: passStrength >= n ? strengthColor[passStrength] : "var(--border-light)", transition: "background 0.3s" }} />
                  ))}
                </div>
                <p style={{ fontSize: "0.67rem", color: strengthColor[passStrength], marginTop: 4 }}>
                  {strengthLabel[passStrength]}
                </p>
              </div>
            )}
            {errors.password && <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}><AlertCircle style={{ width: 11, height: 11 }} />{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="sal-label">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
              <input type={showConfirm ? "text" : "password"} required placeholder="Repeat your password"
                value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)}
                className="sal-input" style={{ paddingLeft: 42, paddingRight: 44, borderColor: errors.confirmPassword ? "var(--color-error)" : undefined }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
                {showConfirm ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
              </button>
            </div>
            {errors.confirmPassword && <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--color-error)", marginTop: 5 }}><AlertCircle style={{ width: 11, height: 11 }} />{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            By creating an account you agree to our{" "}
            <span style={{ color: "var(--gold)", cursor: "pointer" }}>Terms of Service</span> and{" "}
            <span style={{ color: "var(--gold)", cursor: "pointer" }}>Privacy Policy</span>.
          </p>

          {/* Submit */}
          <button type="submit" className="sal-btn sal-btn-gold" disabled={loading}
            style={{ marginTop: 4, padding: "15px", fontSize: "0.92rem", justifyContent: "center", opacity: loading ? 0.72 : 1 }}>
            {loading
              ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Creating accountâ€¦</>
              : <><ArrowRight style={{ width: 15, height: 15 }} /> Create Account — Free</>
            }
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 28 }}>
          Already have an account?{" "}
          <Link
            href={redirectTo ? `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}` : ROUTES.LOGIN}
            style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          <button
            type="button"
            onClick={createGuestAccount}
            disabled={guestLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "none",
              background: "transparent",
              color: "var(--gold)",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: guestLoading ? "default" : "pointer",
              opacity: guestLoading ? 0.72 : 1,
              padding: "4px 6px",
            }}
          >
            {guestLoading ? "Creating guest account..." : "Booked as guest? Create guest account"}
            <ArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
        </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <RegisterPageInner />
    </Suspense>
  );
}


