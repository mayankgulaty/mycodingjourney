'use client'

import { useState } from 'react'
import { PROJECTS } from '../data/content'
import type { AppProps } from '../types'

export function Projects({ os, params }: AppProps) {
  const initial = typeof params.project === 'string' ? params.project : null
  const [sel, setSel] = useState<string | null>(initial)
  const proj = PROJECTS.find((p) => p.id === sel) ?? null
  return (
    <div className="pg-split" style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <nav aria-label="Finder sidebar" className="pg-panel" style={{ width: 150, flex: 'none', padding: 10, borderRight: '1px solid var(--pg-border)', fontSize: 13, overflow: 'auto' }}>
        <div className="pg-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', margin: '2px 0 6px' }}>Favourites</div>
        <button type="button" onClick={() => setSel(null)} className="pg-btn pg-ghost" style={{ width: '100%', justifyContent: 'flex-start', border: 0 }}>📁 Projects</button>
        <button type="button" onClick={() => os.open('blog')} className="pg-btn pg-ghost" style={{ width: '100%', justifyContent: 'flex-start', border: 0 }}>📝 Blog</button>
        <button type="button" onClick={() => os.open('about')} className="pg-btn pg-ghost" style={{ width: '100%', justifyContent: 'flex-start', border: 0 }}>👤 About</button>
        <a href="/projects" className="pg-btn pg-ghost" style={{ width: '100%', justifyContent: 'flex-start', border: 0 }}>🌐 Full site</a>
      </nav>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {!proj ? (
          <div style={{ padding: 16, overflow: 'auto' }}>
            <div className="pg-muted" style={{ marginBottom: 10, fontSize: 12 }}>{PROJECTS.length} items. Click one to get info.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
              {PROJECTS.map((p) => (
                <button key={p.id} type="button" onClick={() => setSel(p.id)} onDoubleClick={() => setSel(p.id)} className="pg-icon" style={{ color: 'var(--pg-win-fg)', textShadow: 'none', width: '100%' }}>
                  <span className="pg-ico" aria-hidden>{p.icon}</span>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <span className="pg-muted" style={{ fontSize: 11 }}>{p.kind}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: 18, overflow: 'auto' }} className="pg-selectable">
            <button type="button" className="pg-btn pg-ghost" onClick={() => setSel(null)}>← Back</button>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', margin: '14px 0 8px' }}>
              <span style={{ fontSize: 46 }} aria-hidden>{proj.icon}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{proj.name}</h2>
                <div className="pg-muted">{proj.tagline} · {proj.kind}</div>
              </div>
            </div>
            {proj.details.map((d) => <p key={d} style={{ margin: '8px 0' }}>{d}</p>)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>{proj.stack.map((s) => <span key={s} className="pg-chip">{s}</span>)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {proj.links.map((l) => (
                <a key={l.href} className="pg-btn" href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label} ↗</a>
              ))}
              {proj.id === 'dublin-bus' && <button type="button" className="pg-btn pg-ghost" onClick={() => os.open('sql')}>Query the data</button>}
              {proj.id === 'dublin-bus' && <button type="button" className="pg-btn pg-ghost" onClick={() => os.open('terminal', { run: 'sql SELECT * FROM delay_distribution' })}>…in the terminal</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
