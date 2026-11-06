import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { isAdmin, forbidden } from "@/server/middleware/auth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return forbidden();

  try {
    const users = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    return Response.json({ success: true, data: users });
  } catch (err) {
    console.error("[GET /api/auth/users]", err);
    return Response.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
