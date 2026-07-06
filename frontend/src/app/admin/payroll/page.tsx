"use client";

import Image from "next/image";
import {
  Wallet, Plus, X, Check, User, Calendar, FileText, Trash2, Settings2,
  AlertCircle, RefreshCw, Clock
} from "lucide-react";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { usePayroll, type Invoice, type StylistPayrollSummary } from "@/hooks/usePayroll";
import { ToastContainer, useToast } from "@/components/ui/Toast";

// -- Status helpers ------------------------------------------------------------
const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  paid:    { color: "var(--status-confirmed)", bg: "var(--status-confirmed-bg)", border: "var(--status-confirmed-border)", dot: "var(--status-confirmed)" },
  pending: { color: "var(--status-pending)",   bg: "var(--status-pending-bg)",   border: "var(--status-pending-border)",   dot: "var(--status-pending)" },
  overdue: { color: "var(--status-cancelled)", bg: "var(--status-cancelled-bg)", border: "var(--status-cancelled-border)", dot: "var(--status-cancelled)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.color, textTransform: "capitalize" }}>{status}</span>
    </div>
  );
}

// -- Skeleton helper -----------------------------------------------------------
const skel = (w: string | number, h: number, r = 8) => ({
  width: w, height: h, borderRadius: r,
  background: "var(--border-light)",
  animation: "pulse 1.4s ease-in-out infinite",
} as React.CSSProperties);

// -- Generate Invoice Modal ----------------------------------------------------
function GenerateModal({ stylists, form, setForm, errors, generating, onGenerate, onClose }: {
  stylists: StylistPayrollSummary[];
  form: { stylistId: string; periodStart: string; periodEnd: string; notes: string };
  setForm: (f: any) => void;
  errors: Record<string, string>;
  generating: boolean;
  onGenerate: () => void;
  onClose: () => void;
}) {
  const selectedStylist = stylists.find((s) => s.id === form.stylistId);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,9,7,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1001,
        width: "min(94vw,520px)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border-light)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>Generate Invoice</h2>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Auto-calculate from completed bookings</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {errors.general && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", fontSize: "0.78rem", color: "#f87171" }}>{errors.general}</div>}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Stylist</label>
            <select value={form.stylistId} onChange={(e) => setForm({ ...form, stylistId: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${errors.stylistId ? "#f87171" : "var(--border-light)"}`, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none" }}>
              <option value="">Select stylist...</option>
              {stylists.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.role}</option>)}
            </select>
            {errors.stylistId && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{errors.stylistId}</p>}
          </div>

          {selectedStylist && (
            <div style={{ background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-light)", overflow: "hidden" }}>
              {/* Stylist identity row */}
              <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
                <div style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)", flexShrink: 0 }}>
                  {selectedStylist.avatar ? (
                    <Image src={selectedStylist.avatar} alt={selectedStylist.name} fill sizes="40px" style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 16 }} /></div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{selectedStylist.name}</h4>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>{selectedStylist.role}</p>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 10px", borderRadius: 99,
                  background: selectedStylist.payRate ? "rgba(201,151,59,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${selectedStylist.payRate ? "rgba(201,151,59,0.2)" : "rgba(239,68,68,0.2)"}`,
                  fontSize: "0.7rem", fontWeight: 600,
                  color: selectedStylist.payRate ? "var(--gold-light)" : "var(--status-cancelled)"
                }}>
                  {selectedStylist.payRate
                    ? selectedStylist.payRate.rateType === "FLAT"
                      ? `${formatPrice(selectedStylist.payRate.flatAmount ?? 0)} / booking`
                      : `${selectedStylist.payRate.commissionPct}% commission`
                    : "No rate set"}
                </div>
              </div>

              {/* Financial stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "none" }}>
                <div style={{ padding: "12px 16px", borderRight: "1px solid var(--border-light)" }}>
                  <p style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Completed Jobs</p>
                  <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4 }}>{selectedStylist.completedBookings}</p>
                </div>
                <div style={{ padding: "12px 16px", borderRight: "1px solid var(--border-light)" }}>
                  <p style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Total Revenue</p>
                  <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4 }}>{formatPrice(selectedStylist.totalRevenue)}</p>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <p style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Est. Earnings</p>
                  <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gold)", marginTop: 4 }}>{formatPrice(selectedStylist.earnedAmount)}</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Period Start</label>
              <input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${errors.periodStart ? "#f87171" : "var(--border-light)"}`, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
              {errors.periodStart && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{errors.periodStart}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Period End</label>
              <input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${errors.periodEnd ? "#f87171" : "var(--border-light)"}`, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
              {errors.periodEnd && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{errors.periodEnd}</p>}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about this invoice..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={onGenerate} disabled={generating}
              style={{ flex: 2, padding: "10px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {generating ? <><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block" }} />Generating...</> : <><FileText style={{ width: 13, height: 13 }} />Generate Invoice</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// -- Configure Pay Rate Modal ------------------------------------------------──
function RateModal({ stylist, form, setForm, errors, saving, onSave, onClose }: {
  stylist: StylistPayrollSummary | null;
  form: { rateType: "FLAT" | "COMMISSION"; flatAmount: string; commissionPct: string; baseSalary: string };
  setForm: (f: any) => void;
  errors: Record<string, string>;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  if (!stylist) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,9,7,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1001,
        width: "min(94vw,460px)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border-light)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>Configure Pay Rate</h2>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{stylist.name} &bull; {stylist.role}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Rate Type Toggle */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Rate Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={() => setForm({ ...form, rateType: "COMMISSION" })}
                style={{
                  padding: "12px", borderRadius: 10,
                  border: form.rateType === "COMMISSION" ? "1.5px solid #c9973b" : "1.5px solid var(--border-light)",
                  background: form.rateType === "COMMISSION" ? "rgba(201,151,59,0.08)" : "var(--bg-secondary)",
                  color: form.rateType === "COMMISSION" ? "#c9973b" : "var(--text-secondary)",
                  fontSize: "0.82rem", fontWeight: 600, cursor: "pointer"
                }}>
                Commission (%)
              </button>
              <button
                onClick={() => setForm({ ...form, rateType: "FLAT" })}
                style={{
                  padding: "12px", borderRadius: 10,
                  border: form.rateType === "FLAT" ? "1.5px solid #c9973b" : "1.5px solid var(--border-light)",
                  background: form.rateType === "FLAT" ? "rgba(201,151,59,0.08)" : "var(--bg-secondary)",
                  color: form.rateType === "FLAT" ? "#c9973b" : "var(--text-secondary)",
                  fontSize: "0.82rem", fontWeight: 600, cursor: "pointer"
                }}>
                Flat Amount ($)
              </button>
            </div>
          </div>

          {/* Commission or Flat input */}
          {form.rateType === "COMMISSION" ? (
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>
                Commission Percentage (0 – 100)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number" min="0" max="100"
                  value={form.commissionPct}
                  onChange={(e) => setForm({ ...form, commissionPct: e.target.value })}
                  placeholder="e.g. 50"
                  style={{ width: "100%", padding: "10px 30px 10px 12px", borderRadius: 10, border: `1.5px solid ${errors.commissionPct ? "#f87171" : "var(--border-light)"}`, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                />
                <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>%</span>
              </div>
              {errors.commissionPct && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{errors.commissionPct}</p>}
            </div>
          ) : (
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>
                Flat Amount Per Booking
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>$</span>
                <input
                  type="number" min="0"
                  value={form.flatAmount}
                  onChange={(e) => setForm({ ...form, flatAmount: e.target.value })}
                  placeholder="e.g. 25"
                  style={{ width: "100%", padding: "10px 12px 10px 25px", borderRadius: 10, border: `1.5px solid ${errors.flatAmount ? "#f87171" : "var(--border-light)"}`, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              {errors.flatAmount && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{errors.flatAmount}</p>}
            </div>
          )}

          {/* Base Salary — divider */}
          <div style={{ height: 1, background: "var(--border-light)", margin: "0 -24px" }} />

          {/* Base Salary field */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 4 }}>
              Base Salary (optional)
            </label>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 8 }}>
              Fixed salary paid on top of the commission / flat rate above.
            </p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>$</span>
              <input
                type="number" min="0"
                value={form.baseSalary}
                onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                placeholder="e.g. 500"
                style={{ width: "100%", padding: "10px 12px 10px 25px", borderRadius: 10, border: `1.5px solid ${errors.baseSalary ? "#f87171" : "var(--border-light)"}`, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {errors.baseSalary && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{errors.baseSalary}</p>}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={onSave} disabled={saving}
              style={{ flex: 1.5, padding: "10px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {saving ? <><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block" }} />Saving...</> : <><Check style={{ width: 13, height: 13 }} />Save Rate</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


// -- View Invoice Details Modal ------------------------------------------------
function DetailModal({ invoice, updatingId, onUpdateStatus, onDelete, onClose }: {
  invoice: Invoice | null;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}) {
  if (!invoice) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,9,7,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1001,
        width: "min(94vw,640px)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border-light)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>Invoice Details</h2>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>ID: {invoice.id}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          {/* Metadata info */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, padding: 16, background: "var(--bg-secondary)", borderRadius: 16, border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)" }}>
                {invoice.stylist.avatar ? (
                  <Image src={invoice.stylist.avatar} alt={invoice.stylist.name} fill sizes="44px" style={{ objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 18 }} /></div>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{invoice.stylist.name}</h3>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{invoice.stylist.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", borderLeft: "1px solid var(--border-light)", paddingLeft: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Period:</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{invoice.periodStart} to {invoice.periodEnd}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Created:</span>
                <span style={{ color: "var(--text-primary)" }}>{formatDateShort(invoice.createdAt)}</span>
              </div>
              {invoice.paidAt && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Paid At:</span>
                  <span style={{ color: "var(--status-confirmed)", fontWeight: 600 }}>{invoice.paidAt}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Invoice Items</label>
            <div style={{ border: "1px solid var(--border-light)", borderRadius: 12, overflow: "hidden", background: "var(--bg-secondary)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-muted)" }}>Date</th>
                    <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-muted)" }}>Description</th>
                    <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-muted)", textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: "20px 14px", textAlign: "center", color: "var(--text-muted)" }}>No items in this invoice.</td>
                    </tr>
                  ) : (
                    invoice.items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{item.date}</td>
                        <td style={{ padding: "10px 14px", color: "var(--text-primary)", fontWeight: 500 }}>{item.description}</td>
                        <td style={{ padding: "10px 14px", color: "var(--text-primary)", fontWeight: 700, textAlign: "right" }}>{formatPrice(item.amount)}</td>
                      </tr>
                    ))
                  )}
                  {/* Total Row */}
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderTop: "1.5px solid var(--border-light)" }}>
                    <td colSpan={2} style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-primary)" }}>Total Amount Due</td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--gold)", fontSize: "0.88rem", textAlign: "right" }}>{formatPrice(invoice.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>Notes</label>
              <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-light)", borderRadius: 12, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {invoice.notes}
              </div>
            </div>
          )}

          {/* Status Actions & Invoice Management */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: 18, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Status:</span>
              <StatusBadge status={invoice.status} />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                disabled={updatingId != null}
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this invoice?")) {
                    await onDelete(invoice.id);
                  }
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                  color: "var(--status-cancelled)", fontSize: "0.76rem", fontWeight: 600, cursor: updatingId ? "not-allowed" : "pointer"
                }}>
                <Trash2 style={{ width: 13, height: 13 }} />
                Delete
              </button>

              {invoice.status !== "paid" && (
                <button
                  disabled={updatingId != null}
                  onClick={() => onUpdateStatus(invoice.id, "paid")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                    background: "var(--status-confirmed)", border: "none", color: "#062312", fontSize: "0.76rem", fontWeight: 700,
                    cursor: updatingId ? "not-allowed" : "pointer"
                  }}>
                  {updatingId === invoice.id ? (
                    <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(6,35,18,0.3)", borderTopColor: "#062312", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  ) : (
                    <Check style={{ width: 13, height: 13 }} />
                  )}
                  Mark as Paid
                </button>
              )}

              {invoice.status === "paid" && (
                <button
                  disabled={updatingId != null}
                  onClick={() => onUpdateStatus(invoice.id, "pending")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                    background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.76rem", fontWeight: 600,
                    cursor: updatingId ? "not-allowed" : "pointer"
                  }}>
                  Mark as Unpaid
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// -- Main Page Component -------------------------------------------------------
export default function AdminPayrollPage() {
  const {
    stylists, invoices, loading,
    activeTab, setActiveTab,
    filterStylist, setFilterStylist,
    filterStatus, setFilterStatus,
    totalPaid, totalPending, totalOverdue,
    // generate modal
    genModal, openGenModal, closeGenModal,
    genForm, setGenForm, genErrors, generating, generateInvoice,
    // rate modal
    rateModal, openRateModal, closeRateModal,
    rateStylist, rateForm, setRateForm, rateErrors, rateSaving, savePayRate,
    // detail
    detailInvoice, setDetailInvoice,
    updatingId, updateInvoiceStatus, deleteInvoice,
    refresh
  } = usePayroll();

  const { toasts, toast, remove } = useToast();

  const handleSavePayRate = async () => {
    const res = await savePayRate();
    if (res.ok) {
      toast("success", "Rate Saved", "Stylist pay rate updated successfully.");
      refresh();
    } else {
      toast("error", "Error Saving Rate", res.error ?? "Could not save pay rate.");
    }
  };

  const handleGenerateInvoice = async () => {
    const res = await generateInvoice();
    if (res.ok) {
      toast("success", "Invoice Generated", "New payroll invoice generated successfully.");
      refresh();
    } else {
      toast("error", "Error Generating", res.error ?? "Could not generate invoice.");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await updateInvoiceStatus(id, status);
    if (res.ok) {
      toast("success", `Invoice Marked as ${status.toUpperCase()}`, "Status updated successfully.");
      refresh();
    } else {
      toast("error", "Error Updating Status", res.error ?? "Could not update status.");
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    const res = await deleteInvoice(id);
    if (res.ok) {
      toast("success", "Invoice Deleted", "Payroll invoice deleted successfully.");
      refresh();
    } else {
      toast("error", "Error Deleting", res.error ?? "Could not delete invoice.");
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", animation: "fadeIn 0.3s ease-out" }}>
      {/* Toast container for displaying messages */}
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Payroll Management
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Configure stylist pay structures, calculate earnings, and manage payroll invoices.
          </p>
        </div>
        <button
          onClick={() => openGenModal()}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 20px", borderRadius: 11,
            background: "var(--grad-gold-btn)", border: "none",
            color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
          }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Generate Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "20px 24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-confirmed)" }}>
            <Wallet style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Total Paid</p>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4 }}>
              {loading ? <div style={skel(110, 24)} /> : formatPrice(totalPaid)}
            </h3>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "20px 24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-pending)" }}>
            <Clock style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Pending Invoices</p>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4 }}>
              {loading ? <div style={skel(110, 24)} /> : formatPrice(totalPending)}
            </h3>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "20px 24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-cancelled)" }}>
            <AlertCircle style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Overdue Invoices</p>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4 }}>
              {loading ? <div style={skel(110, 24)} /> : formatPrice(totalOverdue)}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, border: "1px solid var(--border-light)" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              background: activeTab === "overview" ? "rgba(255,255,255,0.06)" : "transparent",
              color: activeTab === "overview" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s"
            }}>
            Stylists Overview
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              background: activeTab === "invoices" ? "rgba(255,255,255,0.06)" : "transparent",
              color: activeTab === "invoices" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s"
            }}>
            Payroll Invoices
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={refresh}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 18px", borderRadius: 11,
              background: "var(--bg-card)", border: "1px solid var(--border-light)",
              color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
            }}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? "spin 1.7s linear infinite" : undefined }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stylist Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 24, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  {[
                    { label: "Stylist",            icon: User },
                    { label: "Completed Bookings", icon: null },
                    { label: "Total Revenue",      icon: null },
                    { label: "Pay Rate Config",    icon: Settings2 },
                    { label: "Estimated Earnings", icon: Wallet },
                    { label: "Actions",            icon: null },
                  ].map(({ label, icon: Icon }) => (
                    <th key={label} style={{ padding: "14px 20px", textAlign: label === "Actions" ? "right" : "left", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: label === "Actions" ? "flex-end" : "flex-start", gap: 5 }}>
                        {Icon && <Icon style={{ width: 11, height: 11, color: "var(--gold)", opacity: 0.7 }} />}
                        <span style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={skel(36, 36, 18)} />
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            <div style={skel(100, 14)} />
                            <div style={skel(70, 11)} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}><div style={skel(40, 14)} /></td>
                      <td style={{ padding: "16px 20px" }}><div style={skel(60, 14)} /></td>
                      <td style={{ padding: "16px 20px" }}><div style={skel(110, 14)} /></td>
                      <td style={{ padding: "16px 20px" }}><div style={skel(60, 14)} /></td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}><div style={{ display: "inline-flex", gap: 8 }}><div style={skel(80, 30, 6)} /><div style={skel(80, 30, 6)} /></div></td>
                    </tr>
                  ))
                ) : stylists.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>No stylists found.</td>
                  </tr>
                ) : (
                  stylists.map((s, idx) => {
                    const hasRate = s.payRate != null;
                    return (
                      <tr key={s.id} style={{ borderBottom: idx < stylists.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.15s" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)" }}>
                              {s.avatar ? (
                                <Image src={s.avatar} alt={s.name} fill sizes="36px" style={{ objectFit: "cover" }} />
                              ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 14 }} /></div>
                              )}
                            </div>
                            <div>
                              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</h4>
                              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.role}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontWeight: 500 }}>
                          {s.completedBookings} bookings
                        </td>
                        <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontWeight: 600 }}>
                          {formatPrice(s.totalRevenue)}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          {hasRate ? (
                            s.payRate?.rateType === "FLAT" ? (
                              <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "4px 10px", borderRadius: 99,
                                background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.18)",
                                fontSize: "0.74rem", fontWeight: 600, color: "var(--gold-light)"
                              }}>
                                {formatPrice(s.payRate.flatAmount ?? 0)} / booking
                              </div>
                            ) : (
                              <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "4px 10px", borderRadius: 99,
                                background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.18)",
                                fontSize: "0.74rem", fontWeight: 600, color: "var(--gold-light)"
                              }}>
                                {s.payRate?.commissionPct}% commission
                              </div>
                            )
                          ) : (
                            <div style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "4px 10px", borderRadius: 99,
                              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                              fontSize: "0.74rem", fontWeight: 600, color: "var(--status-cancelled)"
                            }}>
                              Not configured
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gold)", whiteSpace: "nowrap" }}>
                            {formatPrice(s.earnedAmount)}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 8 }}>
                            <button
                              onClick={() => openRateModal(s)}
                              style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8,
                                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)",
                                color: "var(--text-secondary)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer"
                              }}>
                              <Settings2 style={{ width: 12, height: 12 }} />
                              Configure Rate
                            </button>
                            <button
                              onClick={() => openGenModal(s.id)}
                              style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8,
                                background: "var(--grad-gold-btn)", border: "none",
                                color: "#0d0c0a", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer"
                              }}>
                              <FileText style={{ width: 12, height: 12 }} />
                              Generate Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll Invoices Tab */}
      {activeTab === "invoices" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Filters Row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 18, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>Filter by Stylist</label>
              <select value={filterStylist} onChange={(e) => setFilterStylist(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem", outline: "none" }}>
                <option value="all">All Stylists</option>
                {stylists.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>Filter by Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem", outline: "none" }}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Invoices List Table */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {[
                      { label: "Invoice ID",     icon: null },
                      { label: "Stylist",        icon: User },
                      { label: "Billing Period", icon: Calendar },
                      { label: "Amount Due",     icon: Wallet },
                      { label: "Status",         icon: null },
                      { label: "Actions",        icon: null },
                    ].map(({ label, icon: Icon }) => (
                      <th key={label} style={{ padding: "14px 20px", textAlign: label === "Actions" ? "right" : "left", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: label === "Actions" ? "flex-end" : "flex-start", gap: 5 }}>
                          {Icon && <Icon style={{ width: 11, height: 11, color: "var(--gold)", opacity: 0.7 }} />}
                          <span style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>{label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "16px 20px" }}><div style={skel(90, 14)} /></td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={skel(32, 32, 16)} />
                            <div style={skel(80, 14)} />
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px" }}><div style={skel(140, 14)} /></td>
                        <td style={{ padding: "16px 20px" }}><div style={skel(60, 14)} /></td>
                        <td style={{ padding: "16px 20px" }}><div style={skel(65, 20, 10)} /></td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}><div style={{ display: "inline-flex", gap: 8 }}><div style={skel(60, 30, 6)} /><div style={skel(30, 30, 6)} /></div></td>
                      </tr>
                    ))
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>No invoices found.</td>
                    </tr>
                  ) : (
                    invoices.map((inv, idx) => (
                      <tr key={inv.id} style={{ borderBottom: idx < invoices.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.15s" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 700, color: "var(--text-muted)", padding: "3px 8px", borderRadius: 6, background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
                            {inv.id}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)" }}>
                              {inv.stylist.avatar ? (
                                <Image src={inv.stylist.avatar} alt={inv.stylist.name} fill sizes="28px" style={{ objectFit: "cover" }} />
                              ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 12 }} /></div>
                              )}
                            </div>
                            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{inv.stylist.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                          {inv.periodStart} to {inv.periodEnd}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--gold)", whiteSpace: "nowrap" }}>
                            {formatPrice(inv.totalAmount)}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <StatusBadge status={inv.status} />
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 8 }}>
                            <button
                              onClick={() => setDetailInvoice(inv)}
                              style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8,
                                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)",
                                color: "var(--text-secondary)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer"
                              }}>
                              View Details
                            </button>
                            <button
                              disabled={updatingId != null}
                              onClick={() => handleDeleteInvoice(inv.id)}
                              style={{
                                width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(239,68,68,0.08)",
                                color: "var(--status-cancelled)", cursor: updatingId ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                              <Trash2 style={{ width: 13, height: 13 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {genModal && (
        <GenerateModal
          stylists={stylists}
          form={genForm}
          setForm={setGenForm}
          errors={genErrors}
          generating={generating}
          onGenerate={handleGenerateInvoice}
          onClose={closeGenModal}
        />
      )}

      {rateModal && (
        <RateModal
          stylist={rateStylist}
          form={rateForm}
          setForm={setRateForm}
          errors={rateErrors}
          saving={rateSaving}
          onSave={handleSavePayRate}
          onClose={closeRateModal}
        />
      )}

      {detailInvoice && (
        <DetailModal
          invoice={detailInvoice}
          updatingId={updatingId}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteInvoice}
          onClose={() => setDetailInvoice(null)}
        />
      )}
    </div>
  );
}
