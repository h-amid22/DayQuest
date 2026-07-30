import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { seed: "tsx prisma/seed.ts" },
  datasource: {
    // A placeholder permits `prisma generate` during dependency installation.
    // Migration and seed commands still require a real DIRECT_URL.
    url: process.env.DIRECT_URL ?? "postgresql://localhost:5432/postgres",
  },
});
