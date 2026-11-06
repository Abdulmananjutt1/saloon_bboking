import { NextRequest } from "next/server";
import prisma from "@/server/db";
import jwt from "jsonwebtoken";
import { validateLogin, hasErrors } from "@/server/validations";
import { hashPassword } from "@/server/lib/hash";
import { JWT_SECRET } from "@/server/lib/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, string>;
    const errors = validateLogin(body);
    if (hasErrors(errors)) {
      return Response.json({ success: false, errors }, { status: 422 });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });

    if (!user || user.passwordHash !== hashPassword(body.password)) {
      return Response.json(
        { success: false, errors: { general: "Invalid email or password. Please try again." } },
        { status: 401 }
      );
    }

    if (user.role === "CLIENT" && !user.emailVerified) {
      return Response.json(
        {
          success: false,
          errors: {
            general: "Please verify your email before signing in. Check your inbox for the verification link.",
            email: user.email,
          },
          requiresVerification: true,
        },
        { status: 403 }
      );
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const { passwordHash: _, ...safeUser } = user;

    return Response.json({ success: true, data: safeUser, token });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return Response.json({ success: false, error: "Login failed. Please try again." }, { status: 500 });
  }
}
