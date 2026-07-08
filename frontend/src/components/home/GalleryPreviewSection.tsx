import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeader from "@/components/sections/SectionHeader";
import { GALLERY_PREVIEW_IMAGES } from "@/lib/data/home";
import { ROUTES } from "@/constants";

export default function GalleryPreviewSection() {
  return (
    <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
      <div className="sal-container">
        <SectionHeader
          eyebrow="Gallery"
          title={
            <>
              Explore Our <span className="text-gold">Gallery</span>
            </>
          }
          description="Real transformations from real clients — every cut, color, and style captured here."
        />

        <div className="reveal-stagger gallery-preview-grid">
          <div className="gallery-img-wrap gallery-preview-hero reveal-child">
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={GALLERY_PREVIEW_IMAGES[0]} alt="Gallery 1" fill className="object-cover" sizes="33vw" />
              <div className="gallery-overlay">
                <span
                  style={{
                    opacity: 0,
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    transition: "opacity 0.3s",
                  }}
                >
                  View
                </span>
              </div>
            </div>
          </div>
          {GALLERY_PREVIEW_IMAGES.slice(1).map((src, i) => (
            <div key={i} className="gallery-img-wrap reveal-child" style={{ position: "relative" }}>
              <Image src={src} alt={`Gallery ${i + 2}`} fill className="object-cover" sizes="25vw" />
              <div className="gallery-overlay" />
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 44 }}>
          <Link href={ROUTES.GALLERY} className="sal-btn sal-btn-outline">
            View Full Gallery
            <ChevronRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
