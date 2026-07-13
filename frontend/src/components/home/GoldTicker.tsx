import { TICKER_ITEMS } from "@/lib/data/home";

export default function GoldTicker() {
  return (
    <div className="gold-ticker-strip">
      <div className="gold-ticker-inner">
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            {TICKER_ITEMS.map((text, j) => (
              <span key={j} className="gold-ticker-item">
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>✦</span>
                {text}
                <span className="gold-ticker-dot" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
