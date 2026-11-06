import { NextRequest } from "next/server";
import prisma from "@/server/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stylist = await prisma.stylist.findUnique({
      where: { id },
      include: { specialties: true, slots: true, availability: true },
    });
    if (!stylist) return Response.json({ success: false, error: "Stylist not found" }, { status: 404 });
    return Response.json({ success: true, data: stylist });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to fetch stylist" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, role, avatar, bio, experience, available, specialties } = await req.json();

    if (specialties !== undefined) {
      await prisma.stylistSpecialty.deleteMany({ where: { stylistId: id } });
    }

    const stylist = await prisma.stylist.update({
      where: { id },
      data: {
        ...(name       !== undefined && { name }),
        ...(role       !== undefined && { role }),
        ...(avatar     !== undefined && { avatar }),
        ...(bio        !== undefined && { bio }),
        ...(experience !== undefined && { experience: Number(experience) }),
        ...(available  !== undefined && { available }),
        ...(specialties !== undefined && {
          specialties: { create: (specialties as string[]).map((s) => ({ name: s })) },
        }),
      },
      include: { specialties: true, slots: true, availability: true },
    });

    return Response.json({ success: true, data: stylist });
  } catch (err) {
    console.error("[PATCH /api/stylists/:id]", err);
    return Response.json({ success: false, error: "Failed to update stylist" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.stylist.update({ where: { id }, data: { isActive: false } });
    return Response.json({ success: true, message: "Stylist removed" });
  } catch (err) {
    console.error("[DELETE /api/stylists/:id]", err);
    return Response.json({ success: false, error: "Failed to delete stylist" }, { status: 500 });
  }
}
