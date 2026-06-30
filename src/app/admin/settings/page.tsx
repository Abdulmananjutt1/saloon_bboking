"use client";

import { useState } from "react";
import { User, Store, Bell, Palette, Shield, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully.");
    }, 600);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Settings</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>Manage salon configurations and your admin profile.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 10, background: "var(--grad-gold-btn)",
            color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, border: "none", cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 6px 20px rgba(201,151,59,0.25)", transition: "all 0.2s"
          }}
        >
          <Save style={{ width: 16, height: 16 }} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        
        {/* Settings Sidebar Navigation */}
        <div style={{
          width: 240, flexShrink: 0, padding: 16, borderRadius: 16,
          background: "var(--bg-card)", border: "1px solid var(--border-light)",
          display: "flex", flexDirection: "column", gap: 4
        }}>
          <TabButton icon={<Store />} label="Salon Details" active={activeTab === "general"} onClick={() => setActiveTab("general")} />
          <TabButton icon={<User />} label="Admin Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <TabButton icon={<Bell />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <TabButton icon={<Palette />} label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
          <TabButton icon={<Shield />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
        </div>

        {/* Settings Content Area */}
        <div style={{
          flex: 1, padding: 32, borderRadius: 16,
          background: "var(--bg-card)", border: "1px solid var(--border-light)"
        }}>
          
          {activeTab === "general" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Salon Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <InputField label="Salon Name" defaultValue="Glamour Studio" />
                <InputField label="Contact Email" defaultValue="hello@glamourstudio.pk" />
                <InputField label="Contact Phone" defaultValue="+92 300 1234567" />
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Business Address</label>
                  <textarea 
                    defaultValue="123 Fashion Avenue, DHA Phase 5, Lahore"
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 10, minHeight: 80,
                      background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-light)", color: "var(--text-primary)", outline: "none", fontSize: "0.85rem", resize: "vertical"
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Admin Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 10 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "#0d0c0a" }}>
                    A
                  </div>
                  <button style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "0.8rem", cursor: "pointer" }}>Change Avatar</button>
                </div>
                <InputField label="Full Name" defaultValue="Super Admin" />
                <InputField label="Email Address" defaultValue="admin@glamour.pk" />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Alert Preferences</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ToggleRow label="New Booking Alerts" description="Receive a ding when a client makes a new booking." defaultChecked={true} />
                <ToggleRow label="Chat Notifications" description="Show badge when a client sends a message in support chat." defaultChecked={true} />
                <ToggleRow label="Daily Summary Report" description="Email me a summary of total revenue and appointments every evening." defaultChecked={false} />
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Theme Configuration</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20 }}>
                Use the quick toggle in the top navigation bar to switch between dark and light themes instantly.
              </p>
              <div style={{ padding: 20, borderRadius: 12, background: "rgba(201,151,59,0.05)", border: "1px solid rgba(201,151,59,0.2)" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--gold)", fontWeight: 600 }}>Theme changes are saved locally to your device.</p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Password & Security</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <InputField label="Current Password" type="password" placeholder="••••••••" />
                <InputField label="New Password" type="password" placeholder="••••••••" />
                <InputField label="Confirm New Password" type="password" placeholder="••••••••" />
                <button style={{ alignSelf: "flex-start", padding: "10px 20px", borderRadius: 8, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, marginTop: 10, cursor: "pointer" }}>
                  Update Password
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Components ──

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer",
      background: active ? "var(--grad-gold-btn)" : "transparent",
      color: active ? "#0d0c0a" : "var(--text-secondary)",
      fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s", textAlign: "left"
    }}>
      <span style={{ width: 16, height: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

function InputField({ label, defaultValue, type = "text", placeholder = "" }: { label: string, defaultValue?: string, type?: string, placeholder?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</label>
      <input 
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 10,
          background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-light)", color: "var(--text-primary)", outline: "none", fontSize: "0.85rem"
        }}
      />
    </div>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string, description: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-light)" }}>
      <div>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{label}</p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, position: "relative", cursor: "pointer", border: "none",
          background: checked ? "var(--gold)" : "rgba(255,255,255,0.1)", transition: "all 0.2s"
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: checked ? 23 : 3, transition: "all 0.2s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }} />
      </button>
    </div>
  );
}
