import Link from "next/link";
import { Scissors, Phone, MapPin, Clock } from "lucide-react";
import { ROUTES, APP_PHONE } from "@/constants";
import { Logo } from "@/components/ui/Logo";

export default function CtaBanner() {
  return (
    <section
      className="cta-banner-bg"
      style={{
        background: "linear-gradient(135deg, #0d0c0a 0%, #1c1508 40%, #0d0c0a 100%)",
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 400,
          background: "radial-gradient(ellipse, rgba(201,151,59,0.09) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="sal-container" style={{ position: "relative", textAlign: "center" }}>
        <Logo size={96} style={{ margin: "0 auto 28px", boxShadow: "0 12px 40px rgba(201,151,59,0.4)" }} />

        <h2
          style={{ marginBottom: 16, fontSize: "clamp(2rem, 4vw, 3rem)" }}
          className="sal-h2"
        >
          Book Your Appointment
          <br />
          <span className="text-gold">Today</span>
        </h2>

        <p
          style={{ color: "#ffffff", fontSize: "1rem", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.8 }}
        >
          Choose your service, pick your stylist, and select a time that works for you. Takes less
          than 2 minutes.
        </p>

        <div
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}
        >
          <Link
            href={ROUTES.BOOK}
            className="sal-btn sal-btn-gold"
            style={{ padding: "15px 36px", fontSize: "0.88rem" }}
          >
            <Scissors style={{ width: 17, height: 17 }} />
            Book Now — Free
          </Link>
          <a
            href={`tel:${APP_PHONE}`}
            className="sal-btn sal-btn-ghost"
            style={{
              padding: "14px 36px",
              fontSize: "0.88rem",
              color: "#ffffff",
              borderColor: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <Phone style={{ width: 16, height: 16 }} />
            Call Us
          </a>
        </div>

        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <MapPin style={{ width: 13, height: 13, color: "var(--gold)" }} />
          F-7 Markaz, Islamabad
          <span style={{ color: "var(--border)" }}>·</span>
          <Clock style={{ width: 13, height: 13, color: "var(--gold)" }} />
          Mon–Sat 9AM–9PM, Sun 10AM–7PM
        </p>
      </div>
    </section>
  );
}
