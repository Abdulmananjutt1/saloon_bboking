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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/stylists`,
      { cache: "no-store" }
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}
