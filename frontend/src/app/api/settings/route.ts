import { NextRequest } from "next/server";
import prisma from "@/server/db";

export const DEFAULT_WORKING_HOURS = [
  { dayOfWeek: 0, dayName: "Sunday",    isOpen: false, openTime: "10:00", closeTime: "19:00" },
  { dayOfWeek: 1, dayName: "Monday",    isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 2, dayName: "Tuesday",   isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 3, dayName: "Wednesday", isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 4, dayName: "Thursday",  isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 5, dayName: "Friday",    isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 6, dayName: "Saturday",  isOpen: true,  openTime: "09:00", closeTime: "19:00" },
];

export async function GET() {
  try {
    const rows = await prisma.salonSettings.findMany();
    const map: Record<string, unknown> = {};
    for (const row of rows) {
      try { map[row.key] = JSON.parse(row.value); } catch { map[row.key] = row.value; }
    }
    if (!map["working_hours"]) map["working_hours"] = DEFAULT_WORKING_HOURS;
    return Response.json({ success: true, data: map });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return Response.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const updates = await req.json() as Record<string, unknown>;
    const upserts = Object.entries(updates).map(([key, value]) =>
      prisma.salonSettings.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      })
    );
    await Promise.all(upserts);
    return Response.json({ success: true, message: "Settings updated" });
  } catch (err) {
    console.error("[PATCH /api/settings]", err);
    return Response.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
