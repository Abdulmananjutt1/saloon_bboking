import { Router, Request, Response } from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";
import { validateLogin, validateRegister, hasErrors } from "../validations";
const JWT_SECRET = process.env.JWT_SECRET || "glamour_studio_super_secret_dev_key_2026";

// Simple deterministic hash — no external crypto deps
function hashPassword(password: string): string {
  const salt = "glamour_studio_2026";
  const str  = password + salt;
  let hash   = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha_${Math.abs(hash).toString(36)}_${Buffer.from(str.slice(0, 8)).toString("base64")}`;
}

const router = Router();

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
        name:         body.name.trim(),
        email:        body.email.trim().toLowerCase(),
        phone:        body.phone.trim(),
        passwordHash: hashPassword(body.password),
        role:         "CLIENT",
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const { passwordHash: _, ...safeUser } = user;
    
    res.status(201).json({ success: true, data: safeUser, token });
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

    // Vague error to prevent user enumeration
    if (!user || user.passwordHash !== hashPassword(body.password)) {
      return res.status(401).json({
        success: false,
        errors: { general: "Invalid email or password. Please try again." },
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

export default router;
