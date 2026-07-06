// ─────────────────────────────────────────────────────────
//  Salon Settings Routes — Glamour Studio
//  GET  /settings          – get all settings as key-value map
//  PATCH /settings         – bulk-update settings
//  GET  /settings/:key     – get one setting
//  PUT  /settings/:key     – set one setting
// ─────────────────────────────────────────────────────────

import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// ── Default working hours (full week) ────────────────────
export const DEFAULT_WORKING_HOURS = [
  { dayOfWeek: 0, dayName: "Sunday",    isOpen: false, openTime: "10:00", closeTime: "19:00" },
  { dayOfWeek: 1, dayName: "Monday",    isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 2, dayName: "Tuesday",   isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 3, dayName: "Wednesday", isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 4, dayName: "Thursday",  isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 5, dayName: "Friday",    isOpen: true,  openTime: "09:00", closeTime: "21:00" },
  { dayOfWeek: 6, dayName: "Saturday",  isOpen: true,  openTime: "09:00", closeTime: "19:00" },
];

// ── GET /settings ─────────────────────────────────────────
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.salonSettings.findMany();
    // Convert rows to a plain key-value object, parsing JSON values
    const map: Record<string, unknown> = {};
    for (const row of rows) {
      try { map[row.key] = JSON.parse(row.value); } catch { map[row.key] = row.value; }
    }
    // Inject defaults for missing keys
    if (!map["working_hours"]) {
      map["working_hours"] = DEFAULT_WORKING_HOURS;
    }
    res.json({ success: true, data: map });
  } catch (err) {
    console.error("[GET /settings]", err);
    res.status(500).json({ success: false, error: "Failed to fetch settings" });
  }
});

// ── PATCH /settings ───────────────────────────────────────
// Body: { key: value, ... }
router.patch("/", async (req: Request, res: Response) => {
  try {
    const updates = req.body as Record<string, unknown>;
    const upserts = Object.entries(updates).map(([key, value]) =>
      prisma.salonSettings.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      })
    );
    await Promise.all(upserts);
    res.json({ success: true, message: "Settings updated" });
  } catch (err) {
    console.error("[PATCH /settings]", err);
    res.status(500).json({ success: false, error: "Failed to update settings" });
  }
});

// ── GET /settings/:key ────────────────────────────────────
router.get("/:key", async (req: Request, res: Response) => {
  try {
    const row = await prisma.salonSettings.findUnique({ where: { key: req.params.key } });
    if (!row) {
      // Return default if key not stored yet
      if (req.params.key === "working_hours") {
        return res.json({ success: true, data: DEFAULT_WORKING_HOURS });
      }
      return res.status(404).json({ success: false, error: "Setting not found" });
    }
    let value: unknown;
    try { value = JSON.parse(row.value); } catch { value = row.value; }
    res.json({ success: true, data: value });
  } catch (err) {
    console.error("[GET /settings/:key]", err);
    res.status(500).json({ success: false, error: "Failed to fetch setting" });
  }
});

// ── PUT /settings/:key ────────────────────────────────────
router.put("/:key", async (req: Request, res: Response) => {
  try {
    const { value } = req.body as { value: unknown };
    const row = await prisma.salonSettings.upsert({
      where: { key: req.params.key },
      update: { value: JSON.stringify(value) },
      create: { key: req.params.key, value: JSON.stringify(value) },
    });
    let parsed: unknown;
    try { parsed = JSON.parse(row.value); } catch { parsed = row.value; }
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("[PUT /settings/:key]", err);
    res.status(500).json({ success: false, error: "Failed to save setting" });
  }
});

export default router;
