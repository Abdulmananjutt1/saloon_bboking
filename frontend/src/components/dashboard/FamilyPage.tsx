"use client";

import { FamilyProfilesPage } from "./FamilyProfiles";
import { useDashboardContext } from "./DashboardContext";

export default function FamilyPage() {
  const { familyProfiles, user, setShowFamilyModal, deleteFamilyProfile } = useDashboardContext();

  if (!user) return null;

  return (
    <FamilyProfilesPage
      profiles={familyProfiles}
      userName={user.name}
      onAdd={() => setShowFamilyModal(true)}
      onDelete={deleteFamilyProfile}
    />
  );
}
