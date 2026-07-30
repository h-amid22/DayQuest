import { NextResponse } from "next/server";

type ApiMeta = { requestId?: string };
export function apiSuccess<T>(data: T, init: ResponseInit = {}, meta: ApiMeta = {}) {
  return NextResponse.json({ ok: true as const, data, ...(meta.requestId ? { requestId: meta.requestId } : {}) }, init);
}
export function apiError(code: string, message: string, status: number, meta: ApiMeta = {}) {
  return NextResponse.json({ ok: false as const, error: { code, message }, ...(meta.requestId ? { requestId: meta.requestId } : {}) }, { status });
}
