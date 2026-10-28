import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Transit Delay Prediction',
  description: 'Case study: an exploratory machine learning model for predicting Dublin bus delays from GTFS-Realtime data.',
  path: '/projects/case-studies/transit-delay-prediction',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
