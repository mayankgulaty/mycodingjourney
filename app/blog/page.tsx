import { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { getPublishedArticles } from '@/lib/articles'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog | My Coding Journey',
  description: 'Thoughts, tutorials, and insights from my coding journey',
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogPage() {
  const { data: articles } = await getPublishedArticles({ pageSize: 20 })

  return (
    <>
      {/* Hero Section */}
      <Section className="py-16 md:py-20 relative overflow-hidden gradient-bg">
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              My <span className="text-shimmer">Blog</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-8">
              Thoughts, tutorials, and insights from my coding journey
            </p>

            {/* Blog Stats */}
            {articles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="text-center px-6 py-3 glass-morphism rounded-2xl">
                  <span className="text-2xl font-bold text-primary">{articles.length}</span>
                  <span className="text-sm text-foreground/70 ml-2">Articles</span>
                </div>
                <div className="text-center px-6 py-3 glass-morphism rounded-2xl">
                  <span className="text-sm text-foreground/70">Topics: </span>
                  <span className="text-sm font-medium text-foreground">Data Engineering, System Design, Full-Stack</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Articles List */}
      <Section className="relative bg-background py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              All <span className="text-shimmer">Articles</span>
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105 cursor-pointer">
                    {/* Cover Image */}
                    {article.cover_image && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-purple-300 text-purple-700 dark:border-purple-500 dark:text-purple-400"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {article.featured && (
                          <Badge className="text-xs bg-yellow-500 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-foreground/70 mb-4 text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-foreground/60">
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                        <span>{article.reading_time} min read</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
