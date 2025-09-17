'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './card'
import { Badge } from './badge'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: 'data-engineering' | 'web-development' | 'machine-learning' | 'devops' | 'analytics'
  status: 'completed' | 'in-progress' | 'planned'
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  complexity: 'beginner' | 'intermediate' | 'advanced'
}

const projects: Project[] = [
  {
    id: 'etl-pipeline',
    title: 'Real-time ETL Pipeline',
    description: 'Built a scalable ETL pipeline using Apache Spark, Kafka, and PostgreSQL for processing 10TB+ of customer data daily.',
    image: '/api/placeholder/400/300',
    technologies: ['Apache Spark', 'Kafka', 'PostgreSQL', 'Docker', 'AWS'],
    category: 'data-engineering',
    status: 'completed',
    githubUrl: 'https://github.com/example/etl-pipeline',
    liveUrl: 'https://example.com/dashboard',
    featured: true,
    complexity: 'advanced'
  },
  {
    id: 'ml-recommendation',
    title: 'ML Recommendation Engine',
    description: 'Developed a collaborative filtering recommendation system using PySpark MLlib and deployed with MLflow.',
    image: '/api/placeholder/400/300',
    technologies: ['PySpark', 'MLlib', 'MLflow', 'Python', 'Redis'],
    category: 'machine-learning',
    status: 'completed',
    githubUrl: 'https://github.com/example/ml-recommendation',
    featured: true,
    complexity: 'advanced'
  },
  {
    id: 'data-dashboard',
    title: 'Interactive Data Dashboard',
    description: 'Created a real-time analytics dashboard using React, D3.js, and FastAPI for visualizing business metrics.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'D3.js', 'FastAPI', 'PostgreSQL', 'WebSocket'],
    category: 'web-development',
    status: 'completed',
    githubUrl: 'https://github.com/example/data-dashboard',
    liveUrl: 'https://dashboard.example.com',
    featured: true,
    complexity: 'intermediate'
  },
  {
    id: 'data-warehouse',
    title: 'Cloud Data Warehouse',
    description: 'Designed and implemented a cloud-based data warehouse using Snowflake and dbt for modern analytics.',
    image: '/api/placeholder/400/300',
    technologies: ['Snowflake', 'dbt', 'Airflow', 'S3', 'Terraform'],
    category: 'data-engineering',
    status: 'completed',
    githubUrl: 'https://github.com/example/data-warehouse',
    featured: false,
    complexity: 'advanced'
  },
  {
    id: 'monitoring-system',
    title: 'Data Pipeline Monitoring',
    description: 'Built a comprehensive monitoring system using Grafana, Prometheus, and custom alerting for data pipelines.',
    image: '/api/placeholder/400/300',
    technologies: ['Grafana', 'Prometheus', 'Python', 'Docker', 'Kubernetes'],
    category: 'devops',
    status: 'in-progress',
    githubUrl: 'https://github.com/example/monitoring',
    featured: false,
    complexity: 'intermediate'
  },
  {
    id: 'ab-testing',
    title: 'A/B Testing Platform',
    description: 'Developed a statistical analysis platform for A/B testing with automated experiment evaluation.',
    image: '/api/placeholder/400/300',
    technologies: ['Python', 'Pandas', 'Scipy', 'FastAPI', 'PostgreSQL'],
    category: 'analytics',
    status: 'completed',
    githubUrl: 'https://github.com/example/ab-testing',
    featured: false,
    complexity: 'intermediate'
  },
  {
    id: 'stream-processing',
    title: 'Real-time Stream Processing',
    description: 'Implemented real-time data processing using Apache Flink and Apache Pulsar for event-driven architecture.',
    image: '/api/placeholder/400/300',
    technologies: ['Apache Flink', 'Apache Pulsar', 'Java', 'Docker', 'Kubernetes'],
    category: 'data-engineering',
    status: 'planned',
    featured: false,
    complexity: 'advanced'
  },
  {
    id: 'feature-store',
    title: 'ML Feature Store',
    description: 'Built a centralized feature store using Feast for managing ML features across multiple models.',
    image: '/api/placeholder/400/300',
    technologies: ['Feast', 'Redis', 'PostgreSQL', 'Python', 'Docker'],
    category: 'machine-learning',
    status: 'in-progress',
    githubUrl: 'https://github.com/example/feature-store',
    featured: false,
    complexity: 'advanced'
  }
]

const categories = [
  { id: 'all', label: 'All Projects', count: projects.length },
  { id: 'data-engineering', label: 'Data Engineering', count: projects.filter(p => p.category === 'data-engineering').length },
  { id: 'web-development', label: 'Web Development', count: projects.filter(p => p.category === 'web-development').length },
  { id: 'machine-learning', label: 'Machine Learning', count: projects.filter(p => p.category === 'machine-learning').length },
  { id: 'devops', label: 'DevOps', count: projects.filter(p => p.category === 'devops').length },
  { id: 'analytics', label: 'Analytics', count: projects.filter(p => p.category === 'analytics').length }
]

const statuses = [
  { id: 'all', label: 'All Status', color: 'gray' },
  { id: 'completed', label: 'Completed', color: 'green' },
  { id: 'in-progress', label: 'In Progress', color: 'blue' },
  { id: 'planned', label: 'Planned', color: 'yellow' }
]

const complexities = [
  { id: 'all', label: 'All Levels', color: 'gray' },
  { id: 'beginner', label: 'Beginner', color: 'green' },
  { id: 'intermediate', label: 'Intermediate', color: 'blue' },
  { id: 'advanced', label: 'Advanced', color: 'red' }
]

export function ProjectFilter() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedComplexity, setSelectedComplexity] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'complexity'>('recent')

  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus)
    }

    // Filter by complexity
    if (selectedComplexity !== 'all') {
      filtered = filtered.filter(project => project.complexity === selectedComplexity)
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'complexity':
          const complexityOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        case 'recent':
        default:
          return b.featured ? 1 : -1
      }
    })

    return filtered
  }, [selectedCategory, selectedStatus, selectedComplexity, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Projects
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Explore my portfolio of data engineering, web development, and ML projects
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label} ({category.count})
              </motion.button>
            ))}
          </div>
        </div>

        {/* Status and Complexity Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <motion.button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === status.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Complexity</h4>
            <div className="flex flex-wrap gap-2">
              {complexities.map((complexity) => (
                <motion.button
                  key={complexity.id}
                  onClick={() => setSelectedComplexity(complexity.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedComplexity === complexity.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {complexity.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'complexity')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="complexity">Complexity</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${selectedStatus}-${selectedComplexity}-${sortBy}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 group-hover:scale-105">
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {project.featured && (
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    )}
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className={getComplexityColor(project.complexity)}>
                      {project.complexity}
                    </Badge>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        GitHub
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Live Demo
                      </motion.a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your filters to see more projects
          </p>
        </motion.div>
      )}
    </div>
  )
}
