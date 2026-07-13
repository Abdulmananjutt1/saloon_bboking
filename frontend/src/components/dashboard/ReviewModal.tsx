import { useState } from "react";
import { Star } from "lucide-react";
import type { ClientBooking } from "@/hooks/useClientDashboard";
import { smallGhostButtonStyle } from "./styles";

export function ReviewModal({ booking, onClose, onSubmit }: { booking?: ClientBooking; onClose: () => void; onSubmit: () => void }) {
  const [rating, setRating] = useState(5);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(460px, 100%)", borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: 24 }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: 6 }}>Rate your visit</h2>
        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: 18 }}>{booking?.serviceName ?? "Completed appointment"} with {booking?.stylistName ?? "your stylist"}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} style={{ border: 0, background: "transparent", cursor: "pointer", padding: 2 }}>
              <Star style={{ width: 28, height: 28, color: "var(--gold)", fill: n <= rating ? "var(--gold)" : "none" }} />
            </button>
          ))}
        </div>
        <textarea placeholder="Share a quick note" style={{ width: "100%", minHeight: 96, borderRadius: 12, border: "1px solid var(--border-light)", background: "rgba(255,255,255,0.03)", color: "var(--text-primary)", padding: 12, resize: "vertical", marginBottom: 16 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={smallGhostButtonStyle}>Later</button>
          <button onClick={onSubmit} style={{ ...smallGhostButtonStyle, background: "var(--grad-gold-btn)", color: "#0d0c0a", borderColor: "transparent" }}>Submit review</button>
        </div>
      </div>
    </div>
  );
}
