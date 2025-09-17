'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DataSkill {
  name: string
  category: 'Languages' | 'Tools' | 'Cloud' | 'Databases'
  level: number
  icon: string
  color: string
}

const dataSkills: DataSkill[] = [
  // Languages
  { name: 'Python', category: 'Languages', level: 95, icon: '🐍', color: '#3776ab' },
  { name: 'SQL', category: 'Languages', level: 90, icon: '🗄️', color: '#336791' },
  { name: 'Scala', category: 'Languages', level: 80, icon: '⚡', color: '#dc322f' },
  { name: 'R', category: 'Languages', level: 75, icon: '📊', color: '#276dc3' },
  
  // Tools
  { name: 'Apache Spark', category: 'Tools', level: 90, icon: '⚡', color: '#e25a1c' },
  { name: 'Airflow', category: 'Tools', level: 85, icon: '🌪️', color: '#017cee' },
  { name: 'Kafka', category: 'Tools', level: 80, icon: '📡', color: '#231f20' },
  { name: 'Docker', category: 'Tools', level: 85, icon: '🐳', color: '#2496ed' },
  
  // Cloud
  { name: 'AWS', category: 'Cloud', level: 90, icon: '☁️', color: '#ff9900' },
  { name: 'GCP', category: 'Cloud', level: 75, icon: '🌩️', color: '#4285f4' },
  { name: 'Azure', category: 'Cloud', level: 70, icon: '🔵', color: '#0078d4' },
  { name: 'Kubernetes', category: 'Cloud', level: 80, icon: '⚙️', color: '#326ce5' },
  
  // Databases
  { name: 'PostgreSQL', category: 'Databases', level: 90, icon: '🐘', color: '#336791' },
  { name: 'MongoDB', category: 'Databases', level: 85, icon: '🍃', color: '#47a248' },
  { name: 'Redis', category: 'Databases', level: 80, icon: '🔴', color: '#dc382d' },
  { name: 'Elasticsearch', category: 'Databases', level: 75, icon: '🔍', color: '#005571' },
]

export function DataSkills() {
  const [selectedCategory, setSelectedCategory] = useState<DataSkill['category']>('Languages')
  const [isAnimating, setIsAnimating] = useState(false)

  const filteredSkills = dataSkills.filter(skill => skill.category === selectedCategory)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  const categories: DataSkill['category'][] = ['Languages', 'Tools', 'Cloud', 'Databases']

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-4">Data Engineering Skills</h3>
        
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: isAnimating ? [1, 1.05, 1] : 1
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              scale: { duration: 0.3 }
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 10px 25px ${skill.color}20`
            }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{skill.icon}</span>
              <span className="text-white font-medium text-sm">{skill.name}</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: skill.color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ 
                  duration: 1,
                  delay: index * 0.1 + 0.5,
                  ease: "easeOut"
                }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">{skill.level}%</span>
              <motion.span 
                className="text-xs font-mono"
                animate={{
                  color: isAnimating ? [skill.color, '#ffffff', skill.color] : skill.color
                }}
                transition={{ duration: 0.5 }}
              >
                {skill.level >= 90 ? 'Expert' : 
                 skill.level >= 80 ? 'Advanced' : 
                 skill.level >= 70 ? 'Intermediate' : 'Beginner'}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating data particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
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
