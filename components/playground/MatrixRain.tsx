'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain({ onDone, ms = 9000 }: { onDone: () => void; ms?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const accent = getComputedStyle(canvas.closest('.pg-root') ?? document.body).getPropertyValue('--pg-accent').trim() || '#22ff88'
    const size = 16
    let cols = 0
    let drops: number[] = []
    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      cols = Math.ceil(canvas.width / size)
      drops = Array.from({ length: cols }, () => Math.random() * -40)
    }
    resize()
    const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ01SELECTJOINGROUPBYDAGETL{}<>$'
    const id = window.setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.09)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = accent
      ctx.font = `${size}px monospace`
      drops.forEach((y, i) => {
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y * size)
        drops[i] = y * size > canvas.height && Math.random() > 0.975 ? 0 : y + 1
      })
    }, 50)
    const stop = window.setTimeout(onDone, ms)
    window.addEventListener('resize', resize)
    return () => { clearInterval(id); clearTimeout(stop); window.removeEventListener('resize', resize) }
  }, [onDone, ms])
  return (
    <div className="pg-matrix" onClick={onDone} role="button" tabIndex={0} aria-label="Matrix rain. Press Escape or click to dismiss." onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') onDone() }}>
      <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 16, width: '100%', textAlign: 'center', color: '#fff', opacity: 0.6, fontFamily: 'monospace', fontSize: 12 }}>click or press Esc to wake up</div>
    </div>
  )
}
