import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { parseMarkdown } from '@/lib/markdown'
import { Badge } from '@/components/badge'
import { Card } from '@/components/card'
import { Section } from '@/components/section'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-[70vh] flex items-center">
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
                  <Badge key={tag} variant="outline" className="border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80">
                    {tag}
                  </Badge>
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
