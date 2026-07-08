import Image from "next/image";
import Link from "next/link";
import { Crown, Sparkles, Zap, Award, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

const FEATURES = [
  { icon: Crown, text: "Expert master stylists with international certification" },
  { icon: Sparkles, text: "Premium Loreal, Wella & Kerastase products only" },
  { icon: Zap, text: "Instant online booking — confirmed in seconds" },
  { icon: Award, text: "15+ years serving Islamabad's most discerning clients" },
];

export default function AboutSection() {
  return (
    <section style={{ background: "var(--bg-secondary)", padding: "100px 0", overflow: "hidden" }}>
      <div className="sal-container">
        <div className="sal-grid-2col" style={{ gap: 64, alignItems: "center" }}>
          <div className="reveal-left" style={{ position: "relative" }}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 500, maxHeight: "min(500px, 70vw)" }}>
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Our salon"
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(10,9,7,0.5) 0%, transparent 60%)",
                }}
              />
            </div>
            <div
              className="sal-glass-gold about-float-card"
              style={{
                position: "absolute",
                bottom: -20,
                right: -20,
                padding: "16px 20px",
                borderRadius: 16,
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--grad-gold-btn)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Crown style={{ width: 22, height: 22, color: "#0d0c0a" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
                    Premium Quality
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Only finest products</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <span className="sal-eyebrow">About Us</span>
            <h2 className="sal-h2" style={{ marginBottom: 16, lineHeight: 1.15 }}>
              Why People
              <br />
              <span className="text-gold">Choose Us!</span>
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.92rem",
                lineHeight: 1.85,
                marginBottom: 32,
              }}
            >
              We blend artistry with luxury to create an environment where every visit feels like a
              special occasion. Our expert team uses only premium products to deliver results that
              exceed expectations every single time.
            </p>

            <div className="reveal-stagger" style={{ display: "flex", gap: 36, marginBottom: 36, flexWrap: "wrap" }}>
              <div className="reveal-child">
                <p className="stat-num" data-count="25" data-suffix="+">
                  25+
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  Years Experience
                </p>
              </div>
              <div className="reveal-child" style={{ width: 1, background: "var(--border-light)" }} />
              <div className="reveal-child">
                <p className="stat-num" data-count="999" data-suffix="+">
                  999+
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  Happy Clients
                </p>
              </div>
              <div className="reveal-child" style={{ width: 1, background: "var(--border-light)" }} />
              <div className="reveal-child">
                <p className="stat-num" data-count="4.9" data-suffix="★">
                  4.9★
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  Avg. Rating
                </p>
              </div>
            </div>

            <div className="reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="reveal-child" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(201,151,59,0.1)",
                      border: "1px solid rgba(201,151,59,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: 16, height: 16, color: "var(--gold)" }} />
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{text}</p>
                </div>
              ))}
            </div>

            <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold">
              Book Now
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
