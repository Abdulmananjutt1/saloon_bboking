import { Router, Response } from "express";
import prisma from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { PaymentStatus } from "@prisma/client";

const router = Router();

// All payroll routes require admin
router.use(requireAdmin as any);

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtInvoice(inv: any) {
  return {
    ...inv,
    periodStart: inv.periodStart.toISOString().split("T")[0],
    periodEnd:   inv.periodEnd.toISOString().split("T")[0],
    paidAt:      inv.paidAt ? inv.paidAt.toISOString().split("T")[0] : null,
    status:      inv.status.toLowerCase(),
    items:       (inv.items ?? []).map((i: any) => ({
      ...i,
      date: i.date.toISOString().split("T")[0],
    })),
  };
}

// ── GET /payroll — all invoices, optionally filtered by stylistId / status ───
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { stylistId, status } = req.query as Record<string, string>;
    const where: any = {};
    if (stylistId) where.stylistId = stylistId;
    if (status && status !== "all") where.status = status.toUpperCase() as PaymentStatus;

    const invoices = await prisma.payrollInvoice.findMany({
      where,
      include: {
        stylist: { select: { id: true, name: true, role: true, avatar: true } },
        items:   true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: invoices.map(fmtInvoice) });
  } catch (err) {
    console.error("[GET /payroll]", err);
    res.status(500).json({ success: false, error: "Failed to fetch invoices" });
  }
});

// ── GET /payroll/stylists — all stylists with their pay rates & summary ───────
router.get("/stylists", async (_req: AuthRequest, res: Response) => {
  try {
    const stylists = await prisma.stylist.findMany({
      where: { isActive: true },
      include: {
        payRate: true,
        bookings: {
          where: { status: "COMPLETED" },
          select: { price: true, date: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const data = stylists.map((s) => {
      const completedBookings = s.bookings.length;
      const totalRevenue      = s.bookings.reduce((sum, b) => sum + b.price, 0);
      const earnedAmount      = s.payRate
        ? s.payRate.rateType === "FLAT"
          ? (s.payRate.flatAmount ?? 0) * completedBookings
          : Math.round(totalRevenue * ((s.payRate.commissionPct ?? 0) / 100))
        : 0;

      return {
        id:               s.id,
        name:             s.name,
        role:             s.role,
        avatar:           s.avatar,
        completedBookings,
        totalRevenue,
        earnedAmount,
        payRate:          s.payRate,
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("[GET /payroll/stylists]", err);
    res.status(500).json({ success: false, error: "Failed to fetch stylist payroll data" });
  }
});

// ── GET /payroll/:id — single invoice ────────────────────────────────────────
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await prisma.payrollInvoice.findUnique({
      where: { id: req.params.id },
      include: {
        stylist: { select: { id: true, name: true, role: true, avatar: true } },
        items:   true,
      },
    });
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });
    res.json({ success: true, data: fmtInvoice(invoice) });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch invoice" });
  }
});

// ── POST /payroll — generate invoice for a stylist over a date range ──────────
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { stylistId, periodStart, periodEnd, notes, manualItems } = req.body as {
      stylistId:   string;
      periodStart: string;
      periodEnd:   string;
      notes?:      string;
      manualItems?: { description: string; amount: number; date: string }[];
    };

    if (!stylistId) return res.status(422).json({ success: false, errors: { stylistId: "Stylist is required" } });
    if (!periodStart || !periodEnd) return res.status(422).json({ success: false, errors: { period: "Period start and end are required" } });

    const stylist = await prisma.stylist.findUnique({
      where:   { id: stylistId },
      include: { payRate: true },
    });
    if (!stylist) return res.status(422).json({ success: false, errors: { stylistId: "Stylist not found" } });

    const start = new Date(periodStart);
    const end   = new Date(periodEnd);
    end.setHours(23, 59, 59, 999);

    // Fetch completed bookings in this period for this stylist
    const bookings = await prisma.booking.findMany({
      where: {
        stylistId,
        status: "COMPLETED",
        date:   { gte: start, lte: end },
      },
      include: { service: { select: { name: true } } },
      orderBy: { date: "asc" },
    });

    // Build invoice items from bookings
    const bookingItems = bookings.map((b) => {
      const revenue = b.price;
      let amount = 0;
      if (stylist.payRate) {
        amount = stylist.payRate.rateType === "FLAT"
          ? (stylist.payRate.flatAmount ?? 0)
          : Math.round(revenue * ((stylist.payRate.commissionPct ?? 0) / 100));
      }
      return {
        bookingId:   b.id,
        description: `${b.service.name} — ${b.customerName} (Booking ${b.id})`,
        amount,
        date:        b.date,
      };
    });

    // Manual items (bonus, deduction, etc.)
    const extraItems = (manualItems ?? []).map((i) => ({
      bookingId:   null,
      description: i.description,
      amount:      i.amount,
      date:        new Date(i.date),
    }));

    const allItems  = [...bookingItems, ...extraItems];
    const totalAmount = allItems.reduce((sum, i) => sum + i.amount, 0);

    const invoice = await prisma.payrollInvoice.create({
      data: {
        stylistId,
        periodStart: start,
        periodEnd:   end,
        totalAmount,
        notes:       notes?.trim() || null,
        status:      "PENDING",
        items: {
          create: allItems,
        },
      },
      include: {
        stylist: { select: { id: true, name: true, role: true, avatar: true } },
        items:   true,
      },
    });

    res.status(201).json({ success: true, data: fmtInvoice(invoice) });
  } catch (err) {
    console.error("[POST /payroll]", err);
    res.status(500).json({ success: false, error: "Failed to generate invoice" });
  }
});

// ── PATCH /payroll/:id — mark as paid / overdue / pending, or update notes ───
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body as { status?: string; notes?: string };
    const valid = ["pending", "paid", "overdue"];

    if (status && !valid.includes(status)) {
      return res.status(422).json({ success: false, error: `Status must be one of: ${valid.join(", ")}` });
    }

    const invoice = await prisma.payrollInvoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });

    const updated = await prisma.payrollInvoice.update({
      where: { id: req.params.id },
      data: {
        ...(status ? { status: status.toUpperCase() as PaymentStatus } : {}),
        ...(status === "paid" ? { paidAt: new Date() } : {}),
        ...(notes !== undefined ? { notes: notes.trim() || null } : {}),
      },
      include: {
        stylist: { select: { id: true, name: true, role: true, avatar: true } },
        items:   true,
      },
    });

    res.json({ success: true, data: fmtInvoice(updated) });
  } catch (err) {
    console.error("[PATCH /payroll/:id]", err);
    res.status(500).json({ success: false, error: "Failed to update invoice" });
  }
});

// ── DELETE /payroll/:id — delete invoice ──────────────────────────────────────
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await prisma.payrollInvoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });
    await prisma.payrollInvoice.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete invoice" });
  }
});

// ── PUT /payroll/rate/:stylistId — set pay rate for a stylist ─────────────────
router.put("/rate/:stylistId", async (req: AuthRequest, res: Response) => {
  try {
    const { rateType, flatAmount, commissionPct, baseSalary } = req.body as {
      rateType:       "FLAT" | "COMMISSION";
      flatAmount?:    number;
      commissionPct?: number;
      baseSalary?:    number;
    };

    if (!["FLAT", "COMMISSION"].includes(rateType)) {
      return res.status(422).json({ success: false, error: "rateType must be FLAT or COMMISSION" });
    }
    if (rateType === "FLAT" && (flatAmount == null || flatAmount < 0)) {
      return res.status(422).json({ success: false, errors: { flatAmount: "Flat amount is required and must be 0 or more" } });
    }
    if (rateType === "COMMISSION") {
      if (commissionPct == null) {
        return res.status(422).json({ success: false, errors: { commissionPct: "Commission percentage is required" } });
      }
      if (commissionPct < 0 || commissionPct > 100) {
        return res.status(422).json({ success: false, errors: { commissionPct: "Commission must be between 0 and 100" } });
      }
    }

    const rate = await prisma.stylistPayRate.upsert({
      where:  { stylistId: req.params.stylistId },
      create: {
        stylistId:     req.params.stylistId,
        rateType,
        flatAmount:    flatAmount    ?? null,
        commissionPct: commissionPct ?? null,
        baseSalary:    baseSalary != null ? Math.round(baseSalary) : null,
      },
      update: {
        rateType,
        flatAmount:    flatAmount    ?? null,
        commissionPct: commissionPct ?? null,
        baseSalary:    baseSalary != null ? Math.round(baseSalary) : null,
      },
    });

    res.json({ success: true, data: rate });
  } catch (err) {
    console.error("[PUT /payroll/rate/:stylistId]", err);
    res.status(500).json({ success: false, error: "Failed to save pay rate" });
  }
});

export default router;
