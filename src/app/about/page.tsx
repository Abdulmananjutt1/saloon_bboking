import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES, STATS, APP_PHONE, APP_EMAIL, APP_ADDRESS } from "@/constants";
import { STYLISTS, REVIEWS } from "@/lib/data/salon";
import {
  Scissors, Phone, MapPin, ChevronRight, Mail,
  Sparkles, Star, Calendar,
  Award, Quote, Heart, Shield, AwardIcon,
  Globe, Target, Coffee
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Glamour Studio",
  description: "Discover the story behind Islamabad's premier salon — expert stylists, luxury products, and a commitment to excellence since 2015.",
};

export default function AboutPage() {
  const featuredStylists = STYLISTS.slice(0, 3);
  const featuredReviews = REVIEWS.slice(0, 4);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* BG image */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
              alt="Our Salon Interior"
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
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Since 2015 · Islamabad's #1
                </span>
              </div>

              {/* Main heading */}
              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 24, fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
                Where Beauty<br />
                <span className="text-gold">Meets Excellence</span>
              </h1>

              <p className="anim-up anim-d3" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36, maxWidth: 600 }}>
                At Glamour Studio, we believe beauty is an art form and self-care is a necessity. For over a decade, we've been transforming clients with precision cuts, vibrant colors, and rejuvenating treatments in a space designed to inspire confidence and relaxation.
              </p>

              {/* Stats row */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {STATS.map((stat, i) => (
                  <div key={i}>
                    <p className="stat-num">{stat.value}</p>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginTop: 4 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            OUR STORY SECTION
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 80, alignItems: "center" }}>

              {/* Left — Text */}
              <div>
                <span className="sal-eyebrow">Our Story</span>
                <h2 className="sal-h2" style={{ marginBottom: 16, lineHeight: 1.15 }}>
                  From a Small Salon<br />
                  <span className="text-gold">To a Premier Destination</span>
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.85, marginBottom: 24 }}>
                  What started as a single-chair salon in 2015 has grown into Islamabad's most sought-after beauty destination. Founded by master stylist Ayesha Khan, our vision was simple: create a space where artistry, luxury, and personalized care come together.
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.85, marginBottom: 32 }}>
                  Today, we're a team of 15+ certified specialists offering 50+ services, but our core philosophy remains unchanged — every client deserves to feel seen, heard, and beautifully transformed.
                </p>

                {/* Founder signature */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "rgba(201,151,59,0.05)", borderRadius: 14, border: "1px solid rgba(201,151,59,0.15)" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "var(--grad-gold-btn)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#0d0c0a", fontSize: "1.2rem"
                  }}>
                    AK
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem" }}>Ayesha Khan</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Founder & Master Stylist</p>
                  </div>
                </div>
              </div>

              {/* Right — Image */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 500 }}>
                  <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w-800&q=80"
                    alt="Our Salon Journey"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.5) 0%, transparent 60%)" }} />
                </div>
                {/* Floating badge */}
                <div className="sal-glass-gold" style={{
                  position: "absolute", bottom: -20, left: -20,
                  padding: "16px 20px", borderRadius: 16,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "var(--grad-gold-btn)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Award style={{ width: 22, height: 22, color: "#0d0c0a" }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>Award Winning</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Best Salon 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            OUR VALUES SECTION
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Our Values</span>
              <h2 className="sal-h2" style={{ marginBottom: 14 }}>
                What <span className="text-gold">Sets Us Apart</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 520, margin: "0 auto" }}>
                Beyond technical skill, we build relationships and trust with every client who walks through our doors.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 }}>
              {[
                {
                  icon: Heart,
                  title: "Personalized Care",
                  description: "Every service is tailored to your unique needs, face shape, and personal style. We listen first, then create.",
                  color: "var(--gold)"
                },
                {
                  icon: Shield,
                  title: "Premium Products",
                  description: "We use only certified, top-tier products — Loreal, Wella, Kerastase — for results that last and shine.",
                  color: "var(--gold-light)"
                },
                {
                  icon: AwardIcon,
                  title: "Expert Certification",
                  description: "All stylists undergo rigorous training and international certification to ensure cutting-edge techniques.",
                  color: "var(--gold)"
                },
                {
                  icon: Globe,
                  title: "Clean & Safe",
                  description: "Our salon maintains the highest standards of hygiene, sterilization, and COVID-safe protocols.",
                  color: "var(--gold-light)"
                },
                {
                  icon: Target,
                  title: "Precision Focus",
                  description: "From a subtle trim to dramatic transformation, every detail is executed with meticulous attention.",
                  color: "var(--gold)"
                },
                {
                  icon: Coffee,
                  title: "Relaxing Experience",
                  description: "Enjoy complimentary refreshments, soothing music, and a stress-free environment from start to finish.",
                  color: "var(--gold-light)"
                },
              ].map((value, i) => (
                <div key={i} className="sal-card" style={{ padding: 32, textAlign: "center" }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px"
                  }}>
                    <value.icon style={{ width: 26, height: 26, color: value.color }} />
                  </div>
                  <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: 12 }}>
                    {value.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            MEET OUR TEAM (Preview)
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="sal-eyebrow">Our Experts</span>
                <h2 className="sal-h2">Meet Our <span className="text-gold">Master Stylists</span></h2>
              </div>
              <Link href={ROUTES.STYLISTS} className="sal-btn sal-btn-outline">
                View All Team <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
              {featuredStylists.map((stylist) => (
                <div key={stylist.id} className="team-card" style={{ textAlign: "center" }}>
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
                      <Star style={{ width: 14, height: 14, color: "var(--gold)" }} />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{stylist.rating} ({stylist.reviewCount})</span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
                      {stylist.bio.slice(0, 80)}…
                    </p>
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
          </div>
        </section>

        {/* ══════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="sal-eyebrow">Client Love</span>
              <h2 className="sal-h2" style={{ marginBottom: 12 }}>
                Stories from <span className="text-gold">Happy Clients</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 520, margin: "0 auto" }}>
                Join 8,500+ satisfied clients who've experienced the Glamour Studio difference.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {featuredReviews.map((review) => (
                <div key={review.id} className="testimonial-card">
                  {/* Quote icon */}
                  <div style={{ marginBottom: 16 }}>
                    <Quote style={{ width: 28, height: 28, color: "var(--gold)", opacity: 0.5 }} />
                  </div>

                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "var(--grad-gold-btn)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, color: "#0d0c0a", fontSize: "0.85rem", flexShrink: 0
                      }}>
                        {review.customerName[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>{review.customerName}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{review.service}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} style={{ width: 14, height: 14, color: i < review.rating ? "var(--gold)" : "var(--border-light)" }} />
                      ))}
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
              Experience the <span className="text-gold">Glamour Studio</span><br />
              Difference
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Ready to transform? Book your appointment today and discover why we're Islamabad's most trusted salon.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "15px 36px", fontSize: "0.88rem" }}>
                <Calendar style={{ width: 17, height: 17 }} />
                Book Your Visit
              </Link>
              <a href={`tel:${APP_PHONE}`} className="sal-btn sal-btn-ghost" style={{ padding: "14px 36px", fontSize: "0.88rem" }}>
                <Phone style={{ width: 16, height: 16 }} />
                Call {APP_PHONE}
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin style={{ width: 13, height: 13, color: "var(--gold)" }} />
                {APP_ADDRESS}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Mail style={{ width: 13, height: 13, color: "var(--gold)" }} />
                {APP_EMAIL}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}