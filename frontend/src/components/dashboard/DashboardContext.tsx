"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { popSessionToast } from "@/lib/session";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { notificationService, type AppNotification } from "@/services/notifications";
import { buildClientNotificationFeed, type ClientNotificationItem } from "./notifications";
import { DashboardResponsiveStyles } from "./DashboardResponsiveStyles";
import { DashboardSidebar } from "./DashboardSidebar";
import { FamilyProfileModal, familyProfilesStorageKey } from "./FamilyProfiles";
import { ReviewModal } from "./ReviewModal";
import type { DashboardTab, FamilyProfile, ProfileErrors } from "./types";

type ClientDashboardData = ReturnType<typeof useClientDashboard>;
type ToastFn = ReturnType<typeof useToast>["toast"];

type DashboardContextValue = ClientDashboardData & {
  activeTab: DashboardTab;
  dashboardNotifications: ClientNotificationItem[];
  totalNotificationUnread: number;
  familyProfiles: FamilyProfile[];
  showFamilyModal: boolean;
  setShowFamilyModal: (value: boolean) => void;
  saveFamilyProfile: (profile: Omit<FamilyProfile, "id">) => void;
  deleteFamilyProfile: (id: string) => void;
  reviewBookingId: string | null;
  setReviewBookingId: (value: string | null) => void;
  favoriteStylistId: string;
  setFavoriteStylistId: (value: string) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  profileForm: { name: string; phone: string };
  setProfileForm: Dispatch<SetStateAction<{ name: string; phone: string }>>;
  profileErrors: ProfileErrors;
  setProfileErrors: (value: ProfileErrors) => void;
  profileSaving: boolean;
  setProfileSaving: (value: boolean) => void;
  profileSaved: boolean;
  setProfileSaved: (value: boolean) => void;
  toast: ToastFn;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboardContext() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboardContext must be used inside DashboardProvider");
  return value;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeTab = tabFromPath(pathname);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [favoriteStylistId, setFavoriteStylistId] = useState("");
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [notificationUnread, setNotificationUnread] = useState(0);
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const { toasts, toast, remove } = useToast();
  const dashboard = useClientDashboard();
  const { user, upcomingBookings, pastBookings, appointmentUnread, markAppointmentsRead, markChatRead, markChatClosed, unreadCount, logout } = dashboard;

  useEffect(() => {
    const t = popSessionToast();
    if (t) toast(t.type as "success" | "error" | "info", t.title, t.message);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, phone: user.phone ?? "" });
  }, [user]);

  useEffect(() => {
    const stored = localStorage.getItem("gs_favorite_stylist_id");
    if (stored) setFavoriteStylistId(stored);
  }, []);

  useEffect(() => {
    return notificationService.subscribe((items) => {
      const visibleItems = items.filter((n) => n.type !== "chat" && n.screen !== "chat");
      setNotifs(visibleItems);
      setNotificationUnread(visibleItems.filter((n) => !n.read).length);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setFamilyProfiles([]);
      return;
    }

    try {
      const key = familyProfilesStorageKey(user);
      const stored = localStorage.getItem(key);
      if (stored) {
        setFamilyProfiles(JSON.parse(stored) as FamilyProfile[]);
        return;
      }

      const legacy = localStorage.getItem("gs_family_profiles");
      if (legacy) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem("gs_family_profiles");
        setFamilyProfiles(JSON.parse(legacy) as FamilyProfile[]);
        return;
      }

      setFamilyProfiles([]);
    } catch {
      setFamilyProfiles([]);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "chat") markChatRead();
    else markChatClosed();

    if (activeTab === "appointments") markAppointmentsRead();
    setShowMobileMenu(false);
    setShowProfileMenu(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const dashboardNotifications = useMemo(
    () => buildClientNotificationFeed(notifs, upcomingBookings, pastBookings),
    [notifs, upcomingBookings, pastBookings]
  );
  const totalNotificationUnread = notificationUnread + appointmentUnread;

  const saveFamilyProfile = (profile: Omit<FamilyProfile, "id">) => {
    const next = [...familyProfiles, { ...profile, id: `fp-${Date.now()}` }];
    setFamilyProfiles(next);
    if (user) localStorage.setItem(familyProfilesStorageKey(user), JSON.stringify(next));
    setShowFamilyModal(false);
    toast("success", "Profile added", `${profile.name} is ready for quicker bookings.`);
  };

  const deleteFamilyProfile = (id: string) => {
    const next = familyProfiles.filter((profile) => profile.id !== id);
    setFamilyProfiles(next);
    if (user) localStorage.setItem(familyProfilesStorageKey(user), JSON.stringify(next));
    toast("success", "Profile removed", "Family profile has been removed.");
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", border: "4px solid rgba(201,151,59,0.2)", borderTopColor: "var(--gold)", animation: "spin 1s linear infinite" }} />
        <DashboardResponsiveStyles />
      </div>
    );
  }

  const value: DashboardContextValue = {
    ...dashboard,
    activeTab,
    dashboardNotifications,
    totalNotificationUnread,
    familyProfiles,
    showFamilyModal,
    setShowFamilyModal,
    saveFamilyProfile,
    deleteFamilyProfile,
    reviewBookingId,
    setReviewBookingId,
    favoriteStylistId,
    setFavoriteStylistId,
    editMode,
    setEditMode,
    profileForm,
    setProfileForm,
    profileErrors,
    setProfileErrors,
    profileSaving,
    setProfileSaving,
    profileSaved,
    setProfileSaved,
    toast,
  };

  return (
    <DashboardContext.Provider value={value}>
      <div className="client-dashboard-shell" style={{
        height: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
        display: "flex",
        overflow: "hidden",
      }}>
        <ToastContainer toasts={toasts} onRemove={remove} />
        {showMobileMenu && (
          <button
            aria-label="Close menu"
            className="client-mobile-overlay"
            onClick={() => setShowMobileMenu(false)}
          />
        )}
        <DashboardSidebar
          activeTab={activeTab}
          showMobileMenu={showMobileMenu}
          showProfileMenu={showProfileMenu}
          user={user}
          appointmentUnread={appointmentUnread}
          totalNotificationUnread={totalNotificationUnread}
          unreadCount={unreadCount}
          logout={logout}
          setShowMobileMenu={setShowMobileMenu}
          setShowProfileMenu={setShowProfileMenu}
        />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", minHeight: 0, overflow: "hidden" }}>
          <header className="client-mobile-header">
            <Link href={ROUTES.HOME} className="client-mobile-brand">
              <Logo size={36} />
              <span>{APP_NAME}</span>
            </Link>
            <button
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
              className="client-mobile-menu-button"
              onClick={() => setShowMobileMenu((v) => !v)}
            >
              {showMobileMenu ? <X size={19} /> : <Menu size={19} />}
            </button>
          </header>
          <main className="client-dashboard-main" style={{ flex: 1, minHeight: 0, padding: 28, overflowY: "auto", overflowX: "hidden" }}>
            {children}
          </main>
        </div>
        {reviewBookingId && (
          <ReviewModal
            booking={pastBookings.find((b) => b.id === reviewBookingId)}
            onClose={() => setReviewBookingId(null)}
            onSubmit={() => {
              toast("success", "Review saved", "Thank you for rating your visit.");
              setReviewBookingId(null);
            }}
          />
        )}
        {showFamilyModal && (
          <FamilyProfileModal
            onClose={() => setShowFamilyModal(false)}
            onSubmit={saveFamilyProfile}
          />
        )}
        <DashboardResponsiveStyles />
      </div>
    </DashboardContext.Provider>
  );
}

function tabFromPath(pathname: string | null): DashboardTab {
  if (pathname?.endsWith("/appointments")) return "appointments";
  if (pathname?.endsWith("/family")) return "family";
  if (pathname?.endsWith("/notifications")) return "notifications";
  if (pathname?.endsWith("/chat")) return "chat";
  if (pathname?.endsWith("/settings")) return "settings";
  return "overview";
}
