import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Projects',
  description: 'Data engineering and full-stack projects: Dublin bus real-time pipeline, delay analysis and more.',
  path: '/projects',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
