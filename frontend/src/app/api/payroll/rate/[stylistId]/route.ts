import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { isAdmin, forbidden } from "@/server/middleware/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ stylistId: string }> }) {
  if (!isAdmin(req)) return forbidden();

  try {
    const { stylistId } = await params;
    const { rateType, flatAmount, commissionPct, baseSalary } = await req.json() as {
      rateType: "FLAT" | "COMMISSION";
      flatAmount?: number;
      commissionPct?: number;
      baseSalary?: number;
    };

    if (!["FLAT", "COMMISSION"].includes(rateType)) {
      return Response.json({ success: false, error: "rateType must be FLAT or COMMISSION" }, { status: 422 });
    }
    if (rateType === "FLAT" && (flatAmount == null || flatAmount < 0)) {
      return Response.json({ success: false, errors: { flatAmount: "Flat amount is required and must be 0 or more" } }, { status: 422 });
    }
    if (rateType === "COMMISSION") {
      if (commissionPct == null) {
        return Response.json({ success: false, errors: { commissionPct: "Commission percentage is required" } }, { status: 422 });
      }
      if (commissionPct < 0 || commissionPct > 100) {
        return Response.json({ success: false, errors: { commissionPct: "Commission must be between 0 and 100" } }, { status: 422 });
      }
    }

    const rate = await prisma.stylistPayRate.upsert({
      where:  { stylistId },
      create: {
        stylistId, rateType,
        flatAmount: flatAmount ?? null, commissionPct: commissionPct ?? null,
        baseSalary: baseSalary != null ? Math.round(baseSalary) : null,
      },
      update: {
        rateType,
        flatAmount: flatAmount ?? null, commissionPct: commissionPct ?? null,
        baseSalary: baseSalary != null ? Math.round(baseSalary) : null,
      },
    });

    return Response.json({ success: true, data: rate });
  } catch (err) {
    console.error("[PUT /api/payroll/rate/:stylistId]", err);
    return Response.json({ success: false, error: "Failed to save pay rate" }, { status: 500 });
  }
}
