"use client";

// ─────────────────────────────────────────────────────────
//  Admin — Services Page
//  Full CRUD for the service catalogue.
//  Components: ServiceCard · ServiceModal · ServiceDeleteModal · ServiceFilters
// ─────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { Plus, Tag } from "lucide-react";
import { useServices, type Service, type ServiceFormData } from "@/hooks/useServices";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { ServiceCard }        from "@/components/admin/services/ServiceCard";
import { ServiceModal }       from "@/components/admin/services/ServiceModal";
import { ServiceDeleteModal } from "@/components/admin/services/ServiceDeleteModal";
import { ServiceFilters }     from "@/components/admin/services/ServiceFilters";

export default function AdminServicesPage() {
  const { services, loading, error, createService, updateService, deleteService } = useServices();
  const { toasts, toast, remove } = useToast();

  // ── Filter state ──────────────────────────────────────
  const [search,         setSearch]        = useState("");
  const [activeCategory, setCategory]      = useState("");
  const [showInactive,   setShowInactive]  = useState(false);

  // ── Modal state ───────────────────────────────────────
  const [modalOpen,  setModalOpen]   = useState(false);
  const [editing,    setEditing]     = useState<Service | null>(null);
  const [saving,     setSaving]      = useState(false);
  const [modalError, setModalError]  = useState("");

  // ── Delete state ──────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  // ── Filtered list ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = showInactive ? services : services.filter((s) => s.isActive);
    if (activeCategory) list = list.filter((s) => s.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, showInactive, activeCategory, search]);

  // ── Handlers ──────────────────────────────────────────
  const openAdd = () => { setEditing(null); setModalError(""); setModalOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setModalError(""); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (data: ServiceFormData) => {
    setSaving(true);
    setModalError("");
    const result = editing
      ? await updateService(editing.id, data)
      : await createService(data);
    setSaving(false);
    if (result.ok) {
      toast("success", editing ? "Service updated" : "Service added",
        editing ? `${data.name} has been updated.` : `${data.name} has been added.`);
      closeModal();
    } else {
      setModalError(result.error ?? "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteService(deleteTarget.id);
    setDeleting(false);
    if (result.ok) {
      toast("success", "Service removed", `${deleteTarget.name} has been deactivated.`);
    } else {
      toast("error", "Failed to remove", result.error ?? "Something went wrong");
    }
    setDeleteTarget(null);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            Services
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            {services.filter((s) => s.isActive).length} active · {services.length} total
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 20px", borderRadius: 11,
            background: "var(--grad-gold-btn)", border: "none",
            color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(201,151,59,0.3)",
          }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Add Service
        </button>
      </div>

      {/* ── Filters ── */}
      <ServiceFilters
        search={search}
        activeCategory={activeCategory}
        showInactive={showInactive}
        onSearch={setSearch}
        onCategory={setCategory}
        onToggleInactive={() => setShowInactive((v) => !v)}
        totalCount={services.length}
        filteredCount={filtered.length}
      />

      {/* ── Loading skeletons ── */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ height: 340, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border-light)", animation: "pulse 1.4s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={{ padding: 24, borderRadius: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Tag style={{ width: 48, height: 48, color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            {search || activeCategory ? "No services match" : "No services yet"}
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 24 }}>
            {search || activeCategory ? "Try adjusting your filters" : "Add your first service to get started"}
          </p>
          {!search && !activeCategory && (
            <button onClick={openAdd} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 24px", borderRadius: 11, border: "none",
              background: "var(--grad-gold-btn)", color: "#0d0c0a",
              fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
            }}>
              <Plus style={{ width: 15, height: 15 }} /> Add First Service
            </button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <ServiceModal
        open={modalOpen}
        service={editing}
        saving={saving}
        error={modalError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
      <ServiceDeleteModal
        service={deleteTarget}
        deleting={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
