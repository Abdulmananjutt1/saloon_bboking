import prisma from "@/server/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return Response.json({ success: true, data: services });
  } catch (err) {
    console.error("[GET /api/services/all]", err);
    return Response.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}
