import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GALLERY_IMAGES } from "@/lib/data/salon";
import { ROUTES } from "@/constants";
import { Scissors, Sparkles, ArrowRight, Calendar } from "lucide-react";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — Glamour Studio",
  description: "Browse our portfolio of haircuts, colors, facials, bridal, and nail art.",
};

/* Extra images to fill the grid richly */
const EXTRA = [
  { id: "g10", src: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80", category: "bridal",  caption: "Elegant Bridal Look" },
  { id: "g11", src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", category: "beard",   caption: "Classic Fade" },
  { id: "g12", src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", category: "facial",  caption: "Radiant Skin" },
  { id: "g13", src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", category: "facial",  caption: "Spa Glow" },
  { id: "g14", src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", category: "nails",   caption: "Gel Nail Art" },
  { id: "g15", src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", category: "haircut", caption: "Silk Finish" },
];

const ALL_IMAGES = [...GALLERY_IMAGES, ...EXTRA];

/* Category filters */

/* Masonry layout: defines which cells span 2 columns/rows */
const LARGE_INDICES = new Set([0, 5, 9, 14]);   // these cells get a bigger size

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1600&q=80"
              alt="Glamour Studio Gallery"
              fill
              className="object-cover"
              style={{ transform: "scale(1.04)" }}
              priority
            />
            <div className="hero-overlay-grad" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(10,9,7,0.97) 0%, rgba(10,9,7,0.85) 50%, rgba(10,9,7,0.4) 100%)"
            }} />
            <div className="hero-overlay-bottom" style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(10,9,7,0.9) 0%, transparent 60%)"
            }} />
          </div>

          {/* Gold glow */}
          <div style={{
            position: "absolute", top: "20%", right: "30%",
            width: 380, height: 380,
            background: "radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 70%)",
            borderRadius: "50%", pointerEvents: "none"
          }} />

          <div className="sal-container" style={{ position: "relative", paddingTop: 120, paddingBottom: 80, width: "100%" }}>
            <div className="hero-content" style={{ maxWidth: 680, textAlign: "center", margin: "0 auto" }}>

              {/* Badge */}
              <div className="sal-glass-gold anim-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 99, padding: "6px 20px", marginBottom: 24
              }}>
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Our Portfolio
                </span>
              </div>

              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 20, fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
                Our <span className="text-gold">Gallery</span>
              </h1>

              <p className="anim-up anim-d3" style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
                Every image tells a transformation story. Browse our portfolio of real client work and get inspired for your next visit.
              </p>

              {/* Stats */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 36, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { value: `${ALL_IMAGES.length}+`, label: "Portfolio Shots" },
                  { value: "8.5K+",                 label: "Happy Clients" },
                  { value: "4.9★",                  label: "Avg. Rating" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--gold-light)", lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 4 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            GALLERY SECTION
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">

            {/* Section heading */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Gallery</span>
              <h2 className="sal-h2" style={{ marginBottom: 14 }}>
                Explore Our <span className="text-gold">Work</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 460, margin: "0 auto" }}>
                Real transformations from real clients — every cut, color, and style captured here.
              </p>
            </div>

            {/* Category filter pills + masonry grid — client component for interactivity */}
            <GalleryGrid images={ALL_IMAGES} />

            {/* Inspired CTA inline */}
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: 20 }}>
                Inspired by what you see? Let&apos;s create your transformation.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "12px 30px" }}>
                  <Calendar style={{ width: 16, height: 16 }} />
                  Book Appointment
                </Link>
                <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-outline" style={{ padding: "12px 30px" }}>
                  Explore Services
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════ */}
        <section className="cta-banner-bg" style={{
          background: "linear-gradient(135deg, #0d0c0a 0%, #1c1508 40%, #0d0c0a 100%)",
          padding: "100px 0", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 700, height: 400,
            background: "radial-gradient(ellipse, rgba(201,151,59,0.09) 0%, transparent 65%)",
            pointerEvents: "none"
          }} />

          <div className="sal-container" style={{ position: "relative", textAlign: "center" }}>
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
              Your Transformation<br />
              <span className="text-gold">Starts Today</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Choose your service, pick your stylist, and book your appointment in under 2 minutes.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "15px 36px", fontSize: "0.88rem" }}>
                <Scissors style={{ width: 17, height: 17 }} />
                Book Now — Free
              </Link>
              <Link href={ROUTES.STYLISTS} className="sal-btn sal-btn-ghost" style={{ padding: "14px 36px", fontSize: "0.88rem" }}>
                Meet Our Stylists
                <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
