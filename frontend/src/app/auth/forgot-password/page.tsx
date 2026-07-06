"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Scissors, Mail, Sparkles, CheckCircle, ArrowRight, Gem, Calendar, BadgeCheck } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { authApi } from "@/lib/api";

type Step = "email" | "sent";

export default function ForgotPasswordPage() {
  const [step, setStep]       = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email) as { success: boolean; error?: string };
      if (res.success) {
        setStep("sent");
      }
    } catch {
      // Still show success to avoid revealing whether email exists
      setStep("sent");
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

      {/* ════════════════════════════════
          LEFT — image panel
      ════════════════════════════════ */}
      <div style={{
        flex: 1, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <Image
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&q=80"
          alt="Glamour Studio"
          fill
          className="object-cover"
          priority
        />
        {/* layered dark + gold overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.6) 55%, rgba(10,9,7,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 55%, rgba(201,151,59,0.12) 0%, transparent 65%)" }} />

        {/* Text content */}
        <div style={{ position: "relative", padding: "48px 56px", maxWidth: 500, width: "100%" }}>

          {/* Badge */}
          <div className="sal-glass-gold" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            borderRadius: 99, padding: "6px 18px", marginBottom: 32
          }}>
            <Sparkles style={{ width: 13, height: 13, color: "var(--gold)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Islamabad&apos;s #1 Salon
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 18 }}>
            Your Style.<br />
            <span className="text-gold">Our Expertise.</span>
          </h2>

          <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.85, marginBottom: 44 }}>
            50+ premium beauty &amp; grooming services. Book with our expert stylists in minutes.
          </p>

          {/* Feature rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: Scissors,    text: "Expert certified stylists" },
              { icon: Gem,         text: "Premium Loreal & Wella products" },
              { icon: Calendar,    text: "Instant online booking" },
              { icon: BadgeCheck,  text: "100% satisfaction guarantee" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 18px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)"
              }}>
                <Icon style={{ width: 16, height: 16, color: "var(--gold)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 32, marginTop: 44,
            paddingTop: 32, borderTop: "1px solid rgba(201,151,59,0.2)"
          }}>
            {[["8.5K+", "Clients"], ["4.9★", "Rating"], ["50+", "Services"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.16em", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          RIGHT — form panel
      ════════════════════════════════ */}
      <div style={{
        flex: "0 0 540px", maxWidth: 540, width: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "72px 64px",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-light)",
        overflowY: "auto",
      }}>

        {/* Logo */}
        <Link href={ROUTES.HOME} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          textDecoration: "none", marginBottom: 56
        }}>
          <Logo size={58} />
          <div>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1 }}>{APP_NAME}</p>
            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--text-muted)", marginTop: 2 }}>Premium Salon</p>
          </div>
        </Link>

        {/* ══ STEP 1 — Enter email ══ */}
        {step === "email" && (
          <>
            {/* Mail icon box */}
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 36, marginLeft: "auto", marginRight: "auto",
              boxShadow: "0 12px 40px rgba(201,151,59,0.35)"
            }}>
              <Mail style={{ width: 32, height: 32, color: "#0d0c0a" }} />
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 40 }}>
              <span className="sal-eyebrow">Password Reset</span>
              <h1 className="sal-h2" style={{ fontSize: "2rem", marginBottom: 14 }}>
                Forgot Your <span className="text-gold">Password?</span>
              </h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                No worries — it happens to everyone. Enter the email linked to your account and we&apos;ll send you a secure reset link instantly.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label className="sal-label">Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    width: 15, height: 15, color: "var(--text-muted)"
                  }} />
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sal-input"
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sal-btn sal-btn-gold"
                disabled={loading}
                style={{ padding: "16px", fontSize: "0.92rem", justifyContent: "center", opacity: loading ? 0.72 : 1 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: "2px solid #0d0c0a", borderTopColor: "transparent",
                      display: "inline-block", animation: "spin 0.7s linear infinite"
                    }} />
                    Sending reset link…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    Send Reset Link <ArrowRight style={{ width: 15, height: 15 }} />
                  </span>
                )}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 32 }}>
              Remember your password?{" "}
              <Link href={ROUTES.LOGIN} style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </>
        )}

        {/* ══ STEP 2 — Confirmation ══ */}
        {step === "sent" && (
          <div>
            {/* Success ring + icon */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "rgba(74,222,128,0.1)",
              border: "1.5px solid rgba(74,222,128,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 36,
              boxShadow: "0 0 0 16px rgba(74,222,128,0.04), 0 12px 40px rgba(74,222,128,0.15)"
            }}>
              <CheckCircle style={{ width: 42, height: 42, color: "#4ade80" }} />
            </div>

            <div style={{ marginBottom: 36 }}>
              <span className="sal-eyebrow">Check Your Inbox</span>
              <h1 className="sal-h2" style={{ fontSize: "2rem", marginBottom: 14 }}>
                Reset Link <span className="text-gold">Sent!</span>
              </h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 14 }}>
                We sent a secure password reset link to:
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 10,
                background: "rgba(201,151,59,0.08)",
                border: "1px solid rgba(201,151,59,0.22)"
              }}>
                <Mail style={{ width: 14, height: 14, color: "var(--gold)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)" }}>{email}</span>
              </div>
            </div>

            {/* Steps */}
            <div style={{
              padding: "24px 28px", borderRadius: 16,
              background: "rgba(201,151,59,0.04)",
              border: "1px solid rgba(201,151,59,0.12)",
              marginBottom: 36
            }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 20 }}>
                Next Steps
              </p>
              {[
                "Open the email we just sent you",
                "Click the secure reset link inside",
                "Create a new strong password",
                "Sign in and you're back!",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i === 3 ? 0 : 16 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "var(--grad-gold-btn)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.72rem", fontWeight: 800, color: "#0d0c0a",
                    boxShadow: "0 4px 12px rgba(201,151,59,0.3)"
                  }}>{i + 1}</div>
                  <span style={{ fontSize: "0.87rem", color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link
                href={ROUTES.LOGIN}
                className="sal-btn sal-btn-gold"
                style={{ justifyContent: "center", padding: "15px", fontSize: "0.92rem" }}
              >
                Back to Sign In
              </Link>
              <button
                onClick={() => { setStep("email"); setEmail(""); }}
                className="sal-btn sal-btn-ghost"
                style={{ justifyContent: "center", padding: "14px", fontSize: "0.85rem" }}
              >
                Use a different email
              </button>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 24, lineHeight: 1.75, textAlign: "center" }}>
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => setStep("email")}
                style={{ background: "none", border: "none", color: "var(--gold)", fontWeight: 600, cursor: "pointer", fontSize: "0.78rem", padding: 0 }}
              >
                try again
              </button>.
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
