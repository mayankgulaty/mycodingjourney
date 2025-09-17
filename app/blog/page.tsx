'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { BlogSystem } from '@/components/blog-system'
import { FloatingParticles } from '@/components/enhanced-animations'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-[80vh] flex items-center relative overflow-hidden gradient-bg">
        <FloatingParticles />
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              My{' '}
              <span className="text-shimmer">Blog</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-foreground/80 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Thoughts, tutorials, and insights from my coding journey
            </motion.p>

            {/* Blog Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { number: '25+', label: 'Articles Written' },
                { number: '5K+', label: 'Readers' },
                { number: '3', label: 'Categories' },
                { number: '100%', label: 'Original Content' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 glass-morphism rounded-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-foreground/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Featured Articles */}
      <Section className="relative bg-background">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Featured{' '}
              <span className="text-shimmer">Articles</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              My most popular and impactful articles on data engineering, web development, and technology.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Data Engineering Article */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl mr-3">
                    📊
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:border-blue-500 dark:text-blue-400">
                      Data Engineering
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Building Scalable Data Pipelines with Apache Kafka
                </h3>
                <p className="text-foreground/70 mb-4 text-sm leading-relaxed">
                  Learn how to design and implement robust data pipelines that can handle millions of events per day using Apache Kafka, Spark, and modern data engineering practices.
                </p>
                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <span>Dec 15, 2024</span>
                  <span>8 min read</span>
                </div>
              </div>
            </Card>

            {/* Web Development Article */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-xl mr-3">
                    ⚛️
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:border-green-500 dark:text-green-400">
                      Web Development
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Next.js 14: The Complete Guide to App Router
                </h3>
                <p className="text-foreground/70 mb-4 text-sm leading-relaxed">
                  A comprehensive guide to Next.js 14's App Router, covering everything from basic routing to advanced patterns, server components, and performance optimization.
                </p>
                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <span>Dec 10, 2024</span>
                  <span>12 min read</span>
                </div>
              </div>
            </Card>

            {/* AI/ML Article */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-xl mr-3">
                    🤖
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 dark:border-purple-500 dark:text-purple-400">
                      AI/ML
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  MLOps: Deploying Machine Learning Models at Scale
                </h3>
                <p className="text-foreground/70 mb-4 text-sm leading-relaxed">
                  Everything you need to know about MLOps, from model training and versioning to deployment strategies, monitoring, and maintaining ML systems in production.
                </p>
                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <span>Dec 5, 2024</span>
                  <span>15 min read</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Blog Categories */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-8">Explore by Category</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Data Engineering', count: 8, color: 'from-blue-500 to-purple-600' },
                { name: 'Web Development', count: 12, color: 'from-green-500 to-teal-600' },
                { name: 'AI/ML', count: 5, color: 'from-purple-500 to-pink-600' },
                { name: 'DevOps', count: 6, color: 'from-orange-500 to-red-600' },
                { name: 'Tutorials', count: 15, color: 'from-indigo-500 to-blue-600' }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`bg-gradient-to-r ${category.color} p-1 rounded-2xl`}>
                    <div className="bg-background px-6 py-3 rounded-xl group-hover:bg-transparent transition-all duration-300">
                      <div className="text-foreground group-hover:text-white font-medium">
                        {category.name}
                      </div>
                      <div className="text-sm text-foreground/60 group-hover:text-white/80">
                        {category.count} articles
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Recent Posts */}
      <Section className="relative bg-background">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Recent{' '}
              <span className="text-shimmer">Posts</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Latest articles and insights from my technical journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Recent Post 1 */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:border-blue-500 dark:text-blue-400">
                    Data Engineering
                  </Badge>
                  <span className="text-sm text-foreground/60">Dec 20, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Optimizing Apache Spark Jobs for Better Performance
                </h3>
                <p className="text-foreground/70 mb-4 text-sm leading-relaxed">
                  Learn advanced techniques to optimize your Spark jobs, including partitioning strategies, 
                  memory management, and cluster configuration for maximum performance.
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href="#"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-2 transition-all duration-300"
                  >
                    Read More
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-sm text-foreground/60">6 min read</span>
                </div>
              </div>
            </Card>

            {/* Recent Post 2 */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:border-green-500 dark:text-green-400">
                    Web Development
                  </Badge>
                  <span className="text-sm text-foreground/60">Dec 18, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Building Scalable React Applications with TypeScript
                </h3>
                <p className="text-foreground/70 mb-4 text-sm leading-relaxed">
                  A comprehensive guide to building large-scale React applications with TypeScript, 
                  covering state management, component architecture, and performance optimization.
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href="#"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-2 transition-all duration-300"
                  >
                    Read More
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-sm text-foreground/60">10 min read</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Blog System */}
      <Section className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <BlogSystem />
      </Section>
    </>
  )
}
