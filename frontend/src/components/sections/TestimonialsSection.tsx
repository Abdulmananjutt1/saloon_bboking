import StarRating from "@/components/ui/StarRating";
import SectionHeader from "@/components/sections/SectionHeader";
import TestimonialCard from "@/components/sections/TestimonialCard";
import type { Review } from "@/types";

interface TestimonialsSectionProps {
  reviews: Review[];
  eyebrow?: string;
  title?: React.ReactNode;
  showRatingSummary?: boolean;
  background?: string;
  animated?: boolean;
}

export default function TestimonialsSection({
  reviews,
  eyebrow = "What Clients Say",
  title = (
    <>
      Our <span className="text-gold">Happy</span> Clients
    </>
  ),
  showRatingSummary = true,
  background = "var(--bg-secondary)",
  animated = false,
}: TestimonialsSectionProps) {
  return (
    <section style={{ background, padding: "100px 0" }}>
      <div className="sal-container">
        <SectionHeader eyebrow={eyebrow} title={title} className={animated ? "reveal" : ""}>
          {showRatingSummary && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12 }}>
              <StarRating rating={4.9} size="md" showLabel />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>from 8,500+ reviews</span>
            </div>
          )}
        </SectionHeader>

        <div
          className={animated ? "reveal-stagger" : undefined}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {reviews.map((review) => (
            <TestimonialCard
              key={review.id}
              review={review}
              className={animated ? "testimonial-card reveal-child" : "testimonial-card"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
