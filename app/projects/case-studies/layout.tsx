import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Case Studies',
  description: 'In-depth case studies of data pipelines, analytics and full-stack projects.',
  path: '/projects/case-studies',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
