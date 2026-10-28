import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About',
  description: 'Background, experience and skills of Mayank Gulaty, a data engineer and full-stack developer.',
  path: '/about',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
