"use client";

import { SettingsTab } from "./SettingsTab";
import { useDashboardContext } from "./DashboardContext";

export default function SettingsPage() {
  const {
    user, totalBookings, loyaltyPoints, totalSpent,
    upcomingBookings, pastBookings,
    favoriteStylistId, profileForm, profileErrors,
    profileSaving, profileSaved, editMode,
    setEditMode, setProfileSaved, setProfileSaving, setProfileErrors, setProfileForm,
    setFavoriteStylistId, updateProfile, toast,
  } = useDashboardContext();

  if (!user) return null;

  return (
    <SettingsTab
      user={user}
      totalBookings={totalBookings}
      loyaltyPoints={loyaltyPoints}
      totalSpent={totalSpent}
      upcomingBookings={upcomingBookings}
      pastBookings={pastBookings}
      favoriteStylistId={favoriteStylistId}
      profileForm={profileForm}
      profileErrors={profileErrors}
      profileSaving={profileSaving}
      profileSaved={profileSaved}
      editMode={editMode}
      setEditMode={setEditMode}
      setProfileSaved={setProfileSaved}
      setProfileSaving={setProfileSaving}
      setProfileErrors={setProfileErrors}
      setProfileForm={setProfileForm}
      setFavoriteStylistId={setFavoriteStylistId}
      updateProfile={updateProfile}
      toast={toast}
    />
  );
}
