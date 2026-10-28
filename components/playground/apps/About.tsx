'use client'

import Link from 'next/link'
import { useState } from 'react'
import { siteConfig } from '@/lib/site'
import { SKILLS } from '../data/content'
import type { AppProps } from '../types'

const MESSAGES = [
  'Ouch. That was my logo.',
  'Stop that. It tickles.',
  'SELECT * FROM clicks WHERE you = "very persistent";',
  'You have unlocked: 🥉 Persistent Clicker.',
  'Fine, here is a hint: try ↑ ↑ ↓ ↓ ← → ← → B A',
  'Try typing `sudo hire-me` in the terminal.',
]

export function About({ os }: AppProps) {
  const [n, setN] = useState(0)
  const [spin, setSpin] = useState(false)
  return (
    <div style={{ padding: 20, display: 'grid', gap: 18 }} className="pg-selectable">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          aria-label="Logo. Click it, I dare you."
          onClick={() => {
            const next = n + 1
            setN(next)
            if (!os.reduceMotion) { setSpin(true); window.setTimeout(() => setSpin(false), 700) }
            os.toast(MESSAGES[(next - 1) % MESSAGES.length])
            if (next === 7) os.matrix()
          }}
          style={{ background: 'none', border: 0, padding: 0, transition: 'transform .7s', transform: spin ? 'rotate(360deg)' : 'none' }}
        >
          <svg width="72" height="72" viewBox="0 0 40 40" aria-hidden>
            <rect width="40" height="40" rx="10" fill="var(--pg-accent)" />
            <path d="M20 12 V28 M12 16 L20 20 L28 16" stroke="var(--pg-accent-fg)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="20" cy="12" r="2.5" fill="var(--pg-accent-fg)" />
            <circle cx="20" cy="28" r="2.5" fill="var(--pg-accent-fg)" />
          </svg>
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{siteConfig.author.name}</h1>
          <div className="pg-muted">Senior Data Engineer · Full-stack developer</div>
          <div className="pg-muted pg-mono" style={{ fontSize: 12 }}>{siteConfig.author.location}</div>
        </div>
      </div>
      <p style={{ margin: 0 }}>{siteConfig.author.bio}</p>
      <div>
        <div className="pg-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Toolbox</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SKILLS.map((s) => <span key={s} className="pg-chip">{s}</span>)}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <a className="pg-btn" href={siteConfig.author.resume} target="_blank" rel="noopener noreferrer">Résumé (PDF)</a>
        <a className="pg-btn pg-ghost" href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="pg-btn pg-ghost" href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <Link className="pg-btn pg-ghost" href="/contact">Contact</Link>
        <Link className="pg-btn pg-ghost" href="/hire">Work with me</Link>
      </div>
      <div className="pg-muted" style={{ fontSize: 12 }}>
        This desktop is a playground. The proper site is at <Link className="pg-link" href="/">mycodingjourney.com</Link>. Psst: there are Easter eggs. Try clicking the logo.
      </div>
    </div>
  )
}
