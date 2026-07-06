import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/layout/CtaBanner";
import SectionHeader from "@/components/sections/SectionHeader";
import StylistCardFull from "@/components/stylists/StylistCardFull";
import { ROUTES } from "@/constants";
import { fetchStylists } from "@/lib/api/stylists";

export const metadata: Metadata = {
  title: "Our Stylists — Glamour Studio",
  description: "Meet Glamour Studio's expert team of stylists and beauty professionals.",
};

export default async function StylistsPage() {
  const stylists = await fetchStylists();
  const available = stylists.filter((s) => s.available);
  const unavailable = stylists.filter((s) => !s.available);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>
        <PageHero
          image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
          imageAlt="Our Team"
          badge="Certified Professionals"
          heading={
            <>
              Meet Our <span className="text-gold">Expert</span> Team
            </>
          }
          subtext="Every stylist at Glamour Studio is hand-picked, internationally trained, and passionate about transforming your look. Book directly with the expert of your choice."
          stats={[
            { value: `${available.length}`, label: "Available Now" },
            { value: "15+", label: "Years Avg. Exp." },
            { value: "4.9★", label: "Avg. Rating" },
          ]}
        />

        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <SectionHeader
              eyebrow="Our Team"
              title={
                <>
                  Our <span className="text-gold">Experienced</span> Specialists
                </>
              }
              description="Each expert is trained in international techniques and dedicated to giving you a flawless result every visit."
              className=""
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28, marginBottom: 60, alignItems: "stretch" }}>
              {available.map((stylist) => (
                <StylistCardFull key={stylist.id} stylist={stylist} />
              ))}
            </div>

            {unavailable.length > 0 && (
              <>
                <div style={{ marginBottom: 32, textAlign: "center" }}>
                  <span className="sal-eyebrow">Currently On Leave</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, opacity: 0.6 }}>
                  {unavailable.map((stylist) => (
                    <StylistCardFull key={stylist.id} stylist={stylist} unavailable />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <CtaBanner
          heading={
            <>
              Found Your Perfect
              <br />
              <span className="text-gold">Stylist?</span>
            </>
          }
          subtext="Book your appointment in under 2 minutes. Choose your stylist, pick a time, and you're all set."
          buttons={[
            { label: "Book Appointment", href: ROUTES.BOOK, variant: "gold", icon: <Calendar style={{ width: 17, height: 17 }} /> },
            { label: "Browse Services", href: ROUTES.SERVICES, variant: "outline", icon: <ArrowRight style={{ width: 15, height: 15 }} /> },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
