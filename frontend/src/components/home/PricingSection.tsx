import Link from "next/link";
import { Clock, Sparkles, Calendar } from "lucide-react";
import SectionHeader from "@/components/sections/SectionHeader";
import { PRICING_LIST } from "@/lib/data/home";
import { ROUTES } from "@/constants";

export default function PricingSection() {
  return (
    <section className="pricing-premium-section">
      <style>{`
        .pricing-premium-section {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(160deg, #0a0907 0%, #161109 45%, #0d0c0a 100%);
          overflow: hidden;
        }
        .pricing-premium-section::before {
          content: '';
          position: absolute;
          top: -120px; left: -120px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .pricing-premium-section::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,151,59,0.05) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .pricing-bg-text {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(6rem, 16vw, 16rem);
          font-weight: 900;
          color: rgba(201,151,59,0.03);
          letter-spacing: -0.05em;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          font-family: var(--font-display), Georgia, serif;
          line-height: 1;
        }
        .pricing-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 24px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,151,59,0.12);
          transition: all 0.3s ease;
        }
        .pricing-card:hover {
          background: rgba(201,151,59,0.06);
          border-color: rgba(201,151,59,0.35);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(201,151,59,0.1);
        }
        .pricing-num-box {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(201,151,59,0.1);
          border: 1px solid rgba(201,151,59,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .pricing-card:hover .pricing-num-box {
          background: rgba(201,151,59,0.18);
          border-color: rgba(201,151,59,0.4);
        }
        .pricing-price-pill {
          padding: 6px 16px;
          border-radius: 99px;
          background: rgba(201,151,59,0.1);
          border: 1px solid rgba(201,151,59,0.25);
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .pricing-card:hover .pricing-price-pill {
          background: rgba(201,151,59,0.18);
          border-color: rgba(201,151,59,0.45);
        }
        .pricing-discount-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          padding: 32px 40px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(201,151,59,0.1) 0%, rgba(201,151,59,0.04) 100%);
          border: 1px solid rgba(201,151,59,0.25);
          position: relative;
          overflow: hidden;
        }
        .pricing-discount-bar::before {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(201,151,59,0.08), transparent);
          animation: ribbonSlide 4s ease-in-out infinite;
          pointer-events: none;
        }
        .pricing-pulse-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid rgba(201,151,59,0.35);
          animation: pulseGold 2.5s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .pricing-discount-bar { padding: 24px 20px; }
        }
      `}</style>

      <div className="pricing-bg-text" aria-hidden="true">
        PRICING
      </div>

      <div className="sal-container" style={{ position: "relative", zIndex: 1 }}>
        <SectionHeader
          eyebrow="Transparent Pricing"
          title={
            <>
              Our <span className="text-gold">Service Rates</span>
            </>
          }
          description="Premium quality at honest prices. No hidden charges — what you see is what you pay."
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                flex: 1,
                maxWidth: 80,
                height: 1,
                background: "linear-gradient(to right, transparent, rgba(201,151,59,0.4))",
              }}
            />
            <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
            <div
              style={{
                flex: 1,
                maxWidth: 80,
                height: 1,
                background: "linear-gradient(to left, transparent, rgba(201,151,59,0.4))",
              }}
            />
          </div>
        </SectionHeader>

        <div
          className="reveal-stagger sal-grid"
          style={{ gap: 16, marginBottom: 40 }}
        >
          {PRICING_LIST.map((item, i) => (
            <div key={i} className="pricing-card reveal-child">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div className="pricing-num-box">
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      color: "var(--gold)",
                      fontFamily: "var(--font-display), Georgia, serif",
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem", marginBottom: 3 }}>
                    {item.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock style={{ width: 11, height: 11, color: "var(--gold)" }} />
                    <span style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{item.duration}</span>
                  </div>
                </div>
              </div>
              <div className="pricing-price-pill">
                <span
                  style={{
                    fontWeight: 800,
                    color: "var(--gold-light)",
                    fontSize: "0.9rem",
                    fontFamily: "var(--font-display), Georgia, serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-discount-bar reveal-zoom">
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--grad-gold-btn)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 30px rgba(201,151,59,0.4)",
                }}
              >
                <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0d0c0a", lineHeight: 1 }}>20%</span>
              </div>
              <div className="pricing-pulse-ring" />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontSize: "1.05rem",
                  marginBottom: 6,
                  fontFamily: "var(--font-display), Georgia, serif",
                }}
              >
                First Visit Discount
              </p>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                Use code
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 12px",
                    borderRadius: 6,
                    background: "rgba(201,151,59,0.15)",
                    border: "1px solid rgba(201,151,59,0.4)",
                    color: "var(--gold-light)",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                  }}
                >
                  GLAM20
                </span>
                on your first booking
              </p>
            </div>
          </div>

          <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "14px 36px", fontSize: "0.85rem", flexShrink: 0 }}>
            <Calendar style={{ width: 16, height: 16 }} />
            Book &amp; Save 20%
          </Link>
        </div>
      </div>
    </section>
  );
}
