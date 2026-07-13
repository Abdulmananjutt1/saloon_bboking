import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/CtaBanner";
import SectionHeader from "@/components/sections/SectionHeader";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCategoryFilter from "@/components/services/ServiceCategoryFilter";
import { ROUTES } from "@/constants";
import { SERVICES } from "@/lib/data/salon";
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
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <PageHero
          size="short"
          image="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          imageAlt="Salon Services"
          badge="Premium Services"
          heading={
            <>
              Our <span className="text-gold">Services</span>
            </>
          }
          subtext="50+ professional beauty and grooming services for men, women, and everyone in between. Each treatment is crafted to perfection by our expert stylists."
        >
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="#services-grid" className="sal-btn sal-btn-gold" style={{ padding: "12px 30px" }}>
              <ArrowRight style={{ width: 16, height: 16 }} />
              Explore Services
            </Link>
            <Link href={ROUTES.BOOK} className="sal-btn sal-btn-outline" style={{ padding: "12px 30px" }}>
              <Calendar style={{ width: 16, height: 16 }} />
              Book Appointment
            </Link>
          </div>
        </PageHero>

        <section id="services-grid" style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <SectionHeader
              eyebrow="Our Services"
              title={
                <>
                  Explore Our <span className="text-gold">Services</span>
                </>
              }
              description="From classic cuts to luxury bridal packages — everything to make you look and feel your absolute best."
              className=""
            />

            <ServiceCategoryFilter activeCategory={cat} />

            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Showing {filtered.length} {cat ? cat : ""} service{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="sal-grid" style={{ gap: 24 }}>
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} className="sal-card" />
              ))}
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
