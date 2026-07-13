"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { APP_NAME, NAV_LINKS, ROUTES, APP_PHONE } from "@/constants";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "./ThemeProvider";
import { getSession } from "@/lib/session";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });

    // Check if user is logged in
    try {
      const u = getSession();
      if (u) {
        const id = requestAnimationFrame(() => setUser(u));
        window.addEventListener("scroll", fn, { passive: true });
        return () => {
          window.removeEventListener("scroll", fn);
          cancelAnimationFrame(id);
        };
      }
    } catch { /* ignore */ }

    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dashboardUrl = user?.role === "ADMIN" || user?.role === "admin" ? ROUTES.ADMIN : ROUTES.DASHBOARD;

  return (
    <>
      {/* Floating Theme Toggle */}
      <button
        onClick={toggle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 100,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "1px solid var(--border-light)",
          background: theme === "dark" ? "rgba(13,12,10,0.95)" : "rgba(253,248,242,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 4px 16px rgba(201,151,59,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.3), 0 6px 20px rgba(201,151,59,0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.2), 0 4px 16px rgba(201,151,59,0.15)";
        }}
      >
        {theme === "dark"
          ? <Sun style={{ width: "22px", height: "22px", color: "var(--gold)" }} />
          : <Moon style={{ width: "22px", height: "22px", color: "var(--gold)" }} />
        }
      </button>

      {/* Responsive styles for floating theme toggle */}
      <style>{`
        @media (max-width: 768px) {
          button[aria-label*="Switch to"] {
            width: 44px !important;
            height: 44px !important;
            right: 16px !important;
            bottom: 16px !important;
          }
          button[aria-label*="Switch to"] svg {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>

      {/* Main Navbar */}
      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 50,
        width: "100%", maxWidth: "100%",
        transition: "all 0.4s ease",
        background: scrolled
          ? (theme === "dark" ? "rgba(13,12,10,0.95)" : "rgba(253,248,242,0.95)")
          : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-light)" : "none",
        boxShadow: scrolled
          ? (theme === "dark" ? "0 4px 30px rgba(0,0,0,0.5)" : "0 4px 30px rgba(0,0,0,0.08)")
          : "none",
      }}>
      <div className="sal-container">
        <div className="navbar-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 80 }}>

          {/* ── Logo ── */}
          <Link href={ROUTES.HOME} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <Logo size={60} />
            <div className="navbar-logo-text">
              <p style={{
                fontSize: "1.1rem", fontWeight: 900, letterSpacing: "-0.02em",
                background: "var(--grad-gold)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {APP_NAME}
              </p>
              <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.3em", color: !scrolled ? "#6e6456" : "var(--text-muted)", marginTop: -2 }}>
                Salon &amp; Spa
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav style={{ display: "none", alignItems: "center", gap: 4 }} className="lg-nav">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "8px 16px", fontSize: "0.82rem", fontWeight: 500,
                  color: !scrolled ? "#b8a98a" : "var(--text-secondary)", textDecoration: "none",
                  borderRadius: 8, transition: "all 0.2s ease",
                  textTransform: "uppercase", letterSpacing: "0.08em"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#e0b96a";
                  (e.currentTarget as HTMLElement).style.background = "rgba(201,151,59,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = !scrolled ? "#b8a98a" : "var(--text-secondary)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── CTA area ── */}
          <div style={{ display: "none", alignItems: "center", gap: 16 }} className="lg-cta">
            <a href={`tel:${APP_PHONE}`} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.75rem", color: !scrolled ? "#c4b49a" : "var(--text-secondary)", textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "#e0b96a"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = !scrolled ? "#c4b49a" : "var(--text-secondary)"}
            >
              <Phone style={{ width: 13, height: 13 }} /> {APP_PHONE}
            </a>
            <div style={{ width: 1, height: 18, background: "var(--border-light)" }} />
            {user ? (
              <Link href={dashboardUrl} className="sal-btn sal-btn-outline" style={{ padding: "9px 20px", fontSize: "0.78rem" }}>
                Dashboard
              </Link>
            ) : (
              <Link href={ROUTES.LOGIN} style={{
                fontSize: "0.8rem", fontWeight: 500,
                color: !scrolled ? "#b8a98a" : "var(--text-secondary)",
                padding: "8px 14px", borderRadius: 8, textDecoration: "none",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#f5f0e8";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = !scrolled ? "#b8a98a" : "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
              >
                Sign In
              </Link>
            )}
            <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "10px 22px", fontSize: "0.78rem" }}>
              Book Now
            </Link>
          </div>

          {/* ── Mobile toggle only ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{
                padding: "8px", borderRadius: 8, border: "1px solid var(--border-light)",
                background: "transparent", cursor: "pointer",
                color: "var(--text-secondary)", transition: "all 0.2s"
              }}
              className="mobile-toggle"
            >
              {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {open && (
          <div style={{
            borderTop: "1px solid var(--border-light)",
            paddingBlock: 16,
            background: theme === "dark" ? "rgba(13,12,10,0.98)" : "rgba(253,248,242,0.98)",
            backdropFilter: "blur(24px)"
          }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block", padding: "11px 16px",
                  fontSize: "0.85rem", fontWeight: 500,
                  color: "var(--text-secondary)", textDecoration: "none",
                  borderRadius: 8, marginBottom: 2,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  transition: "all 0.2s"
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ paddingTop: 14, borderTop: "1px solid var(--border-light)", marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {user ? (
                <Link
                  href={dashboardUrl}
                  onClick={() => setOpen(false)}
                  className="sal-btn sal-btn-outline"
                  style={{ width: "100%", justifyContent: "center", padding: "11px" }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href={ROUTES.LOGIN}
                  onClick={() => setOpen(false)}
                  className="sal-btn sal-btn-ghost"
                  style={{ width: "100%", justifyContent: "center", padding: "11px" }}
                >
                  Sign In
                </Link>
              )}
              <Link
                href={ROUTES.BOOK}
                onClick={() => setOpen(false)}
                className="sal-btn sal-btn-gold"
                style={{ width: "100%", justifyContent: "center", padding: "12px" }}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Inline responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-nav { display: flex !important; }
          .lg-cta { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 640px) {
          .navbar-logo-text { display: none !important; }
          .navbar-inner { height: 64px !important; }
        }
      `}</style>
      </header>
    </>
  );
}
