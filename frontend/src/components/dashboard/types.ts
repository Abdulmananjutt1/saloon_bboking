export type DashboardTab = "overview" | "appointments" | "family" | "notifications" | "chat" | "settings";

export type FamilyProfile = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

export type ProfileErrors = {
  name?: string;
  phone?: string;
  general?: string;
};

export type ClientDashboardUser = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
};
