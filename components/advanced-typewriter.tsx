'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdvancedTypewriterProps {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
  showCursor?: boolean
  effect?: 'typewriter' | 'matrix' | 'glitch' | 'wave'
}

export function AdvancedTypewriter({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = '',
  showCursor = true,
  effect = 'typewriter'
}: AdvancedTypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false)
        setIsDeleting(true)
        return
      }

      if (isDeleting) {
        setCurrentText(texts[currentTextIndex].substring(0, currentText.length - 1))
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }
      } else {
        setCurrentText(texts[currentTextIndex].substring(0, currentText.length + 1))
        if (currentText === texts[currentTextIndex]) {
          setIsPaused(true)
        }
      }
    }, isPaused ? pauseTime : isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts, speed, deleteSpeed, pauseTime])

  const renderText = () => {
    switch (effect) {
      case 'matrix':
        return (
          <span className="font-mono text-green-400">
            {currentText.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        )
      
      case 'glitch':
        return (
          <span className="relative">
            {currentText.split('').map((char, index) => (
              <motion.span
                key={index}
                className="inline-block relative"
                animate={{
                  x: [0, -2, 2, 0],
                  color: ['#fff', '#ff00ff', '#00ffff', '#fff']
                }}
                transition={{
                  duration: 0.1,
                  delay: index * 0.05,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        )
      
      case 'wave':
        return (
          <span>
            {currentText.split('').map((char, index) => (
              <motion.span
                key={index}
                className="inline-block"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        )
      
      default:
        return <span>{currentText}</span>
    }
  }

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTextIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderText()}
        </motion.div>
      </AnimatePresence>
      
      {showCursor && (
        <motion.span
          className="ml-1 text-purple-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </div>
  )
}
