'use client'

import dynamic from 'next/dynamic'
import type { PostLite } from './types'

function Loading() {
  return (
    <div role="status" style={{ position: 'fixed', inset: 0, zIndex: 100000, background: '#0b1020', color: '#9fe8b6', display: 'grid', placeItems: 'center', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 14 }}>
      <div>booting mcj-OS…</div>
    </div>
  )
}

// The whole desktop is lazy-loaded so the rest of the site never pays for it.
const Desktop = dynamic(() => import('./Desktop'), { ssr: false, loading: Loading })

export function PlaygroundLoader({ posts }: { posts: PostLite[] }) {
  return <Desktop posts={posts} />
}
