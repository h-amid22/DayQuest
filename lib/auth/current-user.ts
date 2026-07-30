import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getRole } from "./authorization";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { id: user.id, email: user.email ?? null, role: getRole(user.app_metadata) };
}
