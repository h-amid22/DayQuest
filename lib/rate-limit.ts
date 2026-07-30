type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();
export type RateLimitResult = { allowed: boolean; limit: number; remaining: number; resetAt: number };

export function rateLimit(key: string, options: { limit: number; windowMs: number }, now = Date.now()): RateLimitResult {
  const current = buckets.get(key);
  const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + options.windowMs } : current;
  entry.count += 1; buckets.set(key, entry);
  return { allowed: entry.count <= options.limit, limit: options.limit, remaining: Math.max(0, options.limit - entry.count), resetAt: entry.resetAt };
}

export function clearRateLimits() { buckets.clear(); }
