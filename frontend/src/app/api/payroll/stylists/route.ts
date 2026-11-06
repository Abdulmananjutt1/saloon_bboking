import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { isAdmin, forbidden } from "@/server/middleware/auth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return forbidden();

  try {
    const stylists = await prisma.stylist.findMany({
      where: { isActive: true },
      include: {
        payRate: true,
        bookings: { where: { status: "COMPLETED" }, select: { price: true, date: true } },
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
      return { id: s.id, name: s.name, role: s.role, avatar: s.avatar, completedBookings, totalRevenue, earnedAmount, payRate: s.payRate };
    });

    return Response.json({ success: true, data });
  } catch (err) {
    console.error("[GET /api/payroll/stylists]", err);
    return Response.json({ success: false, error: "Failed to fetch stylist payroll data" }, { status: 500 });
  }
}
