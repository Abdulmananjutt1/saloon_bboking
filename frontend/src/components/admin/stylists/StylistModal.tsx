"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, User, UploadCloud, Trash2, Clock } from "lucide-react";
import type { Stylist, StylistFormData } from "@/hooks/useStylists";
import { EMPTY_STYLIST_FORM } from "@/hooks/useStylists";
import { AvailabilitySchedule, type DaySchedule } from "./AvailabilitySchedule";
import { stylistsApi } from "@/lib/api";

interface StylistModalProps {
  open:     boolean;
  stylist:  Stylist | null;
  saving:   boolean;
  error:    string;
  onClose:  () => void;
  onSubmit: (data: StylistFormData) => void;
}

export function StylistModal({ open, stylist, saving, error, onClose, onSubmit }: StylistModalProps) {
  const [form, setForm]               = useState<StylistFormData>(EMPTY_STYLIST_FORM);
  const [specialtyInput, setSpecInput] = useState("");
  const [avatarPreview, setPreview]   = useState("");
  const [activeTab, setActiveTab]     = useState<"info" | "schedule">("info");
  const [pendingSchedule, setPending] = useState<DaySchedule[]>([]);
  const [scheduleSaving, setSchSaving] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Sync form when modal opens ── */
  useEffect(() => {
    if (stylist) {
      setForm({
        name:        stylist.name,
        role:        stylist.role,
        avatar:      stylist.avatar,
        bio:         stylist.bio,
        experience:  stylist.experience,
        available:   stylist.available,
        specialties: stylist.specialties.map((s) => s.name),
      });
      setPreview(stylist.avatar);
    } else {
      setForm(EMPTY_STYLIST_FORM);
      setPreview("");
    }
    setSpecInput("");
    setActiveTab("info");
    setScheduleMsg("");
  }, [stylist, open]);

  if (!open) return null;

  function setField<K extends keyof StylistFormData>(key: K, val: StylistFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPreview(url);
      setField("avatar", url);
    };
    reader.readAsDataURL(file);
  }

  function addSpecialty() {
    const val = specialtyInput.trim();
    if (!val || form.specialties.includes(val)) return;
    setField("specialties", [...form.specialties, val]);
    setSpecInput("");
  }

  async function saveSchedule() {
    if (!stylist) return;
    setSchSaving(true);
    setScheduleMsg("");
    try {
      await stylistsApi.saveAvailability(stylist.id, pendingSchedule);
      setScheduleMsg("Schedule saved!");
      setTimeout(() => setScheduleMsg(""), 3000);
    } catch {
      setScheduleMsg("Failed to save. Try again.");
    } finally {
      setSchSaving(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1001,
        width: "min(96vw,580px)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 0",
          position: "sticky", top: 0, background: "var(--bg-secondary)", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User style={{ width: 16, height: 16, color: "var(--gold)" }} />
            </div>
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {stylist ? "Edit Stylist" : "Add New Stylist"}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {stylist ? "Update profile & availability schedule" : "Fill in stylist information"}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "none",
            background: "rgba(255,255,255,0.05)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)",
          }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div style={{ display: "flex", gap: 4, padding: "14px 24px 0", borderBottom: "1px solid var(--border-light)" }}>
          {([
            { key: "info",     label: "Profile",      icon: <User  style={{ width: 13, height: 13 }} /> },
            { key: "schedule", label: "Availability",  icon: <Clock style={{ width: 13, height: 13 }} /> },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px",
                borderRadius: "8px 8px 0 0",
                border: "1px solid var(--border-light)",
                borderBottom: activeTab === tab.key ? "2px solid var(--gold)" : "1px solid var(--border-light)",
                background: activeTab === tab.key ? "rgba(201,151,59,0.06)" : "transparent",
                color: activeTab === tab.key ? "var(--gold)" : "var(--text-muted)",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                marginBottom: -1,
                transition: "all 0.15s",
              }}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === "info" && (
          <form
            onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
            style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}
          >
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.82rem", color: "#f87171" }}>
                {error}
              </div>
            )}

            {/* Photo */}
            <FieldRow label="Profile Photo">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={{ display: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
                  background: "var(--bg-card)", border: "2px dashed var(--border-light)",
                  overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {avatarPreview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={avatarPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <User style={{ width: 32, height: 32, color: "var(--text-muted)" }} />
                  }
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button type="button" onClick={() => fileRef.current?.click()} style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "8px 16px", borderRadius: 9,
                    border: "1px solid var(--border-light)", background: "var(--bg-card)",
                    color: "var(--text-primary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <UploadCloud style={{ width: 14, height: 14, color: "var(--gold)" }} />
                    {avatarPreview ? "Change Photo" : "Upload Photo"}
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => { setPreview(""); setField("avatar", ""); if (fileRef.current) fileRef.current.value = ""; }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "6px 14px", borderRadius: 9, border: "none",
                        background: "rgba(239,68,68,0.08)", color: "#f87171",
                        fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      <Trash2 style={{ width: 12, height: 12 }} /> Remove
                    </button>
                  )}
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>PNG, JPG or WebP</p>
                </div>
              </div>
            </FieldRow>

            {/* Name + Role */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FieldRow label="Full Name" required>
                <input className="sal-input" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Ayesha Khan" required />
              </FieldRow>
              <FieldRow label="Role / Title" required>
                <input className="sal-input" value={form.role} onChange={(e) => setField("role", e.target.value)} placeholder="e.g. Senior Stylist" required />
              </FieldRow>
            </div>

            {/* Bio */}
            <FieldRow label="Bio" required>
              <textarea className="sal-input" value={form.bio} onChange={(e) => setField("bio", e.target.value)} placeholder="Brief description..." rows={3} required style={{ resize: "vertical" }} />
            </FieldRow>

            {/* Experience + Available toggle */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FieldRow label="Experience (years)" required>
                <input className="sal-input" type="number" min={0} max={50} value={form.experience} onChange={(e) => setField("experience", Number(e.target.value))} required />
              </FieldRow>
              <FieldRow label="Status">
                <div style={{ display: "flex", alignItems: "center", gap: 12, height: 44 }}>
                  <button
                    type="button"
                    onClick={() => setField("available", !form.available)}
                    style={{
                      width: 48, height: 26, borderRadius: 13, border: "none",
                      background: form.available ? "var(--gold)" : "rgba(255,255,255,0.1)",
                      cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", background: "#fff",
                      position: "absolute", top: 3, left: form.available ? 25 : 3,
                      transition: "left 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                    }} />
                  </button>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: form.available ? "var(--status-confirmed)" : "var(--text-muted)" }}>
                    {form.available ? "Available" : "On Leave"}
                  </span>
                </div>
              </FieldRow>
            </div>

            {/* Specialties */}
            <FieldRow label="Specialties">
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                  className="sal-input"
                  value={specialtyInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialty(); } }}
                  placeholder="e.g. Hair Coloring — press Enter"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addSpecialty} style={{ padding: "0 14px", borderRadius: 10, border: "none", background: "rgba(201,151,59,0.12)", color: "var(--gold)", cursor: "pointer", flexShrink: 0 }}>
                  <Plus style={{ width: 14, height: 14 }} />
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {form.specialties.map((sp) => (
                  <span key={sp} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)", color: "var(--gold-light)" }}>
                    {sp}
                    <button type="button" onClick={() => setField("specialties", form.specialties.filter((s) => s !== sp))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex" }}>
                      <X style={{ width: 11, height: 11 }} />
                    </button>
                  </span>
                ))}
              </div>
            </FieldRow>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
              <button type="button" onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--grad-gold-btn)", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? "Saving..." : stylist ? "Save Changes" : "Add Stylist"}
              </button>
            </div>
          </form>
        )}

        {/* ── Schedule / Availability Tab ── */}
        {activeTab === "schedule" && (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
              Set which days and hours this stylist works each week. Clients will only see booking slots within these hours on the booking form.
            </p>

            <AvailabilitySchedule
              stylistId={stylist?.id ?? null}
              onChange={setPending}
            />

            {/* Save feedback */}
            {scheduleMsg && (
              <p style={{
                fontSize: "0.78rem", fontWeight: 600, textAlign: "center",
                color: scheduleMsg.includes("saved") ? "var(--status-confirmed)" : "#f87171",
              }}>
                {scheduleMsg}
              </p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
              <button type="button" onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border-light)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
              {stylist ? (
                <button
                  type="button"
                  disabled={scheduleSaving}
                  onClick={saveSchedule}
                  style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--grad-gold-btn)", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: scheduleSaving ? "not-allowed" : "pointer", opacity: scheduleSaving ? 0.7 : 1 }}
                >
                  {scheduleSaving ? "Saving…" : "Save Schedule"}
                </button>
              ) : (
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>
                  Save the stylist profile first, then set availability.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Shared helper component ── */
function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
        {label}{required && <span style={{ color: "var(--gold)", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
