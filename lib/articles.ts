import { supabase, createAdminClient } from './supabase'
import type { Article, ArticleInput, ArticleUpdate, PaginatedResponse } from './types'
import slugify from 'slugify'
import readingTime from 'reading-time'

// Generate a URL-friendly slug from title
export function generateSlug(title: string): string {
    return slugify(title, {
        lower: true,
        strict: true,
        trim: true
    })
}

// Calculate reading time from content
export function calculateReadingTime(content: string): number {
    const stats = readingTime(content)
    return Math.ceil(stats.minutes)
}

// Extract excerpt from content (first paragraph or first 160 chars)
export function extractExcerpt(content: string, maxLength = 160): string {
    // Remove markdown headers and get first paragraph
    const cleanContent = content
        .replace(/^#+\s+.+$/gm, '') // Remove headers
        .replace(/^\s+/gm, '') // Remove leading whitespace
        .trim()

    // Get first paragraph
    const firstParagraph = cleanContent.split('\n\n')[0] || cleanContent

    // Clean markdown formatting
    const plainText = firstParagraph
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
        .replace(/`(.*?)`/g, '$1') // Inline code
        .trim()

    if (plainText.length <= maxLength) {
        return plainText
    }

    return plainText.substring(0, maxLength).trim() + '...'
}

// Extract title from content (first H1 heading)
export function extractTitle(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : null
}

// Get all published articles
export async function getPublishedArticles(options?: {
    page?: number
    pageSize?: number
    tag?: string
    featured?: boolean
}): Promise<PaginatedResponse<Article>> {
    const page = options?.page || 1
    const pageSize = options?.pageSize || 10
    const offset = (page - 1) * pageSize

    let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('published_at', { ascending: false })

    if (options?.tag) {
        query = query.contains('tags', [options.tag])
    }

    if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured)
    }

    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching articles:', error)
        return { data: [], total: 0, page, pageSize, totalPages: 0 }
    }

    const total = count || 0
    return {
        data: data || [],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    }
}

// Get a single article by slug (public)
export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

    if (error) {
        console.error('Error fetching article:', error)
        return null
    }

    return data
}

// Get all articles (admin - includes drafts)
export async function getAllArticles(): Promise<Article[]> {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching all articles:', error)
        return []
    }

    return data || []
}

// Get article by ID (admin)
export async function getArticleById(id: string): Promise<Article | null> {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching article by ID:', error)
        return null
    }

    return data
}

// Create a new article
export async function createArticle(input: ArticleInput): Promise<Article | null> {
    const adminClient = createAdminClient()

    const slug = input.slug || generateSlug(input.title)
    const readingTimeMinutes = calculateReadingTime(input.content)
    const excerpt = input.excerpt || extractExcerpt(input.content)

    const articleData = {
        title: input.title,
        slug,
        content: input.content,
        excerpt,
        author: 'Mayank',
        tags: input.tags || [],
        cover_image: input.cover_image || null,
        cover_image_position: input.cover_image_position || '50% 50%',
        published: input.published || false,
        featured: input.featured || false,
        reading_time: readingTimeMinutes,
        published_at: input.published ? new Date().toISOString() : null
    }

    const { data, error } = await (adminClient
        .from('articles')
        .insert(articleData as any)
        .select()
        .single())

    if (error) {
        console.error('Error creating article:', error)
        return null
    }

    return data as Article
}

// Update an article
export async function updateArticle(update: ArticleUpdate): Promise<Article | null> {
    const adminClient = createAdminClient()

    const updateData: Record<string, unknown> = {}

    if (update.title !== undefined) {
        updateData.title = update.title
        if (!update.slug) {
            updateData.slug = generateSlug(update.title)
        }
    }

    if (update.slug !== undefined) {
        updateData.slug = update.slug
    }

    if (update.content !== undefined) {
        updateData.content = update.content
        updateData.reading_time = calculateReadingTime(update.content)
        if (!update.excerpt) {
            updateData.excerpt = extractExcerpt(update.content)
        }
    }

    if (update.excerpt !== undefined) {
        updateData.excerpt = update.excerpt
    }

    if (update.tags !== undefined) {
        updateData.tags = update.tags
    }

    if (update.cover_image !== undefined) {
        updateData.cover_image = update.cover_image
    }

    if (update.cover_image_position !== undefined) {
        updateData.cover_image_position = update.cover_image_position
    }

    if (update.featured !== undefined) {
        updateData.featured = update.featured
    }

    if (update.published !== undefined) {
        updateData.published = update.published
        // Set published_at on first publish
        if (update.published) {
            const existing = await getArticleById(update.id)
            if (existing && !existing.published_at) {
                updateData.published_at = new Date().toISOString()
            }
        }
    }

    const { data, error } = await (adminClient
        .from('articles')
        .update(updateData as any)
        .eq('id', update.id)
        .select()
        .single())

    if (error) {
        console.error('Error updating article:', error)
        return null
    }

    return data as Article
}

// Delete an article
export async function deleteArticle(id: string): Promise<boolean> {
    const adminClient = createAdminClient()

    const { error } = await adminClient
        .from('articles')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting article:', error)
        return false
    }

    return true
}

// Increment view count
export async function incrementViewCount(slug: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', { article_slug: slug })

    if (error) {
        console.error('Error incrementing view count:', error)
    }
}

// Get all unique tags from published articles
export async function getAllTags(): Promise<string[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('tags')
        .eq('published', true)

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    const allTags = data?.flatMap(article => article.tags) || []
    return Array.from(new Set(allTags)).sort()
}

// Get article slugs for static generation
export async function getArticleSlugs(): Promise<string[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('slug')
        .eq('published', true)

    if (error) {
        console.error('Error fetching slugs:', error)
        return []
    }

    return data?.map(article => article.slug) || []
}
