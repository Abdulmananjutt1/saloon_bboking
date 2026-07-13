import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Phone, Mail, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/layout/CtaBanner";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import TeamPreviewSection from "@/components/sections/TeamPreviewSection";
import { ROUTES, STATS, APP_PHONE, APP_EMAIL, APP_ADDRESS } from "@/constants";
import { REVIEWS, STYLISTS } from "@/lib/data/salon";
import { fetchStylists } from "@/lib/api/stylists";
import {
  Heart, Shield, Award as AwardIcon, Globe, Target, Coffee,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Glamour Studio",
  description:
    "Discover the story behind Islamabad's premier salon — expert stylists, luxury products, and a commitment to excellence since 2015.",
};

const VALUES = [
  { icon: Heart, title: "Personalized Care", description: "Every service is tailored to your unique needs, face shape, and personal style. We listen first, then create.", color: "var(--gold)" },
  { icon: Shield, title: "Premium Products", description: "We use only certified, top-tier products — Loreal, Wella, Kerastase — for results that last and shine.", color: "var(--gold-light)" },
  { icon: AwardIcon, title: "Expert Certification", description: "All stylists undergo rigorous training and international certification to ensure cutting-edge techniques.", color: "var(--gold)" },
  { icon: Globe, title: "Clean & Safe", description: "Our salon maintains the highest standards of hygiene, sterilization, and COVID-safe protocols.", color: "var(--gold-light)" },
  { icon: Target, title: "Precision Focus", description: "From a subtle trim to dramatic transformation, every detail is executed with meticulous attention.", color: "var(--gold)" },
  { icon: Coffee, title: "Relaxing Experience", description: "Enjoy complimentary refreshments, soothing music, and a stress-free environment from start to finish.", color: "var(--gold-light)" },
];

export default async function AboutPage() {
  const apiStylists = await fetchStylists();
  const featuredStylists = (apiStylists.length > 0 ? apiStylists : STYLISTS).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <PageHero
          size="short"
          image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
          imageAlt="Our Salon Interior"
          badge="Since 2015 · Islamabad's #1"
          heading={
            <>
              Where Beauty
              <br />
              <span className="text-gold">Meets Excellence</span>
            </>
          }
          subtext="At Glamour Studio, we believe beauty is an art form and self-care is a necessity. For over a decade, we've been transforming clients with precision cuts, vibrant colors, and rejuvenating treatments in a space designed to inspire confidence and relaxation."
          stats={STATS}
          align="left"
        />

        <section style={{ background: "var(--bg-secondary)", padding: "100px 0", overflow: "hidden" }}>
          <div className="sal-container">
            <div className="sal-grid-2col" style={{ gap: 80, alignItems: "center" }}>
              <div>
                <span className="sal-eyebrow">Our Story</span>
                <h2 className="sal-h2" style={{ marginBottom: 16, lineHeight: 1.15 }}>
                  From a Small Salon
                  <br />
                  <span className="text-gold">To a Premier Destination</span>
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.85, marginBottom: 24 }}>
                  What started as a single-chair salon in 2015 has grown into Islamabad&apos;s most sought-after beauty destination. Founded by master stylist Ayesha Khan, our vision was simple: create a space where artistry, luxury, and personalized care come together.
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.85, marginBottom: 32 }}>
                  Today, we&apos;re a team of 15+ certified specialists offering 50+ services, but our core philosophy remains unchanged — every client deserves to feel seen, heard, and beautifully transformed.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "rgba(201,151,59,0.05)", borderRadius: 14, border: "1px solid rgba(201,151,59,0.15)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0d0c0a", fontSize: "1.2rem" }}>
                    AK
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem" }}>Ayesha Khan</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Founder & Master Stylist</p>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 500, maxHeight: "min(500px, 70vw)" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                    alt="Our Salon Journey"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.5) 0%, transparent 60%)" }} />
                </div>
                <div className="sal-glass-gold about-float-card" style={{ position: "absolute", bottom: -20, left: -20, padding: "16px 20px", borderRadius: 16, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <div className="sal-grid" style={{ gap: 30 }}>
              {VALUES.map((value, i) => (
                <div key={i} className="sal-card" style={{ padding: 32, textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <value.icon style={{ width: 26, height: 26, color: value.color }} />
                  </div>
                  <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: 12 }}>{value.title}</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TeamPreviewSection
          stylists={featuredStylists}
          eyebrow="Our Experts"
          title={
            <>
              Meet Our <span className="text-gold">Master Stylists</span>
            </>
          }
          variant="compact"
          background="var(--bg-secondary)"
          headerLayout="split"
        />

        <TestimonialsSection
          reviews={REVIEWS}
          eyebrow="Client Love"
          title={
            <>
              Stories from <span className="text-gold">Happy Clients</span>
            </>
          }
          showRatingSummary={false}
          background="var(--bg-primary)"
        />

        <CtaBanner
          heading={
            <>
              Experience the <span className="text-gold">Glamour Studio</span>
              <br />
              Difference
            </>
          }
          subtext="Ready to transform? Book your appointment today and discover why we're Islamabad's most trusted salon."
          buttons={[
            { label: "Book Your Visit", href: ROUTES.BOOK, variant: "gold", icon: <Calendar style={{ width: 17, height: 17 }} /> },
            { label: `Call ${APP_PHONE}`, href: `tel:${APP_PHONE}`, variant: "ghost", icon: <Phone style={{ width: 16, height: 16 }} />, external: true },
          ]}
          footer={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin style={{ width: 13, height: 13, color: "var(--gold)" }} />
                {APP_ADDRESS}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Mail style={{ width: 13, height: 13, color: "var(--gold)" }} />
                {APP_EMAIL}
              </div>
            </div>
          }
        />
      </main>
      <Footer />
    </>
  );
}
