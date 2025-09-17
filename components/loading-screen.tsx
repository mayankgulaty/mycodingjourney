'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center gradient-bg"
        >
          <div className="text-center">
            {/* Profile Photo with Data Engineering Elements */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center relative overflow-hidden p-1">
                {/* Profile Photo */}
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src="/mayank-photo.jpg"
                    alt="Mayank"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                
                {/* Database icon overlay */}
                <motion.div
                  className="absolute bottom-2 right-2 text-2xl bg-white/90 rounded-full p-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🗄️
                </motion.div>
                
                {/* Rotating data points */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 0',
                        transform: `rotate(${i * 45}deg) translateY(-40px)`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-5xl font-bold text-shimmer mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Mayank
            </motion.h1>
            
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-2xl font-semibold text-blue-400 mr-2">Data Engineer</span>
              <span className="text-foreground/60 text-xl">&</span>
              <span className="text-2xl font-semibold text-purple-400 ml-2">Full-stack Developer</span>
            </motion.div>
            
            {/* Data pipeline visualization */}
            <motion.div
              className="flex items-center justify-center space-x-4 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              {['📊', '⚙️', '💾', '📈'].map((icon, index) => (
                <motion.div
                  key={index}
                  className="text-3xl"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {icon}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p
              className="text-foreground/70 text-lg mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Building data pipelines and amazing web experiences...
            </motion.p>
            
            {/* Animated progress bar */}
            <motion.div
              className="w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeOut" }}
              />
            </motion.div>
            
            {/* Floating data elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 360, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 4,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3
                  }}
                >
                  {['📊', '🐍', '☁️', '⚡', '🗄️', '📈'][Math.floor(Math.random() * 6)]}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
