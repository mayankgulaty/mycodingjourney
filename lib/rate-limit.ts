/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * Best-effort only: state lives in one serverless instance, so it blocks bursts and
 * naive bots but is not a hard global limit. For a hard limit move this to Redis/KV
 * or enforce it inside Supabase.
 */
const buckets = new Map<string, number[]>()
let lastSweep = 0

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  if (now - lastSweep > 60_000) {
    lastSweep = now
    for (const [k, hits] of buckets) {
      if (!hits.length || now - hits[hits.length - 1] > 3_600_000) buckets.delete(k)
    }
  }
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) }
  }
  hits.push(now)
  buckets.set(key, hits)
  return { ok: true, retryAfter: 0 }
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return headers.get('x-real-ip') || 'unknown'
}
