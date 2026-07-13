"use client";

import { useState } from "react";
import Image from "next/image";
import { Scissors, Sparkles, User, Palette, Heart, Star, Crown, type LucideIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  caption?: string;
}

const FILTERS: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "All",     value: "all",     icon: Sparkles },
  { label: "Haircut", value: "haircut", icon: Scissors },
  { label: "Beard",   value: "beard",   icon: User     },
  { label: "Color",   value: "color",   icon: Palette  },
  { label: "Facial",  value: "facial",  icon: Heart    },
  { label: "Nails",   value: "nails",   icon: Star     },
  { label: "Bridal",  value: "bridal",  icon: Crown    },
];

const LARGE_INDICES = new Set([0, 5, 9, 14]);

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? images : images.filter((img) => img.category === active);

  return (
    <>
      {/* Filter pills */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        justifyContent: "center", flexWrap: "wrap",
        marginBottom: 48
      }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8,
              fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", border: "none",
              transition: "all 0.2s ease",
              ...(active === f.value
                ? {
                    background: "var(--grad-gold-btn)",
                    color: "#0d0c0a",
                    boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
                  }
                : {
                    background: "var(--bg-card)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-light)"
                  }
              )
            }}
          >
            <f.icon style={{ width: 13, height: 13 }} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="gallery-masonry-grid">
        {filtered.map((img, i) => {
          const large = active === "all" && LARGE_INDICES.has(i);
          return (
            <div
              key={`${img.id}-${i}`}
              className={`gallery-img-wrap${large ? " gallery-masonry-large" : ""}`}
              style={{
                borderRadius: "var(--r-lg)",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={img.src}
                  alt={img.caption ?? `Gallery ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                />
                <div className="gallery-overlay" style={{ flexDirection: "column", gap: 8, padding: 20 }}>
                  <div className="sal-glass-gold" style={{
                    padding: "4px 12px", borderRadius: 99,
                    fontSize: "0.65rem", fontWeight: 700,
                    color: "var(--gold-light)", textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}>
                    {img.category}
                  </div>
                  {img.caption && (
                    <p style={{
                      color: "#fff", fontWeight: 700, fontSize: large ? "1rem" : "0.85rem",
                      textAlign: "center", letterSpacing: "0.02em"
                    }}>
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
