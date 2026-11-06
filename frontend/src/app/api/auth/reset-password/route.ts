import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { validatePassword } from "@/server/validations";
import { hashPassword } from "@/server/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const { token, password, confirmPassword } = await req.json() as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };

    const errors: Record<string, string> = {};
    if (!token?.trim()) errors.token = "Reset token is required";
    const passErr = validatePassword(password ?? "");
    if (passErr) errors.password = passErr;
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (Object.keys(errors).length) {
      return Response.json({ success: false, errors }, { status: 422 });
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: token!.trim() },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return Response.json(
        { success: false, errors: { general: "This reset link is invalid or has expired. Please request a new one." } },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data:  { passwordHash: hashPassword(password!) },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data:  { usedAt: new Date() },
      }),
    ]);

    return Response.json({ success: true, message: "Password updated successfully. You can now sign in." });
  } catch (err) {
    console.error("[POST /api/auth/reset-password]", err);
    return Response.json({ success: false, error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
