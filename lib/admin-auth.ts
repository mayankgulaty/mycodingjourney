import { createHash, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

/**
 * Shared admin check for API routes.
 *
 * - Fails closed: if ADMIN_PASSWORD is not configured, nobody is authorised
 *   (previously one route silently fell back to a hard-coded default).
 * - Constant-time comparison (hash both sides so lengths always match).
 */
export function isAdminRequest(request: NextRequest): boolean {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) return false

    const authHeader = request.headers.get('authorization')
    if (!authHeader) return false

    const [type, token] = authHeader.split(' ')
    if (type !== 'Bearer' || !token) return false

    const a = createHash('sha256').update(token).digest()
    const b = createHash('sha256').update(expected).digest()
    return timingSafeEqual(a, b)
}
