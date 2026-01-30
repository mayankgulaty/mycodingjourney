// Database types for Supabase

export interface Article {
    id: string
    slug: string
    title: string
    excerpt: string | null
    content: string
    author: string
    tags: string[]
    cover_image: string | null
    cover_image_position: string | null // CSS object-position value like "50% 50%" or "center top"
    published: boolean
    featured: boolean
    view_count: number
    reading_time: number | null
    created_at: string
    updated_at: string
    published_at: string | null
}

export interface ArticleInput {
    title: string
    content: string
    excerpt?: string
    slug?: string
    tags?: string[]
    cover_image?: string
    cover_image_position?: string
    published?: boolean
    featured?: boolean
}

export interface ArticleUpdate extends Partial<ArticleInput> {
    id: string
}

// Supabase Database types
export interface Database {
    public: {
        Tables: {
            articles: {
                Row: Article
                Insert: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'view_count'> & {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    view_count?: number
                }
                Update: Partial<Article>
            }
        }
    }
}

// API Response types
export interface ApiResponse<T> {
    data?: T
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}
