import Link from "next/link";
import { APP_NAME, ROUTES, APP_PHONE, APP_EMAIL, APP_ADDRESS, APP_HOURS } from "@/constants";
import { Scissors, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-dark)", borderTop: "1px solid var(--border-light)" }}>
      <style>{`
        .footer-link {
          font-size: 0.82rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
          line-height: 1.6;
        }
        .footer-link:hover { color: var(--gold-light); }
        .footer-social {
          width: 34px; height: 34px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; color: var(--text-muted);
          text-decoration: none; transition: all 0.2s;
        }
        .footer-social:hover { color: var(--gold-light); border-color: var(--border); }
      `}</style>

      {/* Main grid */}
      <div className="sal-container" style={{ padding: "60px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>

          {/* Brand */}
          <div>
            <Link href={ROUTES.HOME} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, textDecoration: "none" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: "var(--grad-gold-btn)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Scissors style={{ width: 16, height: 16, color: "#0d0c0a", transform: "rotate(45deg)" }} />
              </div>
              <span style={{
                fontSize: "1.05rem", fontWeight: 900,
                background: "var(--grad-gold)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                {APP_NAME}
              </span>
            </Link>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.85, marginBottom: 20 }}>
              Premium salon &amp; spa in Islamabad. Expert stylists, luxury products, and an experience that leaves you glowing.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["f", "Facebook"], ["in", "Instagram"], ["yt", "YouTube"], ["tw", "Twitter"]].map(([s, label]) => (
                <a key={s} href="#" aria-label={label} className="footer-social">{s}</a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-secondary)", marginBottom: 20 }}>
              Services
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Haircut & Styling", `${ROUTES.SERVICES}?cat=haircut`],
                ["Beard Grooming", `${ROUTES.SERVICES}?cat=beard`],
                ["Hair Color", `${ROUTES.SERVICES}?cat=color`],
                ["Facial Treatments", `${ROUTES.SERVICES}?cat=facial`],
                ["Bridal Package", `${ROUTES.SERVICES}?cat=bridal`],
                ["Massage & Spa", `${ROUTES.SERVICES}?cat=massage`],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-secondary)", marginBottom: 20 }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Our Stylists", ROUTES.STYLISTS],
                ["Gallery", ROUTES.GALLERY],
                ["About Us", ROUTES.ABOUT],
                ["Contact", ROUTES.CONTACT],
                ["My Bookings", ROUTES.MY_BOOKINGS],
                ["Privacy Policy", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-secondary)", marginBottom: 20 }}>
              Find Us
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <MapPin style={{ width: 14, height: 14, color: "var(--gold)", marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{APP_ADDRESS}</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Phone style={{ width: 14, height: 14, color: "var(--gold)", flexShrink: 0 }} />
                <a href={`tel:${APP_PHONE}`} className="footer-link">{APP_PHONE}</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail style={{ width: 14, height: 14, color: "var(--gold)", flexShrink: 0 }} />
                <a href={`mailto:${APP_EMAIL}`} className="footer-link">{APP_EMAIL}</a>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Clock style={{ width: 14, height: 14, color: "var(--gold)", marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{APP_HOURS}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="sal-container" style={{ padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            Built with <span style={{ color: "var(--gold)" }}>♥</span> in Islamabad
          </p>
        </div>
      </div>
    </footer>
  );
}
