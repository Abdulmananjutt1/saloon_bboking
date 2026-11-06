import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Prevent connection leaks during Next.js hot-reloads
// and limit pool size to fit within Supabase free-tier limits.
declare global {
  var prismaGlobal: PrismaClient | undefined;
  var pgPoolGlobal: Pool | undefined;
}

const IS_PROD = process.env.NODE_ENV === "production";
const DATABASE_URL = process.env.DATABASE_URL ?? "";
const poolMax = Number(process.env.DB_POOL_MAX ?? (IS_PROD ? 5 : 2));

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
}

let pool: Pool;
let prisma: PrismaClient;

if (IS_PROD) {
  pool = new Pool({ connectionString: DATABASE_URL, max: poolMax });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter } as any);
} else {
  if (!global.pgPoolGlobal) {
    global.pgPoolGlobal = new Pool({ connectionString: DATABASE_URL, max: poolMax });
  }
  pool = global.pgPoolGlobal;

  if (!global.prismaGlobal) {
    const adapter = new PrismaPg(pool);
    global.prismaGlobal = new PrismaClient({ adapter } as any);
  }
  prisma = global.prismaGlobal;
}

export default prisma;
export { pool };
