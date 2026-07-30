import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DIRECT_URL;
if (!connectionString) throw new Error("DIRECT_URL is required to seed the database");
const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  await prisma.user.upsert({ where: { email: "developer@example.test" }, update: { name: "Development User" }, create: { email: "developer@example.test", name: "Development User" } });
}

main().then(async () => { await prisma.$disconnect(); await pool.end(); }).catch(async (error: unknown) => { console.error("Database seed failed", error instanceof Error ? error.message : "Unknown error"); await prisma.$disconnect(); await pool.end(); process.exit(1); });
