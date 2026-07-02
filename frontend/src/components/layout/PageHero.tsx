// ─────────────────────────────────────────────────────────
//  PageHero — Shared interior page hero section
//  Used on: Services, Stylists, Gallery, Contact pages
// ─────────────────────────────────────────────────────────
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
}

interface PageHeroProps {
  image: string;
  imageAlt: string;
  badge: string;
  heading: React.ReactNode;  // can have <span className="text-gold">
  subtext: string;
  stats?: StatItem[];
  children?: React.ReactNode; // extra content below subtext (e.g. CTA buttons)
}

export default function PageHero({
  image,
  imageAlt,
  badge,
  heading,
  subtext,
  stats,
  children,
}: PageHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          style={{ transform: "scale(1.04)" }}
          priority
        />
        <div
          className="hero-overlay-grad"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(10,9,7,0.97) 0%, rgba(10,9,7,0.85) 50%, rgba(10,9,7,0.4) 100%)",
          }}
        />
        <div
          className="hero-overlay-bottom"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,9,7,0.9) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Gold glow orb */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "28%",
          width: 380,
          height: 380,
          background: "radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="sal-container"
        style={{ position: "relative", paddingTop: 120, paddingBottom: 80, width: "100%" }}
      >
        <div style={{ maxWidth: 680, textAlign: "center", margin: "0 auto" }}>
          {/* Badge */}
          <div
            className="sal-glass-gold anim-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 99,
              padding: "6px 20px",
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
              {badge}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="sal-h1 anim-up anim-d2 hero-text-shadow"
            style={{ marginBottom: 20, fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
          >
            {heading}
          </h1>

          {/* Subtext */}
          <p
            className="anim-up anim-d3"
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: stats || children ? 40 : 0,
              maxWidth: 560,
              margin: "0 auto 40px",
            }}
          >
            {subtext}
          </p>

          {/* Custom children (buttons, etc.) */}
          {children && (
            <div className="anim-up anim-d4" style={{ marginBottom: stats ? 40 : 0 }}>
              {children}
            </div>
          )}

          {/* Stats row */}
          {stats && stats.length > 0 && (
            <div
              className="anim-up anim-d4"
              style={{ display: "flex", gap: 36, justifyContent: "center", flexWrap: "wrap" }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      color: "var(--gold-light)",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      marginTop: 4,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
