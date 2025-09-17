'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { siteConfig } from '@/lib/site'

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

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center relative overflow-hidden gradient-bg">
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
                className="inline-block px-4 py-2 glass-morphism rounded-full text-sm font-medium text-foreground/80 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                ✨ Available for new opportunities
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight text-foreground"
              variants={fadeInUp}
            >
              <span className="block">Hi, I&apos;m</span>
              <span className="block text-shimmer">{siteConfig.author.name}</span>
            </motion.h1>
            
            <motion.div
              className="text-xl md:text-3xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              <span className="text-2xl md:text-4xl font-semibold">
                Data Engineer & Full-stack Developer
              </span>
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
                  className="inline-flex items-center px-10 py-4 glass-morphism rounded-2xl font-semibold text-foreground hover:neon-glow transition-all duration-300 group-hover:shadow-2xl"
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
                  className="inline-flex items-center px-10 py-4 border-2 border-border rounded-2xl font-semibold text-foreground hover:bg-accent transition-all duration-300 group-hover:border-border/60"
                >
                  <span className="mr-3">💬</span>
                  Get In Touch
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* About Preview */}
      <Section className="relative bg-muted/30">
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
              I&apos;m a passionate Data Engineer and Full-stack Developer who loves creating 
              amazing web experiences and building robust data pipelines. With expertise in 
              modern web technologies and data engineering tools, I build scalable applications 
              and data solutions that make a difference.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              variants={fadeInUp}
            >
              {['Python', 'Apache Spark', 'AWS', 'PostgreSQL', 'React', 'Next.js', 'TypeScript', 'Docker'].map((skill) => (
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
                className="inline-flex items-center px-8 py-4 glass-morphism rounded-2xl font-semibold text-foreground hover:neon-glow transition-all duration-300"
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
      <Section className="relative bg-background">
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
              className="inline-flex items-center px-8 py-4 glass-morphism rounded-2xl font-semibold text-foreground hover:neon-glow transition-all duration-300"
            >
              <span className="mr-3">🚀</span>
              View All Projects
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  )
}