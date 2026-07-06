import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { ROUTES, APP_PHONE, APP_EMAIL, APP_ADDRESS, APP_HOURS } from "@/constants";
import {
  Phone, Mail, MapPin, Clock, MessageSquare,
  Send, Facebook, Instagram, Youtube,
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
            <div className="hero-content" style={{ maxWidth: 720 }}>
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
                <a href={`tel:${APP_PHONE}`} className="sal-glass hero-chip" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 20px", borderRadius: 12,
                  textDecoration: "none", color: "var(--text-primary)",
                  fontSize: "0.82rem", fontWeight: 600
                }}>
                  <Phone style={{ width: 16, height: 16, color: "var(--gold)" }} />
                  Call Now
                </a>
                <a href={`mailto:${APP_EMAIL}`} className="sal-glass hero-chip" style={{
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

              {/* Contact Info & Social */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

                {/* Section header */}
                <div style={{ marginBottom: 28 }}>
                  <span className="sal-eyebrow">Find Us</span>
                  <h2 className="sal-h2" style={{ marginBottom: 8 }}>Visit Our <span className="text-gold">Salon</span></h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    We&apos;d love to see you in person — or reach out any way you prefer.
                  </p>
                </div>

                {/* Contact cards — 2×2 grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 28
                }}>
                  {[
                    {
                      icon: MapPin,
                      label: "Location",
                      value: APP_ADDRESS,
                      action: "View on Maps",
                      href: "https://maps.google.com/?q=Plot+45+F-7+Markaz+Islamabad",
                      accent: "var(--gold)"
                    },
                    {
                      icon: Phone,
                      label: "Call Us",
                      value: APP_PHONE,
                      action: "Call Now",
                      href: `tel:${APP_PHONE}`,
                      accent: "var(--gold)"
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: APP_EMAIL,
                      action: "Send Email",
                      href: `mailto:${APP_EMAIL}`,
                      accent: "var(--gold)"
                    },
                    {
                      icon: Clock,
                      label: "Hours",
                      value: APP_HOURS,
                      action: "Book Now",
                      href: ROUTES.BOOK,
                      accent: "var(--gold)"
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className="contact-info-card"
                      style={{ textDecoration: "none" }}
                    >
                      {/* Gold top bar */}
                      <div style={{
                        height: 3,
                        background: "var(--grad-gold-btn)",
                        borderRadius: "var(--r-lg) var(--r-lg) 0 0",
                        opacity: 0,
                        transition: "opacity 0.3s ease"
                      }} className="contact-card-bar" />

                      <div style={{ padding: "20px 20px 18px" }}>
                        {/* Icon */}
                        <div style={{
                          width: 46, height: 46, borderRadius: 12,
                          background: "linear-gradient(135deg, rgba(201,151,59,0.15) 0%, rgba(201,151,59,0.05) 100%)",
                          border: "1px solid rgba(201,151,59,0.25)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 14,
                          transition: "all 0.3s ease"
                        }} className="contact-card-icon">
                          <item.icon style={{ width: 19, height: 19, color: "var(--gold)" }} />
                        </div>

                        {/* Label */}
                        <p style={{
                          fontSize: "0.65rem", fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.18em",
                          color: "var(--text-muted)", marginBottom: 5
                        }}>
                          {item.label}
                        </p>

                        {/* Value */}
                        <p style={{
                          fontSize: "0.8rem", fontWeight: 600,
                          color: "var(--text-primary)", lineHeight: 1.5,
                          marginBottom: 12
                        }}>
                          {item.value}
                        </p>

                        {/* Action link */}
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: "0.7rem", fontWeight: 700,
                          color: "var(--gold)", letterSpacing: "0.05em"
                        }}>
                          {item.action}
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social links — premium style */}
                <div style={{
                  padding: "24px 24px 22px",
                  background: "linear-gradient(135deg, rgba(201,151,59,0.06) 0%, rgba(201,151,59,0.02) 100%)",
                  border: "1px solid rgba(201,151,59,0.15)",
                  borderRadius: "var(--r-lg)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: 3 }}>
                        Follow Our Journey
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Stay inspired with daily transformations
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { icon: Facebook,  label: "Facebook",  cls: "social-btn-fb",  href: "#" },
                        { icon: Instagram, label: "Instagram", cls: "social-btn-ig",  href: "#" },
                        { icon: Twitter,   label: "Twitter",   cls: "social-btn-tw",  href: "#" },
                        { icon: Youtube,   label: "YouTube",   cls: "social-btn-yt",  href: "#" },
                      ].map((s, i) => (
                        <a
                          key={i}
                          href={s.href}
                          aria-label={s.label}
                          className={`social-brand-btn ${s.cls}`}
                        >
                          <s.icon style={{ width: 18, height: 18 }} />
                        </a>
                      ))}
                    </div>
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

            <FaqAccordion />
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

          <div className="sal-container cta-dark-content" style={{ position: "relative", textAlign: "center" }}>
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