import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { validateName, validatePhone, hasErrors } from "@/server/validations";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return Response.json({ success: false, error: "Client not found" }, { status: 404 });
    return Response.json({ success: true, data: client });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to fetch client" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json() as Record<string, string>;
    const errors: Record<string, string> = {};

    if (body.name  !== undefined) { const e = validateName(body.name);   if (e) errors.name  = e; }
    if (body.phone !== undefined) { const e = validatePhone(body.phone); if (e) errors.phone = e; }
    if (hasErrors(errors)) return Response.json({ success: false, errors }, { status: 422 });

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return Response.json({ success: false, error: "Client not found" }, { status: 404 });

    const updated = await prisma.client.update({
      where: { id },
      data: {
        ...(body.name  !== undefined && { name:  body.name.trim()  }),
        ...(body.phone !== undefined && { phone: body.phone.trim() }),
        ...(body.notes !== undefined && { notes: body.notes.trim() || null }),
      },
    });

    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return Response.json({ success: false, error: "Client not found" }, { status: 404 });
    await prisma.client.delete({ where: { id } });
    return Response.json({ success: true, message: "Client deleted" });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to delete client" }, { status: 500 });
  }
}
