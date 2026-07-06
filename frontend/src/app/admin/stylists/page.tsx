"use client";

import { useState } from "react";
import { Plus, Users, Search } from "lucide-react";
import { useStylists, type Stylist, type StylistFormData } from "@/hooks/useStylists";
import { useToast } from "@/components/ui/Toast";
import { ToastContainer } from "@/components/ui/Toast";
import { StylistCard } from "@/components/admin/stylists/StylistCard";
import { StylistModal } from "@/components/admin/stylists/StylistModal";
import { DeleteConfirmModal } from "@/components/admin/stylists/DeleteConfirmModal";

export default function AdminStylistsPage() {
  const { stylists, loading, error, createStylist, updateStylist, deleteStylist } = useStylists();
  const { toasts, toast, remove } = useToast();

  // Search
  const [search, setSearch] = useState("");

  // Add / Edit modal
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Stylist | null>(null);
  const [saving, setSaving]         = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Stylist | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const filtered = stylists.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Handlers ── */
  const openAdd = () => { setEditing(null); setModalError(""); setModalOpen(true); };
  const openEdit = (s: Stylist) => { setEditing(s); setModalError(""); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (data: StylistFormData) => {
    setSaving(true);
    setModalError("");
    const result = editing
      ? await updateStylist(editing.id, data)
      : await createStylist(data);
    setSaving(false);
    if (result.ok) {
      toast("success", editing ? "Stylist updated" : "Stylist added", editing ? `${data.name} has been updated.` : `${data.name} has been added.`);
      closeModal();
    } else {
      setModalError(result.error ?? "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteStylist(deleteTarget.id);
    setDeleting(false);
    if (result.ok) {
      toast("success", "Stylist removed", `${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
    } else {
      toast("error", "Failed to remove", result.error ?? "Something went wrong");
      setDeleteTarget(null);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Stylists
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            {stylists.length} stylists · {stylists.filter((s) => s.available).length} available
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 20px", borderRadius: 11,
            background: "var(--grad-gold-btn)", border: "none",
            color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
          }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Add Stylist
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{ position: "relative", maxWidth: 360, marginBottom: 28 }}>
        <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or role…"
          style={{
            width: "100%", padding: "10px 12px 10px 36px",
            borderRadius: 10, border: "1px solid var(--border-light)",
            background: "var(--bg-card)", color: "var(--text-primary)",
            fontSize: "0.85rem", outline: "none", boxSizing: "border-box"
          }}
        />
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 380, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border-light)", animation: "pulse 1.4s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={{ padding: "24px", borderRadius: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Users style={{ width: 48, height: 48, color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            {search ? "No stylists found" : "No stylists yet"}
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 24 }}>
            {search ? "Try a different search term" : "Add your first stylist to get started"}
          </p>
          {!search && (
            <button onClick={openAdd} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 24px", borderRadius: 11, border: "none",
              background: "var(--grad-gold-btn)", color: "#0d0c0a",
              fontSize: "0.85rem", fontWeight: 700, cursor: "pointer"
            }}>
              <Plus style={{ width: 15, height: 15 }} /> Add First Stylist
            </button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {filtered.map((s) => (
            <StylistCard
              key={s.id}
              stylist={s}
              onEdit={openEdit}
              onDelete={(s) => setDeleteTarget(s)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <StylistModal
        open={modalOpen}
        stylist={editing}
        saving={saving}
        error={modalError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmModal
        stylist={deleteTarget}
        deleting={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
