import { NextRequest } from "next/server";
import prisma from "@/server/db";

const DEFAULT_SCHEDULE = [
  { dayOfWeek: 0, isWorking: false, startTime: "09:00", endTime: "19:00" },
  { dayOfWeek: 1, isWorking: true,  startTime: "09:00", endTime: "19:00" },
  { dayOfWeek: 2, isWorking: true,  startTime: "09:00", endTime: "19:00" },
  { dayOfWeek: 3, isWorking: true,  startTime: "09:00", endTime: "19:00" },
  { dayOfWeek: 4, isWorking: true,  startTime: "09:00", endTime: "19:00" },
  { dayOfWeek: 5, isWorking: true,  startTime: "09:00", endTime: "19:00" },
  { dayOfWeek: 6, isWorking: true,  startTime: "09:00", endTime: "17:00" },
];

export async function GET() {
  try {
    const stylists = await prisma.stylist.findMany({
      where: { isActive: true },
      include: { specialties: true, slots: true, availability: true },
      orderBy: { name: "asc" },
    });
    return Response.json({ success: true, data: stylists });
  } catch (err) {
    console.error("[GET /api/stylists]", err);
    return Response.json({ success: false, error: "Failed to fetch stylists" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, role, avatar, bio, experience, available, specialties } = await req.json();
    if (!name || !role || !bio || experience === undefined) {
      return Response.json({ success: false, error: "name, role, bio, experience are required" }, { status: 400 });
    }

    const stylist = await prisma.stylist.create({
      data: {
        name, role,
        avatar: avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        bio, experience: Number(experience),
        available: available !== false,
        specialties: specialties?.length ? { create: (specialties as string[]).map((s) => ({ name: s })) } : undefined,
        availability: { create: DEFAULT_SCHEDULE },
      },
      include: { specialties: true, slots: true, availability: true },
    });

    return Response.json({ success: true, data: stylist }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/stylists]", err);
    return Response.json({ success: false, error: "Failed to create stylist" }, { status: 500 });
  }
}
