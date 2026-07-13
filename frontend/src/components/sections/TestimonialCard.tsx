import { Quote } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import type { Review } from "@/types";

interface TestimonialCardProps {
  review: Review;
  className?: string;
}

export default function TestimonialCard({ review, className = "testimonial-card reveal-child" }: TestimonialCardProps) {
  return (
    <div className={className}>
      <div style={{ marginBottom: 16 }}>
        <Quote style={{ width: 28, height: 28, color: "var(--gold)", opacity: 0.5 }} />
      </div>

      <p
        style={{
          fontSize: "0.88rem",
          color: "var(--text-secondary)",
          lineHeight: 1.8,
          marginBottom: 20,
          fontStyle: "italic",
        }}
      >
        &ldquo;{review.comment}&rdquo;
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--grad-gold-btn)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#0d0c0a",
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {review.customerName[0]}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>
              {review.customerName}
            </p>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{review.service}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
    </div>
  );
}
