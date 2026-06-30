import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// ── GET /stats — Dashboard summary ────────────────────────────────────────────
router.get("/", async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // ── Aggregate all-time totals ──────────────────────────────────────
    const [totalBookings, totalClients, allBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.booking.findMany({
        select: { price: true, status: true, date: true },
      }),
    ]);

    const totalRevenue = allBookings
      .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.price ?? 0), 0);

    // ── This month vs last month ───────────────────────────────────────
    const [thisMonthBookings, lastMonthBookings] = await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.booking.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      }),
    ]);

    const [thisMonthRevBookings, lastMonthRevBookings] = await Promise.all([
      prisma.booking.findMany({
        where: {
          status: { in: ["CONFIRMED", "COMPLETED"] },
          createdAt: { gte: startOfMonth },
        },
        select: { price: true },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ["CONFIRMED", "COMPLETED"] },
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
        select: { price: true },
      }),
    ]);

    const [thisMonthClients, lastMonthClients] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT", createdAt: { gte: startOfMonth } } }),
      prisma.user.count({
        where: { role: "CLIENT", createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      }),
    ]);

    const thisMonthRevenue = thisMonthRevBookings.reduce((s, b) => s + (b.price ?? 0), 0);
    const lastMonthRevenue = lastMonthRevBookings.reduce((s, b) => s + (b.price ?? 0), 0);

    function growthPct(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    }

    // ── Recent bookings (last 5) ───────────────────────────────────────
    const recentBookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        service: { select: { name: true } },
        stylist: { select: { name: true } },
      },
    });

    // ── Stylists with booking count ────────────────────────────────────
    const stylists = await prisma.stylist.findMany({
      include: {
        _count: { select: { bookings: true } },
      },
      orderBy: { name: "asc" },
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        totalClients,
        revenueGrowth:  growthPct(thisMonthRevenue, lastMonthRevenue),
        bookingsGrowth: growthPct(thisMonthBookings, lastMonthBookings),
        clientGrowth:   growthPct(thisMonthClients, lastMonthClients),
        recentBookings: recentBookings.map((b) => ({
          id:            b.id,
          customerName:  b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          serviceName:   b.service?.name ?? "—",
          stylistName:   b.stylist?.name ?? "—",
          date:          b.date.toISOString().split("T")[0],
          price:         b.price,
          status:        b.status.toLowerCase(),
        })),
        stylists: stylists.map((s) => ({
          id:           s.id,
          name:         s.name,
          role:         s.role ?? "Stylist",
          avatar:       s.avatar ?? null,
          bookingCount: s._count.bookings,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to load stats" });
  }
});

// ── GET /stats/analytics — Full analytics breakdown ───────────────────────────
router.get("/analytics", async (_req: Request, res: Response) => {
  try {
    const now = new Date();

    // ── Monthly breakdown — last 7 months ─────────────────────────────
    const monthlyData: { month: string; revenue: number; bookings: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthBookings = await prisma.booking.findMany({
        where: { createdAt: { gte: start, lt: end } },
        select: { price: true, status: true },
      });

      const revenue = monthBookings
        .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
        .reduce((sum, b) => sum + (b.price ?? 0), 0);

      monthlyData.push({
        month:    start.toLocaleDateString("en-US", { month: "short" }),
        revenue,
        bookings: monthBookings.length,
      });
    }

    // ── Booking counts by status ───────────────────────────────────────
    const [confirmed, pending, completed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]);

    const totalBookings = confirmed + pending + completed + cancelled;

    // ── Top services by revenue ────────────────────────────────────────
    const serviceBookings = await prisma.booking.groupBy({
      by: ["serviceId"],
      _count: { id: true },
      _sum:   { price: true },
      where:  { status: { in: ["CONFIRMED", "COMPLETED"] } },
      orderBy: { _sum: { price: "desc" } },
      take: 5,
    });

    const topServices = await Promise.all(
      serviceBookings.map(async (sb) => {
        const service = await prisma.service.findUnique({
          where: { id: sb.serviceId },
          select: { name: true },
        });
        return {
          name:     service?.name ?? "Unknown",
          bookings: sb._count.id,
          revenue:  sb._sum.price ?? 0,
        };
      })
    );

    // ── KPI totals ─────────────────────────────────────────────────────
    const [totalRevenue, totalClients, avgRating] = await Promise.all([
      prisma.booking
        .aggregate({
          where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
          _sum: { price: true },
        })
        .then((r) => r._sum.price ?? 0),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.stylist
        .aggregate({ _avg: { rating: true } })
        .then((r) => Math.round((r._avg.rating ?? 0) * 10) / 10),
    ]);

    res.json({
      success: true,
      data: {
        kpi: { totalRevenue, totalBookings, totalClients, avgRating },
        monthlyData,
        statusBreakdown: { confirmed, pending, completed, cancelled, total: totalBookings },
        topServices,
      },
    });
  } catch (err) {
    console.error("[GET /stats/analytics]", err);
    res.status(500).json({ success: false, error: "Failed to load analytics" });
  }
});

export default router;
