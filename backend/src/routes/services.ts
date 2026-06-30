import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /services
router.get("/", async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: services });
  } catch (err) {
    console.error("[GET /services]", err);
    res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
});

// GET /services/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ success: false, error: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch service" });
  }
});

export default router;
