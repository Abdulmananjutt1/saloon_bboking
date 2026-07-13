import type { ReactNode } from "react";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
