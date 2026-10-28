'use client'

import { WALLPAPERS } from '../types'
import type { AppProps } from '../types'

export function Settings({ os }: AppProps) {
  return (
    <div style={{ padding: 18, display: 'grid', gap: 20 }}>
      <section aria-labelledby="pg-themes">
        <h2 id="pg-themes" style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800 }}>Theme</h2>
        <div role="radiogroup" aria-label="Theme" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {os.themes.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === os.themeId}
              onClick={() => os.setTheme(t.id)}
              style={{ textAlign: 'left', padding: 10, borderRadius: 10, border: `2px solid ${t.id === os.themeId ? 'var(--pg-accent)' : 'var(--pg-border)'}`, background: 'var(--pg-panel)' }}
            >
              <span aria-hidden style={{ display: 'block', height: 44, borderRadius: 6, marginBottom: 8, background: t.vars['--pg-wallpaper'], border: '1px solid var(--pg-border)', position: 'relative' }}>
                <span style={{ position: 'absolute', right: 6, bottom: 6, width: 16, height: 16, borderRadius: '50%', background: t.swatch, border: '1px solid rgba(0,0,0,.3)' }} />
              </span>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 13 }}>{t.name}</span>
              <span className="pg-muted" style={{ fontSize: 11 }}>{t.blurb}</span>
            </button>
          ))}
        </div>
        <p className="pg-muted" style={{ fontSize: 12, margin: '8px 0 0' }}>Saved in this browser only (localStorage). Terminal: <code className="pg-chip">theme synthwave</code></p>
      </section>
      <section aria-labelledby="pg-walls">
        <h2 id="pg-walls" style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800 }}>Wallpaper overlay</h2>
        <div role="radiogroup" aria-label="Wallpaper overlay" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {WALLPAPERS.map((w) => (
            <button key={w.id} type="button" role="radio" aria-checked={w.id === os.wallpaper} onClick={() => os.setWallpaper(w.id)} className={w.id === os.wallpaper ? 'pg-btn' : 'pg-btn pg-ghost'}>{w.name}</button>
          ))}
        </div>
        {os.reduceMotion && <p className="pg-muted" style={{ fontSize: 12, margin: '8px 0 0' }}>Reduced motion is on, so the animated bits stay still.</p>}
      </section>
      <section aria-labelledby="pg-keys">
        <h2 id="pg-keys" style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800 }}>Keyboard</h2>
        <ul className="pg-muted" style={{ margin: 0, paddingLeft: 18, listStyle: 'disc', fontSize: 13 }}>
          <li>Tab to a window title bar, then arrow keys move it, Shift+arrows resize, Enter maximises.</li>
          <li>Terminal: Tab completes, ↑/↓ history, Ctrl+L clears.</li>
          <li>There is at least one cheat code. It is very old.</li>
        </ul>
      </section>
    </div>
  )
}
