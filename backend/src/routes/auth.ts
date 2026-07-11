import { Router, Request, Response } from "express";
import crypto from "crypto";
import prisma from "../db";
import jwt from "jsonwebtoken";
import { validateLogin, validateRegister, validateEmail, validatePassword, hasErrors } from "../validations";
import { hashPassword } from "../lib/hash";
import { JWT_SECRET } from "../lib/config";
import { requireAdmin, requireAuth, AuthRequest } from "../middleware/auth";
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from "../lib/email";

const router = Router();

const RESET_TOKEN_HOURS = 1;
const VERIFY_TOKEN_HOURS  = 24;

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function createVerificationToken(userId: string): Promise<string> {
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  const token = generateToken();
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + VERIFY_TOKEN_HOURS * 60 * 60 * 1000),
    },
  });
  return token;
}

function buildSafeUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "CLIENT";
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return user;
}

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

// POST /auth/guest — create a temporary client account and sign in immediately
router.post("/guest", async (_req: Request, res: Response) => {
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
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, data: buildSafeUser(user), token });
  } catch (err) {
    console.error("[POST /auth/guest]", err);
    res.status(500).json({ success: false, error: "Failed to create guest account." });
  }
});

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, string>;
    const errors = validateRegister(body);
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const existing = await prisma.user.findUnique({ where: { email: body.email.trim().toLowerCase() } });
    if (existing) {
      return res.status(409).json({
        success: false,
        errors: { email: "This email is already registered. Please sign in." },
      });
    }

    const user = await prisma.user.create({
      data: {
        name:          body.name.trim(),
        email:         body.email.trim().toLowerCase(),
        phone:         body.phone.trim(),
        passwordHash:  hashPassword(body.password),
        role:          "CLIENT",
        emailVerified: false,
      }
    });

    const verifyToken = await createVerificationToken(user.id);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
      message: "Account created. Please check your email to verify your account before signing in.",
    });

    sendVerificationEmail(user.email, user.name, verifyToken);
  } catch (err: unknown) {
    console.error("[POST /auth/register]", err);
    res.status(500).json({ success: false, error: "Registration failed. Please try again." });
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, string>;
    const errors = validateLogin(body);
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const user = await prisma.user.findUnique({ where: { email: body.email.trim().toLowerCase() } });

    if (!user || user.passwordHash !== hashPassword(body.password)) {
      return res.status(401).json({
        success: false,
        errors: { general: "Invalid email or password. Please try again." },
      });
    }

    if (user.role === "CLIENT" && !user.emailVerified) {
      return res.status(403).json({
        success: false,
        errors: {
          general: "Please verify your email before signing in. Check your inbox for the verification link.",
          email: user.email,
        },
        requiresVerification: true,
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const { passwordHash: _, ...safeUser } = user;

    res.json({ success: true, data: safeUser, token });
  } catch (err) {
    console.error("[POST /auth/login]", err);
    res.status(500).json({ success: false, error: "Login failed. Please try again." });
  }
});

// POST /auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    const emailErr = validateEmail(email ?? "");
    if (emailErr) {
      return res.status(422).json({ success: false, errors: { email: emailErr } });
    }

    const normalized = email!.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    // Always return success to prevent email enumeration
    if (user) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

      const token = generateToken();
      const expiresAt = new Date(Date.now() + RESET_TOKEN_HOURS * 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: { userId: user.id, token, expiresAt },
      });

      sendPasswordResetEmail(user.email, user.name, token);
    }

    res.json({
      success: true,
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("[POST /auth/forgot-password]", err);
    res.status(500).json({ success: false, error: "Failed to process request. Please try again." });
  }
});

// POST /auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password, confirmPassword } = req.body as {
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
      return res.status(422).json({ success: false, errors });
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: token!.trim() },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        errors: { general: "This reset link is invalid or has expired. Please request a new one." },
      });
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

    res.json({ success: true, message: "Password updated successfully. You can now sign in." });
  } catch (err) {
    console.error("[POST /auth/reset-password]", err);
    res.status(500).json({ success: false, error: "Failed to reset password. Please try again." });
  }
});

// GET /auth/verify-email?token=...
router.get("/verify-email", async (req: Request, res: Response) => {
  try {
    const token = (req.query.token as string)?.trim();
    if (!token) {
      return res.status(422).json({ success: false, error: "Verification token is required." });
    }

    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: "This verification link is invalid or has expired. Please request a new one.",
      });
    }

    if (record.user.emailVerified) {
      return res.json({ success: true, message: "Email already verified. You can sign in." });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data:  { emailVerified: true, emailVerifiedAt: new Date() },
      }),
      prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
    ]);

    res.json({ success: true, message: "Email verified successfully! You can now sign in." });

    sendWelcomeEmail(record.user.email, record.user.name);
  } catch (err) {
    console.error("[GET /auth/verify-email]", err);
    res.status(500).json({ success: false, error: "Verification failed. Please try again." });
  }
});

// POST /auth/resend-verification
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    const emailErr = validateEmail(email ?? "");
    if (emailErr) {
      return res.status(422).json({ success: false, errors: { email: emailErr } });
    }

    const normalized = email!.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    if (user && user.role === "CLIENT" && !user.emailVerified) {
      const verifyToken = await createVerificationToken(user.id);
      sendVerificationEmail(user.email, user.name, verifyToken);
    }

    res.json({
      success: true,
      message: "If an unverified account exists, a new verification email has been sent.",
    });
  } catch (err) {
    console.error("[POST /auth/resend-verification]", err);
    res.status(500).json({ success: false, error: "Failed to resend verification email." });
  }
});

// GET /auth/users — admin only, returns list of all CLIENT users
router.get("/users", requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("[GET /auth/users]", err);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});

// PATCH /auth/profile — authenticated user updates their own name & phone
router.patch("/profile", requireAuth as any, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body as { name?: string; phone?: string };
    const errors: Record<string, string> = {};

    if (!name?.trim())  errors.name  = "Name is required";
    if (!phone?.trim()) errors.phone = "Phone number is required";
    if (Object.keys(errors).length) {
      return res.status(422).json({ success: false, errors });
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data:  { name: name!.trim(), phone: phone!.trim() },
      select: { id: true, name: true, email: true, phone: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /auth/profile]", err);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
});

export default router;
