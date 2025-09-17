'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { InteractivePipeline } from '@/components/interactive-pipeline'
import { LiveCodeEditor } from '@/components/live-code-editor'
import { ProjectFilter } from '@/components/project-filter'
import { BlogSystem } from '@/components/blog-system'
import { 
  FloatingParticles
} from '@/components/enhanced-animations'
import { siteConfig } from '@/lib/site'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center relative overflow-hidden gradient-bg">
        <FloatingParticles />
        <div className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 glass-morphism rounded-full text-sm font-medium text-foreground/80 mb-4">
                ✨ Available for new opportunities
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight text-foreground">
              <span className="block">Hi, I&apos;m</span>
              <span className="block text-shimmer">{siteConfig.author.name}</span>
            </h1>
            
            <div className="text-xl md:text-3xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              <div className="text-center">
                <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Data Engineer & Full-stack Developer
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="group">
                <Link
                  href="/projects"
                  className="inline-flex items-center px-10 py-4 glass-morphism rounded-2xl font-semibold text-foreground hover:neon-glow transition-all duration-300 group-hover:shadow-2xl"
                >
                  <span className="mr-3">🚀</span>
                  View My Work
                  <span className="ml-3">→</span>
                </Link>
              </div>
              
              <div className="group">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-10 py-4 border-2 border-border rounded-2xl font-semibold text-foreground hover:bg-accent transition-all duration-300 group-hover:border-border/60"
                >
                  <span className="mr-3">💬</span>
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* About Preview */}
      <Section className="relative bg-muted/30">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white">
              About{' '}
              <span className="text-shimmer">Me</span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              I&apos;m a passionate Data Engineer and Full-stack Developer who loves creating 
              amazing web experiences and building robust data pipelines. With expertise in 
              modern web technologies and data engineering tools, I build scalable applications 
              and data solutions that make a difference.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Python', 'Apache Spark', 'AWS', 'PostgreSQL', 'React', 'Next.js', 'TypeScript', 'Docker'].map((skill) => (
                <div key={skill}>
                  <Badge variant="outline" className="text-sm border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80 hover:border-gray-400 hover:text-gray-900 dark:hover:border-white/60 dark:hover:text-white transition-all duration-300">
                    {skill}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 glass-morphism rounded-2xl font-semibold text-foreground hover:neon-glow transition-all duration-300"
              >
                <span className="mr-3">👨‍💻</span>
                Learn more about me
                <svg 
                  className="ml-3 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Projects */}
      <Section className="relative bg-background">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              Featured{' '}
              <span className="text-shimmer">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Some of my recent work and side projects that showcase my skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div key={index} className="group">
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
                    <svg 
                      className="ml-2 h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 glass-morphism rounded-2xl font-semibold text-foreground hover:neon-glow transition-all duration-300"
            >
              <span className="mr-3">🚀</span>
              View All Projects
            </Link>
          </div>
        </div>
      </Section>

      {/* Interactive Data Pipeline Section */}
      <Section className="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <InteractivePipeline />
      </Section>

      {/* Live Code Editor Section */}
      <Section className="relative bg-background">
        <LiveCodeEditor />
      </Section>

      {/* Enhanced Projects Section */}
      <Section className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <ProjectFilter />
      </Section>

      {/* Blog System Section */}
      <Section className="relative bg-background">
        <BlogSystem />
      </Section>
    </>
  )
}