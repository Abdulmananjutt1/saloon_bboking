import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", cls: "social-btn-fb", href: "#" },
  { icon: Instagram, label: "Instagram", cls: "social-btn-ig", href: "#" },
  { icon: Twitter, label: "Twitter", cls: "social-btn-tw", href: "#" },
  { icon: Youtube, label: "YouTube", cls: "social-btn-yt", href: "#" },
];

export default function SocialLinks() {
  return (
    <div style={{ padding: "24px 24px 22px", background: "linear-gradient(135deg, rgba(201,151,59,0.06) 0%, rgba(201,151,59,0.02) 100%)", border: "1px solid rgba(201,151,59,0.15)", borderRadius: "var(--r-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: 3 }}>Follow Our Journey</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Stay inspired with daily transformations</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {SOCIAL_LINKS.map((s, i) => (
            <a key={i} href={s.href} aria-label={s.label} className={`social-brand-btn ${s.cls}`}>
              <s.icon style={{ width: 18, height: 18 }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
