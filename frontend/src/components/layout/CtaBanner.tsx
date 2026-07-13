import Link from "next/link";
import { Scissors } from "lucide-react";
import { ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";

export interface CtaButton {
  label: string;
  href: string;
  variant?: "gold" | "outline" | "ghost";
  icon?: React.ReactNode;
  external?: boolean;
}

export interface CtaBannerProps {
  heading: React.ReactNode;
  subtext: string;
  buttons?: CtaButton[];
  footer?: React.ReactNode;
}

const DEFAULT_BUTTONS: CtaButton[] = [
  {
    label: "Book Now — Free",
    href: ROUTES.BOOK,
    variant: "gold",
    icon: <Scissors style={{ width: 17, height: 17 }} />,
  },
];

function CtaButtonLink({ btn }: { btn: CtaButton }) {
  const className = `sal-btn sal-btn-${btn.variant ?? "gold"}`;
  const style = { padding: "15px 36px", fontSize: "0.88rem" };

  if (btn.external) {
    return (
      <a href={btn.href} className={className} style={style}>
        {btn.icon}
        {btn.label}
      </a>
    );
  }

  return (
    <Link href={btn.href} className={className} style={style}>
      {btn.icon}
      {btn.label}
    </Link>
  );
}

export default function CtaBanner({
  heading,
  subtext,
  buttons = DEFAULT_BUTTONS,
  footer,
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

      <div className="sal-container cta-dark-content" style={{ position: "relative", textAlign: "center" }}>
        <Logo
          size={96}
          className="anim-pulse"
          style={{ margin: "0 auto 28px", boxShadow: "0 12px 40px rgba(201,151,59,0.4)" }}
        />

        <h2 className="sal-h2 cta-banner-heading" style={{ marginBottom: 16, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          {heading}
        </h2>
        <p className="cta-banner-subtext" style={{ fontSize: "1rem", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8 }}>
          {subtext}
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: footer ? 28 : 0,
          }}
        >
          {buttons.map((btn) => (
            <CtaButtonLink key={btn.href + btn.label} btn={btn} />
          ))}
        </div>

        {footer && <div className="cta-banner-footer">{footer}</div>}
      </div>
    </section>
  );
}

/** Default home/services CTA */
export function DefaultCtaBanner() {
  return (
    <CtaBanner
      heading={
        <>
          Book Your Appointment
          <br />
          <span className="text-gold">Today</span>
        </>
      }
      subtext="Choose your service, pick your stylist, and select a time that works for you. Takes less than 2 minutes."
      buttons={DEFAULT_BUTTONS}
    />
  );
}
