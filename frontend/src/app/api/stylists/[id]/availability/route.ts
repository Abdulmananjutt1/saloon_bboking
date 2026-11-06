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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const availability = await prisma.stylistAvailability.findMany({
      where: { stylistId: id },
      orderBy: { dayOfWeek: "asc" },
    });

    const result = availability.length === 7
      ? availability
      : DEFAULT_SCHEDULE.map((def) => {
          const found = availability.find((a) => a.dayOfWeek === def.dayOfWeek);
          return found ?? { ...def, id: "", stylistId: id };
        });

    return Response.json({ success: true, data: result });
  } catch (err) {
    console.error("[GET /api/stylists/:id/availability]", err);
    return Response.json({ success: false, error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { schedule } = await req.json() as {
      schedule: { dayOfWeek: number; isWorking: boolean; startTime: string; endTime: string }[];
    };

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return Response.json({ success: false, error: "schedule array is required" }, { status: 422 });
    }

    const upserts = schedule.map((day) =>
      prisma.stylistAvailability.upsert({
        where: { stylistId_dayOfWeek: { stylistId: id, dayOfWeek: day.dayOfWeek } },
        update: { isWorking: day.isWorking, startTime: day.startTime, endTime: day.endTime },
        create: { stylistId: id, dayOfWeek: day.dayOfWeek, isWorking: day.isWorking, startTime: day.startTime, endTime: day.endTime },
      })
    );

    const result = await Promise.all(upserts);
    return Response.json({ success: true, data: result.sort((a, b) => a.dayOfWeek - b.dayOfWeek) });
  } catch (err) {
    console.error("[PUT /api/stylists/:id/availability]", err);
    return Response.json({ success: false, error: "Failed to save availability" }, { status: 500 });
  }
}
