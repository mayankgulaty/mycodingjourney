import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Contact',
  description: 'Get in touch with Mayank Gulaty about data engineering, full-stack work or collaboration.',
  path: '/contact',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
