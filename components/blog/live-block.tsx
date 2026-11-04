'use client'

import dynamic from 'next/dynamic'

// Sandpack is client-only. ssr:false keeps it out of the Worker render.
const LivePlayground = dynamic(
  () => import('./live-playground').then((mod) => mod.LivePlayground),
  {
    ssr: false,
    loading: () => (
      <div className="my-6 rounded-xl border border-gray-800 bg-gray-900 px-4 py-6 text-sm text-gray-400">
        Loading playground…
      </div>
    ),
  },
)

export function LiveBlock({ code, language }: { code: string; language: string }) {
  return <LivePlayground code={code} language={language} />
}
