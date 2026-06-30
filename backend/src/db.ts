import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Prevent connection leaks during development hot-reloads (ts-node-dev)
// and limit pool size to fit within Supabase free-tier limits.
declare global {
  var prismaGlobal: PrismaClient | undefined;
  var pgPoolGlobal: Pool | undefined;
}

let pool: Pool;
let prisma: PrismaClient;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({ connectionString, max: 2 });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter } as any);
} else {
  if (!global.pgPoolGlobal) {
    global.pgPoolGlobal = new Pool({ connectionString, max: 2 });
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
