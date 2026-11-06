import prisma from "@/server/db";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalBookings, totalClients, allBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.booking.findMany({ select: { price: true, status: true, date: true } }),
    ]);

    const totalRevenue = allBookings
      .filter((b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED")
      .reduce((sum: number, b: any) => sum + (b.price ?? 0), 0);

    const [thisMonthBookings, lastMonthBookings] = await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
    ]);

    const [thisMonthRevBookings, lastMonthRevBookings] = await Promise.all([
      prisma.booking.findMany({ where: { status: { in: ["CONFIRMED", "COMPLETED"] }, createdAt: { gte: startOfMonth } }, select: { price: true } }),
      prisma.booking.findMany({ where: { status: { in: ["CONFIRMED", "COMPLETED"] }, createdAt: { gte: startOfLastMonth, lt: startOfMonth } }, select: { price: true } }),
    ]);

    const [thisMonthClients, lastMonthClients] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT", createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { role: "CLIENT", createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
    ]);

    const thisMonthRevenue = thisMonthRevBookings.reduce((s: number, b: any) => s + (b.price ?? 0), 0);
    const lastMonthRevenue = lastMonthRevBookings.reduce((s: number, b: any) => s + (b.price ?? 0), 0);

    function growthPct(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    }

    const recentBookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        service: { select: { name: true } },
        stylist: { select: { name: true } },
      },
    });

    const stylists = await prisma.stylist.findMany({
      include: { _count: { select: { bookings: true } } },
      orderBy: { name: "asc" },
    });

    return Response.json({
      success: true,
      data: {
        totalRevenue, totalBookings, totalClients,
        revenueGrowth:  growthPct(thisMonthRevenue, lastMonthRevenue),
        bookingsGrowth: growthPct(thisMonthBookings, lastMonthBookings),
        clientGrowth:   growthPct(thisMonthClients, lastMonthClients),
        recentBookings: recentBookings.map((b: any) => ({
          id: b.id, customerName: b.customerName, customerEmail: b.customerEmail,
          customerPhone: b.customerPhone, serviceName: b.service?.name ?? "—",
          stylistName: b.stylist?.name ?? "—",
          date: b.date.toISOString().split("T")[0], price: b.price, status: b.status.toLowerCase(),
        })),
        stylists: stylists.map((s: any) => ({
          id: s.id, name: s.name, role: s.role ?? "Stylist", avatar: s.avatar ?? null,
          bookingCount: s._count.bookings,
        })),
      },
    });
  } catch (err) {
    console.error("[GET /api/stats]", err);
    return Response.json({ success: false, error: "Failed to load stats" }, { status: 500 });
  }
}
