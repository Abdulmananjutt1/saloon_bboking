import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { validateClient, hasErrors } from "@/server/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");

    const where = search
      ? {
          OR: [
            { name:  { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const orderBy: Record<string, string> =
      sortBy === "totalSpent"  ? { totalSpent:  "desc" } :
      sortBy === "totalVisits" ? { totalVisits: "desc" } :
      sortBy === "name"        ? { name:        "asc"  } :
                                 { createdAt:   "desc" };

    const clients = await prisma.client.findMany({ where, orderBy });
    return Response.json({ success: true, data: clients, total: clients.length });
  } catch (err) {
    console.error("[GET /api/clients]", err);
    return Response.json({ success: false, error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, string>;
    const errors = validateClient(body);
    if (hasErrors(errors)) return Response.json({ success: false, errors }, { status: 422 });

    const existing = await prisma.client.findUnique({ where: { email: body.email.trim().toLowerCase() } });
    if (existing) {
      return Response.json({ success: false, errors: { email: "A client with this email already exists" } }, { status: 409 });
    }

    const client = await prisma.client.create({
      data: {
        name:  body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        notes: body.notes?.trim() || null,
      },
    });

    return Response.json({ success: true, data: client }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/clients]", err);
    return Response.json({ success: false, error: "Failed to create client" }, { status: 500 });
  }
}
