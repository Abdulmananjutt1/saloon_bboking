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
    items:       (inv.items ?? []).map((i: any) => ({ ...i, date: i.date.toISOString().split("T")[0] })),
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return forbidden();

  try {
    const { id } = await params;
    const invoice = await prisma.payrollInvoice.findUnique({
      where: { id },
      include: {
        stylist: { select: { id: true, name: true, role: true, avatar: true } },
        items:   true,
      },
    });
    if (!invoice) return Response.json({ success: false, error: "Invoice not found" }, { status: 404 });
    return Response.json({ success: true, data: fmtInvoice(invoice) });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return forbidden();

  try {
    const { id } = await params;
    const { status, notes } = await req.json() as { status?: string; notes?: string };
    const valid = ["pending", "paid", "overdue"];

    if (status && !valid.includes(status)) {
      return Response.json({ success: false, error: `Status must be one of: ${valid.join(", ")}` }, { status: 422 });
    }

    const invoice = await prisma.payrollInvoice.findUnique({ where: { id } });
    if (!invoice) return Response.json({ success: false, error: "Invoice not found" }, { status: 404 });

    const updated = await prisma.payrollInvoice.update({
      where: { id },
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

    return Response.json({ success: true, data: fmtInvoice(updated) });
  } catch (err) {
    console.error("[PATCH /api/payroll/:id]", err);
    return Response.json({ success: false, error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return forbidden();

  try {
    const { id } = await params;
    const invoice = await prisma.payrollInvoice.findUnique({ where: { id } });
    if (!invoice) return Response.json({ success: false, error: "Invoice not found" }, { status: 404 });
    await prisma.payrollInvoice.delete({ where: { id } });
    return Response.json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to delete invoice" }, { status: 500 });
  }
}
