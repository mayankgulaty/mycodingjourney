'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

// Floating Particles Animation
export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5
      }))
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 8,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Typewriter Effect with Multiple Lines
export function MultiLineTypewriter({ 
  lines, 
  speed = 100, 
  delay = 1000 
}: { 
  lines: string[]
  speed?: number
  delay?: number 
}) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentLine = lines[currentLineIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentLine.length) {
          setCurrentText(currentLine.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), delay)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentLineIndex((prev) => (prev + 1) % lines.length)
        }
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentLineIndex, lines, speed, delay])

  return (
    <div className="text-center">
      <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        {currentText}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-1 h-12 bg-current ml-1"
        />
      </span>
    </div>
  )
}

// Morphing Shapes Animation
export function MorphingShapes() {
  const [currentShape, setCurrentShape] = useState(0)
  const shapes = [
    { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', color: 'from-yellow-400 to-orange-500' },
    { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', color: 'from-green-400 to-blue-500' },
    { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', color: 'from-purple-400 to-pink-500' },
    { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', color: 'from-red-400 to-yellow-500' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [shapes.length])

  return (
    <div className="flex justify-center items-center h-32">
      <motion.svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <motion.path
          d={shapes[currentShape].d}
          fill="currentColor"
          className={`bg-gradient-to-r ${shapes[currentShape].color} bg-clip-text text-transparent`}
          animate={{ d: shapes[currentShape].d }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  )
}

// Scroll Progress Indicator
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}

// Magnetic Button Effect
export function MagneticButton({ 
  children, 
  className = '',
  onClick 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setPosition({ x: x * 0.3, y: y * 0.3 })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

// Parallax Scroll Effect
export function ParallaxScroll({ 
  children, 
  speed = 0.5,
  className = ''
}: { 
  children: React.ReactNode
  speed?: number
  className?: string 
}) {
  const [offsetY, setOffsetY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffsetY(rate)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offsetY}px)` }}
    >
      {children}
    </div>
  )
}

// Reveal Animation on Scroll
export function RevealOnScroll({ 
  children, 
  direction = 'up',
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

// Glitch Text Effect
export function GlitchText({ 
  text, 
  className = ''
}: { 
  text: string
  className?: string 
}) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <motion.span
        className="relative z-10"
        animate={isGlitching ? { x: [0, -2, 2, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
      {isGlitching && (
        <>
          <motion.span
            className="absolute top-0 left-0 text-red-500 opacity-70"
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 text-blue-500 opacity-70"
            animate={{ x: [0, -2, 2, 0] }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.span>
        </>
      )}
    </div>
  )
}

// Loading Spinner with Data Engineering Theme
export function DataLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full"></div>
      </motion.div>
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-300"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Processing data...
      </motion.p>
    </div>
  )
}

// Hover Tilt Effect
export function TiltCard({ 
  children, 
  className = ''
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: 1.05
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}
