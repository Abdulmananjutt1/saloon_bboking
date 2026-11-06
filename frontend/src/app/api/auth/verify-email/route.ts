import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { sendWelcomeEmail } from "@/server/lib/email";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return Response.json({ success: false, error: "Verification token is required." }, { status: 422 });
    }

    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return Response.json(
        { success: false, error: "This verification link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (record.user.emailVerified) {
      return Response.json({ success: true, message: "Email already verified. You can sign in." });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data:  { emailVerified: true, emailVerifiedAt: new Date() },
      }),
      prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
    ]);

    sendWelcomeEmail(record.user.email, record.user.name);

    return Response.json({ success: true, message: "Email verified successfully! You can now sign in." });
  } catch (err) {
    console.error("[GET /api/auth/verify-email]", err);
    return Response.json({ success: false, error: "Verification failed. Please try again." }, { status: 500 });
  }
}
