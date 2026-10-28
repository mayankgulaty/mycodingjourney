import type { Metadata } from 'next'
import { siteConfig } from './site'

/**
 * Build page-specific metadata. `title` is the short page title; the root layout
 * template appends " | Mayank Gulaty". `path` is relative to metadataBase (www host).
 */
export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${opts.title} | ${siteConfig.author.name}`
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: 'website',
      url: opts.path,
      title: fullTitle,
      description: opts.description,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: opts.description,
      images: [siteConfig.ogImage],
    },
  }
}
