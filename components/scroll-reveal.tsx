'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { motion } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'rotate'
  delay?: number
  duration?: number
  distance?: number
  className?: string
  once?: boolean
}

const directionVariants = {
  up: { y: 100, opacity: 0 },
  down: { y: -100, opacity: 0 },
  left: { x: 100, opacity: 0 },
  right: { x: -100, opacity: 0 },
  scale: { scale: 0, opacity: 0 },
  rotate: { rotate: -180, scale: 0, opacity: 0 }
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = '',
  once = true
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  const variant = { ...directionVariants[direction] } as any
  if (direction !== 'scale' && direction !== 'rotate') {
    if (direction === 'up' || direction === 'down') {
      variant.y = distance
    } else {
      variant.x = distance
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={variant}
      animate={isInView ? { 
        x: 0, 
        y: 0, 
        scale: 1, 
        rotate: 0, 
        opacity: 1 
      } : variant}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}
