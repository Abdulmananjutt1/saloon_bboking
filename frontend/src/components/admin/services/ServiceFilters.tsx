"use client";

// ─────────────────────────────────────────────────────────
//  ServiceFilters — Admin
//  Category filter tabs + search + active/inactive toggle.
// ─────────────────────────────────────────────────────────

import { Search, X } from "lucide-react";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/hooks/useServices";

interface Props {
  search:          string;
  activeCategory:  string;   // "" = all
  showInactive:    boolean;
  onSearch:        (v: string) => void;
  onCategory:      (v: string) => void;
  onToggleInactive: () => void;
  totalCount:      number;
  filteredCount:   number;
}

export function ServiceFilters({
  search, activeCategory, showInactive,
  onSearch, onCategory, onToggleInactive,
  totalCount, filteredCount,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>

      {/* ── Top row: search + inactive toggle ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search services…"
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              borderRadius: 10, border: "1px solid var(--border-light)",
              background: "var(--bg-card)", color: "var(--text-primary)",
              fontSize: "0.84rem", outline: "none", boxSizing: "border-box",
            }}
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
            >
              <X style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>

        {/* Show inactive toggle */}
        <button
          onClick={onToggleInactive}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 14px", borderRadius: 10, cursor: "pointer",
            border: `1px solid ${showInactive ? "rgba(239,68,68,0.4)" : "var(--border-light)"}`,
            background: showInactive ? "rgba(239,68,68,0.08)" : "var(--bg-card)",
            color: showInactive ? "#f87171" : "var(--text-muted)",
            fontSize: "0.78rem", fontWeight: 700, transition: "all 0.2s",
          }}
        >
          {showInactive ? "Hiding Inactive" : "Show Inactive"}
        </button>

        {/* Count */}
        <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginLeft: "auto" }}>
          {filteredCount} of {totalCount} services
        </span>
      </div>

      {/* ── Category chips ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {/* All */}
        <CategoryChip
          label="All"
          active={activeCategory === ""}
          onClick={() => onCategory("")}
        />
        {SERVICE_CATEGORIES.map((c) => (
          <CategoryChip
            key={c.value}
            label={c.label}
            active={activeCategory === c.value}
            onClick={() => onCategory(c.value)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 99, cursor: "pointer",
        fontSize: "0.72rem", fontWeight: 700,
        border: active ? "1.5px solid rgba(201,151,59,0.5)" : "1px solid var(--border-light)",
        background: active ? "rgba(201,151,59,0.1)" : "var(--bg-card)",
        color: active ? "var(--gold)" : "var(--text-muted)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
