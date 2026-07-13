import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ROUTES, APP_PHONE, APP_EMAIL, APP_ADDRESS, APP_HOURS } from "@/constants";

const CONTACT_ITEMS = [
  { icon: MapPin, label: "Location", value: APP_ADDRESS, action: "View on Maps", href: "https://maps.google.com/?q=Plot+45+F-7+Markaz+Islamabad" },
  { icon: Phone, label: "Call Us", value: APP_PHONE, action: "Call Now", href: `tel:${APP_PHONE}` },
  { icon: Mail, label: "Email", value: APP_EMAIL, action: "Send Email", href: `mailto:${APP_EMAIL}` },
  { icon: Clock, label: "Hours", value: APP_HOURS, action: "Book Now", href: ROUTES.BOOK },
];

export default function ContactInfoCards() {
  return (
    <div className="contact-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
      {CONTACT_ITEMS.map((item, i) => (
        <a key={i} href={item.href} className="contact-info-card" style={{ textDecoration: "none" }}>
          <div style={{ height: 3, background: "var(--grad-gold-btn)", borderRadius: "var(--r-lg) var(--r-lg) 0 0", opacity: 0, transition: "opacity 0.3s ease" }} className="contact-card-bar" />
          <div style={{ padding: "20px 20px 18px" }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg, rgba(201,151,59,0.15) 0%, rgba(201,151,59,0.05) 100%)", border: "1px solid rgba(201,151,59,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "all 0.3s ease" }} className="contact-card-icon">
              <item.icon style={{ width: 19, height: 19, color: "var(--gold)" }} />
            </div>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--text-muted)", marginBottom: 5 }}>{item.label}</p>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 12 }}>{item.value}</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.7rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.05em" }}>
              {item.action}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
