import Link from 'next/link'
import { PlaygroundLoader } from '@/components/playground/Loader'
import type { PostLite } from '@/components/playground/types'
import { getPublishedArticles } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = pageMetadata({
  title: 'Playground',
  description: 'A hackable desktop in your browser: terminal, SQL on real Dublin bus data, a pipeline puzzle game, themes and a few Easter eggs.',
  path: '/playground',
})

export default async function PlaygroundPage() {
  let posts: PostLite[] = []
  try {
    const { data } = await getPublishedArticles({ pageSize: 8 })
    posts = data.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? '',
      date: formatDate(a.published_at || a.created_at),
      tags: a.tags ?? [],
      readingTime: a.reading_time,
      preview: a.content.slice(0, 2600),
    }))
  } catch {
    posts = []
  }
  return (
    <>
      <PlaygroundLoader posts={posts} />
      <noscript>
        <div style={{ position: 'fixed', inset: 0, zIndex: 100001, background: '#0b1020', color: '#e5e7eb', padding: 32, fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>The playground needs JavaScript</h1>
          <p>It is a desktop made of React. Meanwhile: <Link href="/" style={{ color: '#4da3ff' }}>home</Link>, <Link href="/projects" style={{ color: '#4da3ff' }}>projects</Link>, <Link href="/blog" style={{ color: '#4da3ff' }}>blog</Link>.</p>
        </div>
      </noscript>
    </>
  )
}
