// ─────────────────────────────────────────────────────────
//  Stylists Routes — Glamour Studio
//  GET    /stylists               – list all active
//  GET    /stylists/:id           – get one
//  POST   /stylists               – create
//  PATCH  /stylists/:id           – update
//  DELETE /stylists/:id           – soft delete
//  GET    /stylists/:id/availability  – get schedule
//  PUT    /stylists/:id/availability  – replace full schedule
// ─────────────────────────────────────────────────────────

import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// ── Default availability schedule (Mon–Sat, 9 AM–7 PM) ──
const DEFAULT_SCHEDULE = [
  { dayOfWeek: 0, isWorking: false, startTime: "09:00", endTime: "19:00" }, // Sun
  { dayOfWeek: 1, isWorking: true,  startTime: "09:00", endTime: "19:00" }, // Mon
  { dayOfWeek: 2, isWorking: true,  startTime: "09:00", endTime: "19:00" }, // Tue
  { dayOfWeek: 3, isWorking: true,  startTime: "09:00", endTime: "19:00" }, // Wed
  { dayOfWeek: 4, isWorking: true,  startTime: "09:00", endTime: "19:00" }, // Thu
  { dayOfWeek: 5, isWorking: true,  startTime: "09:00", endTime: "19:00" }, // Fri
  { dayOfWeek: 6, isWorking: true,  startTime: "09:00", endTime: "17:00" }, // Sat
];

// ── GET /stylists ─────────────────────────────────────────
router.get("/", async (_req: Request, res: Response) => {
  try {
    const stylists = await prisma.stylist.findMany({
      where: { isActive: true },
      include: { specialties: true, slots: true, availability: true },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: stylists });
  } catch (err) {
    console.error("[GET /stylists]", err);
    res.status(500).json({ success: false, error: "Failed to fetch stylists" });
  }
});

// ── GET /stylists/:id ─────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const stylist = await prisma.stylist.findUnique({
      where: { id: req.params.id },
      include: { specialties: true, slots: true, availability: true },
    });
    if (!stylist) return res.status(404).json({ success: false, error: "Stylist not found" });
    res.json({ success: true, data: stylist });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch stylist" });
  }
});

// ── POST /stylists ────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, role, avatar, bio, experience, available, specialties } = req.body;
    if (!name || !role || !bio || experience === undefined) {
      return res.status(400).json({ success: false, error: "name, role, bio, experience are required" });
    }
    const stylist = await prisma.stylist.create({
      data: {
        name,
        role,
        avatar: avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        bio,
        experience: Number(experience),
        available: available !== false,
        specialties: specialties?.length
          ? { create: (specialties as string[]).map((s) => ({ name: s })) }
          : undefined,
        // Seed with default schedule on creation
        availability: {
          create: DEFAULT_SCHEDULE,
        },
      },
      include: { specialties: true, slots: true, availability: true },
    });
    res.status(201).json({ success: true, data: stylist });
  } catch (err) {
    console.error("[POST /stylists]", err);
    res.status(500).json({ success: false, error: "Failed to create stylist" });
  }
});

// ── PATCH /stylists/:id ───────────────────────────────────
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { name, role, avatar, bio, experience, available, specialties } = req.body;
    if (specialties !== undefined) {
      await prisma.stylistSpecialty.deleteMany({ where: { stylistId: req.params.id } });
    }
    const stylist = await prisma.stylist.update({
      where: { id: req.params.id },
      data: {
        ...(name       !== undefined && { name }),
        ...(role       !== undefined && { role }),
        ...(avatar     !== undefined && { avatar }),
        ...(bio        !== undefined && { bio }),
        ...(experience !== undefined && { experience: Number(experience) }),
        ...(available  !== undefined && { available }),
        ...(specialties !== undefined && {
          specialties: { create: (specialties as string[]).map((s) => ({ name: s })) },
        }),
      },
      include: { specialties: true, slots: true, availability: true },
    });
    res.json({ success: true, data: stylist });
  } catch (err) {
    console.error("[PATCH /stylists/:id]", err);
    res.status(500).json({ success: false, error: "Failed to update stylist" });
  }
});

// ── DELETE /stylists/:id (soft delete) ───────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.stylist.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true, message: "Stylist removed" });
  } catch (err) {
    console.error("[DELETE /stylists/:id]", err);
    res.status(500).json({ success: false, error: "Failed to delete stylist" });
  }
});

// ── GET /stylists/:id/availability ───────────────────────
router.get("/:id/availability", async (req: Request, res: Response) => {
  try {
    const availability = await prisma.stylistAvailability.findMany({
      where: { stylistId: req.params.id },
      orderBy: { dayOfWeek: "asc" },
    });

    // If no schedule exists yet, return defaults
    const result = availability.length === 7
      ? availability
      : DEFAULT_SCHEDULE.map((def) => {
          const found = availability.find((a) => a.dayOfWeek === def.dayOfWeek);
          return found ?? { ...def, id: "", stylistId: req.params.id };
        });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[GET /stylists/:id/availability]", err);
    res.status(500).json({ success: false, error: "Failed to fetch availability" });
  }
});

// ── PUT /stylists/:id/availability ───────────────────────
// Body: { schedule: [{ dayOfWeek, isWorking, startTime, endTime }] }
router.put("/:id/availability", async (req: Request, res: Response) => {
  try {
    const { schedule } = req.body as {
      schedule: { dayOfWeek: number; isWorking: boolean; startTime: string; endTime: string }[];
    };

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(422).json({ success: false, error: "schedule array is required" });
    }

    // Upsert each day using the unique constraint [stylistId, dayOfWeek]
    const upserts = schedule.map((day) =>
      prisma.stylistAvailability.upsert({
        where: {
          stylistId_dayOfWeek: {
            stylistId: req.params.id,
            dayOfWeek: day.dayOfWeek,
          },
        },
        update: {
          isWorking: day.isWorking,
          startTime: day.startTime,
          endTime:   day.endTime,
        },
        create: {
          stylistId: req.params.id,
          dayOfWeek: day.dayOfWeek,
          isWorking: day.isWorking,
          startTime: day.startTime,
          endTime:   day.endTime,
        },
      })
    );

    const result = await Promise.all(upserts);
    res.json({ success: true, data: result.sort((a, b) => a.dayOfWeek - b.dayOfWeek) });
  } catch (err) {
    console.error("[PUT /stylists/:id/availability]", err);
    res.status(500).json({ success: false, error: "Failed to save availability" });
  }
});

export default router;
