import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES, APP_PHONE, APP_EMAIL, APP_ADDRESS, APP_HOURS } from "@/constants";
import {
  Phone, Mail, MapPin, Clock, MessageSquare,
  Send, Check, Facebook, Instagram, Youtube,
  Twitter, Scissors
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — Glamour Studio",
  description: "Get in touch with Islamabad's premier salon. Book appointments, ask questions, or visit us at F-7 Markaz.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* BG image */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
              alt="Contact Us"
              fill
              className="object-cover"
              style={{ transform: "scale(1.05)" }}
              priority
            />
            {/* Dark gradient overlay */}
            <div className="hero-overlay-grad" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(10,9,7,0.97) 0%, rgba(10,9,7,0.85) 50%, rgba(10,9,7,0.45) 100%)"
            }} />
            <div className="hero-overlay-bottom" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(10,9,7,0.9) 0%, transparent 60%)"
            }} />
          </div>

          {/* Content */}
          <div className="sal-container" style={{ position: "relative", paddingTop: 120, paddingBottom: 80, width: "100%" }}>
            <div style={{ maxWidth: 720 }}>
              {/* Top badge */}
              <div className="sal-glass-gold anim-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 99, padding: "6px 16px", marginBottom: 24
              }}>
                <MessageSquare style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  We&apos;re Here to Help
                </span>
              </div>

              {/* Main heading */}
              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 24, fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
                Get in <span className="text-gold">Touch</span><br />
                With Us
              </h1>

              <p className="anim-up anim-d3" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36, maxWidth: 600 }}>
                Questions, bookings, or just want to say hello? Reach out through any channel below. Our team responds within 24 hours, often sooner.
              </p>

              {/* Quick contact chips */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href={`tel:${APP_PHONE}`} className="sal-glass" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 20px", borderRadius: 12,
                  textDecoration: "none", color: "var(--text-primary)",
                  fontSize: "0.82rem", fontWeight: 600
                }}>
                  <Phone style={{ width: 16, height: 16, color: "var(--gold)" }} />
                  Call Now
                </a>
                <a href={`mailto:${APP_EMAIL}`} className="sal-glass" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 20px", borderRadius: 12,
                  textDecoration: "none", color: "var(--text-primary)",
                  fontSize: "0.82rem", fontWeight: 600
                }}>
                  <Mail style={{ width: 16, height: 16, color: "var(--gold)" }} />
                  Email Us
                </a>
                <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ fontSize: "0.82rem", padding: "12px 24px" }}>
                  Book Online
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CONTACT GRID
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>

              {/* Contact Form */}
              <div className="sal-glass" style={{ padding: 40, borderRadius: 20 }}>
                <h2 className="sal-h2" style={{ marginBottom: 8 }}>Send a Message</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 32 }}>
                  Fill out the form and we&apos;ll get back to you ASAP.
                </p>

                <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="sal-label">First Name</label>
                      <input type="text" className="sal-input" placeholder="John" required />
                    </div>
                    <div>
                      <label className="sal-label">Last Name</label>
                      <input type="text" className="sal-input" placeholder="Doe" required />
                    </div>
                  </div>

                  <div>
                    <label className="sal-label">Email Address</label>
                    <input type="email" className="sal-input" placeholder="you@email.com" required />
                  </div>

                  <div>
                    <label className="sal-label">Phone Number</label>
                    <input type="tel" className="sal-input" placeholder="0300-1234567" />
                  </div>

                  <div>
                    <label className="sal-label">Subject</label>
                    <select className="sal-input" style={{ color: "var(--text-primary)", cursor: "pointer" }}>
                      <option value="">Select a topic</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="service">Service Questions</option>
                      <option value="pricing">Pricing & Packages</option>
                      <option value="feedback">Feedback & Reviews</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="sal-label">Message</label>
                    <textarea className="sal-input" rows={4} placeholder="Tell us how we can help..." style={{ resize: "vertical" }} />
                  </div>

                  <button type="submit" className="sal-btn sal-btn-gold" style={{ marginTop: 10 }}>
                    <Send style={{ width: 16, height: 16 }} />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info & Map */}
              <div>
                <h2 className="sal-h2" style={{ marginBottom: 32 }}>Visit Our Salon</h2>

                {/* Contact cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                  {[
                    {
                      icon: MapPin,
                      title: "Our Location",
                      content: APP_ADDRESS,
                      action: "View on Maps",
                      href: "https://maps.google.com/?q=Plot+45+F-7+Markaz+Islamabad"
                    },
                    {
                      icon: Phone,
                      title: "Call Us",
                      content: APP_PHONE,
                      action: "Call Now",
                      href: `tel:${APP_PHONE}`
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      content: APP_EMAIL,
                      action: "Send Email",
                      href: `mailto:${APP_EMAIL}`
                    },
                    {
                      icon: Clock,
                      title: "Hours",
                      content: APP_HOURS,
                      action: "Book Now",
                      href: ROUTES.BOOK
                    },
                  ].map((item, i) => (
                    <div key={i} className="sal-card" style={{ padding: 20, display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <item.icon style={{ width: 18, height: 18, color: "var(--gold)" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: 4 }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
                          {item.content}
                        </p>
                        <a href={item.href} style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gold)", textDecoration: "none" }}>
                          {item.action} →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div>
                  <h3 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Follow Us</h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[
                      { icon: Facebook, label: "Facebook", color: "#1877F2" },
                      { icon: Instagram, label: "Instagram", color: "#E4405F" },
                      { icon: Twitter, label: "Twitter", color: "#1DA1F2" },
                      { icon: Youtube, label: "YouTube", color: "#FF0000" },
                    ].map((social, i) => (
                      <a key={i} href="#" aria-label={social.label} className="footer-social" style={{
                        width: 40, height: 40,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-light)",
                        color: social.color
                      }}>
                        <social.icon style={{ width: 18, height: 18 }} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FAQ SECTION
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Common Questions</span>
              <h2 className="sal-h2" style={{ marginBottom: 14 }}>
                Frequently Asked <span className="text-gold">Questions</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 520, margin: "0 auto" }}>
                Quick answers to questions we often hear from new and returning clients.
              </p>
            </div>

            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {[
                {
                  q: "Do I need to book in advance?",
                  a: "Yes, we recommend booking at least 24–48 hours in advance to secure your preferred time and stylist. Walk-ins are welcome based on availability, but appointments are guaranteed."
                },
                {
                  q: "What's your cancellation policy?",
                  a: "We require 6 hours notice for cancellations or rescheduling. Cancellations within 6 hours may incur a 50% fee. No-shows will be charged full service price."
                },
                {
                  q: "Do you use premium products?",
                  a: "Absolutely. We exclusively use certified, professional-grade products from Loreal, Wella, Kerastase, and other trusted brands. No cheap alternatives."
                },
                {
                  q: "Is parking available?",
                  a: "Yes, we have dedicated parking for clients behind the salon building. Valet service is available during peak hours at no extra cost."
                },
                {
                  q: "Can I bring my own product?",
                  a: "For hygiene and quality assurance, we use only our professional products. If you have specific allergies, please inform us before your appointment."
                },
                {
                  q: "Do you offer bridal packages?",
                  a: "Yes! Our comprehensive bridal package includes hair, makeup, facial, nails, and pre-wedding consultations. Book at least 2–3 months in advance."
                },
              ].map((faq, i) => (
                <div key={i} className="sal-card" style={{ marginBottom: 16, padding: 24, borderRadius: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: "rgba(201,151,59,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Check style={{ width: 12, height: 12, color: "var(--gold)" }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: 8 }}>
                        {faq.q}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════ */}
        <section className="cta-banner-bg" style={{
          background: "linear-gradient(135deg, #0d0c0a 0%, #1c1508 40%, #0d0c0a 100%)",
          padding: "100px 0", position: "relative", overflow: "hidden"
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 700, height: 400,
            background: "radial-gradient(ellipse, rgba(201,151,59,0.09) 0%, transparent 65%)",
            pointerEvents: "none"
          }} />

          <div className="sal-container" style={{ position: "relative", textAlign: "center" }}>
            {/* Icon */}
            <div className="anim-pulse" style={{
              width: 70, height: 70, borderRadius: 20,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px",
              boxShadow: "0 12px 40px rgba(201,151,59,0.4)"
            }}>
              <Scissors style={{ width: 30, height: 30, color: "#0d0c0a", transform: "rotate(45deg)" }} />
            </div>

            <h2 className="sal-h2" style={{ marginBottom: 16, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Ready to Experience<br />
              <span className="text-gold">Premium Salon Care?</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Book your appointment today and discover why 8,500+ clients trust us with their beauty needs.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "15px 36px", fontSize: "0.88rem" }}>
                Book Online Now
              </Link>
              <a href={`tel:${APP_PHONE}`} className="sal-btn sal-btn-outline" style={{ padding: "14px 36px", fontSize: "0.88rem" }}>
                <Phone style={{ width: 16, height: 16 }} />
                Call {APP_PHONE}
              </a>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 32 }}>
              Response time: <span style={{ color: "var(--gold)" }}>Under 2 hours</span> for calls, <span style={{ color: "var(--gold)" }}>24 hours</span> for emails.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}