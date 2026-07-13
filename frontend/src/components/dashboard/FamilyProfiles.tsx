"use client";

import { Phone, Plus, Users, X } from "lucide-react";
import type { FormEvent } from "react";
import type { FamilyProfile } from "./types";
import { modalInputStyle, pageSubtitleStyle, pageTitleStyle, smallGhostButtonStyle } from "./styles";
import { useState } from "react";

export function familyProfilesStorageKey(user: { id?: string; email?: string }) {
  const accountKey = user.id || user.email || "guest";
  return `gs_family_profiles:${accountKey.toLowerCase()}`;
}

export function FamilyProfilesPage({ profiles, userName, onAdd, onDelete }: {
  profiles: FamilyProfile[];
  userName: string;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="client-dashboard-page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={pageTitleStyle}>Family Profiles</h1>
          <p style={pageSubtitleStyle}>
            These profiles are saved separately for {userName}&apos;s account.
          </p>
        </div>
        <button onClick={onAdd} style={{ ...smallGhostButtonStyle, background: "var(--grad-gold-btn)", color: "#0d0c0a", borderColor: "transparent" }}>
          <Plus style={{ width: 14, height: 14 }} /> Add profile
        </button>
      </div>

      {profiles.length === 0 ? (
        <div style={{ padding: "72px 32px", borderRadius: 18, background: "var(--bg-card)", border: "1px dashed var(--border-light)", textAlign: "center" }}>
          <Users style={{ width: 42, height: 42, color: "var(--gold)", margin: "0 auto 14px" }} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 8 }}>No family profiles yet</h2>
          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginBottom: 18 }}>
            Add family members so future bookings can be made faster from this account.
          </p>
          <button onClick={onAdd} style={{ ...smallGhostButtonStyle, background: "var(--grad-gold-btn)", color: "#0d0c0a", borderColor: "transparent" }}>
            <Plus style={{ width: 14, height: 14 }} /> Add first profile
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {profiles.map((profile) => (
            <div key={profile.id} style={{ padding: "18px", borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(201,151,59,0.12)", border: "1px solid rgba(201,151,59,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontWeight: 900, flexShrink: 0 }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</h2>
                    <p style={{ fontSize: "0.76rem", color: "var(--gold)", marginTop: 2 }}>{profile.relation}</p>
                  </div>
                </div>
                <button onClick={() => onDelete(profile.id)} style={{ ...smallGhostButtonStyle, padding: "7px 10px", color: "#f87171", borderColor: "rgba(248,113,113,0.24)" }}>
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
                <Phone style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{profile.phone || "No phone added"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FamilyProfileModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (profile: Omit<FamilyProfile, "id">) => void;
}) {
  const [form, setForm] = useState({ name: "", relation: "", phone: "" });
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      relation: form.relation.trim() || "Family",
      phone: form.phone.trim(),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form onSubmit={submit} style={{ width: "min(430px, 100%)", borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: 24 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 900, marginBottom: 6 }}>Add family profile</h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 18 }}>Keep family details ready for faster future bookings.</p>
        <div style={{ display: "grid", gap: 12 }}>
          <input
            value={form.name}
            onChange={(e) => { setForm((prev) => ({ ...prev, name: e.target.value })); setError(""); }}
            placeholder="Name"
            style={modalInputStyle}
          />
          <input
            value={form.relation}
            onChange={(e) => setForm((prev) => ({ ...prev, relation: e.target.value }))}
            placeholder="Relation"
            style={modalInputStyle}
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone optional"
            style={modalInputStyle}
          />
        </div>
        {error && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: 10 }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button type="button" onClick={onClose} style={smallGhostButtonStyle}>Cancel</button>
          <button type="submit" style={{ ...smallGhostButtonStyle, background: "var(--grad-gold-btn)", color: "#0d0c0a", borderColor: "transparent" }}>Save profile</button>
        </div>
      </form>
    </div>
  );
}
