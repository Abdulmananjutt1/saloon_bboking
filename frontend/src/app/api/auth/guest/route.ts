import { NextRequest } from "next/server";
import crypto from "crypto";
import prisma from "@/server/db";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/server/lib/hash";
import { JWT_SECRET } from "@/server/lib/config";

function randomGuestName(): string {
  return `Guest Account ${Math.floor(1000 + Math.random() * 9000)}`;
}

function randomGuestPhone(): string {
  return `0300${Math.floor(1000000 + Math.random() * 9000000)}`;
}

async function uniqueGuestEmail(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const suffix = crypto.randomBytes(4).toString("hex");
    const email = `guest-${suffix}@glamourstudio.local`;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) return email;
  }
  return `guest-${Date.now()}@glamourstudio.local`;
}

export async function POST(_req: NextRequest) {
  try {
    const email = await uniqueGuestEmail();
    const password = `Guest${crypto.randomBytes(6).toString("hex")}1`;
    const user = await prisma.user.create({
      data: {
        name: randomGuestName(),
        email,
        phone: randomGuestPhone(),
        passwordHash: hashPassword(password),
        role: "CLIENT",
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        emailVerified: true, emailVerifiedAt: true, createdAt: true, updatedAt: true,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    return Response.json({ success: true, data: user, token }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/guest]", err);
    return Response.json({ success: false, error: "Failed to create guest account." }, { status: 500 });
  }
}
