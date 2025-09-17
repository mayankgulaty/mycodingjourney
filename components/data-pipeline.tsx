'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface PipelineStep {
  id: string
  name: string
  icon: string
  color: string
  status: 'active' | 'processing' | 'completed' | 'waiting'
}

export function DataPipeline() {
  const [steps, setSteps] = useState<PipelineStep[]>([
    { id: 'extract', name: 'Extract', icon: '📊', color: '#3b82f6', status: 'waiting' },
    { id: 'transform', name: 'Transform', icon: '⚙️', color: '#8b5cf6', status: 'waiting' },
    { id: 'load', name: 'Load', icon: '💾', color: '#10b981', status: 'waiting' },
    { id: 'analyze', name: 'Analyze', icon: '📈', color: '#f59e0b', status: 'waiting' },
    { id: 'visualize', name: 'Visualize', icon: '📊', color: '#ef4444', status: 'waiting' },
  ])

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(prev => prev.map((step, index) => {
        if (index === currentStep) {
          return { ...step, status: 'processing' as const }
        } else if (index < currentStep) {
          return { ...step, status: 'completed' as const }
        } else {
          return { ...step, status: 'waiting' as const }
        }
      }))

      setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % steps.length)
      }, 2000)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentStep, steps.length])

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white"/>
              <path d="M20,0 L20,20 M0,20 L20,20" stroke="white" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Data Pipeline Flow</h3>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 relative ${
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'processing' ? 'bg-yellow-500' :
                  step.status === 'active' ? 'bg-blue-500' :
                  'bg-gray-600'
                }`}
                animate={{
                  scale: step.status === 'processing' ? [1, 1.2, 1] : 1,
                  boxShadow: step.status === 'processing' 
                    ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
                    : '0 0 0 0 rgba(59, 130, 246, 0)'
                }}
                transition={{
                  scale: { duration: 0.5, repeat: step.status === 'processing' ? Infinity : 0 },
                  boxShadow: { duration: 1, repeat: step.status === 'processing' ? Infinity : 0 }
                }}
              >
                {step.icon}
                
                {/* Processing indicator */}
                {step.status === 'processing' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>

              {/* Step name */}
              <motion.span 
                className={`text-sm font-medium ${
                  step.status === 'completed' ? 'text-green-400' :
                  step.status === 'processing' ? 'text-yellow-400' :
                  step.status === 'active' ? 'text-blue-400' :
                  'text-gray-400'
                }`}
                animate={{
                  color: step.status === 'processing' 
                    ? ['#fbbf24', '#f59e0b', '#fbbf24'] 
                    : undefined
                }}
                transition={{ duration: 0.5, repeat: step.status === 'processing' ? Infinity : 0 }}
              >
                {step.name}
              </motion.span>

              {/* Connection line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-600 to-gray-600"
                  style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 2rem)' }}
                  animate={{
                    background: step.status === 'completed' 
                      ? 'linear-gradient(to right, #10b981, #10b981)'
                      : 'linear-gradient(to right, #6b7280, #6b7280)'
                  }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Data flow particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 200, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
