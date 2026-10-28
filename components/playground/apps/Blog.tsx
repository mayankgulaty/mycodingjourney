'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MiniMarkdown } from '../mini-markdown'
import type { AppProps } from '../types'

export function Blog({ os, params }: AppProps) {
  const first = typeof params.slug === 'string' ? params.slug : null
  const [slug, setSlug] = useState<string | null>(first)
  const post = os.posts.find((p) => p.slug === slug) ?? null
  if (os.posts.length === 0) {
    return <div style={{ padding: 20 }} className="pg-muted">No posts could be loaded right now. The full blog lives at <Link className="pg-link" href="/blog">/blog</Link>.</div>
  }
  return (
    <div className="pg-split" style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <ul aria-label="Posts" className="pg-panel" style={{ width: 230, flex: 'none', margin: 0, padding: 6, listStyle: 'none', borderRight: '1px solid var(--pg-border)', overflow: 'auto' }}>
        {os.posts.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => setSlug(p.slug)}
              aria-current={p.slug === slug}
              style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: 0, background: p.slug === slug ? 'var(--pg-accent)' : 'transparent', color: p.slug === slug ? 'var(--pg-accent-fg)' : 'inherit' }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{p.date}{p.readingTime ? ` · ${p.readingTime} min` : ''}</div>
            </button>
          </li>
        ))}
      </ul>
      <article style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 18 }}>
        {post ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>{post.tags.slice(0, 4).map((t) => <span key={t} className="pg-chip">{t}</span>)}</div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>{post.title}</h2>
            <div className="pg-muted" style={{ fontSize: 12, marginBottom: 10 }}>{post.date}{post.readingTime ? ` · ${post.readingTime} min read` : ''}</div>
            <MiniMarkdown source={post.preview} />
            <div style={{ marginTop: 16 }}><Link className="pg-btn" href={`/blog/${post.slug}`}>Read the full post ↗</Link></div>
          </>
        ) : (
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>Pick a post</h2>
            <p className="pg-muted" style={{ margin: 0 }}>{os.posts.length} real posts, straight from the blog. Pipelines, analytics and the odd ML experiment.</p>
            <div style={{ marginTop: 12 }}><Link className="pg-btn pg-ghost" href="/blog">Open the full blog ↗</Link></div>
          </div>
        )}
      </article>
    </div>
  )
}
