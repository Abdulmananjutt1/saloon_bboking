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
  badgeIcon?: React.ReactNode;
  heading: React.ReactNode;
  subtext: string;
  stats?: StatItem[];
  children?: React.ReactNode;
  align?: "left" | "center";
  size?: "default" | "short";
}

export default function PageHero({
  image,
  imageAlt,
  badge,
  badgeIcon,
  heading,
  subtext,
  stats,
  children,
  align = "center",
  size = "default",
}: PageHeroProps) {
  const isCenter = align === "center";

  return (
    <section
      className={`page-hero-section${size === "short" ? " page-hero-section--short" : ""}`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
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

      <div
        className="hero-decor-orb"
        style={{
          position: "absolute",
          top: "20%",
          right: "28%",
          width: 380,
          height: 380,
          maxWidth: "70vw",
          background: "radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        className="sal-container page-hero-inner"
        style={{ position: "relative", width: "100%" }}
      >
        <div
          className="hero-content"
          style={{
            maxWidth: isCenter ? 680 : 720,
            textAlign: isCenter ? "center" : "left",
            margin: isCenter ? "0 auto" : 0,
          }}
        >
          <div
            className="sal-glass-gold anim-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 99,
              padding: isCenter ? "6px 20px" : "6px 16px",
              marginBottom: 24,
            }}
          >
            {badgeIcon ?? <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />}
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

          <h1
            className="sal-h1 anim-up anim-d2 hero-text-shadow"
            style={{
              marginBottom: 20,
              fontSize: isCenter ? "clamp(2.6rem, 6vw, 4.5rem)" : "clamp(2.6rem, 6vw, 4rem)",
            }}
          >
            {heading}
          </h1>

          <p
            className="anim-up anim-d3"
            style={{
              fontSize: isCenter ? "1rem" : "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              marginBottom: stats || children ? 40 : 0,
              maxWidth: isCenter ? 560 : 600,
              margin: isCenter ? "0 auto 40px" : "0 0 36px",
            }}
          >
            {subtext}
          </p>

          {children && (
            <div
              className="anim-up anim-d4"
              style={{
                marginBottom: stats ? 40 : 0,
                display: "flex",
                justifyContent: isCenter ? "center" : "flex-start",
              }}
            >
              {children}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div
              className="anim-up anim-d4"
              style={{
                display: "flex",
                gap: isCenter ? 36 : 32,
                justifyContent: isCenter ? "center" : "flex-start",
                flexWrap: "wrap",
              }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} style={{ textAlign: isCenter ? "center" : "left" }}>
                  {isCenter ? (
                    <>
                      <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--gold-light)", lineHeight: 1 }}>
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
                    </>
                  ) : (
                    <>
                      <p className="stat-num">{value}</p>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                          color: "var(--text-muted)",
                          marginTop: 4,
                        }}
                      >
                        {label}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
