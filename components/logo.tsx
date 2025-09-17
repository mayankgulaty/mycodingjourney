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
          <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#764ba2', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#f093fb', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="logoGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#8b5cf6', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#ec4899', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle 
        cx="20" 
        cy="20" 
        r="18" 
        fill="url(#logoGradient)"
        className="dark:fill-[url(#logoGradient)] light:fill-[url(#logoGradientLight)]"
      />
      
      {/* Code brackets */}
      <path 
        d="M12 14 L8 20 L12 26" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      <path 
        d="M28 14 L32 20 L28 26" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      
      {/* Central "M" for Mayank */}
      <path 
        d="M16 12 L16 28 M16 12 L20 20 L24 12 M24 12 L24 28" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      
      {/* Decorative dots */}
      <circle cx="20" cy="8" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="20" cy="32" r="1.5" fill="white" opacity="0.8"/>
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {logoElement}
      </motion.div>
    )
  }

  return logoElement
}
