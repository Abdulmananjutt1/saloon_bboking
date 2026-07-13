"use client";

import { Download, Eye, Plus, X, AlertCircle, Search, CheckCircle } from "lucide-react";
import { CLIENT_AVATAR_COLORS } from "@/constants";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";

export default function AdminClientsPage() {
  const {
    clients, loading, search, setSearch,
    showModal, openModal, closeModal,
    form, setField, errors, apiError, saving, saved,
    createClient,
  } = useClients();

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-clients-header {
            align-items: stretch !important;
          }
          .admin-clients-title {
            font-size: 1.8rem !important;
          }
          .admin-clients-actions {
            width: 100%;
          }
          .admin-clients-actions button {
            flex: 1;
            justify-content: center;
            padding-inline: 12px !important;
          }
          .admin-clients-search {
            max-width: none !important;
          }
          .admin-clients-table table {
            min-width: 760px;
          }
          .admin-client-modal-overlay {
            align-items: flex-end !important;
            padding: 12px !important;
          }
          .admin-client-modal {
            max-width: none !important;
            max-height: calc(100dvh - 24px);
            overflow-y: auto;
            border-radius: 18px !important;
            padding: 24px 18px !important;
          }
          .admin-client-form-actions {
            flex-direction: column-reverse;
          }
          .admin-client-form-actions button {
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="admin-clients-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h1 className="admin-clients-title" style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Clients
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{clients.length} registered clients</p>
        </div>
        <div className="admin-clients-actions" style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11, background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
            <Download style={{ width: 14, height: 14 }} /> Export
          </button>
          <button onClick={openModal} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(201,151,59,0.3)" }}>
            <Plus style={{ width: 14, height: 14 }} /> Add Client
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="admin-clients-search" style={{ position: "relative", maxWidth: 360, marginBottom: 20 }}>
        <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--text-muted)" }} />
        <input
          type="text" placeholder="Search by name, email or phone…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 11, padding: "10px 14px 10px 36px", fontSize: "0.82rem", color: "var(--text-primary)", outline: "none" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading clients…</div>
        ) : clients.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {search ? `No clients found for "${search}"` : "No clients yet. Add your first client above."}
          </div>
        ) : (
          <div className="admin-clients-table" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  {["Client", "Phone", "Total Visits", "Total Spent", "Last Visit", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "14px 22px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < clients.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                    <td style={{ padding: "16px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${CLIENT_AVATAR_COLORS[i % CLIENT_AVATAR_COLORS.length]}22`, border: `1px solid ${CLIENT_AVATAR_COLORS[i % CLIENT_AVATAR_COLORS.length]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: CLIENT_AVATAR_COLORS[i % CLIENT_AVATAR_COLORS.length], flexShrink: 0 }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</p>
                          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px" }}><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.phone}</span></td>
                    <td style={{ padding: "16px 22px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", fontSize: "0.8rem", fontWeight: 700, color: "var(--gold)" }}>
                        {c.totalVisits}
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px" }}><span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--gold)" }}>{formatPrice(c.totalSpent)}</span></td>
                    <td style={{ padding: "16px 22px" }}><span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.lastVisit ? formatDateShort(c.lastVisit) : "—"}</span></td>
                    <td style={{ padding: "16px 22px" }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)", color: "var(--gold)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>
                        <Eye style={{ width: 12, height: 12 }} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Client Modal ── */}
      {showModal && (
        <div className="admin-client-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="admin-client-modal" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 24, padding: "32px 36px", width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative" }}>

            <button onClick={closeModal} style={{ position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
              <X style={{ width: 14, height: 14 }} />
            </button>

            {saved ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--status-confirmed-bg)", border: "1px solid var(--status-confirmed-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle style={{ width: 28, height: 28, color: "var(--status-confirmed)" }} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Client Added!</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Client record has been created successfully.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Add New Client</h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 24 }}>Fill in the client details below.</p>

                {apiError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--color-error-bg)", border: "1px solid var(--color-error-border)", marginBottom: 18 }}>
                    <AlertCircle style={{ width: 14, height: 14, color: "var(--color-error)", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.78rem", color: "var(--color-error)" }}>{apiError}</p>
                  </div>
                )}

                <form onSubmit={createClient} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {([
                    { label: "Full Name", key: "name",  type: "text",  placeholder: "Fatima Khan" },
                    { label: "Email",     key: "email", type: "email", placeholder: "client@email.com" },
                    { label: "Phone",     key: "phone", type: "tel",   placeholder: "0300-1234567" },
                  ] as const).map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 6 }}>{label}</label>
                      <input type={type} required placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        style={{ width: "100%", background: "var(--bg-secondary)", border: `1.5px solid ${errors[key] ? "var(--color-error)" : "var(--border-light)"}`, borderRadius: 10, padding: "10px 13px", fontSize: "0.85rem", color: "var(--text-primary)", outline: "none" }}
                      />
                      {errors[key] && (
                        <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.68rem", color: "var(--color-error)", marginTop: 4 }}>
                          <AlertCircle style={{ width: 10, height: 10 }} />{errors[key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 6 }}>Notes (Optional)</label>
                    <textarea rows={2} placeholder="Any notes about this client…"
                      value={form.notes} onChange={(e) => setField("notes", e.target.value)}
                      style={{ width: "100%", background: "var(--bg-secondary)", border: "1.5px solid var(--border-light)", borderRadius: 10, padding: "10px 13px", fontSize: "0.85rem", color: "var(--text-primary)", outline: "none", resize: "none", fontFamily: "inherit" }}
                    />
                  </div>

                  <div className="admin-client-form-actions" style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button type="button" onClick={closeModal} style={{ flex: 1, padding: "11px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} style={{ flex: 2, padding: "11px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 4px 16px rgba(201,151,59,0.25)" }}>
                      {saving ? "Saving…" : "Add Client"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
