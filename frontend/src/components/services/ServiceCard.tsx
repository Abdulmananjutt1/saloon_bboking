import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { ROUTES } from "@/constants";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  className?: string;
  descriptionLength?: number;
}

export default function ServiceCard({
  service,
  className = "sal-card reveal-child",
  descriptionLength = 85,
}: ServiceCardProps) {
  const description =
    service.description.length > descriptionLength
      ? `${service.description.slice(0, descriptionLength)}…`
      : service.description;

  return (
    <Link
      href={`${ROUTES.SERVICES}/${service.id}`}
      className={className}
      style={{ display: "flex", flexDirection: "column", overflow: "hidden", textDecoration: "none" }}
    >
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
          style={{ transition: "transform 0.5s ease" }}
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 60%)",
          }}
        />
        {service.discountedPrice && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "var(--grad-gold-btn)",
              color: "#0d0c0a",
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: 6,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            SALE
          </div>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 12 }}>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--gold-light)",
              background: "rgba(10,9,7,0.7)",
              padding: "3px 8px",
              borderRadius: 4,
            }}
          >
            {service.category}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 className="sal-h3" style={{ marginBottom: 8, fontSize: "1rem", transition: "color 0.2s" }}>
          {service.name}
        </h3>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            flex: 1,
            marginBottom: 16,
          }}
        >
          {description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: "0.78rem" }}>
            <Clock style={{ width: 13, height: 13, color: "var(--gold)" }} />
            {formatDuration(service.duration)}
          </div>
          <div style={{ textAlign: "right" }}>
            {service.discountedPrice ? (
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    textDecoration: "line-through",
                    marginRight: 4,
                  }}
                >
                  {formatPrice(service.price)}
                </span>
                <span style={{ fontWeight: 800, color: "var(--gold-light)" }}>
                  {formatPrice(service.discountedPrice)}
                </span>
              </div>
            ) : (
              <span style={{ fontWeight: 800, color: "var(--gold-light)" }}>{formatPrice(service.price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
