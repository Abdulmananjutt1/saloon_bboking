import Link from "next/link";
import { APP_NAME, ROUTES, APP_PHONE, APP_EMAIL, APP_ADDRESS, APP_HOURS } from "@/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Main grid */}
      <div className="sal-container footer-main">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link href={ROUTES.HOME} className="footer-brand-link">
              <Logo size={54} className="footer-logo" />
              <span className="footer-brand-name">{APP_NAME}</span>
            </Link>
            <p className="footer-desc">
              Premium salon &amp; spa in Islamabad. Expert stylists, luxury products, and an experience that leaves you glowing.
            </p>
            <div className="footer-socials">
              {[["f", "Facebook"], ["in", "Instagram"], ["yt", "YouTube"], ["tw", "Twitter"]].map(([s, label]) => (
                <a key={s} href="#" aria-label={label} className="footer-social">{s}</a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-list">
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
          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
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
          <div className="footer-col">
            <h3 className="footer-heading">Find Us</h3>
            <ul className="footer-contact-list">
              <li>
                <MapPin className="footer-contact-icon" aria-hidden />
                <span>{APP_ADDRESS}</span>
              </li>
              <li>
                <Phone className="footer-contact-icon" aria-hidden />
                <a href={`tel:${APP_PHONE}`} className="footer-link">{APP_PHONE}</a>
              </li>
              <li>
                <Mail className="footer-contact-icon" aria-hidden />
                <a href={`mailto:${APP_EMAIL}`} className="footer-link">{APP_EMAIL}</a>
              </li>
              <li>
                <Clock className="footer-contact-icon" aria-hidden />
                <span>{APP_HOURS}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar">
        <div className="sal-container footer-bottom-inner">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="footer-made">
            Built with <span>♥</span> in Islamabad
          </p>
        </div>
      </div>
    </footer>
  );
}
