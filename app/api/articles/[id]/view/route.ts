import { NextRequest, NextResponse } from 'next/server'
import { incrementViewCount } from '@/lib/articles'
import { clientIp, rateLimit } from '@/lib/rate-limit'

// POST /api/articles/[id]/view - Increment view count (the id is the slug).
// Guarded in app code: slug shape check, same-origin check, and rate limits
// (one count per visitor+article per 30 min, 60 counts per visitor per hour).
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(id)) {
        return NextResponse.json({ error: 'Invalid article' }, { status: 400 })
    }

    const origin = request.headers.get('origin')
    if (origin && new URL(origin).host !== request.nextUrl.host) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ip = clientIp(request.headers)
    const perArticle = rateLimit(`view:${ip}:${id}`, 1, 30 * 60_000)
    const perVisitor = rateLimit(`view-all:${ip}`, 60, 60 * 60_000)
    if (!perVisitor.ok) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(perVisitor.retryAfter) } })
    }
    if (!perArticle.ok) {
        // Already counted recently: succeed quietly without touching the database.
        return NextResponse.json({ success: true, counted: false })
    }

    const counted = await incrementViewCount(id)
    return NextResponse.json({ success: counted, counted }, { status: counted ? 200 : 500 })
}
