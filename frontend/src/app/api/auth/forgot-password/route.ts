import { NextRequest } from "next/server";
import crypto from "crypto";
import prisma from "@/server/db";
import { validateEmail } from "@/server/validations";
import { sendPasswordResetEmail } from "@/server/lib/email";

const RESET_TOKEN_HOURS = 1;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string };
    const emailErr = validateEmail(email ?? "");
    if (emailErr) {
      return Response.json({ success: false, errors: { email: emailErr } }, { status: 422 });
    }

    const normalized = email!.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    if (user) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + RESET_TOKEN_HOURS * 60 * 60 * 1000);
      await prisma.passwordResetToken.create({
        data: { userId: user.id, token, expiresAt },
      });
      sendPasswordResetEmail(user.email, user.name, token);
    }

    return Response.json({
      success: true,
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("[POST /api/auth/forgot-password]", err);
    return Response.json({ success: false, error: "Failed to process request. Please try again." }, { status: 500 });
  }
}
