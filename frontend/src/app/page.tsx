import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CtaBanner from "@/components/CtaBanner";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import {
  HomeHero,
  GoldTicker,
  AboutSection,
  ServicesPreviewSection,
  LuxuryBrandsSection,
  PricingSection,
  GalleryPreviewSection,
  TeamSection,
} from "@/components/home";
import { SERVICES, STYLISTS, REVIEWS } from "@/lib/data/salon";

export default function HomePage() {
  const popularServices = SERVICES.filter((s) => s.popular).slice(0, 6);
  const featuredStylists = STYLISTS.slice(0, 4);

  return (
    <>
      <ScrollReveal />
      <Navbar />
      <main style={{ background: "var(--bg-primary)" }}>
        <HomeHero />
        <GoldTicker />
        <AboutSection />
        <ServicesPreviewSection services={popularServices} />
        <LuxuryBrandsSection />
        <PricingSection />
        <GalleryPreviewSection />
        <TeamSection stylists={featuredStylists} />
        <TestimonialsSection reviews={REVIEWS} animated />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
