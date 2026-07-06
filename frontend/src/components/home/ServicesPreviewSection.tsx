import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeader from "@/components/sections/SectionHeader";
import ServiceCard from "@/components/services/ServiceCard";
import { ROUTES } from "@/constants";
import type { Service } from "@/types";

interface ServicesPreviewSectionProps {
  services: Service[];
}

export default function ServicesPreviewSection({ services }: ServicesPreviewSectionProps) {
  return (
    <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
      <div className="sal-container">
        <SectionHeader
          eyebrow="Our Services"
          title={
            <>
              Explore Our <span className="text-gold">Services</span>
            </>
          }
          description="From classic cuts to luxury bridal packages — everything to make you look and feel your absolute best."
        />

        <div
          className="reveal-stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
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
  );
}
