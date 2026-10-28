'use client'

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import type { ComponentType, CSSProperties } from 'react'
import Link from 'next/link'
import './playground.css'
import { DEFAULT_THEME, THEMES, THEME_KEY, getTheme } from './themes'
import { WALLPAPERS } from './types'
import type { AppId, AppProps, OsApi, Params, PostLite, WallpaperId } from './types'
import { BOTTOM_RESERVED, TOP, Window, type WinState } from './Window'
import { MatrixRain } from './MatrixRain'
import { About } from './apps/About'
import { Blog } from './apps/Blog'
import { Duck } from './apps/Duck'
import { Pipeline } from './apps/Pipeline'
import { Projects } from './apps/Projects'
import { Settings } from './apps/Settings'
import { Sql } from './apps/Sql'
import { Terminal } from './apps/Terminal'

interface AppDef { title: string; icon: string; w: number; h: number; Component: ComponentType<AppProps> }

const APPS: Record<AppId, AppDef> = {
  terminal: { title: 'Terminal', icon: '⌨️', w: 660, h: 420, Component: Terminal },
  projects: { title: 'Projects', icon: '📁', w: 680, h: 440, Component: Projects },
  blog: { title: 'Blog', icon: '📝', w: 760, h: 480, Component: Blog },
  about: { title: 'About Me', icon: '👤', w: 520, h: 470, Component: About },
  pipeline: { title: 'Pipeline Panic', icon: '🕹️', w: 720, h: 500, Component: Pipeline },
  sql: { title: 'SQL Playground', icon: '🗄️', w: 780, h: 500, Component: Sql },
  duck: { title: 'Rubber Duck', icon: '🦆', w: 400, h: 470, Component: Duck },
  settings: { title: 'Appearance', icon: '🎨', w: 560, h: 500, Component: Settings },
}
function AppView({ app, os, params }: AppProps & { app: AppId }) {
  const C = APPS[app].Component
  return <C os={os} params={params} />
}
const DOCK_ORDER: AppId[] = ['terminal', 'projects', 'blog', 'sql', 'pipeline', 'duck', 'about', 'settings']

// ---- window state ----
interface WinEntry extends WinState { id: AppId; params: Params }
interface WState { wins: WinEntry[]; z: number; n: number }
type Act =
  | { t: 'open'; app: AppId; params?: Params; area: { w: number; h: number } }
  | { t: 'focus'; app: AppId }
  | { t: 'close'; app: AppId }
  | { t: 'min'; app: AppId }
  | { t: 'max'; app: AppId }
  | { t: 'move'; app: AppId; x: number; y: number }
  | { t: 'size'; app: AppId; w: number; h: number }
  | { t: 'clear-opening'; app: AppId }

function reducer(s: WState, a: Act): WState {
  const upd = (app: AppId, f: (w: WinEntry) => Partial<WinEntry>) => ({ ...s, wins: s.wins.map((w) => (w.id === app ? { ...w, ...f(w) } : w)) })
  switch (a.t) {
    case 'open': {
      const existing = s.wins.find((w) => w.id === a.app)
      const z = s.z + 1
      if (existing) return { ...upd(a.app, (w) => ({ z, min: false, params: { ...w.params, ...(a.params ?? {}), nonce: z } })), z }
      const def = APPS[a.app]
      const w = Math.min(def.w, a.area.w - 24)
      const h = Math.min(def.h, a.area.h - TOP - BOTTOM_RESERVED - 8)
      const off = (s.n % 6) * 28
      const x = Math.max(8, Math.min(70 + off + (s.n % 2) * 40, a.area.w - w - 8))
      const y = Math.max(TOP + 8, Math.min(TOP + 24 + off, a.area.h - h - BOTTOM_RESERVED))
      return { wins: [...s.wins, { id: a.app, app: a.app, title: def.title, x, y, w, h, z, min: false, max: false, opening: true, params: { ...(a.params ?? {}), nonce: z } }], z, n: s.n + 1 }
    }
    case 'focus': {
      const top = Math.max(...s.wins.map((w) => w.z), 0)
      const cur = s.wins.find((w) => w.id === a.app)
      if (!cur || (cur.z === top && !cur.min)) return s
      return { ...upd(a.app, () => ({ z: s.z + 1, min: false })), z: s.z + 1 }
    }
    case 'close': return { ...s, wins: s.wins.filter((w) => w.id !== a.app) }
    case 'min': return upd(a.app, () => ({ min: true }))
    case 'max': return upd(a.app, (w) => ({ max: !w.max }))
    case 'move': return upd(a.app, () => ({ x: a.x, y: a.y }))
    case 'size': return upd(a.app, () => ({ w: a.w, h: a.h }))
    case 'clear-opening': return upd(a.app, () => ({ opening: false }))
  }
}

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
const TRASH_GAGS = [
  'Trash is empty. Unlike your backlog.',
  "You can't trash a DAG. It's acyclic, not disposable.",
  'Moved 0 files to Trash. Moved 1 bug to "works as intended".',
  'rm -rf node_modules: freed 4.2 GB. Reinstalled 4.2 GB.',
]
const BOOT = [
  'mcj-OS 1.0 booting…',
  '[  ok  ] mounting /blog (read-only)',
  '[  ok  ] loading themes',
  '[  ok  ] starting rubber-duck.service',
  '[ skip ] airflow.service: nobody asked for that',
  'Welcome, visitor.',
]

const mobileQuery = '(max-width: 767px)'
const useMedia = (q: string) =>
  useSyncExternalStore(
    (cb) => { const m = window.matchMedia(q); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
    () => window.matchMedia(q).matches,
    () => false,
  )

function readLS(key: string): string | null { try { return localStorage.getItem(key) } catch { return null } }
function writeLS(key: string, v: string) { try { localStorage.setItem(key, v) } catch { /* storage blocked */ } }

export default function Desktop({ posts }: { posts: PostLite[] }) {
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')
  const mobile = useMedia(mobileQuery)
  const [unlocked, setUnlocked] = useState(() => readLS('mcj-playground-arcade') === '1')
  const themes = useMemo(() => THEMES.filter((t) => !t.hidden || unlocked), [unlocked])
  const [themeId, setThemeId] = useState<string>(() => { const s = readLS(THEME_KEY); return getTheme(s && (s !== 'arcade' || readLS('mcj-playground-arcade') === '1') ? s : DEFAULT_THEME).id })
  const [wallpaper, setWallpaperState] = useState<WallpaperId>(() => { const s = readLS('mcj-playground-wall'); return (WALLPAPERS.find((w) => w.id === s)?.id ?? 'theme') as WallpaperId })
  const theme = getTheme(themeId)
  const [state, dispatch] = useReducer(reducer, null, () => {
    const empty: WState = { wins: [], z: 10, n: 0 }
    if (window.matchMedia(mobileQuery).matches) return empty
    return reducer(empty, { t: 'open', app: 'terminal', params: { run: 'neofetch' }, area: { w: window.innerWidth, h: window.innerHeight } })
  })
  const [area, setArea] = useState({ w: 1200, h: 800 })
  const [mobileApp, setMobileApp] = useState<{ app: AppId; params: Params } | null>(null)
  const [menu, setMenu] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [rain, setRain] = useState(false)
  const [party, setParty] = useState(false)
  const [booting, setBooting] = useState(() => !readLS('mcj-pg-booted') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [bootLine, setBootLine] = useState(0)
  const [clock, setClock] = useState(() => new Date())
  const [startedAt] = useState(() => Date.now())
  const toastTimer = useRef<number | undefined>(undefined)
  const logoClicks = useRef<number[]>([])
  const [trashN, setTrashN] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // lock page scroll while the playground is mounted
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const measure = () => setArea({ w: window.innerWidth, h: window.innerHeight })
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => { const id = window.setInterval(() => setClock(new Date()), 30000); return () => clearInterval(id) }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3800)
  }, [])

  const setTheme = useCallback((id: string) => { setThemeId(id); writeLS(THEME_KEY, id) }, [])
  const setWallpaper = useCallback((id: WallpaperId) => { setWallpaperState(id); writeLS('mcj-playground-wall', id) }, [])

  const open = useCallback((app: AppId, params?: Params) => {
    setMenu(null)
    if (window.matchMedia(mobileQuery).matches) { setMobileApp({ app, params: { ...(params ?? {}), nonce: Date.now() } }); return }
    dispatch({ t: 'open', app, params, area: { w: window.innerWidth, h: window.innerHeight } })
  }, [])
  const close = useCallback((app: AppId) => { dispatch({ t: 'close', app }); setMobileApp((m) => (m?.app === app ? null : m)) }, [])

  const doParty = useCallback(() => {
    setParty(true)
    window.setTimeout(() => setParty(false), 6000)
  }, [])
  const unlockArcade = useCallback(() => {
    writeLS('mcj-playground-arcade', '1')
    setUnlocked(true)
  }, [])

  const os: OsApi = useMemo(() => ({
    posts, open, close, themes, themeId, setTheme, wallpaper, setWallpaper, toast: showToast,
    matrix: () => { if (reduceMotion) showToast('Matrix rain skipped (reduced motion). The green is still in your heart.'); else setRain(true) },
    party: doParty, unlockArcade, reduceMotion, startedAt,
  }), [posts, open, close, themes, themeId, setTheme, wallpaper, setWallpaper, showToast, reduceMotion, doParty, unlockArcade, startedAt])

  // boot sequence + first windows
  useEffect(() => {
    if (!booting) return
    const id = window.setInterval(() => {
      setBootLine((n) => {
        if (n + 1 >= BOOT.length) { clearInterval(id); window.setTimeout(() => { setBooting(false); writeLS('mcj-pg-booted', '1') }, 350) }
        return n + 1
      })
    }, 260)
    return () => clearInterval(id)
  }, [booting])

  // Konami code
  useEffect(() => {
    let i = 0
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      // swallow the final "b a" so they don't end up typed into the terminal or SQL box
      if (i >= 8 && k === KONAMI[i] && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) e.preventDefault()
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        const first = readLS('mcj-playground-arcade') !== '1'
        unlockArcade()
        if (!reduceMotion) doParty()
        showToast(first ? '🎮 KONAMI! +30 lives. Secret theme unlocked: Arcade (see Appearance)' : '🎮 KONAMI! +30 lives (again).')
      }
      if (e.key === 'Escape') setMenu(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doParty, reduceMotion, showToast, unlockArcade])

  // close menus on outside click
  useEffect(() => {
    if (!menu) return
    const onDown = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest('[data-pg-menu]')) setMenu(null) }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [menu])

  const top = state.wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]
  const activeApp = mobile ? mobileApp?.app : top?.id
  const activeTitle = activeApp ? APPS[activeApp].title : 'Finder'

  const logoClick = () => {
    const now = Date.now()
    logoClicks.current = [...logoClicks.current.filter((t) => now - t < 3000), now]
    if (logoClicks.current.length >= 5) { logoClicks.current = []; showToast('🥚 You found the logo egg. Welcome to the matrix.'); os.matrix() }
    else setMenu((m) => (m === 'logo' ? null : 'logo'))
  }

  const rootStyle = { ...theme.vars } as CSSProperties
  const timeStr = clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = clock.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div ref={rootRef} className={`pg-root${party ? ' pg-party' : ''}`} data-theme={theme.id} data-chrome={theme.chrome} style={rootStyle}>
      <div className="pg-wall" data-wall={wallpaper === 'theme' ? 'none' : wallpaper} aria-hidden />

      {/* menu bar */}
      <header className="pg-menubar" data-pg-menu>
        <button type="button" className="pg-mb" aria-haspopup="menu" aria-expanded={menu === 'logo'} aria-label="mcj-OS menu" onClick={logoClick}>
          <svg width="16" height="16" viewBox="0 0 40 40" aria-hidden><rect width="40" height="40" rx="10" fill="currentColor" /><path d="M20 12 V28 M12 16 L20 20 L28 16" stroke="var(--pg-menubar-bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        </button>
        <button type="button" className="pg-mb pg-appname" aria-haspopup="menu" aria-expanded={menu === 'app'} onClick={() => setMenu(menu === 'app' ? null : 'app')}>{activeTitle}</button>
        {!mobile && <button type="button" className="pg-mb" aria-haspopup="menu" aria-expanded={menu === 'view'} onClick={() => setMenu(menu === 'view' ? null : 'view')}>Theme</button>}
        <button type="button" className="pg-mb" aria-haspopup="menu" aria-expanded={menu === 'help'} onClick={() => setMenu(menu === 'help' ? null : 'help')}>Help</button>
        <span className="pg-spacer" />
        <Link href="/" className="pg-mb" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', padding: '2px 9px' }}>← Exit to site</Link>
        {!mobile && <span style={{ padding: '0 8px', fontVariantNumeric: 'tabular-nums' }}>{dateStr} {timeStr}</span>}

        {menu === 'logo' && (
          <div className="pg-menu" style={{ left: 8 }} role="menu">
            <button type="button" role="menuitem" onClick={() => open('about')}>About this playground</button>
            <button type="button" role="menuitem" onClick={() => open('settings')}>Appearance…</button>
            <hr />
            <div className="pg-label">Theme</div>
            {themes.map((t) => <button key={t.id} type="button" role="menuitemradio" aria-checked={t.id === themeId} onClick={() => { setTheme(t.id); setMenu(null) }}><span>{t.id === themeId ? '✓ ' : '\u00a0\u00a0 '}{t.name}</span></button>)}
            <hr />
            <Link role="menuitem" href="/">Exit to the main site</Link>
          </div>
        )}
        {menu === 'app' && (
          <div className="pg-menu" style={{ left: 44 }} role="menu">
            {activeApp ? (
              <>
                <button type="button" role="menuitem" onClick={() => { close(activeApp); setMenu(null) }}>Close {APPS[activeApp].title}</button>
                {!mobile && <button type="button" role="menuitem" onClick={() => { dispatch({ t: 'min', app: activeApp }); setMenu(null) }}>Minimise</button>}
                {!mobile && <button type="button" role="menuitem" onClick={() => { dispatch({ t: 'max', app: activeApp }); setMenu(null) }}>Zoom</button>}
                <hr />
              </>
            ) : null}
            {DOCK_ORDER.map((a) => <button key={a} type="button" role="menuitem" onClick={() => open(a)}><span>{APPS[a].icon} {APPS[a].title}</span></button>)}
            {!mobile && state.wins.length > 0 && <><hr /><button type="button" role="menuitem" onClick={() => { state.wins.forEach((w) => dispatch({ t: 'close', app: w.id })); setMenu(null) }}>Close all windows</button></>}
          </div>
        )}
        {menu === 'view' && (
          <div className="pg-menu" style={{ left: 120 }} role="menu">
            {themes.map((t) => <button key={t.id} type="button" role="menuitemradio" aria-checked={t.id === themeId} onClick={() => { setTheme(t.id); setMenu(null) }}><span>{t.id === themeId ? '✓ ' : '\u00a0\u00a0 '}{t.name}</span><span className="pg-kbd">{t.blurb}</span></button>)}
            <hr />
            <div className="pg-label">Wallpaper</div>
            {WALLPAPERS.map((w) => <button key={w.id} type="button" role="menuitemradio" aria-checked={w.id === wallpaper} onClick={() => { setWallpaper(w.id); setMenu(null) }}>{w.id === wallpaper ? '✓ ' : '\u00a0\u00a0 '}{w.name}</button>)}
          </div>
        )}
        {menu === 'help' && (
          <div className="pg-menu" style={{ left: mobile ? 100 : 190 }} role="menu">
            <button type="button" role="menuitem" onClick={() => open('terminal', { run: 'help' })}>Terminal commands</button>
            <button type="button" role="menuitem" onClick={() => open('settings')}>Keyboard & themes</button>
            <button type="button" role="menuitem" onClick={() => { showToast('There are quite a few Easter eggs. Terminal, logo, duck, and a very old cheat code. Happy hunting.'); setMenu(null) }}>Easter eggs?</button>
            <hr />
            <a role="menuitem" href="/contact">Report a bug (contact)</a>
          </div>
        )}
      </header>

      {/* desktop */}
      {!mobile && (
        <>
          <div className="pg-icons">
            <button type="button" className="pg-icon" onDoubleClick={() => open('about')} onKeyDown={(e) => e.key === 'Enter' && open('about')} onClick={(e) => { if (e.detail === 0) open('about') }} aria-label="README.md, open About"><span className="pg-ico" aria-hidden>📄</span>README.md</button>
            <button type="button" className="pg-icon" onDoubleClick={() => open('projects')} onClick={(e) => { if (e.detail === 0) open('projects') }} aria-label="Projects folder"><span className="pg-ico" aria-hidden>📁</span>Projects</button>
            <button type="button" className="pg-icon" onClick={() => { showToast(TRASH_GAGS[trashN % TRASH_GAGS.length]); setTrashN((n) => n + 1) }} aria-label="Trash"><span className="pg-ico" aria-hidden>🗑️</span>Trash</button>
          </div>
          {state.wins.map((w) => (
            <Window
              key={w.id}
              win={w}
              active={top?.id === w.id}
              area={area}
              onFocus={() => dispatch({ t: 'focus', app: w.id })}
              onMove={(x, y) => dispatch({ t: 'move', app: w.id, x, y })}
              onResize={(ww, hh) => dispatch({ t: 'size', app: w.id, w: ww, h: hh })}
              onClose={() => close(w.id)}
              onMinimize={() => dispatch({ t: 'min', app: w.id })}
              onToggleMax={() => dispatch({ t: 'max', app: w.id })}
            >
              <AppView app={w.id} os={os} params={w.params} />
            </Window>
          ))}
          <div className="pg-dock-wrap">
            <nav className="pg-dock" aria-label="Dock">
              {DOCK_ORDER.map((a, i) => {
                const win = state.wins.find((w) => w.id === a)
                return (
                  <span key={a} style={{ display: 'contents' }}>
                    {i === 6 && <span className="pg-dock-sep" aria-hidden />}
                    <button type="button" className="pg-dock-item" aria-label={`${APPS[a].title}${win ? ' (open)' : ''}`} onClick={() => (win && !win.min && top?.id === a ? dispatch({ t: 'min', app: a }) : open(a))}>
                      <span aria-hidden>{APPS[a].icon}</span>
                      <span className="pg-tip" aria-hidden>{APPS[a].title}</span>
                      {win && <span className="pg-dot" aria-hidden />}
                    </button>
                  </span>
                )
              })}
            </nav>
          </div>
        </>
      )}

      {/* mobile fallback: app grid + fullscreen apps */}
      {mobile && (
        <>
          <div className="pg-mobile-home">
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8px 0 6px' }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>mcj-OS</div>
              <div className="pg-muted" style={{ fontSize: 12 }}>Best on a bigger screen, but every app works here.</div>
            </div>
            {DOCK_ORDER.map((a) => (
              <button key={a} type="button" className="pg-icon" style={{ width: '100%' }} onClick={() => open(a)} aria-label={APPS[a].title}>
                <span className="pg-ico" aria-hidden>{APPS[a].icon}</span>
                {APPS[a].title}
              </button>
            ))}
          </div>
          {mobileApp && (
            <div className="pg-mobile-app" role="dialog" aria-label={APPS[mobileApp.app].title}>
              <div className="pg-mobile-bar">
                <button type="button" className="pg-btn pg-ghost" onClick={() => setMobileApp(null)} aria-label="Back to home">← Home</button>
                <span className="pg-t">{APPS[mobileApp.app].title}</span>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}><AppView app={mobileApp.app} os={os} params={mobileApp.params} /></div>
            </div>
          )}
        </>
      )}

      {rain && <MatrixRain onDone={() => setRain(false)} />}
      {toast && <div className="pg-toast" role="status">{toast}</div>}
      {booting && (
        <div className="pg-boot" onClick={() => { setBooting(false); writeLS('mcj-pg-booted', '1') }} role="status" aria-label="Booting. Click to skip.">
          {BOOT.slice(0, bootLine + 1).map((l, i) => <div key={i}>{l}</div>)}
          <div style={{ opacity: 0.5, marginTop: 12 }}>(click to skip)</div>
        </div>
      )}
    </div>
  )
}
