import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Dublin Bus Real-Time Pipeline',
  description: 'Case study: collecting and analysing live Dublin bus GTFS-Realtime data with Python, SQLite and Streamlit.',
  path: '/projects/case-studies/dublin-bus-pipeline',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
