'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { ProjectFilter } from '@/components/project-filter'
import { InteractivePipeline } from '@/components/interactive-pipeline'
import { LiveCodeEditor } from '@/components/live-code-editor'
import { DataVisualization } from '@/components/data-visualization'
import { FloatingParticles } from '@/components/enhanced-animations'

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

export default function ProjectsPage() {
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
              <span className="text-shimmer">Projects</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-foreground/80 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A collection of projects I&apos;ve built to solve real-world problems and explore new technologies.
            </motion.p>

            {/* Interactive Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { number: '8+', label: 'Years Experience' },
                { number: '10B+', label: 'Records Processed' },
                { number: '15+', label: 'Technologies' },
                { number: '2', label: 'Fortune 500 Companies' }
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

      {/* Featured Projects Showcase */}
      <Section className="relative bg-background">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Featured{' '}
              <span className="text-shimmer">Projects</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Here are some of my most impactful projects that showcase my skills and passion for innovation.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Dublin Bus Pipeline Project */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl mr-4">
                    🚌
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Dublin Bus Real-Time Pipeline</h3>
                    <p className="text-foreground/60">Python + GTFS-RT + SQLite + Streamlit</p>
                  </div>
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Complete data pipeline tracking 700+ buses in real-time across Dublin, 
                  with interactive dashboard showing delays, routes, and performance analytics.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Python', 'GTFS-RT API', 'SQLite', 'Pandas', 'Streamlit', 'Plotly'].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href="/projects/case-studies/dublin-bus-pipeline"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-2 transition-all duration-300"
                  >
                    View Case Study
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  <div className="text-sm text-foreground/60">2026</div>
                </div>
              </div>
            </Card>

            {/* ML Delay Prediction Project */}
            <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl mr-4">
                    🧠
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Transit Delay Prediction</h3>
                    <p className="text-foreground/60">XGBoost + Python + Scikit-learn</p>
                  </div>
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  ML model predicting bus delays 15 minutes in advance with 87% accuracy, 
                  using feature engineering on real-time transit data.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Python', 'XGBoost', 'Scikit-learn', 'Pandas', 'Feature Engineering'].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href="/projects/case-studies/transit-delay-prediction"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-2 transition-all duration-300"
                  >
                    View Case Study
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  <div className="text-sm text-foreground/60">2026</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Interactive Data Pipeline Demo */}
      <Section className="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <InteractivePipeline />
      </Section>

      {/* Live Code Editor Demo */}
      <Section className="relative bg-background">
        <LiveCodeEditor />
      </Section>

      {/* Data Visualization Showcase */}
      <Section className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Data{' '}
              <span className="text-shimmer">Visualization</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Interactive data visualizations and analytics dashboards I&apos;ve created.
            </p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <DataVisualization />
          </motion.div>
        </div>
      </Section>

      {/* Skills & Technologies */}
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
              Skills &{' '}
              <span className="text-shimmer">Technologies</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Technologies and tools I use to build amazing projects and solve complex problems.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { name: 'Python', icon: '🐍', color: 'from-yellow-500 to-orange-500' },
              { name: 'React', icon: '⚛️', color: 'from-blue-500 to-cyan-500' },
              { name: 'Next.js', icon: '▲', color: 'from-gray-800 to-gray-900' },
              { name: 'TypeScript', icon: '📘', color: 'from-blue-600 to-blue-800' },
              { name: 'PostgreSQL', icon: '🐘', color: 'from-blue-700 to-blue-900' },
              { name: 'Docker', icon: '🐳', color: 'from-blue-400 to-blue-600' },
              { name: 'AWS', icon: '☁️', color: 'from-orange-500 to-yellow-500' },
              { name: 'Kafka', icon: '⚡', color: 'from-purple-500 to-pink-500' },
              { name: 'Spark', icon: '🔥', color: 'from-red-500 to-orange-500' },
              { name: 'Kubernetes', icon: '☸️', color: 'from-blue-500 to-blue-700' },
              { name: 'Git', icon: '📚', color: 'from-orange-600 to-red-600' },
              { name: 'Linux', icon: '🐧', color: 'from-yellow-600 to-orange-600' }
            ].map((skill, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`bg-gradient-to-br ${skill.color} p-1 rounded-2xl`}>
                  <div className="bg-background p-4 rounded-xl text-center group-hover:bg-transparent transition-all duration-300">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <div className="text-sm font-medium text-foreground group-hover:text-white">
                      {skill.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Case Studies CTA */}
      <Section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Want the Full Story?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Dive deep into my projects with detailed case studies including architecture decisions, 
              challenges overcome, and measurable business impact.
            </p>
            <Link
              href="/projects/case-studies"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              View Case Studies
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Project Filter System */}
      <Section className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <ProjectFilter />
      </Section>
    </>
  )
}

