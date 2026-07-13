import Image from "next/image";
import Link from "next/link";
import { Scissors } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { ROUTES } from "@/constants";
import type { ApiStylist } from "@/lib/api/stylists";
import type { Stylist } from "@/types";

type StylistInput = Stylist | ApiStylist;

function getSpecialtyLabels(stylist: StylistInput): string[] {
  if (!stylist.specialties.length) return [];
  return typeof stylist.specialties[0] === "string"
    ? (stylist.specialties as string[])
    : (stylist.specialties as { id: string; name: string }[]).map((s) => s.name);
}

interface StylistCardProps {
  stylist: StylistInput;
  variant?: "preview" | "compact";
  className?: string;
}

export default function StylistCard({
  stylist,
  variant = "preview",
  className = "team-card reveal-child",
}: StylistCardProps) {
  const specialties = getSpecialtyLabels(stylist);
  const showBio = variant === "compact" && stylist.bio;

  return (
    <div
      className={className}
      style={{ textAlign: "center", display: "flex", flexDirection: "column" }}
    >
      <div style={{ position: "relative", height: 260, overflow: "hidden", flexShrink: 0 }}>
        <Image
          src={stylist.avatar}
          alt={stylist.name}
          fill
          className="object-cover"
          style={{ transition: "transform 0.5s ease" }}
          sizes="25vw"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.1) 60%, transparent 100%)",
          }}
        />
        {!stylist.available && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(20,18,16,0.9)",
              color: "var(--text-muted)",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid var(--border-light)",
            }}
          >
            Unavailable
          </div>
        )}
      </div>

      <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem", marginBottom: 4 }}>
          {stylist.name}
        </h3>
        <p style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>
          {stylist.role}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
          <StarRating rating={stylist.rating} size="sm" />
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>({stylist.reviewCount})</span>
        </div>

        {showBio ? (
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 16,
              flex: 1,
            }}
          >
            {stylist.bio.slice(0, 80)}…
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 5,
              marginBottom: 16,
              flex: 1,
            }}
          >
            {specialties.map((sp) => (
              <span key={sp} className="sal-badge sal-badge-gold" style={{ fontSize: "0.62rem" }}>
                {sp}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`${ROUTES.BOOK}?stylist=${stylist.id}`}
          className="sal-btn sal-btn-gold"
          style={{ width: "100%", padding: "10px 16px", fontSize: "0.75rem", justifyContent: "center" }}
        >
          <Scissors style={{ width: 13, height: 13 }} />
          Book with {stylist.name.split(" ")[0]}
        </Link>
      </div>
    </div>
  );
}
