'use client'

import { motion } from 'framer-motion'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: 'default' | 'rainbow' | 'fire' | 'ocean' | 'sunset'
  animated?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
}

const gradients = {
  default: 'from-purple-600 via-pink-600 to-blue-600',
  rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500',
  fire: 'from-red-500 via-orange-500 to-yellow-500',
  ocean: 'from-blue-400 via-cyan-400 to-teal-400',
  sunset: 'from-orange-400 via-pink-400 to-purple-400'
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl'
}

export function GradientText({
  children,
  className = '',
  gradient = 'default',
  animated = false,
  size = 'lg'
}: GradientTextProps) {
  const gradientClass = gradients[gradient]
  const sizeClass = sizes[size]

  const textElement = (
    <span
      className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent ${sizeClass} ${className}`}
      style={animated ? {
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 3s ease infinite'
      } : {}}
    >
      {children}
    </span>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        {textElement}
      </motion.div>
    )
  }

  return textElement
}
