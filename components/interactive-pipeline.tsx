'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, FileText, Zap, Settings, Server, Play, RotateCcw, CheckCircle, Activity, Box } from 'lucide-react'

interface PipelineNode {
  id: string
  type: 'source' | 'transform' | 'destination' | 'process'
  title: string
  description: string
  icon: React.ReactNode
  color: string
  status: 'idle' | 'processing' | 'completed' | 'error'
}

interface PipelineConnection {
  from: string
  to: string
  status: 'idle' | 'active' | 'completed'
}

// Map specialized gradients to node types
const nodeStyles = {
  source: "from-blue-600 to-cyan-600",
  transform: "from-orange-500 to-amber-500",
  process: "from-purple-600 to-pink-600",
  destination: "from-emerald-500 to-teal-500"
}

export function InteractivePipeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const [nodes, setNodes] = useState<PipelineNode[]>([
    {
      id: 'source-1',
      type: 'source',
      title: 'PostgreSQL',
      description: 'Raw User Data',
      icon: <Database className="w-8 h-8" />,
      color: nodeStyles.source,
      status: 'idle'
    },
    {
      id: 'transform-1',
      type: 'transform',
      title: 'Cleaning',
      description: 'Dedup & Validation',
      icon: <FileText className="w-8 h-8" />,
      color: nodeStyles.transform,
      status: 'idle'
    },
    {
      id: 'process-1',
      type: 'process',
      title: 'Spark Job',
      description: 'Aggregation',
      icon: <Zap className="w-8 h-8" />,
      color: nodeStyles.process,
      status: 'idle'
    },
    {
      id: 'transform-2',
      type: 'transform',
      title: 'Feature Eng',
      description: 'Vectorization',
      icon: <Settings className="w-8 h-8" />,
      color: "from-indigo-500 to-violet-500",
      status: 'idle'
    },
    {
      id: 'destination-1',
      type: 'destination',
      title: 'Snowflake',
      description: 'Analytics Ready',
      icon: <Server className="w-8 h-8" />,
      color: nodeStyles.destination,
      status: 'idle'
    }
  ])

  const pipelineSteps = [
    { step: 0, description: 'Extracting raw change data from PostgreSQL...' },
    { step: 1, description: 'Running data quality checks and deduplication...' },
    { step: 2, description: 'Aggregating metrics via Apache Spark cluster...' },
    { step: 3, description: 'Generating ML features for propensity models...' },
    { step: 4, description: 'Loading final tables into Data Warehouse.' }
  ]

  const startPipeline = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    setNodes(prev => prev.map(node => ({ ...node, status: 'idle' })))

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= pipelineSteps.length - 1) {
          clearInterval(stepInterval)
          setIsPlaying(false)
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

  useEffect(() => {
    if (isPlaying) {
      setNodes(prev => prev.map((node, index) => {
        if (index < currentStep) return { ...node, status: 'completed' }
        else if (index === currentStep) return { ...node, status: 'processing' }
        else return { ...node, status: 'idle' }
      }))
    }
  }, [currentStep, isPlaying])

  const getConnectionStatus = (index: number) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'idle'
  }

  return (
    <div className="w-full text-slate-200">

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex gap-4">
          <motion.button
            onClick={startPipeline}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isPlaying
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
              }`}
            whileHover={{ scale: isPlaying ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {isPlaying ? 'Processing...' : 'Run Pipeline'}
          </motion.button>

          <motion.button
            onClick={resetPipeline}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </motion.button>
        </div>

        {/* Status Display */}
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 bg-slate-800/50 px-5 py-3 rounded-lg border border-indigo-500/30 text-indigo-200"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-sm font-medium">{pipelineSteps[currentStep]?.description}</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-sm italic"
            >
              System Ready. Waiting for job trigger...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nodes Visualization */}
      <div className="relative py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between relative z-10 gap-8">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex flex-col lg:flex-row items-center w-full">

              {/* Node Card */}
              <motion.div
                className={`relative z-20 group w-full lg:w-auto`}
                animate={{
                  scale: node.status === 'processing' ? 1.1 : 1,
                  filter: node.status === 'idle' ? 'grayscale(0.5)' : 'grayscale(0)'
                }}
              >
                <div className={`
                  w-full lg:w-32 h-32 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2
                  bg-gradient-to-br ${node.color} shadow-xl relative overflow-hidden transition-all duration-300
                  ${node.status === 'processing' ? 'ring-4 ring-white/20 ring-offset-2 ring-offset-slate-900' : ''}
                `}>

                  {/* Inner shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="text-white drop-shadow-md relative z-10">
                    {node.icon}
                  </div>
                  <div className="font-bold text-white text-sm leading-tight relative z-10">
                    {node.title}
                  </div>
                  <div className="text-[10px] text-white/80 font-medium uppercase tracking-wider relative z-10">
                    {node.description}
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2">
                    {node.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>

                  {/* Processing scanning bar */}
                  {node.status === 'processing' && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ y: ['100%', '-100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Connecting Line (Desktop) */}
              {index < nodes.length - 1 && (
                <div className="hidden lg:flex flex-1 mx-4 items-center justify-center h-full min-w-[3rem] relative">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-400 box-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{
                        width: getConnectionStatus(index) === 'completed' || getConnectionStatus(index) === 'active' ? "100%" : "0%"
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Connecting Line (Mobile) */}
              {index < nodes.length - 1 && (
                <div className="lg:hidden h-8 w-1 bg-slate-800 my-2 rounded-full overflow-hidden">
                  <motion.div
                    className="w-full bg-cyan-400"
                    initial={{ height: "0%" }}
                    animate={{
                      height: getConnectionStatus(index) === 'completed' || getConnectionStatus(index) === 'active' ? "100%" : "0%"
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 justify-center mt-12 text-slate-500 text-sm font-mono">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4" /> <span>Cluster Status: Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" /> <span>Latency: 24ms</span>
        </div>
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4" /> <span>Nodes: 5/5</span>
        </div>
      </div>
    </div>
  )
}

