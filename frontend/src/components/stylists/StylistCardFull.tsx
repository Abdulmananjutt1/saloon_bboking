import Image from "next/image";
import Link from "next/link";
import { Scissors, Award } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { ROUTES } from "@/constants";
import type { ApiStylist } from "@/lib/api/stylists";

interface StylistCardFullProps {
  stylist: ApiStylist;
  unavailable?: boolean;
}

export default function StylistCardFull({ stylist, unavailable = false }: StylistCardFullProps) {
  if (unavailable) {
    return (
      <div className="team-card" style={{ textAlign: "center" }}>
        <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
          <Image
            src={stylist.avatar}
            alt={stylist.name}
            fill
            className="object-cover"
            style={{ filter: "grayscale(40%)" }}
            sizes="33vw"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.1) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: "rgba(255,255,255,0.07)", border: "1px solid var(--border-light)", fontSize: "0.67rem", fontWeight: 700, color: "var(--text-muted)" }}>
              On Leave
            </span>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 0" }}>
            <h2 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.05rem", marginBottom: 3 }}>{stylist.name}</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600, marginBottom: 12 }}>{stylist.role}</p>
          </div>
        </div>
        <div style={{ padding: "18px 20px 22px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            {stylist.specialties.map((sp) => (
              <span key={sp.id} className="sal-badge sal-badge-gray" style={{ fontSize: "0.65rem" }}>{sp.name}</span>
            ))}
          </div>
          <button disabled style={{ width: "100%", padding: "11px 16px", borderRadius: "var(--r)", background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border-light)", fontSize: "0.8rem", fontWeight: 600, cursor: "not-allowed" }}>
            Currently Unavailable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-card" style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 300, overflow: "hidden", flexShrink: 0 }}>
        <Image src={stylist.avatar} alt={stylist.name} fill className="object-cover" style={{ transition: "transform 0.5s ease" }} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.1) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 99, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", fontSize: "0.68rem", fontWeight: 700, color: "#4ade80" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Available
          </span>
        </div>
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <div className="sal-glass-gold" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99 }}>
            <Award style={{ width: 11, height: 11, color: "var(--gold)" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold-light)" }}>{stylist.experience} yrs</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px 0" }}>
          <h2 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.15rem", marginBottom: 4 }}>{stylist.name}</h2>
          <p style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600, marginBottom: 10 }}>{stylist.role}</p>
        </div>
      </div>

      <div style={{ padding: "20px 22px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <StarRating rating={stylist.rating} size="sm" />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {stylist.rating} ({stylist.reviewCount.toLocaleString()} reviews)
          </span>
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 16 }}>{stylist.bio}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 20, flex: 1, alignContent: "flex-start" }}>
          {stylist.specialties.map((sp) => (
            <span key={sp.id} className="sal-badge sal-badge-gold" style={{ fontSize: "0.65rem" }}>{sp.name}</span>
          ))}
        </div>
        <div className="sal-divider" style={{ marginBottom: 20 }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 22 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>{stylist.reviewCount.toLocaleString()}</p>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Reviews</p>
          </div>
          <div style={{ width: 1, background: "var(--border-light)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>{stylist.rating}</p>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Rating</p>
          </div>
          <div style={{ width: 1, background: "var(--border-light)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.95rem" }}>{stylist.experience}y</p>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Exp.</p>
          </div>
        </div>
        <Link href={`${ROUTES.BOOK}?stylist=${stylist.id}`} className="sal-btn sal-btn-gold" style={{ width: "100%", padding: "12px 16px", fontSize: "0.82rem", justifyContent: "center" }}>
          <Scissors style={{ width: 14, height: 14 }} />
          Book with {stylist.name.split(" ")[0]}
        </Link>
      </div>
    </div>
  );
}
