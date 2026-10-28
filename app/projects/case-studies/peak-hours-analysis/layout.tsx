import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Peak Hours Analysis',
  description: 'Case study: discovering temporal delay patterns in Dublin bus data.',
  path: '/projects/case-studies/peak-hours-analysis',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
