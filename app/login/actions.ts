"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function login(formData: FormData) {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/login?error=Invalid+credentials");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect("/login?error=Unable+to+sign+in");
  redirect("/protected");
}

export async function logout() { const supabase = await createServerSupabaseClient(); await supabase.auth.signOut(); redirect("/"); }
