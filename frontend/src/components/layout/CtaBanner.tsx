// ─────────────────────────────────────────────────────────
//  CtaBanner — Shared bottom CTA section used on public pages
//  (services, stylists, gallery, contact, home)
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import { Scissors } from "lucide-react";
import { ROUTES } from "@/constants";

interface CtaButton {
  label: string;
  href: string;
  variant?: "gold" | "outline" | "ghost";
  icon?: React.ReactNode;
}

interface CtaBannerProps {
  heading: React.ReactNode;        // can have <span className="text-gold">
  subtext: string;
  buttons?: CtaButton[];
  note?: string;
}

const DEFAULT_BUTTONS: CtaButton[] = [
  {
    label: "Book Now — Free",
    href: ROUTES.BOOK,
    variant: "gold",
    icon: <Scissors style={{ width: 17, height: 17 }} />,
  },
];

export default function CtaBanner({
  heading,
  subtext,
  buttons = DEFAULT_BUTTONS,
  note,
}: CtaBannerProps) {
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
      {/* Gold radial glow */}
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
        {/* Gold scissors icon */}
        <div
          className="anim-pulse"
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            background: "var(--grad-gold-btn)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 12px 40px rgba(201,151,59,0.4)",
          }}
        >
          <Scissors style={{ width: 30, height: 30, color: "#0d0c0a", transform: "rotate(45deg)" }} />
        </div>

        <h2 className="sal-h2" style={{ marginBottom: 16, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          {heading}
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            maxWidth: 420,
            margin: "0 auto 40px",
            lineHeight: 1.8,
          }}
        >
          {subtext}
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {buttons.map((btn) => (
            <Link
              key={btn.href + btn.label}
              href={btn.href}
              className={`sal-btn sal-btn-${btn.variant ?? "gold"}`}
              style={{ padding: "15px 36px", fontSize: "0.88rem" }}
            >
              {btn.icon}
              {btn.label}
            </Link>
          ))}
        </div>

        {note && (
          <p
            style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 32 }}
            dangerouslySetInnerHTML={{ __html: note }}
          />
        )}
      </div>
    </section>
  );
}
