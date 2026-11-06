// ─────────────────────────────────────────────────────────
//  Shared password hashing utility
// ─────────────────────────────────────────────────────────

const SALT = "glamour_studio_2026";

/**
 * Simple deterministic hash.
 * Must stay byte-for-byte identical in auth route and seed.ts.
 */
export function hashPassword(password: string): string {
  const str = password + SALT;
  let hash  = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha_${Math.abs(hash).toString(36)}_${Buffer.from(str.slice(0, 8)).toString("base64")}`;
}
