import SectionHeader from "@/components/sections/SectionHeader";
import { LUXURY_BRANDS } from "@/lib/data/home";

export default function LuxuryBrandsSection() {
  const brands = [...LUXURY_BRANDS, ...LUXURY_BRANDS];

  return (
    <section style={{ background: "var(--bg-secondary)", padding: "80px 0", overflow: "hidden" }}>
      <div className="sal-container">
        <SectionHeader
          eyebrow="Luxury Brands We Use"
          title={
            <>
              Only <span className="text-gold">Premium</span> Products
            </>
          }
        />
      </div>

      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to right, var(--bg-secondary), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to left, var(--bg-secondary), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="brands-track">
          {brands.map((brand, i) => (
            <div key={i} className="brand-card">
              <div className="brand-logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.img} alt="" />
              </div>
              <span className="brand-name">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .brands-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: brandScroll 36s linear infinite;
          padding: 12px 0;
        }
        .brands-track:hover { animation-play-state: paused; }
        @keyframes brandScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 130px;
          height: 130px;
          border-radius: 16px;
          background: transparent;
          border: none;
          flex-shrink: 0;
          transition: all 0.3s ease;
          cursor: default;
          padding: 8px;
          overflow: hidden;
        }
        .brand-card:hover { transform: translateY(-4px); }
        .brand-logo-wrap {
          width: 100%;
          height: 100%;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 1;
        }
        .brand-logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
          filter: none;
          transition: all 0.4s ease;
        }
        .brand-card:hover .brand-logo-wrap {
          opacity: 1;
          box-shadow: 0 8px 30px rgba(201,151,59,0.25);
        }
        .brand-card:hover .brand-logo-wrap img {
          filter: none;
          transform: scale(1.05);
        }
        .brand-name {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          text-align: center;
          transition: color 0.3s;
        }
        .brand-card:hover .brand-name { color: var(--gold); }
      `}</style>
    </section>
  );
}
