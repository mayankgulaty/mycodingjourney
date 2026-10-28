import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site'
import { getPublishedArticles } from '@/lib/articles'

export const revalidate = 3600

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const { data: posts } = await getPublishedArticles({ pageSize: 50 })

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`
      return `
    <item>
      <title>${esc(post.title)}</title>
      <description>${esc(post.excerpt || '')}</description>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
      ${(post.tags || []).map((tag) => `<category>${esc(tag)}</category>`).join('')}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.title)}</title>
    <description>${esc(siteConfig.description)}</description>
    <link>${siteConfig.url}</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`

  return new NextResponse(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
