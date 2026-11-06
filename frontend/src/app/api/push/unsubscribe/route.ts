import { NextRequest } from "next/server";
import prisma from "@/server/db";

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json() as { endpoint: string };
    if (!endpoint) {
      return Response.json({ success: false, error: "endpoint is required" }, { status: 422 });
    }

    await prisma.pushSubscription.delete({ where: { endpoint } }).catch(() => {});
    return Response.json({ success: true, message: "Unsubscribed from push notifications" });
  } catch (err) {
    console.error("[DELETE /api/push/unsubscribe]", err);
    return Response.json({ success: false, error: "Failed to remove subscription" }, { status: 500 });
  }
}
