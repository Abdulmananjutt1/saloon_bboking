import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarRating from "@/components/ui/StarRating";
import { ROUTES } from "@/constants";
import { Scissors, Sparkles, Award, ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Stylists — Glamour Studio",
  description: "Meet Glamour Studio's expert team of stylists and beauty professionals.",
};

interface Specialty { id: string; name: string; }
interface StylistData {
  id: string; name: string; role: string; avatar: string;
  bio: string; experience: number; rating: number;
  reviewCount: number; available: boolean;
  specialties: Specialty[];
}

async function getStylists(): Promise<StylistData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/stylists`,
      { cache: "no-store" }
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export default async function StylistsPage() {
  const stylists = await getStylists();
  const available   = stylists.filter((s) => s.available);
  const unavailable = stylists.filter((s) => !s.available);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* BG image */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
              alt="Our Team"
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

          {/* Gold glow orb */}
          <div style={{
            position: "absolute", top: "20%", right: "28%",
            width: 380, height: 380,
            background: "radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 70%)",
            borderRadius: "50%", pointerEvents: "none"
          }} />

          {/* Content */}
          <div className="sal-container" style={{ position: "relative", paddingTop: 120, paddingBottom: 80, width: "100%" }}>
            <div style={{ maxWidth: 680, textAlign: "center", margin: "0 auto" }}>

              {/* Badge */}
              <div className="sal-glass-gold anim-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 99, padding: "6px 20px", marginBottom: 24
              }}>
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Certified Professionals
                </span>
              </div>

              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 20, fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
                Meet Our <span className="text-gold">Expert</span> Team
              </h1>

              <p className="anim-up anim-d3" style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
                Every stylist at Glamour Studio is hand-picked, internationally trained, and passionate about transforming your look. Book directly with the expert of your choice.
              </p>

              {/* Quick stats */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 36, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { value: `${available.length}`, label: "Available Now" },
                  { value: "15+", label: "Years Avg. Exp." },
                  { value: "4.9★", label: "Avg. Rating" },
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
            STYLISTS GRID
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">

            {/* Section heading */}
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="sal-eyebrow">Our Team</span>
              <h2 className="sal-h2" style={{ marginBottom: 14 }}>
                Our <span className="text-gold">Experienced</span> Specialists
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 480, margin: "0 auto" }}>
                Each expert is trained in international techniques and dedicated to giving you a flawless result every visit.
              </p>
            </div>

            {/* Available stylists */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 28,
              marginBottom: 60,
              alignItems: "stretch"
            }}>
              {available.map((stylist) => (
                <div key={stylist.id} className="team-card" style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                  {/* Photo */}
                  <div style={{ position: "relative", height: 300, overflow: "hidden", flexShrink: 0 }}>
                    <Image
                      src={stylist.avatar}
                      alt={stylist.name}
                      fill
                      className="object-cover"
                      style={{ transition: "transform 0.5s ease" }}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.1) 55%, transparent 100%)"
                    }} />

                    {/* Available badge */}
                    <div style={{ position: "absolute", top: 14, right: 14 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 12px", borderRadius: 99,
                        background: "rgba(74,222,128,0.12)",
                        border: "1px solid rgba(74,222,128,0.3)",
                        fontSize: "0.68rem", fontWeight: 700,
                        color: "#4ade80"
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                        Available
                      </span>
                    </div>

                    {/* Experience badge */}
                    <div style={{ position: "absolute", top: 14, left: 14 }}>
                      <div className="sal-glass-gold" style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 99
                      }}>
                        <Award style={{ width: 11, height: 11, color: "var(--gold)" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold-light)" }}>
                          {stylist.experience} yrs
                        </span>
                      </div>
                    </div>

                    {/* Name overlay at bottom */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px 0" }}>
                      <h2 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.15rem", marginBottom: 4 }}>
                        {stylist.name}
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>
                        {stylist.role}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 22px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
                      <StarRating rating={stylist.rating} size="sm" />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {stylist.rating} ({stylist.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 16 }}>
                      {stylist.bio}
                    </p>

                    {/* Specialties */}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 20, flex: 1, alignContent: "flex-start" }}>
                      {stylist.specialties.map((sp) => (
                        <span key={sp.id} className="sal-badge sal-badge-gold" style={{ fontSize: "0.65rem" }}>{sp.name}</span>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="sal-divider" style={{ marginBottom: 20 }} />

                    {/* Stats row */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 22 }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>{stylist.reviewCount.toLocaleString()}</p>
                        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Reviews</p>
                      </div>
                      <div style={{ width: 1, background: "var(--border-light)" }} />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>{stylist.rating}</p>
                        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Rating</p>
                      </div>
                      <div style={{ width: 1, background: "var(--border-light)" }} />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>{stylist.experience}y</p>
                        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Exp.</p>
                      </div>
                    </div>

                    {/* Book button */}
                    <Link
                      href={`${ROUTES.BOOK}?stylist=${stylist.id}`}
                      className="sal-btn sal-btn-gold"
                      style={{ width: "100%", padding: "12px 16px", fontSize: "0.82rem", justifyContent: "center" }}
                    >
                      <Scissors style={{ width: 14, height: 14 }} />
                      Book with {stylist.name.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Unavailable stylists — smaller row */}
            {unavailable.length > 0 && (
              <>
                <div style={{ marginBottom: 32, textAlign: "center" }}>
                  <span className="sal-eyebrow">Currently On Leave</span>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 24,
                  opacity: 0.6
                }}>
                  {unavailable.map((stylist) => (
                    <div key={stylist.id} className="team-card" style={{ textAlign: "center" }}>
                      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                        <Image
                          src={stylist.avatar}
                          alt={stylist.name}
                          fill
                          className="object-cover"
                          style={{ filter: "grayscale(40%)" }}
                          sizes="33vw"
                        />
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.1) 60%, transparent 100%)"
                        }} />
                        {/* On leave badge */}
                        <div style={{ position: "absolute", top: 14, right: 14 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "4px 10px", borderRadius: 99,
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid var(--border-light)",
                            fontSize: "0.67rem", fontWeight: 700,
                            color: "var(--text-muted)"
                          }}>
                            On Leave
                          </span>
                        </div>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 0" }}>
                          <h2 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.05rem", marginBottom: 3 }}>
                            {stylist.name}
                          </h2>
                          <p style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600, marginBottom: 12 }}>
                            {stylist.role}
                          </p>
                        </div>
                      </div>
                      <div style={{ padding: "18px 20px 22px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 16 }}>
                          {stylist.specialties.map((sp) => (
                            <span key={sp.id} className="sal-badge sal-badge-gray" style={{ fontSize: "0.65rem" }}>{sp.name}</span>
                          ))}
                        </div>
                        <button
                          disabled
                          style={{
                            width: "100%", padding: "11px 16px", borderRadius: "var(--r)",
                            background: "var(--bg-card)", color: "var(--text-muted)",
                            border: "1px solid var(--border-light)",
                            fontSize: "0.8rem", fontWeight: 600, cursor: "not-allowed"
                          }}
                        >
                          Currently Unavailable
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
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
              Found Your Perfect<br />
              <span className="text-gold">Stylist?</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Book your appointment in under 2 minutes. Choose your stylist, pick a time, and you&apos;re all set.
            </p>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ padding: "15px 36px", fontSize: "0.88rem" }}>
                <Calendar style={{ width: 17, height: 17 }} />
                Book Appointment
              </Link>
              <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-outline" style={{ padding: "14px 36px", fontSize: "0.88rem" }}>
                Browse Services
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
