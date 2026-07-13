import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Check, Mail, Pencil, Phone, User, X } from "lucide-react";
import type { ClientBooking } from "@/hooks/useClientDashboard";
import type { ClientDashboardUser, ProfileErrors } from "./types";
import { pageSubtitleStyle, pageTitleStyle } from "./styles";
import { FavoriteStylistCard } from "./shared";

type SettingsTabProps = {
  user: ClientDashboardUser;
  totalBookings: number;
  loyaltyPoints: number;
  totalSpent: number;
  upcomingBookings: ClientBooking[];
  pastBookings: ClientBooking[];
  favoriteStylistId: string;
  profileForm: { name: string; phone: string };
  profileErrors: ProfileErrors;
  profileSaving: boolean;
  profileSaved: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  setProfileSaved: (value: boolean) => void;
  setProfileSaving: (value: boolean) => void;
  setProfileErrors: (value: ProfileErrors) => void;
  setProfileForm: Dispatch<SetStateAction<{ name: string; phone: string }>>;
  setFavoriteStylistId: (value: string) => void;
  updateProfile: (name: string, phone: string) => Promise<{ success: boolean; error?: string; errors?: ProfileErrors }>;
  toast: (type: "success" | "error" | "info", title: string, message?: string) => void;
};

export function SettingsTab({
  user,
  totalBookings,
  loyaltyPoints,
  totalSpent,
  upcomingBookings,
  pastBookings,
  favoriteStylistId,
  profileForm,
  profileErrors,
  profileSaving,
  profileSaved,
  editMode,
  setEditMode,
  setProfileSaved,
  setProfileSaving,
  setProfileErrors,
  setProfileForm,
  setFavoriteStylistId,
  updateProfile,
  toast,
}: SettingsTabProps) {
  const cancelEdit = () => {
    setEditMode(false);
    setProfileErrors({});
    setProfileForm({ name: user.name, phone: user.phone ?? "" });
  };

  const saveProfile = async () => {
    setProfileErrors({});
    setProfileSaving(true);
    const res = await updateProfile(profileForm.name, profileForm.phone);
    setProfileSaving(false);
    if (res.success) {
      setEditMode(false);
      setProfileSaved(true);
      toast("success", "Profile Updated", "Your information has been saved.");
      setTimeout(() => setProfileSaved(false), 3000);
    } else if (res.errors) {
      setProfileErrors(res.errors);
    } else {
      setProfileErrors({ general: res.error ?? "Something went wrong." });
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out", width: "100%", maxWidth: "100%" }}>
      <div className="client-dashboard-page-head" style={{ marginBottom: 32 }}>
        <h1 style={pageTitleStyle}>Profile Settings</h1>
        <p style={pageSubtitleStyle}>Manage your account details and preferences.</p>
      </div>

      <div style={{
        borderRadius: 20, overflow: "hidden", marginBottom: 16,
        border: "1px solid var(--border-light)",
        background: "var(--bg-card)",
      }}>
        <div style={{
          height: 80,
          background: "linear-gradient(135deg, rgba(201,151,59,0.22) 0%, rgba(201,151,59,0.06) 60%, transparent 100%)",
          borderBottom: "1px solid rgba(201,151,59,0.12)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: -20, right: 40, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,151,59,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 10, right: 130, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,151,59,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        </div>

        <div style={{ padding: "0 28px 28px", marginTop: -36 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "var(--grad-gold-btn)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.6rem", fontWeight: 900, color: "#0d0c0a",
              border: "3px solid var(--bg-card)",
              boxShadow: "0 8px 24px rgba(201,151,59,0.35)",
              fontFamily: "var(--font-display), Georgia, serif",
            }}>
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2, fontFamily: "var(--font-display), Georgia, serif" }}>{user.name}</p>
              <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: 4 }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Bookings", value: String(totalBookings) },
              { label: "Loyalty Points", value: `${loyaltyPoints} pts` },
              { label: "Total Spent", value: `Rs. ${totalSpent.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: "12px 14px", borderRadius: 12, textAlign: "center",
                background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
              }}>
                <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--gold)", fontFamily: "var(--font-display), Georgia, serif", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginTop: 5 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        borderRadius: 16, background: "var(--bg-card)",
        border: "1px solid var(--border-light)", marginBottom: 14,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "14px 22px", borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User style={{ width: 12, height: 12, color: "var(--gold)" }} />
            </div>
            <h3 style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>Personal Information</h3>
          </div>
          {!editMode ? (
            <button
              onClick={() => { setEditMode(true); setProfileSaved(false); setProfileErrors({}); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, cursor: "pointer", background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)", color: "var(--gold)", fontSize: "0.74rem", fontWeight: 700 }}
            >
              <Pencil style={{ width: 11, height: 11 }} /> Edit
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={cancelEdit} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, cursor: "pointer", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.74rem", fontWeight: 700 }}>
                <X style={{ width: 11, height: 11 }} /> Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={profileSaving}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, cursor: profileSaving ? "not-allowed" : "pointer", background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.74rem", fontWeight: 700, opacity: profileSaving ? 0.7 : 1 }}
              >
                {profileSaving
                  ? <><span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Saving...</>
                  : <><Check style={{ width: 11, height: 11 }} /> Save</>}
              </button>
            </div>
          )}
        </div>

        {profileErrors.general && (
          <div style={{ margin: "12px 22px 0", padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.78rem", color: "#f87171" }}>
            {profileErrors.general}
          </div>
        )}

        {profileSaved && !editMode && (
          <div style={{ margin: "12px 22px 0", padding: "10px 14px", borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", fontSize: "0.78rem", color: "#34d399", display: "flex", alignItems: "center", gap: 8 }}>
            <Check style={{ width: 13, height: 13 }} /> Profile updated successfully.
          </div>
        )}

        <ProfileField icon={<User style={{ width: 13, height: 13, color: "var(--text-muted)" }} />} label="Full Name">
          {editMode ? (
            <>
              <input value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} style={{ width: "100%", background: "var(--bg-secondary)", border: `1.5px solid ${profileErrors.name ? "#f87171" : "rgba(201,151,59,0.35)"}`, borderRadius: 9, padding: "8px 12px", fontSize: "0.86rem", color: "var(--text-primary)", outline: "none" }} />
              {profileErrors.name && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{profileErrors.name}</p>}
            </>
          ) : (
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</p>
          )}
        </ProfileField>

        <ProfileField icon={<Mail style={{ width: 13, height: 13, color: "var(--text-muted)" }} />} label="Email Address" readOnly>
          <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>{user.email}</p>
        </ProfileField>

        <ProfileField icon={<Phone style={{ width: 13, height: 13, color: "var(--text-muted)" }} />} label="Phone Number" isLast>
          {editMode ? (
            <>
              <input value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} style={{ width: "100%", background: "var(--bg-secondary)", border: `1.5px solid ${profileErrors.phone ? "#f87171" : "rgba(201,151,59,0.35)"}`, borderRadius: 9, padding: "8px 12px", fontSize: "0.86rem", color: "var(--text-primary)", outline: "none" }} />
              {profileErrors.phone && <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{profileErrors.phone}</p>}
            </>
          ) : (
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {user.phone || <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>Not provided</span>}
            </p>
          )}
        </ProfileField>
      </div>

      <FavoriteStylistCard
        bookings={[...upcomingBookings, ...pastBookings]}
        favoriteStylistId={favoriteStylistId}
        onChange={(id) => {
          setFavoriteStylistId(id);
          localStorage.setItem("gs_favorite_stylist_id", id);
          toast("success", "Favorite stylist saved", "Your next booking can start with this stylist selected.");
        }}
      />
    </div>
  );
}

function ProfileField({ icon, label, children, readOnly = false, isLast = false }: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  readOnly?: boolean;
  isLast?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 22px", borderBottom: isLast ? "none" : "1px solid var(--border-light)" }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 5 }}>{label}</p>
        {children}
      </div>
      {readOnly && (
        <span style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 99, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-muted)", flexShrink: 0 }}>
          Read only
        </span>
      )}
    </div>
  );
}
