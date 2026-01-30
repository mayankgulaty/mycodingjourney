import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getArticleBySlug, getArticleSlugs, getPublishedArticles } from '@/lib/articles'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { serializeMDX } from '@/lib/mdx'
import { Badge } from '@/components/badge'
import { Card } from '@/components/card'
import { Section } from '@/components/section'
import { MDXContent } from '@/components/blog/mdx-remote'
import { ViewTracker } from '@/components/blog/view-tracker'
import { siteConfig } from '@/lib/site'

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

    const url = `${siteConfig.url}/blog/${article.slug}`

    return {
      title: `${article.title} | ${siteConfig.author.name}`,
      description: article.excerpt || undefined,
      authors: [{ name: siteConfig.author.name }],
      openGraph: {
        title: article.title,
        description: article.excerpt || undefined,
        type: 'article',
        publishedTime: article.published_at || article.created_at,
        authors: [siteConfig.author.name],
        tags: article.tags,
        images: article.cover_image ? [article.cover_image] : undefined,
        url,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt || undefined,
        images: article.cover_image ? [article.cover_image] : undefined,
      },
      alternates: {
        canonical: url,
      },
    }
  }

  // Fallback to static posts
  const post = getPostBySlug(params.slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | ${siteConfig.author.name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [siteConfig.author.name],
      tags: post.tags,
    },
  }
}

// JSON-LD structured data for SEO
function generateArticleJsonLd(article: { title: string; excerpt?: string | null; published_at?: string | null; created_at: string; author: string; slug: string; cover_image?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    datePublished: article.published_at || article.created_at,
    dateModified: article.published_at || article.created_at,
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${article.slug}`,
    },
    image: article.cover_image || siteConfig.ogImage,
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

    // Get related articles (same tags, excluding current)
    const { data: allArticles } = await getPublishedArticles({ pageSize: 10 })
    const relatedArticles = allArticles
      .filter(a => a.slug !== article.slug)
      .filter(a => a.tags.some(tag => article.tags.includes(tag)))
      .slice(0, 3)

    const jsonLd = generateArticleJsonLd(article)

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/me.jpg" alt={siteConfig.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Written by {siteConfig.author.name}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed mb-4">
                      {siteConfig.author.bio}
                    </p>
                    <div className="flex gap-4">
                      <a 
                        href={siteConfig.links.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Connect on LinkedIn
                      </a>
                      <a 
                        href={siteConfig.links.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Follow on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <Section>
            <div className="container max-w-4xl">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <Card className="h-full glass-morphism border-white/20 hover:border-purple-500/50 dark:border-white/20 dark:hover:border-purple-500/50 border-gray-200 hover:border-purple-300 dark:bg-white/5 bg-white/80 transition-all duration-300 cursor-pointer">
                      <div className="p-6">
                        {related.cover_image && (
                          <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={related.cover_image}
                              alt={related.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {formatDate(related.published_at || related.created_at)}
                        </p>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Back to Blog */}
        <Section className="py-8">
          <div className="container max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>
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
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/me.jpg" alt={siteConfig.author.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Written by {siteConfig.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed mb-4">
                    {siteConfig.author.bio}
                  </p>
                  <div className="flex gap-4">
                    <a 
                      href={siteConfig.links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Connect on LinkedIn
                    </a>
                    <a 
                      href={siteConfig.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Follow on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Back to Blog */}
      <Section className="py-8">
        <div className="container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </Section>
    </>
  )
}
