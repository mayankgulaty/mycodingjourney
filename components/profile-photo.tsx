'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProfilePhotoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  animated?: boolean
  showBorder?: boolean
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
  '2xl': 'w-48 h-48'
}

export function ProfilePhoto({
  size = 'lg',
  className = '',
  animated = true,
  showBorder = true
}: ProfilePhotoProps) {
  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={animated ? { scale: 1, rotate: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={animated ? { scale: 1.05, rotate: 5 } : {}}
    >
      <div className={`relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 ${showBorder ? 'ring-4 ring-white/20 ring-offset-4 ring-offset-transparent' : ''
        }`}>
        <Image
          src="/me.jpg"
          alt="Mayank - Data Engineer & Full-stack Developer"
          width={400}
          height={400}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 30%', // Adjusted to keep face in middle
            objectFit: 'cover'
          }}
          priority
          onError={(e) => {
            // Fallback
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Gradient overlay for professional look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Animated border glow */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
              backgroundSize: '400% 400%',
              animation: 'gradient-shift 3s ease infinite'
            }}
          />
        )}
      </div>

      {/* Floating data elements around photo */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 60}deg) translateY(-60px)`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}