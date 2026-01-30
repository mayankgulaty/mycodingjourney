import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedArticles, getAllTags } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/badge'
import { Card } from '@/components/card'
import { Section } from '@/components/section'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

interface TagPageProps {
    params: {
        tag: string
    }
}

export const revalidate = 60

export async function generateStaticParams() {
    const tags = await getAllTags()
    return tags.map((tag) => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const tag = decodeURIComponent(params.tag)
    return {
        title: `Articles tagged "${tag}"`,
        description: `Browse all articles about ${tag} on My Coding Journey`,
    }
}

export default async function TagPage({ params }: TagPageProps) {
    const tag = decodeURIComponent(params.tag)

    const { data: articles, total } = await getPublishedArticles({
        tag,
        pageSize: 50
    })

    if (articles.length === 0) {
        notFound()
    }

    return (
        <>
            {/* Hero Section */}
            <Section className="py-12 md:py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container max-w-4xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to all articles
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <Tag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            {tag}
                        </Badge>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Articles tagged &ldquo;{tag}&rdquo;
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400">
                        {total} {total === 1 ? 'article' : 'articles'} found
                    </p>
                </div>
            </Section>

            {/* Articles List */}
            <Section>
                <div className="container max-w-4xl">
                    <div className="space-y-6">
                        {articles.map((article) => (
                            <Link key={article.id} href={`/blog/${article.slug}`}>
                                <Card className="p-6 hover:shadow-lg transition-shadow group">
                                    <div className="flex gap-6">
                                        {/* Thumbnail */}
                                        {article.cover_image && (
                                            <div className="hidden sm:block w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={article.cover_image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                    style={{ objectPosition: article.cover_image_position || '50% 50%' }}
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                                                {article.title}
                                            </h2>

                                            {article.excerpt && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                    {article.excerpt}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(article.published_at || article.created_at)}
                                                </span>
                                                {article.reading_time && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {article.reading_time} min read
                                                    </span>
                                                )}
                                            </div>

                                            {/* Other tags */}
                                            {article.tags.length > 1 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {article.tags
                                                        .filter(t => t !== tag)
                                                        .slice(0, 3)
                                                        .map((t) => (
                                                            <Badge
                                                                key={t}
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </Section>
        </>
    )
}
