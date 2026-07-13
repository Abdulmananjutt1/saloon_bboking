import { API_BASE_URL } from "../config";

export interface ApiStylist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  specialties: { id: string; name: string }[];
}

export async function fetchStylists(): Promise<ApiStylist[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stylists`, { cache: "no-store" });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}
