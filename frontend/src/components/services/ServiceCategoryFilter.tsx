import Link from "next/link";
import {
  Scissors, User, Palette, Sparkles, Heart, Star, Crown, Feather, Wind,
  type LucideIcon,
} from "lucide-react";
import { ROUTES, SERVICE_CATEGORIES } from "@/constants";
import type { ServiceCategory } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, User, Palette, Sparkles, Heart, Star, Crown, Feather, Wind,
};

interface ServiceCategoryFilterProps {
  activeCategory?: string;
}

export default function ServiceCategoryFilter({ activeCategory }: ServiceCategoryFilterProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 32,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Link
        href={ROUTES.SERVICES}
        scroll={false}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 8,
          fontSize: "0.82rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "all 0.2s ease",
          ...(!activeCategory
            ? {
                background: "var(--grad-gold-btn)",
                color: "#0d0c0a",
                boxShadow: "0 4px 20px rgba(201,151,59,0.3)",
              }
            : {
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-light)",
              }),
        }}
      >
        <Sparkles style={{ width: 12, height: 12 }} />
        All Services
      </Link>
      {SERVICE_CATEGORIES.map((c) => {
        const Icon = ICON_MAP[c.icon] ?? Sparkles;
        const isActive = activeCategory === c.value;
        return (
          <Link
            key={c.value}
            href={`${ROUTES.SERVICES}?cat=${c.value}`}
            scroll={false}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
              ...(isActive
                ? {
                    background: "var(--grad-gold-btn)",
                    color: "#0d0c0a",
                    boxShadow: "0 4px 20px rgba(201,151,59,0.3)",
                  }
                : {
                    background: "var(--bg-card)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-light)",
                  }),
            }}
          >
            <Icon style={{ width: 13, height: 13 }} />
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}

export function getFilteredServiceCount(total: number, category?: string) {
  return `Showing ${total} ${category ? category : ""} service${total !== 1 ? "s" : ""}`;
}

export type { ServiceCategory };
