'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DataPoint {
  id: number
  value: number
  label: string
  color: string
}

export function DataVisualization() {
  const [data, setData] = useState<DataPoint[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const generateData = () => {
      const newData: DataPoint[] = [
        { id: 1, value: Math.random() * 100, label: 'Python', color: '#3776ab' },
        { id: 2, value: Math.random() * 100, label: 'SQL', color: '#336791' },
        { id: 3, value: Math.random() * 100, label: 'Spark', color: '#e25a1c' },
        { id: 4, value: Math.random() * 100, label: 'Airflow', color: '#017cee' },
        { id: 5, value: Math.random() * 100, label: 'Kafka', color: '#231f20' },
        { id: 6, value: Math.random() * 100, label: 'Docker', color: '#2496ed' },
        { id: 7, value: Math.random() * 100, label: 'AWS', color: '#ff9900' },
        { id: 8, value: Math.random() * 100, label: 'Kubernetes', color: '#326ce5' },
      ]
      setData(newData)
    }

    generateData()
    const interval = setInterval(() => {
      setIsAnimating(true)
      generateData()
      setTimeout(() => setIsAnimating(false), 1000)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 100

  return (
    <div className="w-full h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated data bars */}
      <div className="relative h-full flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center space-y-2 flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: isAnimating ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              scale: { duration: 0.3 }
            }}
          >
            <motion.div
              className="w-full rounded-t-lg relative overflow-hidden"
              style={{ 
                height: `${(item.value / maxValue) * 180}px`,
                backgroundColor: item.color
              }}
              animate={{
                height: `${(item.value / maxValue) * 180}px`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </motion.div>
            
            <motion.span 
              className="text-xs font-mono text-white/80 text-center"
              animate={{
                color: isAnimating ? ['#ffffff', item.color, '#ffffff'] : '#ffffff80'
              }}
              transition={{ duration: 0.5 }}
            >
              {item.label}
            </motion.span>
            
            <motion.span 
              className="text-xs font-mono text-white/60"
              animate={{
                scale: isAnimating ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(item.value)}%
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Floating data points */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
          />
        ))}
      </div>
    </div>
  )
}
