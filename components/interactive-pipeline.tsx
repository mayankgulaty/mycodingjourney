'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PipelineNode {
  id: string
  type: 'source' | 'transform' | 'destination' | 'process'
  title: string
  description: string
  icon: string
  color: string
  x: number
  y: number
  status: 'idle' | 'processing' | 'completed' | 'error'
}

interface PipelineConnection {
  from: string
  to: string
  status: 'idle' | 'active' | 'completed'
}

export function InteractivePipeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [nodes, setNodes] = useState<PipelineNode[]>([
    {
      id: 'source-1',
      type: 'source',
      title: 'PostgreSQL',
      description: 'Customer data extraction',
      icon: '🗄️',
      color: 'bg-blue-500',
      x: 0,
      y: 0,
      status: 'idle'
    },
    {
      id: 'transform-1',
      type: 'transform',
      title: 'Data Cleaning',
      description: 'Remove duplicates & validate',
      icon: '🧹',
      color: 'bg-yellow-500',
      x: 0,
      y: 0,
      status: 'idle'
    },
    {
      id: 'process-1',
      type: 'process',
      title: 'Apache Spark',
      description: 'ETL processing',
      icon: '⚡',
      color: 'bg-purple-500',
      x: 0,
      y: 0,
      status: 'idle'
    },
    {
      id: 'transform-2',
      type: 'transform',
      title: 'Feature Engineering',
      description: 'Create ML features',
      icon: '🔧',
      color: 'bg-green-500',
      x: 0,
      y: 0,
      status: 'idle'
    },
    {
      id: 'destination-1',
      type: 'destination',
      title: 'Data Warehouse',
      description: 'Analytics ready data',
      icon: '📊',
      color: 'bg-red-500',
      x: 0,
      y: 0,
      status: 'idle'
    }
  ])

  const connections: PipelineConnection[] = [
    { from: 'source-1', to: 'transform-1', status: 'idle' },
    { from: 'transform-1', to: 'process-1', status: 'idle' },
    { from: 'process-1', to: 'transform-2', status: 'idle' },
    { from: 'transform-2', to: 'destination-1', status: 'idle' }
  ]

  const pipelineSteps = [
    { step: 0, description: 'Extract data from PostgreSQL database' },
    { step: 1, description: 'Clean and validate incoming data' },
    { step: 2, description: 'Process data with Apache Spark' },
    { step: 3, description: 'Engineer features for ML models' },
    { step: 4, description: 'Load into data warehouse' }
  ]

  const startPipeline = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    
    // Reset all nodes
    setNodes(prev => prev.map(node => ({ ...node, status: 'idle' })))
    
    // Animate through each step
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= pipelineSteps.length - 1) {
          clearInterval(stepInterval)
          setIsPlaying(false)
          // Mark all nodes as completed when pipeline finishes
          setNodes(prev => prev.map(node => ({ ...node, status: 'completed' })))
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const resetPipeline = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setNodes(prev => prev.map(node => ({ ...node, status: 'idle' })))
  }

  // Update node status based on current step
  useEffect(() => {
    if (isPlaying) {
      setNodes(prev => prev.map((node, index) => {
        if (index < currentStep) {
          return { ...node, status: 'completed' }
        } else if (index === currentStep) {
          return { ...node, status: 'processing' }
        } else {
          return { ...node, status: 'idle' }
        }
      }))
    }
  }, [currentStep, isPlaying])

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'ring-4 ring-blue-300 animate-pulse'
      case 'completed': return 'ring-4 ring-green-300'
      case 'error': return 'ring-4 ring-red-300'
      default: return ''
    }
  }

  const getConnectionStatus = (fromId: string, toId: string) => {
    const fromIndex = nodes.findIndex(n => n.id === fromId)
    const toIndex = nodes.findIndex(n => n.id === toId)
    
    if (fromIndex < currentStep && toIndex <= currentStep) {
      return 'active'
    } else if (fromIndex === currentStep && toIndex === currentStep + 1) {
      return 'active'
    }
    return 'idle'
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Interactive Data Pipeline
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Click &quot;Run Pipeline&quot; to see how data flows through my ETL process
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            onClick={startPipeline}
            disabled={isPlaying}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlaying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            whileHover={{ scale: isPlaying ? 1 : 1.05 }}
            whileTap={{ scale: isPlaying ? 1 : 0.95 }}
          >
            {isPlaying ? 'Running...' : 'Run Pipeline'}
          </motion.button>
          
          <motion.button
            onClick={resetPipeline}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>

        {/* Current Step Indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  Step {currentStep + 1} of {pipelineSteps.length}
                </span>
              </div>
              <p className="text-blue-600 dark:text-blue-400">
                {pipelineSteps[currentStep]?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
        {/* Pipeline Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex flex-col lg:flex-row items-center">
              {/* Node */}
              <motion.div
                className={`relative ${getNodeStatusColor(node.status)}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-24 h-24 lg:w-32 lg:h-32 ${node.color} rounded-2xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                  {/* Processing Animation */}
                  {node.status === 'processing' && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  
                  {/* Completed Checkmark */}
                  {node.status === 'completed' && (
                    <motion.div
                      className="absolute top-1 right-1 lg:top-2 lg:right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                  )}

                  <div className="text-2xl lg:text-3xl mb-1">{node.icon}</div>
                  <div className="text-xs lg:text-sm font-bold text-center px-1 lg:px-2 leading-tight">{node.title}</div>
                  <div className="text-xs text-center px-1 lg:px-2 opacity-90 mt-1 hidden lg:block">{node.description}</div>
                </div>
              </motion.div>

              {/* Arrow/Connection */}
              {index < nodes.length - 1 && (
                <motion.div
                  className="flex items-center justify-center my-4 lg:my-0 lg:mx-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <motion.div
                    className={`w-8 h-1 lg:w-12 lg:h-1 rounded-full ${
                      getConnectionStatus(node.id, nodes[index + 1].id) === 'active' 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                    }`}
                    animate={{
                      scaleX: getConnectionStatus(node.id, nodes[index + 1].id) === 'active' ? 1 : 0.5
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className={`ml-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 ${
                      getConnectionStatus(node.id, nodes[index + 1].id) === 'active' 
                        ? 'border-t-blue-500' 
                        : 'border-t-gray-400'
                    }`}
                    animate={{
                      scale: getConnectionStatus(node.id, nodes[index + 1].id) === 'active' ? 1 : 0.5
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Description */}
        <div className="mt-6 lg:hidden">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {pipelineSteps[currentStep]?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
          <div className="text-gray-600 dark:text-gray-300">Pipeline Stages</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
          <div className="text-gray-600 dark:text-gray-300">Uptime</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10TB+</div>
          <div className="text-gray-600 dark:text-gray-300">Data Processed</div>
        </div>
      </div>
    </div>
  )
}
