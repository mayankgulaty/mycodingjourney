import { NextRequest, NextResponse } from 'next/server'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles'

// Verify admin password
function isAuthorized(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return false

    const [type, token] = authHeader.split(' ')
    if (type !== 'Bearer') return false

    return token === process.env.ADMIN_PASSWORD
}

// GET /api/articles/[id] - Get single article by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Verify admin auth (getting by ID is admin-only)
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const article = await getArticleById(params.id)

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        return NextResponse.json({ data: article })
    } catch (error) {
        console.error('Error fetching article:', error)
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
    }
}

// PUT /api/articles/[id] - Update article
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Verify admin auth
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        const article = await updateArticle({
            id: params.id,
            ...body,
        })

        if (!article) {
            return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
        }

        return NextResponse.json({ data: article })
    } catch (error) {
        console.error('Error updating article:', error)
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
    }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Verify admin auth
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const success = await deleteArticle(params.id)

        if (!success) {
            return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting article:', error)
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
    }
}
