import { Router, Request, Response } from "express";
import {
  getClients, getClientById, getClientByEmail,
  createClient, updateClient, deleteClient,
} from "../store";
import { validateClient, validateName, validatePhone, hasErrors } from "../validations";

const router = Router();

// GET /clients
router.get("/", (req: Request, res: Response) => {
  try {
    const { search, sortBy } = req.query as Record<string, string>;
    let clients = getClients();

    if (search) {
      const q = search.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    clients = clients.sort((a, b) => {
      if (sortBy === "totalSpent")  return b.totalSpent  - a.totalSpent;
      if (sortBy === "totalVisits") return b.totalVisits - a.totalVisits;
      if (sortBy === "name")        return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({ success: true, data: clients, total: clients.length });
  } catch (err) {
    console.error("[GET /clients]", err);
    res.status(500).json({ success: false, error: "Failed to fetch clients" });
  }
});

// GET /clients/:id
router.get("/:id", (req: Request, res: Response) => {
  try {
    const client = getClientById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: "Client not found" });
    res.json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch client" });
  }
});

// POST /clients
router.post("/", (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, string>;
    const errors = validateClient(body);
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const existing = getClientByEmail(body.email);
    if (existing) {
      return res.status(409).json({
        success: false,
        errors: { email: "A client with this email already exists" },
      });
    }

    const client = createClient({
      name:  body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      notes: body.notes?.trim() || undefined,
    });

    res.status(201).json({ success: true, data: client });
  } catch (err) {
    console.error("[POST /clients]", err);
    res.status(500).json({ success: false, error: "Failed to create client" });
  }
});

// PATCH /clients/:id
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const body   = req.body as Record<string, string>;
    const errors: Record<string, string> = {};

    if (body.name  !== undefined) { const e = validateName(body.name);   if (e) errors.name  = e; }
    if (body.phone !== undefined) { const e = validatePhone(body.phone); if (e) errors.phone = e; }
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const updated = updateClient(req.params.id, {
      name:  body.name?.trim(),
      phone: body.phone?.trim(),
      notes: body.notes?.trim(),
    });

    if (!updated) return res.status(404).json({ success: false, error: "Client not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update client" });
  }
});

// DELETE /clients/:id
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const deleted = deleteClient(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Client not found" });
    res.json({ success: true, message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete client" });
  }
});

export default router;
