'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { ParticleBackground } from '@/components/particle-background'
import { ScrollProgress } from '@/components/scroll-progress'
import { CursorTrail } from '@/components/cursor-trail'
import { Typewriter } from '@/components/typewriter'
import { Card3D } from '@/components/3d-card'
import { siteConfig } from '@/lib/site'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  const typewriterTexts = [
    "Full-stack Developer",
    "UI/UX Enthusiast", 
    "Problem Solver",
    "Tech Innovator",
    "Code Creator"
  ]

  return (
    <>
      <ScrollProgress />
      <CursorTrail />
      <ParticleBackground />
      
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl floating"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl floating"></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div
              className="mb-8"
              variants={fadeInUp}
            >
              <motion.span
                className="inline-block px-4 py-2 glass-morphism rounded-full text-sm font-medium text-white/80 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                ✨ Available for new opportunities
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
              variants={fadeInUp}
            >
              <span className="block">Hi, I'm</span>
              <span className="block text-shimmer">
                {siteConfig.author.name}
              </span>
            </motion.h1>
            
            <motion.div
              className="text-xl md:text-3xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              <Typewriter 
                texts={typewriterTexts}
                speed={100}
                deleteSpeed={50}
                pauseTime={2000}
                className="text-2xl md:text-4xl font-semibold text-shimmer"
              />
            </motion.div>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center px-10 py-4 glass-morphism rounded-2xl font-semibold text-white hover:neon-glow transition-all duration-300 group-hover:shadow-2xl"
                >
                  <span className="mr-3">🚀</span>
                  View My Work
                  <motion.span
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center px-10 py-4 border-2 border-white/30 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all duration-300 group-hover:border-white/60"
                >
                  <span className="mr-3">💬</span>
                  Get In Touch
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating Tech Icons */}
            <motion.div
              className="absolute top-1/2 left-10 hidden lg:block"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center text-2xl">
                ⚛️
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/3 right-10 hidden lg:block"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center text-2xl">
                🎨
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 left-20 hidden lg:block"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            >
              <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center text-2xl">
                💻
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </Section>

      {/* About Preview */}
      <Section className="relative">
        <div className="container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white"
              variants={fadeInUp}
            >
              About{' '}
              <span className="text-shimmer">Me</span>
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-600 dark:text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              I'm a passionate developer who loves creating amazing web experiences. 
              With expertise in modern web technologies, I build scalable applications 
              that make a difference.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              variants={fadeInUp}
            >
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'].map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="outline" className="text-sm border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80 hover:border-gray-400 hover:text-gray-900 dark:hover:border-white/60 dark:hover:text-white transition-all duration-300">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 glass-morphism rounded-2xl font-semibold text-white hover:neon-glow transition-all duration-300"
              >
                <span className="mr-3">👨‍💻</span>
                Learn more about me
                <motion.svg 
                  className="ml-3 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Featured Projects */}
      <Section className="relative">
        <div className="container">
          <motion.div
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              Featured{' '}
              <span className="text-shimmer">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Some of my recent work and side projects that showcase my skills
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
                {[
                  {
                    title: 'AI Design Tool',
                    description: 'A modern AI-powered design tool that generates logos, color palettes, and design suggestions using OpenAI APIs.',
                    tech: ['Next.js', 'TypeScript', 'OpenAI API', 'Framer Motion'],
                    link: 'http://localhost:3001',
                    icon: '🎨',
                    gradient: 'from-purple-500 to-pink-500'
                  },
                  {
                    title: 'E-Commerce Platform',
                    description: 'A full-stack e-commerce solution built with Next.js, Stripe, and PostgreSQL.',
                    tech: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
                    link: '#',
                    icon: '🛒',
                    gradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    title: 'Task Management App',
                    description: 'A collaborative task management tool with real-time updates and team features.',
                    tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
                    link: '#',
                    icon: '📋',
                    gradient: 'from-green-500 to-teal-500'
                  }
                ].map((project, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="group"
              >
                <Card3D intensity={15} className="h-full">
                  <div className="relative h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                    <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 group-hover:scale-105">
                      <div className="text-4xl mb-4">{project.icon}</div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-gray-600 dark:text-white/70 mb-6 leading-relaxed">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <Link
                        href={project.link}
                        className="inline-flex items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-white/80 font-medium group-hover:translate-x-2 transition-all duration-300"
                      >
                        View Project
                        <motion.svg 
                          className="ml-2 h-4 w-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </motion.svg>
                      </Link>
                    </Card>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="text-center mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 glass-morphism rounded-2xl font-semibold text-white hover:neon-glow transition-all duration-300"
            >
              <span className="mr-3">🚀</span>
              View All Projects
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Blog Preview */}
      <Section className="bg-muted/50">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">Latest Blog Posts</h2>
            <p className="text-lg text-muted-foreground">
              Thoughts, tutorials, and insights from my coding journey
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                title: 'Building Scalable React Applications',
                excerpt: 'Learn how to structure and scale your React applications for long-term maintainability.',
                date: '2024-01-15',
                readTime: '5 min read'
              },
              {
                title: 'The Future of Web Development',
                excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
                date: '2024-01-10',
                readTime: '8 min read'
              },
              {
                title: 'TypeScript Best Practices',
                excerpt: 'Essential TypeScript patterns and practices for better code quality and developer experience.',
                date: '2024-01-05',
                readTime: '6 min read'
              }
            ].map((post, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    Read More
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="text-center mt-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              View All Posts
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
