'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './card'
import { Badge } from './badge'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  readTime: number
  category: 'data-engineering' | 'machine-learning' | 'web-development' | 'tutorials' | 'insights'
  tags: string[]
  featured: boolean
  views: number
  likes: number
  image: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const blogPosts: BlogPost[] = [
  {
    id: 'spark-optimization',
    title: 'Optimizing Apache Spark for Large-Scale Data Processing',
    excerpt: 'Learn advanced techniques to optimize your Spark jobs for processing terabytes of data efficiently.',
    content: 'Full content about Spark optimization...',
    author: 'Mayank Gulaty',
    publishedAt: '2024-01-15',
    readTime: 12,
    category: 'data-engineering',
    tags: ['Apache Spark', 'Performance', 'Big Data', 'Optimization'],
    featured: true,
    views: 1250,
    likes: 89,
    image: '/api/placeholder/600/400',
    difficulty: 'advanced'
  },
  {
    id: 'etl-best-practices',
    title: 'ETL Pipeline Design Patterns and Best Practices',
    excerpt: 'Comprehensive guide to building robust, scalable ETL pipelines with real-world examples.',
    content: 'Full content about ETL best practices...',
    author: 'Mayank Gulaty',
    publishedAt: '2024-01-10',
    readTime: 8,
    category: 'data-engineering',
    tags: ['ETL', 'Data Pipeline', 'Architecture', 'Best Practices'],
    featured: true,
    views: 980,
    likes: 67,
    image: '/api/placeholder/600/400',
    difficulty: 'intermediate'
  },
  {
    id: 'mlops-mlflow',
    title: 'MLOps with MLflow: Managing Machine Learning Lifecycle',
    excerpt: 'Complete guide to implementing MLOps practices using MLflow for model management and deployment.',
    content: 'Full content about MLOps with MLflow...',
    author: 'Mayank Gulaty',
    publishedAt: '2024-01-05',
    readTime: 15,
    category: 'machine-learning',
    tags: ['MLOps', 'MLflow', 'Model Management', 'Deployment'],
    featured: false,
    views: 750,
    likes: 45,
    image: '/api/placeholder/600/400',
    difficulty: 'advanced'
  },
  {
    id: 'data-visualization-d3',
    title: 'Building Interactive Data Visualizations with D3.js',
    excerpt: 'Step-by-step tutorial on creating stunning, interactive data visualizations for your web applications.',
    content: 'Full content about D3.js visualizations...',
    author: 'Mayank Gulaty',
    publishedAt: '2024-01-01',
    readTime: 10,
    category: 'web-development',
    tags: ['D3.js', 'Data Visualization', 'JavaScript', 'Web Development'],
    featured: false,
    views: 650,
    likes: 38,
    image: '/api/placeholder/600/400',
    difficulty: 'intermediate'
  },
  {
    id: 'sql-optimization-tips',
    title: 'SQL Query Optimization: 10 Essential Tips for Data Engineers',
    excerpt: 'Master SQL optimization techniques to write faster, more efficient queries for large datasets.',
    content: 'Full content about SQL optimization...',
    author: 'Mayank Gulaty',
    publishedAt: '2023-12-28',
    readTime: 6,
    category: 'tutorials',
    tags: ['SQL', 'Optimization', 'Database', 'Performance'],
    featured: false,
    views: 1200,
    likes: 92,
    image: '/api/placeholder/600/400',
    difficulty: 'beginner'
  },
  {
    id: 'data-warehouse-design',
    title: 'Modern Data Warehouse Architecture: From Star Schema to Data Vault',
    excerpt: 'Explore different data warehouse modeling techniques and when to use each approach.',
    content: 'Full content about data warehouse design...',
    author: 'Mayank Gulaty',
    publishedAt: '2023-12-20',
    readTime: 14,
    category: 'data-engineering',
    tags: ['Data Warehouse', 'Star Schema', 'Data Vault', 'Architecture'],
    featured: false,
    views: 890,
    likes: 56,
    image: '/api/placeholder/600/400',
    difficulty: 'advanced'
  },
  {
    id: 'real-time-analytics',
    title: 'Building Real-Time Analytics with Apache Kafka and ClickHouse',
    excerpt: 'Learn how to build a real-time analytics system using Kafka for streaming and ClickHouse for storage.',
    content: 'Full content about real-time analytics...',
    author: 'Mayank Gulaty',
    publishedAt: '2023-12-15',
    readTime: 11,
    category: 'data-engineering',
    tags: ['Real-time', 'Kafka', 'ClickHouse', 'Streaming'],
    featured: false,
    views: 720,
    likes: 43,
    image: '/api/placeholder/600/400',
    difficulty: 'advanced'
  },
  {
    id: 'python-data-tools',
    title: 'Essential Python Libraries for Data Engineering',
    excerpt: 'A curated list of must-know Python libraries for data engineers, from Pandas to Airflow.',
    content: 'Full content about Python data tools...',
    author: 'Mayank Gulaty',
    publishedAt: '2023-12-10',
    readTime: 7,
    category: 'tutorials',
    tags: ['Python', 'Data Engineering', 'Libraries', 'Tools'],
    featured: false,
    views: 1100,
    likes: 78,
    image: '/api/placeholder/600/400',
    difficulty: 'beginner'
  }
]

const categories = [
  { id: 'all', label: 'All Posts', count: blogPosts.length },
  { id: 'data-engineering', label: 'Data Engineering', count: blogPosts.filter(p => p.category === 'data-engineering').length },
  { id: 'machine-learning', label: 'Machine Learning', count: blogPosts.filter(p => p.category === 'machine-learning').length },
  { id: 'web-development', label: 'Web Development', count: blogPosts.filter(p => p.category === 'web-development').length },
  { id: 'tutorials', label: 'Tutorials', count: blogPosts.filter(p => p.category === 'tutorials').length },
  { id: 'insights', label: 'Insights', count: blogPosts.filter(p => p.category === 'insights').length }
]

const difficulties = [
  { id: 'all', label: 'All Levels', color: 'gray' },
  { id: 'beginner', label: 'Beginner', color: 'green' },
  { id: 'intermediate', label: 'Intermediate', color: 'blue' },
  { id: 'advanced', label: 'Advanced', color: 'red' }
]

export function BlogSystem() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'read-time'>('recent')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(post => post.difficulty === selectedDifficulty)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.views + b.likes) - (a.views + a.likes)
        case 'read-time':
          return a.readTime - b.readTime
        case 'recent':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
    })

    return filtered
  }, [selectedCategory, selectedDifficulty, sortBy, searchQuery])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Technical Blog
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Insights, tutorials, and best practices from my data engineering journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

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

        {/* Difficulty and Sort Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <motion.button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {difficulty.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sort by</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'read-time')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="read-time">Read Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {filteredPosts.length} of {blogPosts.length} articles
        </p>
      </div>

      {/* Featured Posts */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mb-12">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Articles</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {blogPosts.filter(post => post.featured).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 group-hover:scale-105">
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className={getDifficultyColor(post.difficulty)}>
                        {post.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>👁️ {post.views}</span>
                        <span>❤️ {post.likes}</span>
                      </div>
                      <motion.button
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Read More →
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div>
        {selectedCategory !== 'all' || searchQuery ? (
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Articles</h4>
        ) : (
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Articles</h4>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedDifficulty}-${sortBy}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 group-hover:scale-105">
                  <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getDifficultyColor(post.difficulty)}>
                        {post.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 mb-3 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{post.readTime} min</span>
                      <div className="flex gap-2">
                        <span>👁️ {post.views}</span>
                        <span>❤️ {post.likes}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}
    </div>
  )
}
