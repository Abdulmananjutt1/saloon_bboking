import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES, SERVICE_CATEGORIES } from "@/constants";
import { SERVICES } from "@/lib/data/salon";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Clock, ChevronRight, Scissors, Sparkles, Calendar, ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/types";

export const metadata: Metadata = {
  title: "Services — Glamour Studio",
  description: "Browse all salon services — haircut, beard, color, facial, massage & more.",
};

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const filtered = cat
    ? SERVICES.filter((s) => s.category === (cat as ServiceCategory))
    : SERVICES;

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>
        {/* ═══════════════��══════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* BG image */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
              alt="Salon Services"
              fill
              className="object-cover"
              style={{ transform: "scale(1.04)" }}
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
            <div style={{ maxWidth: 700, textAlign: "center", margin: "0 auto" }}>

              {/* Top badge */}
              <div className="sal-glass-gold anim-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 99, padding: "6px 20px", marginBottom: 24
              }}>
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Premium Services
                </span>
              </div>

              {/* Main heading */}
              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 20, fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
                Our <span className="text-gold">Services</span>
              </h1>

              <p className="anim-up anim-d3" style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36, maxWidth: 600 }}>
                50+ professional beauty and grooming services for men, women, and everyone in between. 
                Each treatment is crafted to perfection by our expert stylists.
              </p>

              {/* CTA Buttons */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="#services-grid" className="sal-btn sal-btn-gold" style={{ padding: "12px 30px" }}>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                  Explore Services
                </Link>
                <Link href={ROUTES.BOOK} className="sal-btn sal-btn-outline" style={{ padding: "12px 30px" }}>
                  <Calendar style={{ width: 16, height: 16 }} />
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SERVICES GRID
        ══════════════════════════════════════ */}
        <section id="services-grid" style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Our Services</span>
              <h2 className="sal-h2" style={{ marginBottom: 14 }}>
                Explore Our <span className="text-gold">Services</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 480, margin: "0 auto" }}>
                From classic cuts to luxury bridal packages — everything to make you look and feel your absolute best.
              </p>
            </div>

            {/* Category filter */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              marginBottom: 32,
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <Link
                href={ROUTES.SERVICES}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  ...(!cat 
                    ? { 
                        background: "var(--grad-gold-btn)", 
                        color: "#0d0c0a",
                        boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
                      }
                    : { 
                        background: "var(--bg-card)", 
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-light)"
                      }
                  )
                }}
              >
                <Sparkles style={{ width: 12, height: 12 }} />
                All Services
              </Link>
              {SERVICE_CATEGORIES.map((c) => (
                <Link
                  key={c.value}
                  href={`${ROUTES.SERVICES}?cat=${c.value}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    ...(cat === c.value
                      ? { 
                          background: "var(--grad-gold-btn)", 
                          color: "#0d0c0a",
                          boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
                        }
                      : { 
                          background: "var(--bg-card)", 
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-light)"
                        }
                    )
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{c.icon}</span>
                  {c.label}
                </Link>
              ))}
            </div>

            {/* Services count */}
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Showing {filtered.length} {cat ? cat : ""} service{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Services grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24
            }}>
              {filtered.map((service) => (
                <Link
                  key={service.id}
                  href={`${ROUTES.SERVICES}/${service.id}`}
                  className="sal-card"
                  style={{ display: "flex", flexDirection: "column", overflow: "hidden", textDecoration: "none" }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      style={{ transition: "transform 0.5s ease" }}
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 60%)" }} />
                    {service.discountedPrice && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "var(--grad-gold-btn)", color: "#0d0c0a",
                        fontSize: "0.65rem", fontWeight: 800,
                        padding: "3px 10px", borderRadius: 6,
                        textTransform: "uppercase", letterSpacing: "0.1em"
                      }}>
                        SALE
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.15em",
                        color: "var(--gold-light)",
                        background: "rgba(10,9,7,0.7)", padding: "3px 8px", borderRadius: 4
                      }}>
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 className="sal-h3" style={{ marginBottom: 8, fontSize: "1rem", transition: "color 0.2s" }}>
                      {service.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.7, flex: 1, marginBottom: 16 }}>
                      {service.description.slice(0, 85)}…
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        <Clock style={{ width: 13, height: 13, color: "var(--gold)" }} />
                        {formatDuration(service.duration)}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {service.discountedPrice ? (
                          <div>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textDecoration: "line-through", marginRight: 4 }}>
                              {formatPrice(service.price)}
                            </span>
                            <span style={{ fontWeight: 800, color: "var(--gold-light)" }}>
                              {formatPrice(service.discountedPrice)}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 800, color: "var(--gold-light)" }}>
                            {formatPrice(service.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View more services */}
            {filtered.length > 12 && (
              <div style={{ textAlign: "center", marginTop: 44 }}>
                <button style={{
                  background: "transparent",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-secondary)",
                  padding: "10px 24px",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}>
                  Load More Services
                </button>
              </div>
            )}
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
              Book Your Appointment<br />
              <span className="text-gold">Today</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Choose your service, pick your stylist, and select a time that works for you. Takes less than 2 minutes.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "15px 36px", fontSize: "0.88rem" }}>
                <Scissors style={{ width: 17, height: 17 }} />
                Book Now — Free
              </Link>
              <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-ghost" style={{ padding: "14px 36px", fontSize: "0.88rem" }}>
                <ArrowRight style={{ width: 16, height: 16 }} />
                Browse More Services
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 40 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>4.9★</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Avg. Rating</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>50+</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Services</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>8.5K+</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Happy Clients</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>15+</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Expert Stylists</div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
