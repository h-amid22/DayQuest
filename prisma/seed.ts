import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import pg from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { starterAchievements } from "./seed-data";

config({ path: ".env.local" });
config();

const connectionString = process.env.DIRECT_URL;
if (!connectionString) throw new Error("DIRECT_URL is required to seed the database");

const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  for (const achievement of starterAchievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error: unknown) => {
    console.error("Database seed failed", error instanceof Error ? error.message : "Unknown error");
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
