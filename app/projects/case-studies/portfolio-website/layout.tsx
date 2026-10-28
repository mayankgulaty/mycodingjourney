import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Portfolio Platform',
  description: 'Case study: this site, built with Next.js, MDX, Supabase and Tailwind.',
  path: '/projects/case-studies/portfolio-website',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
