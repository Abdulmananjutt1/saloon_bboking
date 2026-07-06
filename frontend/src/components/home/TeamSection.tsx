import TeamPreviewSection from "@/components/sections/TeamPreviewSection";
import type { Stylist } from "@/types";

interface TeamSectionProps {
  stylists: Stylist[];
}

export default function TeamSection({ stylists }: TeamSectionProps) {
  return <TeamPreviewSection stylists={stylists} />;
}
