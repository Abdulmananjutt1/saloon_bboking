import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, Scissors } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/layout/CtaBanner";
import SectionHeader from "@/components/sections/SectionHeader";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { GALLERY_IMAGES } from "@/lib/data/salon";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Gallery — Glamour Studio",
  description: "Browse our portfolio of haircuts, colors, facials, bridal, and nail art.",
};

const EXTRA = [
  { id: "g10", src: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80", category: "bridal" as const, caption: "Elegant Bridal Look" },
  { id: "g11", src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", category: "beard" as const, caption: "Classic Fade" },
  { id: "g12", src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", category: "facial" as const, caption: "Radiant Skin" },
  { id: "g13", src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", category: "facial" as const, caption: "Spa Glow" },
  { id: "g14", src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", category: "nails" as const, caption: "Gel Nail Art" },
  { id: "g15", src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", category: "haircut" as const, caption: "Silk Finish" },
];

const ALL_IMAGES = [...GALLERY_IMAGES, ...EXTRA];

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <PageHero
          image="https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1600&q=80"
          imageAlt="Glamour Studio Gallery"
          badge="Our Portfolio"
          heading={
            <>
              Our <span className="text-gold">Gallery</span>
            </>
          }
          subtext="Every image tells a transformation story. Browse our portfolio of real client work and get inspired for your next visit."
          stats={[
            { value: `${ALL_IMAGES.length}+`, label: "Portfolio Shots" },
            { value: "8.5K+", label: "Happy Clients" },
            { value: "4.9★", label: "Avg. Rating" },
          ]}
        />

        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <SectionHeader
              eyebrow="Gallery"
              title={
                <>
                  Explore Our <span className="text-gold">Work</span>
                </>
              }
              description="Real transformations from real clients — every cut, color, and style captured here."
              className=""
            />

            <GalleryGrid images={ALL_IMAGES} />

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

        <CtaBanner
          heading={
            <>
              Your Transformation
              <br />
              <span className="text-gold">Starts Today</span>
            </>
          }
          subtext="Choose your service, pick your stylist, and book your appointment in under 2 minutes."
          buttons={[
            { label: "Book Now — Free", href: ROUTES.BOOK, variant: "gold", icon: <Scissors style={{ width: 17, height: 17 }} /> },
            { label: "Meet Our Stylists", href: ROUTES.STYLISTS, variant: "ghost", icon: <ArrowRight style={{ width: 15, height: 15 }} /> },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
