"use client";

// ─────────────────────────────────────────────────────────
//  ServiceModal — Admin
//  Add / Edit a service. Handles image upload (base64),
//  all Prisma fields, and inline validation.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { X, Tag, UploadCloud, Trash2, Flame } from "lucide-react";
import {
  type Service,
  type ServiceFormData,
  EMPTY_SERVICE_FORM,
  SERVICE_CATEGORIES,
  GENDER_OPTIONS,
} from "@/hooks/useServices";

interface Props {
  open:     boolean;
  service:  Service | null;   // null = add mode
  saving:   boolean;
  error:    string;
  onClose:  () => void;
  onSubmit: (data: ServiceFormData) => void;
}

export function ServiceModal({ open, service, saving, error, onClose, onSubmit }: Props) {
  const [form, setForm]           = useState<ServiceFormData>(EMPTY_SERVICE_FORM);
  const [imagePreview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Sync when modal opens ── */
  useEffect(() => {
    if (service) {
      setForm({
        name:            service.name,
        category:        service.category,
        description:     service.description,
        duration:        service.duration,
        price:           service.price,
        discountedPrice: service.discountedPrice ?? "",
        image:           service.image,
        popular:         service.popular,
        forGender:       service.forGender,
        isActive:        service.isActive,
      });
      setPreview(service.image);
    } else {
      setForm(EMPTY_SERVICE_FORM);
      setPreview("");
    }
  }, [service, open]);

  if (!open) return null;

  function set<K extends keyof ServiceFormData>(key: K, val: ServiceFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPreview(url);
      set("image", url);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setPreview("");
    set("image", "");
    if (fileRef.current) fileRef.current.value = "";
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
        width: "min(96vw,600px)",
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
          padding: "22px 24px 18px",
          borderBottom: "1px solid var(--border-light)",
          position: "sticky", top: 0, background: "var(--bg-secondary)", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Tag style={{ width: 16, height: 16, color: "var(--gold)" }} />
            </div>
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {service ? "Edit Service" : "Add New Service"}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {service ? "Update service details" : "Fill in the service information"}
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

        {/* ── Form ── */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
          style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}
        >
          {error && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.82rem", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* ── Service Image ── */}
          <FieldRow label="Service Image">
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={{ display: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Preview */}
              <div style={{
                width: 100, height: 72, borderRadius: 10, flexShrink: 0,
                background: "var(--bg-card)", border: "2px dashed var(--border-light)",
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {imagePreview
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Tag style={{ width: 24, height: 24, color: "var(--text-muted)" }} />
                }
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button type="button" onClick={() => fileRef.current?.click()} style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "8px 14px", borderRadius: 9,
                  border: "1px solid var(--border-light)", background: "var(--bg-card)",
                  color: "var(--text-primary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <UploadCloud style={{ width: 13, height: 13, color: "var(--gold)" }} />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>PNG, JPG or WebP</p>
                {imagePreview && (
                  <button type="button" onClick={removeImage} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 12px", borderRadius: 8, border: "none",
                    background: "rgba(239,68,68,0.08)", color: "#f87171",
                    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <Trash2 style={{ width: 11, height: 11 }} /> Remove
                  </button>
                )}
              </div>
            </div>
          </FieldRow>

          {/* ── Name ── */}
          <FieldRow label="Service Name" required>
            <input
              className="sal-input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Premium Hair Color"
              required
            />
          </FieldRow>

          {/* ── Category + Gender ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FieldRow label="Category" required>
              <select
                className="sal-input"
                value={form.category}
                onChange={(e) => set("category", e.target.value as ServiceFormData["category"])}
                required
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="For Gender">
              <select
                className="sal-input"
                value={form.forGender}
                onChange={(e) => set("forGender", e.target.value as ServiceFormData["forGender"])}
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </FieldRow>
          </div>

          {/* ── Description ── */}
          <FieldRow label="Description" required>
            <textarea
              className="sal-input"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of the service…"
              rows={3}
              required
              style={{ resize: "vertical" }}
            />
          </FieldRow>

          {/* ── Duration + Price + Discounted Price ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <FieldRow label="Duration (min)" required>
              <input
                className="sal-input"
                type="number"
                min={5}
                max={480}
                step={5}
                value={form.duration}
                onChange={(e) => set("duration", Number(e.target.value))}
                required
              />
            </FieldRow>
            <FieldRow label="Price (PKR)" required>
              <input
                className="sal-input"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                required
              />
            </FieldRow>
            <FieldRow label="Sale Price (PKR)">
              <input
                className="sal-input"
                type="number"
                min={0}
                value={form.discountedPrice}
                onChange={(e) => set("discountedPrice", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Optional"
              />
            </FieldRow>
          </div>

          {/* ── Toggles: Popular + Active ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FieldRow label="Popular">
              <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44 }}>
                <Toggle value={form.popular} onChange={(v) => set("popular", v)} />
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: form.popular ? "var(--gold)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                  {form.popular && <Flame style={{ width: 13, height: 13 }} />}
                  {form.popular ? "Hot / Popular" : "Normal"}
                </span>
              </div>
            </FieldRow>
            <FieldRow label="Status">
              <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44 }}>
                <Toggle value={form.isActive} onChange={(v) => set("isActive", v)} />
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: form.isActive ? "var(--status-confirmed)" : "var(--text-muted)" }}>
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </FieldRow>
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 10,
              border: "1px solid var(--border-light)", background: "transparent",
              color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
            }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: "var(--grad-gold-btn)", color: "#0d0c0a",
              fontSize: "0.85rem", fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? "Saving…" : service ? "Save Changes" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ── Shared sub-components ─────────────────────────────── */

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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 48, height: 26, borderRadius: 13, border: "none",
        background: value ? "var(--gold)" : "rgba(255,255,255,0.1)",
        cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: value ? 25 : 3,
        transition: "left 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
      }} />
    </button>
  );
}
