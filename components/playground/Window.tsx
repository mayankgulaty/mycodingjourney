'use client'

import { useRef } from 'react'
import type { PointerEvent as RPointerEvent, KeyboardEvent as RKeyboardEvent, ReactNode } from 'react'

export interface WinState {
  app: string
  title: string
  x: number
  y: number
  w: number
  h: number
  z: number
  min: boolean
  max: boolean
  opening: boolean
}

interface Props {
  win: WinState
  active: boolean
  area: { w: number; h: number }
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
  onClose: () => void
  onMinimize: () => void
  onToggleMax: () => void
  children: ReactNode
}

const MIN_W = 300
const MIN_H = 200
export const TOP = 28
export const BOTTOM_RESERVED = 78

export function Window({ win, active, area, onFocus, onMove, onResize, onClose, onMinimize, onToggleMax, children }: Props) {
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const rs = useRef<{ px: number; py: number; w: number; h: number; mode: 'both' | 'r' | 'b' } | null>(null)

  const style = win.max
    ? { left: 0, top: TOP, width: area.w, height: area.h - TOP - BOTTOM_RESERVED, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  const onTitleDown = (e: RPointerEvent<HTMLDivElement>) => {
    onFocus()
    if ((e.target as HTMLElement).closest('button') || win.max) return
    drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onTitleMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const nx = Math.min(Math.max(d.x + e.clientX - d.px, 80 - win.w), area.w - 80)
    const ny = Math.min(Math.max(d.y + e.clientY - d.py, TOP), area.h - 40)
    onMove(nx, ny)
  }
  const onTitleUp = (e: RPointerEvent<HTMLDivElement>) => {
    drag.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const onTitleKey = (e: RKeyboardEvent<HTMLDivElement>) => {
    const step = e.altKey ? 4 : 24
    if (e.key === 'Enter') { onToggleMax(); e.preventDefault(); return }
    const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const a = arrows[e.key]
    if (!a) return
    e.preventDefault()
    if (e.shiftKey) onResize(Math.max(MIN_W, win.w + a[0] * step), Math.max(MIN_H, win.h + a[1] * step))
    else onMove(Math.min(Math.max(win.x + a[0] * step, 80 - win.w), area.w - 80), Math.min(Math.max(win.y + a[1] * step, TOP), area.h - 40))
  }

  const startResize = (mode: 'both' | 'r' | 'b', e: RPointerEvent<HTMLDivElement>) => {
    onFocus()
    rs.current = { px: e.clientX, py: e.clientY, w: win.w, h: win.h, mode }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.stopPropagation()
  }
  const moveResize = (e: RPointerEvent<HTMLDivElement>) => {
    const r = rs.current
    if (!r) return
    const nw = r.mode === 'b' ? r.w : Math.max(MIN_W, r.w + e.clientX - r.px)
    const nh = r.mode === 'r' ? r.h : Math.max(MIN_H, r.h + e.clientY - r.py)
    onResize(nw, nh)
  }
  const endResize = (e: RPointerEvent<HTMLDivElement>) => {
    rs.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <section
      className={`pg-win${win.opening ? ' pg-opening' : ''}`}
      style={style}
      data-active={active}
      data-max={win.max}
      data-min={win.min}
      role="dialog"
      aria-label={win.title}
      onPointerDownCapture={onFocus}
    >
      <div
        className="pg-title"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onPointerCancel={onTitleUp}
        onDoubleClick={onToggleMax}
        onKeyDown={onTitleKey}
        tabIndex={0}
        aria-label={`${win.title} title bar. Arrow keys move the window, Shift plus arrows resize it, Enter toggles full size.`}
      >
        <div className="pg-lights">
          <button type="button" className="pg-close" aria-label={`Close ${win.title}`} onClick={onClose}><span aria-hidden>×</span></button>
          <button type="button" className="pg-minimize" aria-label={`Minimise ${win.title}`} onClick={onMinimize}><span aria-hidden>–</span></button>
          <button type="button" className="pg-zoom" aria-label={win.max ? `Restore ${win.title}` : `Maximise ${win.title}`} onClick={onToggleMax}><span aria-hidden>+</span></button>
        </div>
        <span className="pg-t">{win.title}</span>
      </div>
      <div className="pg-body">{children}</div>
      {!win.max && (
        <>
          <div className="pg-resize-r" onPointerDown={(e) => startResize('r', e)} onPointerMove={moveResize} onPointerUp={endResize} onPointerCancel={endResize} />
          <div className="pg-resize-b" onPointerDown={(e) => startResize('b', e)} onPointerMove={moveResize} onPointerUp={endResize} onPointerCancel={endResize} />
          <div className="pg-resize" onPointerDown={(e) => startResize('both', e)} onPointerMove={moveResize} onPointerUp={endResize} onPointerCancel={endResize} aria-hidden />
        </>
      )}
    </section>
  )
}
