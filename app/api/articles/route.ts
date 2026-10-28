import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import {
    getPublishedArticles,
    getAllArticles,
    createArticle,
    extractTitle
} from '@/lib/articles'
import type { ArticleInput } from '@/lib/types'

// Verify admin password (constant-time, fails closed if unset)
function isAuthorized(request: NextRequest): boolean {
    return isAdminRequest(request)
}

// GET /api/articles - List articles
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    // Clamp pagination inputs so a caller cannot request unbounded pages
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10') || 10))
    const tag = searchParams.get('tag') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined

    try {
        if (all) {
            // Admin wants all articles - verify auth
            if (!isAuthorized(request)) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            const articles = await getAllArticles()
            return NextResponse.json({ data: articles })
        }

        // Public - only published articles
        const result = await getPublishedArticles({ page, pageSize, tag, featured })
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching articles:', error)
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }
}

// POST /api/articles - Create article
export async function POST(request: NextRequest) {
    // Verify admin auth
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        // Validate required fields
        if (!body.content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        // Auto-extract title from content if not provided
        const title = body.title || extractTitle(body.content)
        if (!title) {
            return NextResponse.json({
                error: 'Title is required (either provide explicitly or include a # heading in content)'
            }, { status: 400 })
        }

        const input: ArticleInput = {
            title,
            content: body.content,
            excerpt: body.excerpt,
            slug: body.slug,
            tags: body.tags || [],
            cover_image: body.cover_image,
            published: body.published || false,
            featured: body.featured || false,
        }

        const article = await createArticle(input)

        if (!article) {
            return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
        }

        return NextResponse.json({ data: article }, { status: 201 })
    } catch (error) {
        console.error('Error creating article:', error)
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }
}
