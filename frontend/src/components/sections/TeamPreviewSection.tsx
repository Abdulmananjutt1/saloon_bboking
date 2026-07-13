import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StylistCard from "@/components/stylists/StylistCard";
import type { ApiStylist } from "@/lib/api/stylists";
import type { Stylist } from "@/types";
import { ROUTES } from "@/constants";

type StylistInput = Stylist | ApiStylist;

interface TeamPreviewSectionProps {
  stylists: StylistInput[];
  eyebrow?: string;
  title?: React.ReactNode;
  variant?: "preview" | "compact";
  background?: string;
  showViewAll?: boolean;
  headerLayout?: "center" | "split";
}

export default function TeamPreviewSection({
  stylists,
  eyebrow = "Our Team",
  title = (
    <>
      Our <span className="text-gold">Experienced</span> Specialists
    </>
  ),
  variant = "preview",
  background = "var(--bg-primary)",
  showViewAll = true,
  headerLayout = "center",
}: TeamPreviewSectionProps) {
  const splitHeader = headerLayout === "split";

  return (
    <section style={{ background, padding: "100px 0" }}>
      <div className="sal-container">
        {splitHeader ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 48,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <span className="sal-eyebrow">{eyebrow}</span>
              <h2 className="sal-h2">{title}</h2>
            </div>
            {showViewAll && (
              <Link href={ROUTES.STYLISTS} className="sal-btn sal-btn-outline">
                View All Team <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="sal-eyebrow">{eyebrow}</span>
            <h2 className="sal-h2" style={{ marginBottom: 14 }}>
              {title}
            </h2>
          </div>
        )}

        <div
          className={splitHeader ? "sal-grid-sm" : "reveal-stagger sal-grid-sm"}
          style={{ gap: 24, alignItems: "stretch" }}
        >
          {stylists.map((stylist) => (
            <StylistCard
              key={stylist.id}
              stylist={stylist}
              variant={variant}
              className={splitHeader ? "team-card" : "team-card reveal-child"}
            />
          ))}
        </div>

        {!splitHeader && showViewAll && (
          <div className="reveal" style={{ textAlign: "center", marginTop: 44 }}>
            <Link href={ROUTES.STYLISTS} className="sal-btn sal-btn-outline">
              Meet All Stylists <ChevronRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
