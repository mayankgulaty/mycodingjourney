import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Route Performance Analysis',
  description: 'Case study: finding the best and worst performing Dublin bus routes from real-time delay data.',
  path: '/projects/case-studies/route-optimization',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
