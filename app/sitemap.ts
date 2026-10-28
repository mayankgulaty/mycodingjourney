import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { getPublishedArticles } from '@/lib/articles'

export const revalidate = 3600

// Only real, indexable routes. Blog URLs come from the published articles in Supabase.
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }> = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects/case-studies', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projects/case-studies/dublin-bus-pipeline', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projects/case-studies/transit-delay-prediction', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projects/case-studies/route-optimization', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projects/case-studies/peak-hours-analysis', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projects/case-studies/portfolio-website', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/hire', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await getPublishedArticles({ pageSize: 1000 })

  const staticPages = STATIC_ROUTES.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const blogPages = articles.map((a) => ({
    url: `${siteConfig.url}/blog/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at || a.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
