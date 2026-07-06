// ─────────────────────────────────────────────────────────
//  Services Routes — Glamour Studio
//  GET    /services        – list active services
//  GET    /services/all    – list all (admin, incl inactive)
//  GET    /services/:id    – get one
//  POST   /services        – create
//  PATCH  /services/:id    – update
//  DELETE /services/:id    – soft delete (isActive = false)
// ─────────────────────────────────────────────────────────

import { Router, Request, Response } from "express";
import prisma from "../db";
import { ServiceCategory, Gender } from "@prisma/client";

const router = Router();

// ── Slug generator ────────────────────────────────────────
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.service.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix++;
  }
}

// ── GET /services (public — active only) ─────────────────
router.get("/", async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    res.json({ success: true, data: services });
  } catch (err) {
    console.error("[GET /services]", err);
    res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
});

// ── GET /services/all (admin — includes inactive) ─────────
router.get("/all", async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    res.json({ success: true, data: services });
  } catch (err) {
    console.error("[GET /services/all]", err);
    res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
});

// ── GET /services/:id ─────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ success: false, error: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch service" });
  }
});

// ── POST /services ────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name, category, description, duration,
      price, discountedPrice, image, popular, forGender,
    } = req.body;

    if (!name || !category || !description || !duration || !price) {
      return res.status(422).json({
        success: false,
        error: "name, category, description, duration, price are required",
      });
    }

    // Validate category enum
    if (!Object.values(ServiceCategory).includes(category)) {
      return res.status(422).json({ success: false, error: `Invalid category: ${category}` });
    }

    const slug = await uniqueSlug(name);

    const service = await prisma.service.create({
      data: {
        name:            name.trim(),
        slug,
        category:        category as ServiceCategory,
        description:     description.trim(),
        duration:        Number(duration),
        price:           Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        image:           image?.trim() || "",
        popular:         popular === true || popular === "true",
        forGender:       (forGender as Gender) || "UNISEX",
        isActive:        true,
      },
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("[POST /services]", err);
    res.status(500).json({ success: false, error: "Failed to create service" });
  }
});

// ── PATCH /services/:id ───────────────────────────────────
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const {
      name, category, description, duration,
      price, discountedPrice, image, popular, forGender, isActive,
    } = req.body;

    // Recompute slug if name changed
    let slug: string | undefined;
    if (name) slug = await uniqueSlug(name, req.params.id);

    if (category && !Object.values(ServiceCategory).includes(category)) {
      return res.status(422).json({ success: false, error: `Invalid category: ${category}` });
    }

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        ...(name        !== undefined && { name: name.trim(), slug }),
        ...(category    !== undefined && { category: category as ServiceCategory }),
        ...(description !== undefined && { description: description.trim() }),
        ...(duration    !== undefined && { duration: Number(duration) }),
        ...(price       !== undefined && { price: Number(price) }),
        ...(discountedPrice !== undefined && {
          discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        }),
        ...(image       !== undefined && { image: image.trim() }),
        ...(popular     !== undefined && { popular: popular === true || popular === "true" }),
        ...(forGender   !== undefined && { forGender: forGender as Gender }),
        ...(isActive    !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    res.json({ success: true, data: service });
  } catch (err) {
    console.error("[PATCH /services/:id]", err);
    res.status(500).json({ success: false, error: "Failed to update service" });
  }
});

// ── DELETE /services/:id (soft delete) ───────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.service.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true, message: "Service removed" });
  } catch (err) {
    console.error("[DELETE /services/:id]", err);
    res.status(500).json({ success: false, error: "Failed to delete service" });
  }
});

export default router;
