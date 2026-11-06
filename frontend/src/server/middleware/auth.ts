// ─────────────────────────────────────────────────────────
//  Auth middleware helpers for Next.js API routes
// ─────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/config";

export interface AuthUser {
  userId: string;
  role: string;
}

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the decoded user payload or null if invalid/missing.
 */
export function getAuthUser(req: NextRequest): AuthUser | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Returns true if the user is authenticated.
 */
export function isAuthenticated(req: NextRequest): boolean {
  return getAuthUser(req) !== null;
}

/**
 * Returns true if the user is an admin.
 */
export function isAdmin(req: NextRequest): boolean {
  const user = getAuthUser(req);
  return user?.role === "ADMIN" || user?.role === "admin";
}

/**
 * Creates a 401 Unauthorized response.
 */
export function unauthorized(message = "Unauthorized. Token missing or invalid.") {
  return Response.json({ success: false, error: message }, { status: 401 });
}

/**
 * Creates a 403 Forbidden response.
 */
export function forbidden(message = "Forbidden. Admin access required.") {
  return Response.json({ success: false, error: message }, { status: 403 });
}
