import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarRating from "@/components/ui/StarRating";
import ScrollReveal from "@/components/ScrollReveal";
import { ROUTES, APP_PHONE } from "@/constants";
import { SERVICES, STYLISTS, REVIEWS } from "@/lib/data/salon";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  Scissors, Clock, Phone, MapPin, ChevronRight,
  Sparkles, Crown, Zap, Calendar,
  Award, ArrowRight, Quote, Star
} from "lucide-react";

export default function HomePage() {
  const popularServices = SERVICES.filter((s) => s.popular).slice(0, 6);
  const featuredStylists = STYLISTS.slice(0, 4);

  const pricingList = [
    { name: "Haircut & Style", duration: "60 min", price: "Rs 2,500" },
    { name: "Beard Grooming", duration: "45 min", price: "Rs 1,500" },
    { name: "Hair Color", duration: "120 min", price: "Rs 5,500" },
    { name: "Gold Facial", duration: "75 min", price: "Rs 4,500" },
    { name: "Deep Massage", duration: "60 min", price: "Rs 3,500" },
    { name: "Bridal Package", duration: "240 min", price: "Rs 25,000" },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80",
  ];

  const stats = [
    { value: "25+", label: "Years of Excellence", icon: Award },
    { value: "8,500+", label: "Happy Clients", icon: Crown },
    { value: "50+", label: "Premium Services", icon: Sparkles },
    { value: "4.9★", label: "Average Rating", icon: Star },
  ];

  const processSteps = [
    { num: "01", title: "Choose Service", desc: "Browse our 50+ luxury treatments and pick the one you love." },
    { num: "02", title: "Pick a Stylist", desc: "Select from our team of certified master stylists." },
    { num: "03", title: "Book a Slot", desc: "Pick your preferred date and time — confirmed in seconds." },
    { num: "04", title: "Enjoy & Glow", desc: "Sit back and let our experts work their magic on you." },
  ];

  return (
    <>
      <ScrollReveal />
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* BG image */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
              alt="Beauty Salon"
              fill
              className="object-cover hero-bg-zoom"
              priority
            />
            {/* Dark gradient overlay */}
            <div className="hero-overlay-grad" style={{ position: "absolute", inset: 0 }} />
            <div className="hero-overlay-bottom" style={{ position: "absolute", inset: 0 }} />
          </div>

          {/* Gold glow orbs */}
          <div style={{
            position: "absolute", top: "20%", right: "30%",
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(201,151,59,0.08) 0%, transparent 70%)",
            borderRadius: "50%", pointerEvents: "none"
          }} />

          {/* Floating gold particles */}
          {[
            { left: "15%", top: "70%", delay: "0s",   dur: "7s",  size: 3 },
            { left: "25%", top: "60%", delay: "1.5s", dur: "9s",  size: 2 },
            { left: "40%", top: "75%", delay: "3s",   dur: "8s",  size: 4 },
            { left: "55%", top: "65%", delay: "0.8s", dur: "11s", size: 2 },
            { left: "70%", top: "80%", delay: "2s",   dur: "6s",  size: 3 },
            { left: "80%", top: "55%", delay: "4s",   dur: "10s", size: 2 },
          ].map((p, i) => (
            <div key={i} className="hero-particle" style={{
              left: p.left, top: p.top,
              width: p.size, height: p.size,
              animationDelay: p.delay, animationDuration: p.dur,
            }} />
          ))}

          {/* Content */}
          <div className="sal-container hero-section-text" style={{ position: "relative", paddingTop: 120, paddingBottom: 80, width: "100%" }}>
            <div style={{ maxWidth: 620 }}>

              {/* Top badge */}
              <div className="sal-glass-gold anim-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 99, padding: "6px 16px", marginBottom: 24
              }}>
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Islamabad&apos;s #1 Premium Salon
                </span>
              </div>

              {/* Welcome text */}
              <p className="sal-eyebrow anim-up anim-d1" style={{ fontSize: "1.1rem", fontStyle: "italic", textTransform: "none", letterSpacing: "0.05em", fontWeight: 400, color: "var(--gold-light)", marginBottom: 16 }}>
                Welcome
              </p>

              {/* Main heading */}
              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 24, fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
                Beauty Salon<br />
                <span className="text-gold">Fashion for</span><br />
                Women
              </h1>

              <p className="anim-up anim-d3" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36, maxWidth: 500 }}>
                Experience luxury salon services from our expert stylists. Haircut, makeup, color, facial, massage and more — all under one roof in Islamabad.
              </p>

              {/* Contact row */}
              <div className="anim-up anim-d3" style={{ display: "flex", gap: 32, marginBottom: 36, flexWrap: "wrap" }}>
                <a href={`tel:${APP_PHONE}`} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.82rem", textDecoration: "none" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Phone style={{ width: 15, height: 15, color: "#0d0c0a" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>Call Us</p>
                    <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{APP_PHONE}</p>
                  </div>
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "rgba(201,151,59,0.12)", border: "1px solid rgba(201,151,59,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <MapPin style={{ width: 15, height: 15, color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>Location</p>
                    <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>F-7 Markaz, Islamabad</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold">
                  <Calendar style={{ width: 16, height: 16 }} />
                  Book Appointment
                </Link>
                <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-outline">
                  Explore Services
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </div>
            </div>
          </div>

          {/* Floating stats card */}
          <div className="anim-float" style={{
            display: "none",
            position: "absolute", right: 80, bottom: 80,
            padding: 24, borderRadius: 18,
            background: "rgba(20,18,16,0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(201,151,59,0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
          }}>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 4 }}>Appointment Booked</p>
              <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem" }}>Signature Haircut · 3:00 PM</p>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[["25+", "Years"], ["999", "Clients"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <p className="stat-num" style={{ fontSize: "1.4rem" }}>{v}</p>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            GOLD TICKER STRIP
        ══════════════════════════════════════ */}
        <div className="gold-ticker-strip">
          <div className="gold-ticker-inner">
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {["PREMIUM SALON EXPERIENCE", "EXPERT STYLISTS", "BOOK ONLINE INSTANTLY", "LUXURY SERVICES", "F-7 MARKAZ ISLAMABAD", "CERTIFIED PROFESSIONALS"].map((text, j) => (
                  <span key={j} className="gold-ticker-item">
                    <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>✦</span>
                    {text}
                    <span className="gold-ticker-dot" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            ABOUT / WHY CHOOSE US
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>

              {/* Left — Image */}
              <div className="reveal-left" style={{ position: "relative" }}>
                <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 500 }}>
                  <Image
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                    alt="Our salon"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.5) 0%, transparent 60%)" }} />
                </div>
                {/* Floating badge */}
                <div className="sal-glass-gold" style={{
                  position: "absolute", bottom: -20, right: -20,
                  padding: "16px 20px", borderRadius: 16,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "var(--grad-gold-btn)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Crown style={{ width: 22, height: 22, color: "#0d0c0a" }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>Premium Quality</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Only finest products</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Text */}
              <div className="reveal-right">
                <span className="sal-eyebrow">About Us</span>
                <h2 className="sal-h2" style={{ marginBottom: 16, lineHeight: 1.15 }}>
                  Why People<br />
                  <span className="text-gold">Choose Us!</span>
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.85, marginBottom: 32 }}>
                  We blend artistry with luxury to create an environment where every visit feels like a special occasion. Our expert team uses only premium products to deliver results that exceed expectations every single time.
                </p>
                {/* Stats row */}
                <div className="reveal-stagger" style={{ display: "flex", gap: 36, marginBottom: 36, flexWrap: "wrap" }}>
                  <div className="reveal-child">
                    <p className="stat-num" data-count="25" data-suffix="+">25+</p>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginTop: 4 }}>Years Experience</p>
                  </div>
                  <div className="reveal-child" style={{ width: 1, background: "var(--border-light)" }} />
                  <div className="reveal-child">
                    <p className="stat-num" data-count="999" data-suffix="+">999+</p>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginTop: 4 }}>Happy Clients</p>
                  </div>
                  <div className="reveal-child" style={{ width: 1, background: "var(--border-light)" }} />
                  <div className="reveal-child">
                    <p className="stat-num" data-count="4.9" data-suffix="★">4.9★</p>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", marginTop: 4 }}>Avg. Rating</p>
                  </div>
                </div>

                {/* Features list */}
                <div className="reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                  {[
                    { icon: Crown, text: "Expert master stylists with international certification" },
                    { icon: Sparkles, text: "Premium Loreal, Wella & Kerastase products only" },
                    { icon: Zap, text: "Instant online booking — confirmed in seconds" },
                    { icon: Award, text: "15+ years serving Islamabad's most discerning clients" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="reveal-child" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <Icon style={{ width: 16, height: 16, color: "var(--gold)" }} />
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{text}</p>
                    </div>
                  ))}
                </div>

                <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold">
                  Book Now
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            OUR SERVICES
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Our Services</span>
              <h2 className="sal-h2" style={{ marginBottom: 14 }}>
                Explore Our <span className="text-gold">Services</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 480, margin: "0 auto" }}>
                From classic cuts to luxury bridal packages — everything to make you look and feel your absolute best.
              </p>
            </div>

            <div className="reveal-stagger" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24
            }}>
              {popularServices.map((service) => (
                <Link
                  key={service.id}
                  href={`${ROUTES.SERVICES}/${service.id}`}
                  className="sal-card reveal-child"
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

            <div className="reveal" style={{ textAlign: "center", marginTop: 44 }}>
              <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-outline">
                View All Services
                <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            LUXURY BRANDS
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "80px 0", overflow: "hidden" }}>
          <div className="sal-container">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Luxury Brands We Use</span>
              <h2 className="sal-h2">
                Only <span className="text-gold">Premium</span> Products
              </h2>
            </div>
          </div>

          {/* Infinite scroll track */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* fade edges */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 120,
              background: "linear-gradient(to right, var(--bg-secondary), transparent)",
              zIndex: 2, pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 120,
              background: "linear-gradient(to left, var(--bg-secondary), transparent)",
              zIndex: 2, pointerEvents: "none"
            }} />

            <div className="brands-track">
              {(() => {
                const brands: { name: string; sub: string; svg: React.ReactNode }[] = [
                  {
                    name: "MOROCCANOIL", sub: "Moroccanoil",
                    svg: (
                      <svg viewBox="0 0 160 36" width="120" height="27" fill="none">
                        <text x="0" y="26" fontFamily="Georgia,serif" fontWeight="700" fontSize="22" fill="currentColor" letterSpacing="1">moroccanoil</text>
                      </svg>
                    ),
                  },
                  {
                    name: "GHD", sub: "GHD",
                    svg: (
                      <svg viewBox="0 0 80 44" width="60" height="33" fill="none">
                        <text x="0" y="36" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="40" fill="currentColor" letterSpacing="-1">ghd</text>
                      </svg>
                    ),
                  },
                  {
                    name: "L'ORÉAL", sub: "L'Oréal",
                    svg: (
                      <svg viewBox="0 0 130 36" width="110" height="30" fill="none">
                        <text x="0" y="26" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="currentColor" letterSpacing="2">L&apos;ORÉAL</text>
                      </svg>
                    ),
                  },
                  {
                    name: "WELLA", sub: "Wella",
                    svg: (
                      <svg viewBox="0 0 100 36" width="85" height="30" fill="none">
                        <text x="0" y="26" fontFamily="Georgia,serif" fontWeight="700" fontSize="28" fill="currentColor" letterSpacing="3">Wella</text>
                      </svg>
                    ),
                  },
                  {
                    name: "KÉRASTASE", sub: "Kérastase",
                    svg: (
                      <svg viewBox="0 0 160 36" width="130" height="28" fill="none">
                        <text x="0" y="25" fontFamily="Georgia,serif" fontWeight="400" fontSize="22" fill="currentColor" letterSpacing="4">KÉRASTASE</text>
                      </svg>
                    ),
                  },
                  {
                    name: "SCHWARZKOPF", sub: "Schwarzkopf",
                    svg: (
                      <svg viewBox="0 0 180 36" width="140" height="28" fill="none">
                        <text x="0" y="25" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="20" fill="currentColor" letterSpacing="1">SCHWARZKOPF</text>
                      </svg>
                    ),
                  },
                  {
                    name: "MATRIX", sub: "Matrix",
                    svg: (
                      <svg viewBox="0 0 120 36" width="95" height="28" fill="none">
                        <text x="0" y="26" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="currentColor" letterSpacing="4">MATRIX</text>
                      </svg>
                    ),
                  },
                  {
                    name: "REVLON", sub: "Revlon",
                    svg: (
                      <svg viewBox="0 0 120 36" width="95" height="28" fill="none">
                        <text x="0" y="26" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="currentColor" letterSpacing="3">REVLON</text>
                      </svg>
                    ),
                  },
                  {
                    name: "REDKEN", sub: "Redken",
                    svg: (
                      <svg viewBox="0 0 120 36" width="95" height="28" fill="none">
                        <text x="0" y="26" fontFamily="Georgia,serif" fontWeight="700" fontSize="26" fill="currentColor" letterSpacing="2">Redken</text>
                      </svg>
                    ),
                  },
                ];
                return [...brands, ...brands];
              })().map((brand, i) => (
                <div key={i} className="brand-card">
                  <div className="brand-logo-wrap">
                    {brand.svg}
                  </div>
                  <span className="brand-sub">{brand.sub}</span>
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
              min-width: 150px;
              height: 100px;
              border-radius: 16px;
              background: var(--bg-card);
              border: 1px solid var(--border-light);
              flex-shrink: 0;
              transition: all 0.3s ease;
              cursor: default;
              padding: 16px 20px;
            }
            .brand-card:hover {
              border-color: var(--border-hover);
              box-shadow: 0 8px 30px rgba(201,151,59,0.12);
              transform: translateY(-4px);
            }
            .brand-logo-wrap {
              color: var(--text-secondary);
              opacity: 0.5;
              transition: opacity 0.3s ease, color 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .brand-card:hover .brand-logo-wrap {
              opacity: 1;
              color: var(--text-primary);
            }
            .brand-sub {
              font-size: 0.58rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: var(--text-muted);
              transition: color 0.3s;
            }
            .brand-card:hover .brand-sub { color: var(--gold); }

            [data-theme="light"] .brand-card {
              background: #ffffff;
              border-color: rgba(0,0,0,0.07);
              box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            }
            [data-theme="light"] .brand-card:hover {
              border-color: rgba(184,133,42,0.3);
              box-shadow: 0 8px 28px rgba(184,133,42,0.1);
            }
            [data-theme="light"] .brand-logo-wrap { color: #1a1814; }
            [data-theme="light"] .brand-card:hover .brand-logo-wrap { color: #0d0c0a; }
          `}</style>
        </section>


        {/* ══════════════════════════════════════
            PRICING SECTION — Premium Redesign
        ══════════════════════════════════════ */}
        <section className="pricing-premium-section">
          <style>{`
            .pricing-premium-section {
              position: relative;
              padding: 120px 0;
              background: linear-gradient(160deg, #0a0907 0%, #161109 45%, #0d0c0a 100%);
              overflow: hidden;
            }
            .pricing-premium-section::before {
              content: '';
              position: absolute;
              top: -120px; left: -120px;
              width: 600px; height: 600px;
              background: radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 65%);
              border-radius: 50%;
              pointer-events: none;
            }
            .pricing-premium-section::after {
              content: '';
              position: absolute;
              bottom: -80px; right: -80px;
              width: 500px; height: 500px;
              background: radial-gradient(circle, rgba(201,151,59,0.05) 0%, transparent 65%);
              border-radius: 50%;
              pointer-events: none;
            }
            .pricing-bg-text {
              position: absolute;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              font-size: clamp(6rem, 16vw, 16rem);
              font-weight: 900;
              color: rgba(201,151,59,0.03);
              letter-spacing: -0.05em;
              white-space: nowrap;
              pointer-events: none;
              user-select: none;
              font-family: var(--font-display), Georgia, serif;
              line-height: 1;
            }
            .pricing-card {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 20px;
              padding: 20px 24px;
              border-radius: 16px;
              background: rgba(255,255,255,0.02);
              border: 1px solid rgba(201,151,59,0.12);
              transition: all 0.3s ease;
            }
            .pricing-card:hover {
              background: rgba(201,151,59,0.06);
              border-color: rgba(201,151,59,0.35);
              transform: translateY(-3px);
              box-shadow: 0 16px 40px rgba(201,151,59,0.1);
            }
            .pricing-num-box {
              width: 44px; height: 44px;
              border-radius: 12px;
              background: rgba(201,151,59,0.1);
              border: 1px solid rgba(201,151,59,0.2);
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
              transition: all 0.3s;
            }
            .pricing-card:hover .pricing-num-box {
              background: rgba(201,151,59,0.18);
              border-color: rgba(201,151,59,0.4);
            }
            .pricing-price-pill {
              padding: 6px 16px;
              border-radius: 99px;
              background: rgba(201,151,59,0.1);
              border: 1px solid rgba(201,151,59,0.25);
              flex-shrink: 0;
              transition: all 0.3s;
            }
            .pricing-card:hover .pricing-price-pill {
              background: rgba(201,151,59,0.18);
              border-color: rgba(201,151,59,0.45);
            }
            .pricing-discount-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 24px;
              padding: 32px 40px;
              border-radius: 24px;
              background: linear-gradient(135deg, rgba(201,151,59,0.1) 0%, rgba(201,151,59,0.04) 100%);
              border: 1px solid rgba(201,151,59,0.25);
              position: relative;
              overflow: hidden;
            }
            .pricing-discount-bar::before {
              content: '';
              position: absolute;
              top: 0; left: -60%;
              width: 40%; height: 100%;
              background: linear-gradient(to right, transparent, rgba(201,151,59,0.08), transparent);
              animation: ribbonSlide 4s ease-in-out infinite;
              pointer-events: none;
            }
            .pricing-pulse-ring {
              position: absolute;
              inset: -5px;
              border-radius: 50%;
              border: 2px solid rgba(201,151,59,0.35);
              animation: pulseGold 2.5s ease-in-out infinite;
            }
            @media (max-width: 640px) {
              .pricing-discount-bar { padding: 24px 20px; }
            }
          `}</style>

          {/* Watermark text */}
          <div className="pricing-bg-text" aria-hidden="true">PRICING</div>

          <div className="sal-container" style={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
              <span className="sal-eyebrow">Transparent Pricing</span>
              <h2 className="sal-h2" style={{ marginBottom: 16 }}>
                Our <span className="text-gold">Service Rates</span>
              </h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(to right, transparent, rgba(201,151,59,0.4))" }} />
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(to left, transparent, rgba(201,151,59,0.4))" }} />
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 460, margin: "0 auto" }}>
                Premium quality at honest prices. No hidden charges — what you see is what you pay.
              </p>
            </div>

            {/* Pricing cards grid */}
            <div className="reveal-stagger" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
              marginBottom: 40,
            }}>
              {pricingList.map((item, i) => (
                <div key={i} className="pricing-card reveal-child">
                  {/* Left */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="pricing-num-box">
                      <span style={{
                        fontSize: "0.72rem", fontWeight: 800, color: "var(--gold)",
                        fontFamily: "var(--font-display), Georgia, serif",
                      }}>
                        0{i + 1}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem", marginBottom: 3 }}>
                        {item.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock style={{ width: 11, height: 11, color: "var(--gold)" }} />
                        <span style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right */}
                  <div className="pricing-price-pill">
                    <span style={{
                      fontWeight: 800, color: "var(--gold-light)", fontSize: "0.9rem",
                      fontFamily: "var(--font-display), Georgia, serif",
                      letterSpacing: "0.02em",
                    }}>
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount bar */}
            <div className="pricing-discount-bar reveal-zoom">
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Badge circle */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "var(--grad-gold-btn)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 30px rgba(201,151,59,0.4)",
                  }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0d0c0a", lineHeight: 1 }}>20%</span>
                  </div>
                  <div className="pricing-pulse-ring" />
                </div>
                {/* Text */}
                <div>
                  <p style={{
                    fontWeight: 800, color: "var(--text-primary)",
                    fontSize: "1.05rem", marginBottom: 6,
                    fontFamily: "var(--font-display), Georgia, serif",
                  }}>
                    First Visit Discount
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    Use code
                    <span style={{
                      display: "inline-block", padding: "2px 12px", borderRadius: 6,
                      background: "rgba(201,151,59,0.15)", border: "1px solid rgba(201,151,59,0.4)",
                      color: "var(--gold-light)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.12em",
                    }}>
                      GLAM20
                    </span>
                    on your first booking
                  </p>
                </div>
              </div>

              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "14px 36px", fontSize: "0.85rem", flexShrink: 0 }}>
                <Calendar style={{ width: 16, height: 16 }} />
                Book &amp; Save 20%
              </Link>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            GALLERY
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div className="reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="sal-eyebrow">Gallery</span>
                <h2 className="sal-h2">Explore Our <span className="text-gold">Gallery</span></h2>
              </div>
              <Link href={ROUTES.GALLERY} className="sal-btn sal-btn-ghost" style={{ padding: "10px 20px", fontSize: "0.78rem" }}>
                Full Gallery <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            {/* 3-column masonry-style grid */}
            <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {/* Large featured image */}
              <div className="gallery-img-wrap reveal-child" style={{ gridRow: "1 / 3", aspectRatio: "auto" }}>
                <div style={{ position: "relative", height: "100%", minHeight: 360 }}>
                  <Image
                    src={galleryImages[0]}
                    alt="Gallery 1"
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  <div className="gallery-overlay">
                    <span style={{ opacity: 0, color: "white", fontWeight: 700, fontSize: "0.85rem", transition: "opacity 0.3s" }}>View</span>
                  </div>
                </div>
              </div>
              {/* Regular images */}
              {galleryImages.slice(1).map((src, i) => (
                <div key={i} className="gallery-img-wrap reveal-child" style={{ aspectRatio: "4/3" }}>
                  <div style={{ position: "relative", height: 200 }}>
                    <Image src={src} alt={`Gallery ${i + 2}`} fill className="object-cover" sizes="25vw" />
                    <div className="gallery-overlay" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            TEAM — Our Experienced Specialists
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Our Team</span>
              <h2 className="sal-h2">Our <span className="text-gold">Experienced</span> Specialists</h2>
            </div>

            <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
              {featuredStylists.map((stylist) => (
                <div key={stylist.id} className="team-card reveal-child" style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
                    <Image
                      src={stylist.avatar}
                      alt={stylist.name}
                      fill
                      className="object-cover"
                      style={{ transition: "transform 0.5s ease" }}
                      sizes="25vw"
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.1) 60%, transparent 100%)" }} />
                    {!stylist.available && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "rgba(20,18,16,0.9)", color: "var(--text-muted)",
                        fontSize: "0.65rem", fontWeight: 700,
                        padding: "3px 8px", borderRadius: 6,
                        border: "1px solid var(--border-light)"
                      }}>
                        Unavailable
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    <h3 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem", marginBottom: 4 }}>
                      {stylist.name}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>
                      {stylist.role}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
                      <StarRating rating={stylist.rating} size="sm" />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>({stylist.reviewCount})</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5, marginBottom: 16 }}>
                      {stylist.specialties.map((sp) => (
                        <span key={sp} className="sal-badge sal-badge-gold" style={{ fontSize: "0.62rem" }}>{sp}</span>
                      ))}
                    </div>
                    <Link
                      href={`${ROUTES.BOOK}?stylist=${stylist.id}`}
                      className="sal-btn sal-btn-gold"
                      style={{ width: "100%", padding: "10px 16px", fontSize: "0.75rem" }}
                    >
                      <Scissors style={{ width: 13, height: 13 }} />
                      Book with {stylist.name.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ textAlign: "center", marginTop: 44 }}>
              <Link href={ROUTES.STYLISTS} className="sal-btn sal-btn-outline">
                Meet All Stylists <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">What Clients Say</span>
              <h2 className="sal-h2" style={{ marginBottom: 12 }}>
                Our <span className="text-gold">Happy</span> Clients
              </h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <StarRating rating={4.9} size="md" showLabel />
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>from 8,500+ reviews</span>
              </div>
            </div>

            <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {REVIEWS.map((r) => (
                <div key={r.id} className="testimonial-card reveal-child">
                  {/* Quote icon */}
                  <div style={{ marginBottom: 16 }}>
                    <Quote style={{ width: 28, height: 28, color: "var(--gold)", opacity: 0.5 }} />
                  </div>

                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "var(--grad-gold-btn)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, color: "#0d0c0a", fontSize: "0.85rem", flexShrink: 0
                      }}>
                        {r.customerName[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>{r.customerName}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{r.service}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            BOOK CTA BANNER
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
            <div className="anim-pulse reveal-bounce" style={{
              width: 70, height: 70, borderRadius: 20,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px",
              boxShadow: "0 12px 40px rgba(201,151,59,0.4)"
            }}>
              <Scissors style={{ width: 30, height: 30, color: "#0d0c0a", transform: "rotate(45deg)" }} />
            </div>

            <h2 className="sal-h2 reveal" style={{ marginBottom: 16, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Book Your Appointment<br />
              <span className="text-gold">Today</span>
            </h2>
            <p className="reveal" style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Choose your service, pick your stylist, and select a time that works for you. Takes less than 2 minutes.
            </p>

            <div className="reveal" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "15px 36px", fontSize: "0.88rem" }}>
                <Scissors style={{ width: 17, height: 17 }} />
                Book Now — Free
              </Link>
              <a href={`tel:${APP_PHONE}`} className="sal-btn sal-btn-ghost" style={{ padding: "14px 36px", fontSize: "0.88rem" }}>
                <Phone style={{ width: 16, height: 16 }} />
                Call Us
              </a>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
              <MapPin style={{ width: 13, height: 13, color: "var(--gold)" }} />
              F-7 Markaz, Islamabad
              <span style={{ color: "var(--border)" }}>·</span>
              <Clock style={{ width: 13, height: 13, color: "var(--gold)" }} />
              Mon–Sat 9AM–9PM, Sun 10AM–7PM
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
