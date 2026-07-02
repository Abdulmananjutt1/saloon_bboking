import { Router, Request, Response } from "express";
import prisma from "../db";
import { validateClient, validateName, validatePhone, hasErrors } from "../validations";

const router = Router();

// GET /clients
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, sortBy } = req.query as Record<string, string>;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name:  { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
          ],
        }
      : {};

    // Build orderBy clause
    const orderBy: Record<string, string> =
      sortBy === "totalSpent"  ? { totalSpent:  "desc" } :
      sortBy === "totalVisits" ? { totalVisits: "desc" } :
      sortBy === "name"        ? { name:        "asc"  } :
                                 { createdAt:   "desc" };

    const clients = await prisma.client.findMany({ where, orderBy });

    res.json({ success: true, data: clients, total: clients.length });
  } catch (err) {
    console.error("[GET /clients]", err);
    res.status(500).json({ success: false, error: "Failed to fetch clients" });
  }
});

// GET /clients/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) return res.status(404).json({ success: false, error: "Client not found" });
    res.json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch client" });
  }
});

// POST /clients
router.post("/", async (req: Request, res: Response) => {
  try {
    const body   = req.body as Record<string, string>;
    const errors = validateClient(body);
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const existing = await prisma.client.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        errors: { email: "A client with this email already exists" },
      });
    }

    const client = await prisma.client.create({
      data: {
        name:  body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        notes: body.notes?.trim() || null,
      },
    });

    res.status(201).json({ success: true, data: client });
  } catch (err) {
    console.error("[POST /clients]", err);
    res.status(500).json({ success: false, error: "Failed to create client" });
  }
});

// PATCH /clients/:id
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const body   = req.body as Record<string, string>;
    const errors: Record<string, string> = {};

    if (body.name  !== undefined) { const e = validateName(body.name);   if (e) errors.name  = e; }
    if (body.phone !== undefined) { const e = validatePhone(body.phone); if (e) errors.phone = e; }
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const existing = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, error: "Client not found" });

    const updated = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...(body.name  !== undefined && { name:  body.name.trim()  }),
        ...(body.phone !== undefined && { phone: body.phone.trim() }),
        ...(body.notes !== undefined && { notes: body.notes.trim() || null }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update client" });
  }
});

// DELETE /clients/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const existing = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, error: "Client not found" });

    await prisma.client.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete client" });
  }
});

export default router;
