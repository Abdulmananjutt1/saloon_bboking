import { NextRequest } from "next/server";
import crypto from "crypto";
import prisma from "@/server/db";
import { validateEmail } from "@/server/validations";
import { sendVerificationEmail } from "@/server/lib/email";

const VERIFY_TOKEN_HOURS = 24;

async function createVerificationToken(userId: string): Promise<string> {
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + VERIFY_TOKEN_HOURS * 60 * 60 * 1000),
    },
  });
  return token;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string };
    const emailErr = validateEmail(email ?? "");
    if (emailErr) {
      return Response.json({ success: false, errors: { email: emailErr } }, { status: 422 });
    }

    const normalized = email!.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    if (user && user.role === "CLIENT" && !user.emailVerified) {
      const verifyToken = await createVerificationToken(user.id);
      sendVerificationEmail(user.email, user.name, verifyToken);
    }

    return Response.json({
      success: true,
      message: "If an unverified account exists, a new verification email has been sent.",
    });
  } catch (err) {
    console.error("[POST /api/auth/resend-verification]", err);
    return Response.json({ success: false, error: "Failed to resend verification email." }, { status: 500 });
  }
}
