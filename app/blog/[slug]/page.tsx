import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { serializeMDX } from '@/lib/mdx'
import { Badge } from '@/components/badge'
import { Card } from '@/components/card'
import { Section } from '@/components/section'
import { MDXContent } from '@/components/blog/mdx-remote'
import { ViewTracker } from '@/components/blog/view-tracker'

// Set to true when Supabase is configured
const USE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ? true : false

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export const revalidate = 60 // Revalidate every 60 seconds

export async function generateStaticParams() {
  if (USE_SUPABASE) {
    const slugs = await getArticleSlugs()
    return slugs.map((slug) => ({ slug }))
  }

  // Fallback to static posts
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  if (USE_SUPABASE) {
    const article = await getArticleBySlug(params.slug)

    if (!article) {
      return { title: 'Post Not Found' }
    }

    return {
      title: article.title,
      description: article.excerpt || undefined,
      openGraph: {
        title: article.title,
        description: article.excerpt || undefined,
        type: 'article',
        publishedTime: article.published_at || article.created_at,
        authors: [article.author],
        tags: article.tags,
        images: article.cover_image ? [article.cover_image] : undefined,
      },
    }
  }

  // Fallback to static posts
  const post = getPostBySlug(params.slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (USE_SUPABASE) {
    const article = await getArticleBySlug(params.slug)

    if (!article) {
      notFound()
    }

    // Serialize MDX content
    const mdxSource = await serializeMDX(article.content)

    return (
      <>
        {/* Track view */}
        <ViewTracker slug={article.slug} />

        {/* Cover Image */}
        {article.cover_image && (
          <div className="w-full h-64 md:h-96 relative overflow-hidden bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: article.cover_image_position || '50% 50%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Hero Section */}
        <Section className={`${article.cover_image ? 'py-8' : 'py-12 md:py-16'}`}>
          <div className="container max-w-4xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-white/70 mb-6">
                <span>{formatDate(article.published_at || article.created_at)}</span>
                <span>•</span>
                <span>{article.reading_time} min read</span>
                <span>•</span>
                <span>By {article.author}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-gray-600 dark:text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {article.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {article.tags.map((tag) => (
                    <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                      <Badge
                        variant="outline"
                        className="border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80 hover:bg-purple-100 hover:border-purple-400 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:border-purple-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Article Content */}
        <Section>
          <div className="container max-w-4xl">
            <Card className="p-8 md:p-12">
              <MDXContent source={mdxSource} />
            </Card>
          </div>
        </Section>

        {/* Author Bio */}
        <Section className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="container max-w-4xl">
            <Card className="glass-morphism border-white/20 dark:border-white/20 border-gray-200 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm">
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About {article.author}</h3>
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                      Full-stack developer passionate about creating amazing web experiences.
                      I write about modern web technologies, best practices, and my coding journey.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>
      </>
    )
  }

  // Fallback: Use static posts (original implementation)
  const { parseMarkdown } = await import('@/lib/markdown')
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-white/70 mb-6">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80 hover:bg-purple-100 hover:border-purple-400 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:border-purple-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Article Content */}
      <Section>
        <div className="container max-w-4xl">
          <Card className="p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(post.content)
              }}
            />
          </Card>
        </div>
      </Section>

      {/* Author Bio */}
      <Section className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container max-w-4xl">
          <Card className="glass-morphism border-white/20 dark:border-white/20 border-gray-200 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm">
            <div className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About {post.author}</h3>
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                    Full-stack developer passionate about creating amazing web experiences.
                    I write about modern web technologies, best practices, and my coding journey.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </>
  )
}
