import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { getAuthUser, unauthorized } from "@/server/middleware/auth";

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { name, phone } = await req.json() as { name?: string; phone?: string };
    const errors: Record<string, string> = {};
    if (!name?.trim())  errors.name  = "Name is required";
    if (!phone?.trim()) errors.phone = "Phone number is required";
    if (Object.keys(errors).length) {
      return Response.json({ success: false, errors }, { status: 422 });
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data:  { name: name!.trim(), phone: phone!.trim() },
      select: { id: true, name: true, email: true, phone: true },
    });

    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/auth/profile]", err);
    return Response.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
