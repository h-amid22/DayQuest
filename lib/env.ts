import { z } from "zod";

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  DIRECT_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const publicEnvSchema = serverEnvSchema.pick({ NEXT_PUBLIC_SUPABASE_URL: true, NEXT_PUBLIC_SUPABASE_ANON_KEY: true });
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(values: Record<string, string | undefined>): ServerEnv { return serverEnvSchema.parse(values); }
export function getServerEnv(): ServerEnv { return parseServerEnv(process.env); }
export function getPublicEnv() { return publicEnvSchema.parse(process.env); }
