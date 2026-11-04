/**
 * Read a variable at request time.
 *
 * Bracket access is deliberate: Next inlines `process.env.NEXT_PUBLIC_*` (and, when
 * the value is present at build, other direct `process.env.NAME` reads) into the
 * bundle. Worker secrets are injected per request and are not available at build,
 * so they must be read dynamically. Never log the returned value.
 */
export function readEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
