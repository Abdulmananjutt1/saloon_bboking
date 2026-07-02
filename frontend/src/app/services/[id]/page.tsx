import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SERVICES, STYLISTS } from "@/lib/data/salon";
import { formatPrice, formatDuration } from "@/lib/utils";
import { ROUTES, APP_PHONE } from "@/constants";
import StarRating from "@/components/ui/StarRating";
import { Clock, ChevronRight, Scissors, CheckCircle, Users, Sparkles, Award, Star, Calendar, ArrowRight } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) return { title: "Not Found" };
  return { title: `${service.name} — Glamour Studio`, description: service.description };
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ id: s.id }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) notFound();

  const relatedServices = SERVICES.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 3);
  const availableStylists = STYLISTS.filter((st) => st.available);

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
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
              style={{ transform: "scale(1.04)" }}
              priority
              sizes="100vw"
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
            <div style={{ maxWidth: 800 }}>
              {/* Breadcrumb */}
              <div className="anim-up" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                <Link href={ROUTES.HOME} style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}>
                  Home
                </Link>
                <ChevronRight style={{ width: 12, height: 12, color: "var(--text-muted)" }} />
                <Link href={ROUTES.SERVICES} style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}>
                  Services
                </Link>
                <ChevronRight style={{ width: 12, height: 12, color: "var(--text-muted)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: 600 }}>{service.name}</span>
              </div>

              {/* Service badge */}
              <div className="sal-glass-gold anim-up anim-d1" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 99, padding: "6px 20px", marginBottom: 20
              }}>
                <Sparkles style={{ width: 14, height: 14, color: "var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-light)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  {service.category} Service
                </span>
              </div>

              {/* Main heading */}
              <h1 className="sal-h1 anim-up anim-d2 hero-text-shadow" style={{ marginBottom: 16, fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
                {service.name}
              </h1>

              {/* Service details */}
              <div className="anim-up anim-d3" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  <Clock style={{ width: 16, height: 16, color: "var(--gold)" }} />
                  {formatDuration(service.duration)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  <Users style={{ width: 16, height: 16, color: "var(--gold)" }} />
                  For {service.forGender === "unisex" ? "Everyone" : service.forGender}
                </div>
                {service.popular && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold-light)", fontSize: "0.9rem", fontWeight: 600 }}>
                    <Star style={{ width: 16, height: 16 }} />
                    Popular Choice
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="anim-up anim-d3" style={{ marginBottom: 40 }}>
                {service.discountedPrice ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--gold-light)" }}>
                      {formatPrice(service.discountedPrice)}
                    </span>
                    <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                      {formatPrice(service.price)}
                    </span>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: 6, 
                      background: "var(--grad-gold-btn)", 
                      color: "#0d0c0a", 
                      fontSize: "0.75rem", 
                      fontWeight: 800,
                      textTransform: "uppercase"
                    }}>
                      SAVE {Math.round((service.price - service.discountedPrice) / service.price * 100)}%
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--gold-light)" }}>
                    {formatPrice(service.price)}
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="anim-up anim-d4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link 
                  href={`${ROUTES.BOOK}?service=${service.id}`} 
                  className="sal-btn sal-btn-gold"
                  style={{ padding: "14px 32px", fontSize: "0.9rem" }}
                >
                  <Calendar style={{ width: 16, height: 16 }} />
                  Book This Service
                </Link>
                <Link 
                  href={ROUTES.SERVICES} 
                  className="sal-btn sal-btn-outline"
                  style={{ padding: "14px 32px", fontSize: "0.9rem" }}
                >
                  <ArrowRight style={{ width: 16, height: 16 }} />
                  Browse All Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SERVICE DETAILS
        ══════════════════════════════════════ */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40 }}>
              {/* Left Column - Main Content */}
              <div>
                {/* Service Description */}
                <div className="sal-card" style={{ padding: 32, marginBottom: 32 }}>
                  <h2 className="sal-h2" style={{ marginBottom: 20, fontSize: "1.8rem" }}>
                    About This <span className="text-gold">Service</span>
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.8, marginBottom: 24 }}>
                    {service.description}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.8 }}>
                    Our expert stylists use premium products and advanced techniques to ensure you receive the highest quality treatment. 
                    Each session is personalized to your specific needs and preferences.
                  </p>
                </div>

                {/* What's Included */}
                <div className="sal-card" style={{ padding: 32, marginBottom: 32 }}>
                  <h2 className="sal-h2" style={{ marginBottom: 24, fontSize: "1.8rem" }}>
                    What&apos;s <span className="text-gold">Included</span>
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {[
                      { icon: "👨‍⚕️", title: "Professional Consultation", desc: "Personalized advice from expert stylists" },
                      { icon: "💎", title: "Premium Products", desc: "Loreal, Wella & Kerastase products" },
                      { icon: "✨", title: "Expert Technique", desc: "Advanced styling methods" },
                      { icon: "📝", title: "Aftercare Guidance", desc: "Tips to maintain your look" },
                      { icon: "✅", title: "Satisfaction Guarantee", desc: "100% satisfaction or money back" },
                      { icon: "☕", title: "Complimentary Refreshment", desc: "Tea, coffee or juice during service" },
                    ].map((item) => (
                      <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.2rem", flexShrink: 0
                        }}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                            {item.title}
                          </h3>
                          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Stylists */}
                <div className="sal-card" style={{ padding: 32, marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <h2 className="sal-h2" style={{ fontSize: "1.8rem" }}>
                      Available <span className="text-gold">Stylists</span>
                    </h2>
                    <Link 
                      href={ROUTES.STYLISTS} 
                      style={{ 
                        fontSize: "0.8rem", 
                        color: "var(--gold)", 
                        textDecoration: "none",
                        display: "flex", alignItems: "center", gap: 4
                      }}
                    >
                      View All <ArrowRight style={{ width: 12, height: 12 }} />
                    </Link>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {availableStylists.slice(0, 4).map((stylist) => (
                      <Link 
                        key={stylist.id}
                        href={`${ROUTES.BOOK}?service=${service.id}&stylist=${stylist.id}`}
                        className="sal-card"
                        style={{ 
                          padding: 20, 
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          transition: "all 0.3s ease"
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <Image 
                            src={stylist.avatar} 
                            alt={stylist.name} 
                            width={70} 
                            height={70} 
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                          />
                          {stylist.available && (
                            <div style={{
                              position: "absolute", bottom: 0, right: 0,
                              width: 14, height: 14, borderRadius: "50%",
                              background: "#4ade80", border: "2px solid var(--bg-card)"
                            }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                            {stylist.name}
                          </h3>
                          <p style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600, marginBottom: 6 }}>
                            {stylist.role}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <StarRating rating={stylist.rating} size="sm" />
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>({stylist.reviewCount})</span>
                          </div>
                          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            {stylist.experience} years experience
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                  <div className="sal-card" style={{ padding: 32 }}>
                    <h2 className="sal-h2" style={{ marginBottom: 24, fontSize: "1.8rem" }}>
                      Related <span className="text-gold">Services</span>
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                      {relatedServices.map((rs) => (
                        <Link 
                          key={rs.id} 
                          href={`${ROUTES.SERVICES}/${rs.id}`}
                          className="sal-card"
                          style={{ 
                            textDecoration: "none",
                            overflow: "hidden"
                          }}
                        >
                          <div style={{ position: "relative", height: 120 }}>
                            <Image 
                              src={rs.image} 
                              alt={rs.name} 
                              fill
                              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                              sizes="33vw"
                            />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 60%)" }} />
                          </div>
                          <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                              {rs.name}
                            </h3>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--gold-light)", fontWeight: 700 }}>
                                {formatPrice(rs.discountedPrice ?? rs.price)}
                              </span>
                              <ChevronRight style={{ width: 12, height: 12, color: "var(--text-muted)" }} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Booking Sidebar */}
              <aside>
                <div className="sal-card" style={{ padding: 32, position: "sticky", top: 100 }}>
                  {/* Pricing */}
                  <div style={{ textAlign: "center", marginBottom: 32 }}>
                    {service.discountedPrice ? (
                      <div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", textDecoration: "line-through", marginBottom: 4 }}>
                          {formatPrice(service.price)}
                        </p>
                        <p style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 8 }}>
                          {formatPrice(service.discountedPrice)}
                        </p>
                        <div style={{ 
                          display: "inline-block",
                          padding: "4px 12px", 
                          borderRadius: 6, 
                          background: "var(--grad-gold-btn)", 
                          color: "#0d0c0a", 
                          fontSize: "0.75rem", 
                          fontWeight: 800,
                          textTransform: "uppercase"
                        }}>
                          Limited Time Offer
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--gold-light)" }}>
                        {formatPrice(service.price)}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
                      <Clock style={{ width: 14, height: 14, color: "var(--text-muted)" }} />
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <Link
                    href={`${ROUTES.BOOK}?service=${service.id}`}
                    className="sal-btn sal-btn-gold"
                    style={{ 
                      width: "100%", 
                      padding: "16px", 
                      fontSize: "0.95rem", 
                      fontWeight: 700,
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10
                    }}
                  >
                    <Scissors style={{ width: 18, height: 18 }} />
                    Book This Service Now
                  </Link>

                  {/* Features */}
                  <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 24 }}>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                      Why Book With Us
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { icon: "✅", text: "Free cancellation up to 2 hours before" },
                        { icon: "💎", text: "Premium products included" },
                        { icon: "👨‍⚕️", text: "Expert certified stylists" },
                        { icon: "🕒", text: "Flexible scheduling available" },
                      ].map((item) => (
                        <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div style={{ 
                    marginTop: 24, 
                    padding: 20, 
                    borderRadius: 12,
                    background: "rgba(201,151,59,0.05)", 
                    border: "1px solid rgba(201,151,59,0.1)"
                  }}>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, textAlign: "center" }}>
                      Service Stats
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 2 }}>4.9★</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Rating</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 2 }}>500+</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Bookings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════ */}
        <section className="cta-banner-bg" style={{
          background: "linear-gradient(135deg, #0d0c0a 0%, #1c1508 40%, #0d0c0a 100%)",
          padding: "80px 0", position: "relative", overflow: "hidden"
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 700, height: 400,
            background: "radial-gradient(ellipse, rgba(201,151,59,0.09) 0%, transparent 65%)",
            pointerEvents: "none"
          }} />

          <div className="sal-container" style={{ position: "relative", textAlign: "center" }}>
            <h2 className="sal-h2" style={{ marginBottom: 16, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Ready to Experience <span className="text-gold">{service.name}</span>?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.8 }}>
              Book your appointment now and experience premium salon service with our expert stylists.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link 
                href={`${ROUTES.BOOK}?service=${service.id}`} 
                className="sal-btn sal-btn-gold"
                style={{ padding: "15px 36px", fontSize: "0.95rem", fontWeight: 700 }}
              >
                <Calendar style={{ width: 18, height: 18 }} />
                Book Now — Free Cancellation
              </Link>
              <Link href={`tel:${APP_PHONE}`}
                className="sal-btn sal-btn-outline"
                style={{ padding: "15px 36px", fontSize: "0.95rem", fontWeight: 700 }}
              >
                📞 Call to Book
              </Link>
            </div>

            <div style={{ 
              marginTop: 40, 
              padding: 24, 
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.05)",
              maxWidth: 600,
              margin: "40px auto 0"
            }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>24/7</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Online Booking</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>100%</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Satisfaction</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gold-light)", marginBottom: 4 }}>15+</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Expert Stylists</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
