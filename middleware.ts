import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const headers = new Headers(request.headers); headers.set("x-request-id", requestId);
  let response = NextResponse.next({ request: { headers } }); response.headers.set("x-request-id", requestId);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const setAll = ((cookies) => { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request: { headers } }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); response.headers.set("x-request-id", requestId); }) satisfies SetAllCookies;
  const supabase = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll } });
  await supabase.auth.getUser();
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
