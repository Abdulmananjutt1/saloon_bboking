import { NextRequest } from "next/server";
import prisma from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const { subscription, role, email, userId } = await req.json() as {
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
      role: string;
      email?: string;
      userId?: string;
    };

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return Response.json({ success: false, error: "Invalid subscription object" }, { status: 422 });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh, auth: subscription.keys.auth,
        role: role ?? "client", email: email?.toLowerCase() ?? null,
        userId: userId ?? null, updatedAt: new Date(),
      },
      create: {
        endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth, role: role ?? "client",
        email: email?.toLowerCase() ?? null, userId: userId ?? null,
      },
    });

    return Response.json({ success: true, message: "Subscribed to push notifications" });
  } catch (err) {
    console.error("[POST /api/push/subscribe]", err);
    return Response.json({ success: false, error: "Failed to save subscription" }, { status: 500 });
  }
}
