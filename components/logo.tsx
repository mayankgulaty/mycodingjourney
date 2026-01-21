'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

export function Logo({ size = 'md', className = '', animated = false }: LogoProps) {
  const logoElement = (
    <svg
      width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
      height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} /> {/* Cyan-400 */}
          <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} /> {/* Blue-500 */}
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} /> {/* Indigo-500 */}
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Abstract Data Hexagon Shape */}
      <path
        d="M20 2 L35.5885 11 V29 L20 38 L4.41154 29 V11 L20 2Z"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
      />

      {/* Inner Connections / Circuitry */}
      <path
        d="M20 12 V28 M12 16 L20 20 L28 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />

      {/* Data Nodes */}
      <circle cx="20" cy="12" r="2.5" fill="white" className="animate-pulse" />
      <circle cx="20" cy="28" r="2.5" fill="white" className="animate-pulse" />
      <circle cx="12" cy="16" r="2" fill="#22d3ee" />
      <circle cx="28" cy="16" r="2" fill="#6366f1" />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {logoElement}
      </motion.div>
    )
  }

  return logoElement
}
