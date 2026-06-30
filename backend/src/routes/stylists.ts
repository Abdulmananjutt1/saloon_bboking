import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /stylists
router.get("/", async (_req: Request, res: Response) => {
  try {
    const stylists = await prisma.stylist.findMany({
      where: { isActive: true },
      include: { specialties: true, slots: true },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: stylists });
  } catch (err) {
    console.error("[GET /stylists]", err);
    res.status(500).json({ success: false, error: "Failed to fetch stylists" });
  }
});

// GET /stylists/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const stylist = await prisma.stylist.findUnique({
      where: { id: req.params.id },
      include: { specialties: true, slots: true },
    });
    if (!stylist) return res.status(404).json({ success: false, error: "Stylist not found" });
    res.json({ success: true, data: stylist });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch stylist" });
  }
});

export default router;
