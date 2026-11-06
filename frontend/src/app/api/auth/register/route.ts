import { NextRequest } from "next/server";
import crypto from "crypto";
import prisma from "@/server/db";
import jwt from "jsonwebtoken";
import { validateRegister, hasErrors } from "@/server/validations";
import { hashPassword } from "@/server/lib/hash";
import { JWT_SECRET } from "@/server/lib/config";
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
    const body = await req.json() as Record<string, string>;
    const errors = validateRegister(body);
    if (hasErrors(errors)) {
      return Response.json({ success: false, errors }, { status: 422 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });
    if (existing) {
      return Response.json(
        { success: false, errors: { email: "This email is already registered. Please sign in." } },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name:          body.name.trim(),
        email:         body.email.trim().toLowerCase(),
        phone:         body.phone.trim(),
        passwordHash:  hashPassword(body.password),
        role:          "CLIENT",
        emailVerified: false,
      },
    });

    const verifyToken = await createVerificationToken(user.id);
    sendVerificationEmail(user.email, user.name, verifyToken);

    return Response.json(
      {
        success: true,
        requiresVerification: true,
        email: user.email,
        message: "Account created. Please check your email to verify your account before signing in.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return Response.json({ success: false, error: "Registration failed. Please try again." }, { status: 500 });
  }
}
