import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { ROUTES, APP_PHONE } from "@/constants";

const PARTICLES = [
  { left: "15%", top: "70%", delay: "0s", dur: "7s", size: 3 },
  { left: "25%", top: "60%", delay: "1.5s", dur: "9s", size: 2 },
  { left: "40%", top: "75%", delay: "3s", dur: "8s", size: 4 },
  { left: "55%", top: "65%", delay: "0.8s", dur: "11s", size: 2 },
  { left: "70%", top: "80%", delay: "2s", dur: "6s", size: 3 },
  { left: "80%", top: "55%", delay: "4s", dur: "10s", size: 2 },
];

export default function HomeHero() {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          alt="Beauty Salon"
          fill
          className="object-cover hero-bg-zoom"
          priority
        />
        <div className="hero-overlay-grad" style={{ position: "absolute", inset: 0 }} />
        <div className="hero-overlay-bottom" style={{ position: "absolute", inset: 0 }} />
      </div>

      <div
        className="hero-decor-orb"
        style={{
          position: "absolute",
          top: "20%",
          right: "30%",
          width: 400,
          height: 400,
          maxWidth: "80vw",
          background: "radial-gradient(circle, rgba(201,151,59,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}

      <div
        className="sal-container hero-section-text"
        style={{ position: "relative", paddingTop: 120, paddingBottom: 80, width: "100%" }}
      >
        <div style={{ maxWidth: 620 }}>
          <div
            className="sal-glass-gold anim-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 99,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--gold-light)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              Islamabad&apos;s #1 Premium Salon
            </span>
          </div>

          <p
            className="sal-eyebrow anim-up anim-d1"
            style={{
              fontSize: "1.1rem",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: "0.05em",
              fontWeight: 400,
              color: "var(--gold-light)",
              marginBottom: 16,
            }}
          >
            Welcome
          </p>

          <h1
            className="sal-h1 anim-up anim-d2 hero-text-shadow"
            style={{ marginBottom: 24, fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
          >
            Beauty Salon
            <br />
            <span className="text-gold">Fashion for</span>
            <br />
            Women
          </h1>

          <p
            className="anim-up anim-d3"
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: 36,
              maxWidth: 500,
            }}
          >
            Experience luxury salon services from our expert stylists. Haircut, makeup, color, facial,
            massage and more — all under one roof in Islamabad.
          </p>

          <div className="anim-up anim-d3" style={{ display: "flex", gap: 32, marginBottom: 36, flexWrap: "wrap" }}>
            <a
              href={`tel:${APP_PHONE}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--text-secondary)",
                fontSize: "0.82rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "var(--grad-gold-btn)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone style={{ width: 15, height: 15, color: "#0d0c0a" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                  }}
                >
                  Call Us
                </p>
                <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{APP_PHONE}</p>
              </div>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.82rem" }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "rgba(201,151,59,0.12)",
                  border: "1px solid rgba(201,151,59,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPin style={{ width: 15, height: 15, color: "var(--gold)" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                  }}
                >
                  Location
                </p>
                <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>F-7 Markaz, Islamabad</p>
              </div>
            </div>
          </div>

          <div className="anim-up anim-d4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold">
              <Calendar style={{ width: 16, height: 16 }} />
              Book Appointment
            </Link>
            <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-outline">
              Explore Services
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
