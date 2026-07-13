"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { authApi } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Invalid verification link.");

  useEffect(() => {
    if (!token) return;

    authApi.verifyEmail(token)
      .then((res) => {
        const data = res as { success: boolean; message?: string; error?: string };
        if (data.success) {
          setStatus("success");
          setMessage(data.message ?? "Email verified! You can now sign in.");
        } else {
          setStatus("error");
          setMessage(data.error ?? "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 440, width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
        <Link href={ROUTES.HOME} style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 32 }}>
          <Logo size={58} />
          <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem" }}>{APP_NAME}</p>
        </Link>

        {status === "loading" && (
          <>
            <Sparkles style={{ width: 40, height: 40, color: "var(--gold)", margin: "0 auto 20px" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Verifying Email…</h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle style={{ width: 48, height: 48, color: "#4ade80", margin: "0 auto 20px" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Email Verified!</h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
            <Link href={ROUTES.LOGIN} className="sal-btn sal-btn-gold" style={{ display: "inline-flex", justifyContent: "center", padding: "14px 28px", fontSize: "0.9rem" }}>
              Sign In Now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle style={{ width: 48, height: 48, color: "#ef4444", margin: "0 auto 20px" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Verification Failed</h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
            <Link href={ROUTES.LOGIN} style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
