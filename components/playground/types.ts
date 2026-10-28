import type { Theme } from './themes'

export type AppId = 'terminal' | 'projects' | 'blog' | 'about' | 'pipeline' | 'sql' | 'duck' | 'settings'

export interface PostLite {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  readingTime: number | null
  /** first part of the markdown, enough for an in-window preview */
  preview: string
}

export type WallpaperId = 'theme' | 'grid' | 'dots' | 'aurora' | 'plain'
export const WALLPAPERS: { id: WallpaperId; name: string }[] = [
  { id: 'theme', name: 'Theme default' },
  { id: 'grid', name: 'Blueprint grid' },
  { id: 'dots', name: 'Dot matrix' },
  { id: 'aurora', name: 'Aurora' },
  { id: 'plain', name: 'Plain' },
]

export type Params = Record<string, unknown>

export interface OsApi {
  posts: PostLite[]
  open: (app: AppId, params?: Params) => void
  close: (app: AppId) => void
  themes: Theme[]
  themeId: string
  setTheme: (id: string) => void
  wallpaper: WallpaperId
  setWallpaper: (id: WallpaperId) => void
  toast: (msg: string) => void
  matrix: () => void
  party: () => void
  unlockArcade: () => void
  reduceMotion: boolean
  startedAt: number
}

export interface AppProps {
  os: OsApi
  params: Params
}
