/**
 * Playground themes. To add one: append an object to THEMES. Everything visual
 * (wallpaper, window chrome, fonts, accent) is driven by these CSS variables, see playground.css.
 *   chrome: 'mac'     -> traffic-light buttons on the left, rounded windows
 *   chrome: 'classic' -> retro Mac OS: striped title bar, square close box, hard shadow
 */
export interface Theme {
  id: string
  name: string
  blurb: string
  chrome: 'mac' | 'classic'
  /** colour used for the swatch in the switcher */
  swatch: string
  /** hidden themes are unlocked by an Easter egg */
  hidden?: boolean
  vars: Record<string, string>
}

const SANS = `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
const MONO = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`

export const THEMES: Theme[] = [
  {
    id: 'code',
    name: 'Midnight Editor',
    blurb: 'Clean dark code editor',
    chrome: 'mac',
    swatch: '#3b82f6',
    vars: {
      '--pg-wallpaper':
        'radial-gradient(1200px 700px at 15% 10%, rgba(59,130,246,.28), transparent 60%), radial-gradient(900px 600px at 90% 90%, rgba(139,92,246,.24), transparent 60%), linear-gradient(160deg,#0b1020,#111827 55%,#0a0e1a)',
      '--pg-win-bg': '#1e1e24',
      '--pg-win-fg': '#d4d4dc',
      '--pg-muted': '#8b8b9a',
      '--pg-border': 'rgba(255,255,255,.10)',
      '--pg-title-bg': 'linear-gradient(#2d2d36,#26262e)',
      '--pg-title-fg': '#c9c9d4',
      '--pg-accent': '#4da3ff',
      '--pg-accent-fg': '#06101f',
      '--pg-panel': '#16161b',
      '--pg-menubar-bg': 'rgba(18,18,24,.72)',
      '--pg-menubar-fg': '#e5e5ee',
      '--pg-dock-bg': 'rgba(30,30,40,.55)',
      '--pg-term-bg': '#101014',
      '--pg-term-fg': '#d6e2ff',
      '--pg-radius': '12px',
      '--pg-shadow': '0 22px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06)',
      '--pg-font': SANS,
      '--pg-mono': MONO,
    },
  },
  {
    id: 'terminal',
    name: 'Terminal Green',
    blurb: 'Hacker phosphor',
    chrome: 'mac',
    swatch: '#22ff88',
    vars: {
      '--pg-wallpaper':
        'repeating-linear-gradient(0deg, rgba(0,255,120,.045) 0 1px, transparent 1px 3px), radial-gradient(900px 600px at 50% 0%, rgba(0,255,120,.16), transparent 70%), #020a05',
      '--pg-win-bg': '#04120a',
      '--pg-win-fg': '#8dffb8',
      '--pg-muted': '#4fb97a',
      '--pg-border': 'rgba(34,255,136,.35)',
      '--pg-title-bg': 'linear-gradient(#0a2415,#061a0e)',
      '--pg-title-fg': '#7dffae',
      '--pg-accent': '#22ff88',
      '--pg-accent-fg': '#00160a',
      '--pg-panel': '#031009',
      '--pg-menubar-bg': 'rgba(2,12,6,.82)',
      '--pg-menubar-fg': '#7dffae',
      '--pg-dock-bg': 'rgba(4,22,12,.7)',
      '--pg-term-bg': '#010a04',
      '--pg-term-fg': '#8dffb8',
      '--pg-radius': '6px',
      '--pg-shadow': '0 0 0 1px rgba(34,255,136,.35), 0 0 28px rgba(34,255,136,.18), 0 18px 50px rgba(0,0,0,.7)',
      '--pg-font': MONO,
      '--pg-mono': MONO,
    },
  },
  {
    id: 'classic',
    name: 'System 7',
    blurb: 'Retro classic Mac',
    chrome: 'classic',
    swatch: '#9a9a9a',
    vars: {
      '--pg-wallpaper':
        'conic-gradient(#5f8f8f 25%, #6c9c9c 0 50%, #5f8f8f 0 75%, #6c9c9c 0) 0 0 / 8px 8px',
      '--pg-win-bg': '#ffffff',
      '--pg-win-fg': '#000000',
      '--pg-muted': '#555555',
      '--pg-border': '#000000',
      '--pg-title-bg': 'repeating-linear-gradient(0deg,#000 0 1px,#fff 1px 3px)',
      '--pg-title-fg': '#000000',
      '--pg-accent': '#000000',
      '--pg-accent-fg': '#ffffff',
      '--pg-panel': '#e8e8e8',
      '--pg-menubar-bg': '#ffffff',
      '--pg-menubar-fg': '#000000',
      '--pg-dock-bg': 'rgba(220,220,220,.95)',
      '--pg-term-bg': '#ffffff',
      '--pg-term-fg': '#000000',
      '--pg-radius': '0px',
      '--pg-shadow': '2px 2px 0 #000',
      '--pg-font': `Geneva, Chicago, "Lucida Grande", ${SANS}`,
      '--pg-mono': `Monaco, "Courier New", ${MONO}`,
    },
  },
  {
    id: 'paper',
    name: 'Paper',
    blurb: 'Light, warm, ink on paper',
    chrome: 'mac',
    swatch: '#c2410c',
    vars: {
      '--pg-wallpaper':
        'radial-gradient(1000px 600px at 20% 0%, rgba(251,191,36,.25), transparent 60%), radial-gradient(800px 500px at 100% 100%, rgba(244,114,182,.18), transparent 60%), linear-gradient(#f4efe6,#ebe3d3)',
      '--pg-win-bg': '#fdfaf3',
      '--pg-win-fg': '#2b2620',
      '--pg-muted': '#7a7062',
      '--pg-border': 'rgba(60,40,10,.18)',
      '--pg-title-bg': 'linear-gradient(#f3ecdd,#ebe2d0)',
      '--pg-title-fg': '#4a4236',
      '--pg-accent': '#c2410c',
      '--pg-accent-fg': '#fff7ed',
      '--pg-panel': '#f4eee1',
      '--pg-menubar-bg': 'rgba(253,250,243,.75)',
      '--pg-menubar-fg': '#2b2620',
      '--pg-dock-bg': 'rgba(255,255,255,.55)',
      '--pg-term-bg': '#fffdf8',
      '--pg-term-fg': '#2b2620',
      '--pg-radius': '12px',
      '--pg-shadow': '0 18px 44px rgba(80,55,20,.28), 0 0 0 1px rgba(60,40,10,.10)',
      '--pg-font': `ui-serif, Georgia, Cambria, "Times New Roman", serif`,
      '--pg-mono': MONO,
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    blurb: 'Neon horizon, 1985',
    chrome: 'mac',
    swatch: '#ff2bd6',
    vars: {
      '--pg-wallpaper':
        'linear-gradient(transparent 62%, rgba(255,43,214,.35) 62.4%, transparent 63%), repeating-linear-gradient(90deg, rgba(255,43,214,.18) 0 1px, transparent 1px 64px) 0 62% / 100% 38% no-repeat, repeating-linear-gradient(0deg, rgba(0,229,255,.16) 0 1px, transparent 1px 34px) 0 62% / 100% 38% no-repeat, radial-gradient(500px 500px at 50% 62%, rgba(255,160,0,.5), rgba(255,43,214,.25) 45%, transparent 70%), linear-gradient(#12002b, #2a0a4a 62%, #12002b)',
      '--pg-win-bg': '#1a0b33',
      '--pg-win-fg': '#f1e3ff',
      '--pg-muted': '#b58be0',
      '--pg-border': 'rgba(255,43,214,.45)',
      '--pg-title-bg': 'linear-gradient(90deg,#3a0f6b,#5a145f)',
      '--pg-title-fg': '#ffd6fa',
      '--pg-accent': '#00e5ff',
      '--pg-accent-fg': '#001a1f',
      '--pg-panel': '#14072a',
      '--pg-menubar-bg': 'rgba(20,6,42,.78)',
      '--pg-menubar-fg': '#ffd6fa',
      '--pg-dock-bg': 'rgba(60,15,100,.5)',
      '--pg-term-bg': '#10052a',
      '--pg-term-fg': '#ffb8f3',
      '--pg-radius': '10px',
      '--pg-shadow': '0 0 0 1px rgba(255,43,214,.45), 0 0 34px rgba(255,43,214,.25), 0 20px 50px rgba(0,0,0,.6)',
      '--pg-font': SANS,
      '--pg-mono': MONO,
    },
  },
  {
    id: 'arcade',
    name: 'Arcade (secret)',
    blurb: 'Unlocked by a very old cheat code',
    chrome: 'classic',
    swatch: '#ffd800',
    hidden: true,
    vars: {
      '--pg-wallpaper':
        'repeating-conic-gradient(#14142b 0 25%, #1c1c3c 0 50%) 0 0 / 24px 24px',
      '--pg-win-bg': '#0b0b1e',
      '--pg-win-fg': '#fff6c2',
      '--pg-muted': '#c7b85a',
      '--pg-border': '#ffd800',
      '--pg-title-bg': 'repeating-linear-gradient(90deg,#ff2d55 0 12px,#ffd800 12px 24px,#00d4ff 24px 36px)',
      '--pg-title-fg': '#ffd800',
      '--pg-accent': '#ffd800',
      '--pg-accent-fg': '#000000',
      '--pg-panel': '#111130',
      '--pg-menubar-bg': '#000000',
      '--pg-menubar-fg': '#ffd800',
      '--pg-dock-bg': 'rgba(0,0,0,.8)',
      '--pg-term-bg': '#000000',
      '--pg-term-fg': '#ffd800',
      '--pg-radius': '0px',
      '--pg-shadow': '4px 4px 0 #ffd800',
      '--pg-font': `"Courier New", ${MONO}`,
      '--pg-mono': `"Courier New", ${MONO}`,
    },
  },
]

export const DEFAULT_THEME = 'code'
export const THEME_KEY = 'mcj-playground-theme'

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
