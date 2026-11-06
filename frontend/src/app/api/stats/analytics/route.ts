import prisma from "@/server/db";

export async function GET() {
  try {
    const now = new Date();

    const monthlyData: { month: string; revenue: number; bookings: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthBookings = await prisma.booking.findMany({
        where: { createdAt: { gte: start, lt: end } },
        select: { price: true, status: true },
      });
      const revenue = monthBookings
        .filter((b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED")
        .reduce((sum: number, b: any) => sum + (b.price ?? 0), 0);
      monthlyData.push({
        month: start.toLocaleDateString("en-US", { month: "short" }),
        revenue,
        bookings: monthBookings.length,
      });
    }

    const [confirmed, pending, completed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]);
    const totalBookings = confirmed + pending + completed + cancelled;

    const serviceBookings = await prisma.booking.groupBy({
      by: ["serviceId"],
      _count: { id: true },
      _sum:   { price: true },
      where:  { status: { in: ["CONFIRMED", "COMPLETED"] } },
      orderBy: { _sum: { price: "desc" } },
      take: 5,
    });

    const topServices = await Promise.all(
      serviceBookings.map(async (sb: any) => {
        const service = await prisma.service.findUnique({
          where: { id: sb.serviceId },
          select: { name: true },
        });
        return { name: service?.name ?? "Unknown", bookings: sb._count.id, revenue: sb._sum.price ?? 0 };
      })
    );

    const [totalRevenue, totalClients, avgRating] = await Promise.all([
      prisma.booking.aggregate({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } }, _sum: { price: true } })
        .then((r: any) => r._sum.price ?? 0),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.stylist.aggregate({ _avg: { rating: true } })
        .then((r: any) => Math.round((r._avg.rating ?? 0) * 10) / 10),
    ]);

    return Response.json({
      success: true,
      data: {
        kpi: { totalRevenue, totalBookings, totalClients, avgRating },
        monthlyData,
        statusBreakdown: { confirmed, pending, completed, cancelled, total: totalBookings },
        topServices,
      },
    });
  } catch (err) {
    console.error("[GET /api/stats/analytics]", err);
    return Response.json({ success: false, error: "Failed to load analytics" }, { status: 500 });
  }
}
