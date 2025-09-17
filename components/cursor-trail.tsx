'use client'

import { useEffect, useRef } from 'react'

interface CursorTrail {
  x: number
  y: number
  id: number
  opacity: number
  scale: number
}

export function CursorTrail() {
  const trailRef = useRef<CursorTrail[]>([])
  const animationRef = useRef<number>()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'
    canvas.style.mixBlendMode = 'screen'
    
    canvasRef.current = canvas
    document.body.appendChild(canvas)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const addTrail = (x: number, y: number) => {
      const id = Date.now() + Math.random()
      trailRef.current.push({
        x,
        y,
        id,
        opacity: 1,
        scale: 1
      })

      // Limit trail length
      if (trailRef.current.length > 20) {
        trailRef.current.shift()
      }
    }

    const updateTrails = () => {
      trailRef.current = trailRef.current
        .map(trail => ({
          ...trail,
          opacity: trail.opacity - 0.05,
          scale: trail.scale + 0.02
        }))
        .filter(trail => trail.opacity > 0)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      trailRef.current.forEach(trail => {
        const gradient = ctx.createRadialGradient(
          trail.x, trail.y, 0,
          trail.x, trail.y, 30 * trail.scale
        )
        gradient.addColorStop(0, `rgba(102, 126, 234, ${trail.opacity})`)
        gradient.addColorStop(0.5, `rgba(118, 75, 162, ${trail.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(240, 147, 251, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(trail.x, trail.y, 30 * trail.scale, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(updateTrails)
    }

    const handleMouseMove = (e: MouseEvent) => {
      addTrail(e.clientX, e.clientY)
    }

    resizeCanvas()
    updateTrails()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current)
      }
    }
  }, [])

  return null
}

