import type { Metadata } from 'next'
import { HomeView } from '@/components/home-view'
import { getPublishedArticles } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { siteConfig } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const { data } = await getPublishedArticles({ pageSize: 3 })
  const posts = data.map((a) => ({
    slug: a.slug,
    title: a.title,
    date: formatDate(a.published_at || a.created_at),
    readingTime: a.reading_time,
    tag: a.tags?.[0] ?? null,
  }))
  return <HomeView posts={posts} />
}
