import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { DEFAULT_WORKING_HOURS } from "../route";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const row = await prisma.salonSettings.findUnique({ where: { key } });
    if (!row) {
      if (key === "working_hours") {
        return Response.json({ success: true, data: DEFAULT_WORKING_HOURS });
      }
      return Response.json({ success: false, error: "Setting not found" }, { status: 404 });
    }
    let value: unknown;
    try { value = JSON.parse(row.value); } catch { value = row.value; }
    return Response.json({ success: true, data: value });
  } catch (err) {
    console.error("[GET /api/settings/:key]", err);
    return Response.json({ success: false, error: "Failed to fetch setting" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const { value } = await req.json() as { value: unknown };
    const row = await prisma.salonSettings.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    let parsed: unknown;
    try { parsed = JSON.parse(row.value); } catch { parsed = row.value; }
    return Response.json({ success: true, data: parsed });
  } catch (err) {
    console.error("[PUT /api/settings/:key]", err);
    return Response.json({ success: false, error: "Failed to save setting" }, { status: 500 });
  }
}
