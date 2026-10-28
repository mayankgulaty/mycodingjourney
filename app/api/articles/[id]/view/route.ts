import { NextRequest, NextResponse } from 'next/server'
import { incrementViewCount } from '@/lib/articles'

// POST /api/articles/[id]/view - Increment view count
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // The id here is actually the slug
        await incrementViewCount(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error incrementing view count:', error)
        return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 })
    }
}
