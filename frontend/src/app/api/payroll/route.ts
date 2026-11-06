import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { isAdmin, forbidden } from "@/server/middleware/auth";
import { PaymentStatus } from "@prisma/client";

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

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return forbidden();

  try {
    const { searchParams } = req.nextUrl;
    const stylistId = searchParams.get("stylistId");
    const status    = searchParams.get("status");

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

    return Response.json({ success: true, data: invoices.map(fmtInvoice) });
  } catch (err) {
    console.error("[GET /api/payroll]", err);
    return Response.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return forbidden();

  try {
    const { stylistId, periodStart, periodEnd, notes, manualItems } = await req.json() as {
      stylistId:   string;
      periodStart: string;
      periodEnd:   string;
      notes?:      string;
      manualItems?: { description: string; amount: number; date: string }[];
    };

    if (!stylistId) return Response.json({ success: false, errors: { stylistId: "Stylist is required" } }, { status: 422 });
    if (!periodStart || !periodEnd) return Response.json({ success: false, errors: { period: "Period start and end are required" } }, { status: 422 });

    const stylist = await prisma.stylist.findUnique({ where: { id: stylistId }, include: { payRate: true } });
    if (!stylist) return Response.json({ success: false, errors: { stylistId: "Stylist not found" } }, { status: 422 });

    const start = new Date(periodStart);
    const end   = new Date(periodEnd);
    end.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: { stylistId, status: "COMPLETED", date: { gte: start, lte: end } },
      include: { service: { select: { name: true } } },
      orderBy: { date: "asc" },
    });

    const bookingItems = bookings.map((b: any) => {
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
        amount, date: b.date,
      };
    });

    const extraItems = (manualItems ?? []).map((i) => ({
      bookingId: null, description: i.description, amount: i.amount, date: new Date(i.date),
    }));

    const allItems = [...bookingItems, ...extraItems];
    const totalAmount = allItems.reduce((sum, i) => sum + i.amount, 0);

    const invoice = await prisma.payrollInvoice.create({
      data: {
        stylistId, periodStart: start, periodEnd: end, totalAmount,
        notes: notes?.trim() || null, status: "PENDING",
        items: { create: allItems },
      },
      include: {
        stylist: { select: { id: true, name: true, role: true, avatar: true } },
        items:   true,
      },
    });

    return Response.json({ success: true, data: fmtInvoice(invoice) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/payroll]", err);
    return Response.json({ success: false, error: "Failed to generate invoice" }, { status: 500 });
  }
}
