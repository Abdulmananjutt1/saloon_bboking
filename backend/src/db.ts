import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL, IS_PROD } from "./lib/config";

// Prevent connection leaks during development hot-reloads (ts-node-dev)
// and limit pool size to fit within Supabase free-tier limits.
declare global {
  var prismaGlobal: PrismaClient | undefined;
  var pgPoolGlobal: Pool | undefined;
}

let pool: Pool;
let prisma: PrismaClient;

const connectionString = DATABASE_URL;
const poolMax = Number(process.env.DB_POOL_MAX ?? (IS_PROD ? 5 : 2));

if (!connectionString) {
  throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
}

if (IS_PROD) {
  pool = new Pool({ connectionString, max: poolMax });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter } as any);
} else {
  if (!global.pgPoolGlobal) {
    global.pgPoolGlobal = new Pool({ connectionString, max: poolMax });
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
