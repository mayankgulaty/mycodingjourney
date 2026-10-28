import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Hire Me',
  description: 'Open to data engineering and full-stack roles. What I bring, what I am looking for, and how to reach me.',
  path: '/hire',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
