'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Code, Zap, Shield, Palette, Database, Globe, CheckCircle, ExternalLink, Github } from 'lucide-react'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { siteConfig } from '@/lib/site'

export default function PortfolioWebsiteCaseStudy() {
  return (
    <>
      {/* Hero */}
      <Section className="py-16 md:py-24 relative overflow-hidden gradient-bg">
        <div className="container relative z-10">
          <Link 
            href="/projects/case-studies"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
              Live Project
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Full-Stack Portfolio Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl">
              Building a modern, high-performance portfolio with custom CMS, 
              demonstrating that data engineers can also ship beautiful web applications.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              {[
                { value: '100', label: 'Lighthouse Score' },
                { value: '<1s', label: 'Load Time' },
                { value: 'SSR', label: 'Server Rendering' },
                { value: 'A+', label: 'SEO Grade' }
              ].map((metric, idx) => (
                <div key={idx} className="text-center p-4 glass-morphism rounded-xl">
                  <div className="text-2xl font-bold text-purple-500 mb-1">{metric.value}</div>
                  <div className="text-sm text-foreground/60">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Problem Statement */}
      <Section className="bg-background">
        <div className="container max-w-4xl">
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              The Challenge
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-foreground/80 leading-relaxed mb-4">
                As a data engineer looking to transition to top tech companies, I needed more than 
                just a resume. I needed a platform that would:
              </p>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span><strong>Showcase technical depth</strong> - Not just list skills, but demonstrate them through the site itself</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span><strong>Host detailed case studies</strong> - With code samples, architecture diagrams, and real metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span><strong>Publish technical blogs</strong> - To share knowledge and improve discoverability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span><strong>Be maintainable</strong> - Easy to update without touching code every time</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span><strong>Load fast everywhere</strong> - Performance is a feature, especially for technical audiences</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Tech Stack */}
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Code className="w-6 h-6 text-blue-500" />
              Technology Stack
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Frontend</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Next.js 14', desc: 'App Router with Server Components' },
                    { name: 'TypeScript', desc: 'Type safety and better DX' },
                    { name: 'Tailwind CSS', desc: 'Utility-first styling' },
                    { name: 'Framer Motion', desc: 'Smooth animations' },
                  ].map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <span className="font-medium text-foreground">{tech.name}</span>
                        <span className="text-foreground/60 text-sm ml-2">- {tech.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Backend & Infrastructure</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Supabase', desc: 'PostgreSQL + Auth + Storage' },
                    { name: 'Vercel', desc: 'Edge deployment & CDN' },
                    { name: 'MDX', desc: 'Markdown with React components' },
                    { name: 'API Routes', desc: 'Serverless functions' },
                  ].map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div>
                        <span className="font-medium text-foreground">{tech.name}</span>
                        <span className="text-foreground/60 text-sm ml-2">- {tech.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Architecture */}
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Database className="w-6 h-6 text-green-500" />
              Architecture Overview
            </h2>
            
            <div className="bg-gray-900 rounded-xl p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-foreground/80 font-mono whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                              VISITORS                                    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE NETWORK                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   CDN       │  │  Edge       │  │  Static     │  │  ISR        │    │
│  │   Caching   │  │  Functions  │  │  Assets     │  │  Revalidate │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEXT.JS APPLICATION                             │
│                                                                          │
│  ┌──────────────────────┐    ┌──────────────────────┐                   │
│  │   Server Components  │    │   Client Components  │                   │
│  │   • Blog pages       │    │   • Animations       │                   │
│  │   • Case studies     │    │   • Theme toggle     │                   │
│  │   • Static pages     │    │   • Interactive UI   │                   │
│  └──────────┬───────────┘    └──────────────────────┘                   │
│             │                                                            │
│             ▼                                                            │
│  ┌──────────────────────┐    ┌──────────────────────┐                   │
│  │   API Routes         │    │   Admin Dashboard    │                   │
│  │   • /api/articles    │    │   • CRUD operations  │                   │
│  │   • /api/contact     │    │   • Image upload     │                   │
│  │   • /api/views       │    │   • Preview mode     │                   │
│  └──────────┬───────────┘    └──────────────────────┘                   │
│             │                                                            │
└─────────────┼────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│  │  PostgreSQL │  │  Storage    │  │  Auth       │                      │
│  │  • articles │  │  • images   │  │  • admin    │                      │
│  │  • views    │  │  • covers   │  │  • sessions │                      │
│  └─────────────┘  └─────────────┘  └─────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </Card>

          {/* Key Features */}
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Palette className="w-6 h-6 text-pink-500" />
              Key Features Built
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Custom CMS',
                  description: 'Full admin dashboard with markdown editor, image uploads, tagging, and draft/publish workflow.',
                  tech: ['React', 'Supabase', 'MDX']
                },
                {
                  title: 'Dark/Light Mode',
                  description: 'System-aware theme with smooth transitions and persistent preference storage.',
                  tech: ['CSS Variables', 'LocalStorage', 'Tailwind']
                },
                {
                  title: 'Blog System',
                  description: 'MDX-powered blog with syntax highlighting, reading time, related posts, and SEO optimization.',
                  tech: ['MDX', 'next-mdx-remote', 'rehype']
                },
                {
                  title: 'Contact Form',
                  description: 'Serverless form handling with validation, rate limiting, and email notifications.',
                  tech: ['API Routes', 'Zod', 'Resend']
                },
                {
                  title: 'Responsive Design',
                  description: 'Mobile-first approach with fluid typography, adaptive layouts, and touch-friendly interactions.',
                  tech: ['Tailwind', 'CSS Grid', 'Flexbox']
                },
                {
                  title: 'Performance Optimized',
                  description: 'Image optimization, code splitting, font subsetting, and aggressive caching strategies.',
                  tech: ['Next/Image', 'Dynamic Imports', 'ISR']
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10">
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tech.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance */}
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              Performance Results
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { score: 100, label: 'Performance', color: 'bg-green-500' },
                { score: 100, label: 'Accessibility', color: 'bg-green-500' },
                { score: 100, label: 'Best Practices', color: 'bg-green-500' },
                { score: 100, label: 'SEO', color: 'bg-green-500' }
              ].map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full ${metric.color} flex items-center justify-center mb-2`}>
                    <span className="text-2xl font-bold text-white">{metric.score}</span>
                  </div>
                  <p className="text-sm text-foreground/70">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Optimization Techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Server-side rendering for initial page loads',
                  'Static generation for blog posts with ISR',
                  'Image optimization with next/image',
                  'Font subsetting and display swap',
                  'Code splitting with dynamic imports',
                  'Edge caching via Vercel CDN',
                  'Minimal JavaScript bundle size',
                  'CSS-in-JS with zero runtime (Tailwind)'
                ].map((technique, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{technique}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* CMS Demo */}
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-500" />
              Admin CMS Features
            </h2>
            
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <pre className="text-sm text-foreground/80 font-mono whitespace-pre overflow-x-auto">
{`Admin Dashboard Features
========================

📝 Article Management
   ├── Create/Edit with live preview
   ├── Markdown toolbar (bold, italic, code, links)
   ├── Auto-save every 30 seconds
   ├── Draft/Published workflow
   ├── Featured article toggle
   └── Reading time calculation

🖼️ Media Management
   ├── Drag & drop image upload
   ├── Automatic image optimization
   ├── Cover image positioning
   └── Storage via Supabase

🏷️ Organization
   ├── Tag management
   ├── Search & filter articles
   ├── Sort by date/status
   └── Quick stats dashboard

🔐 Security
   ├── Password-protected admin
   ├── API route authentication
   ├── Rate limiting
   └── Input sanitization`}
              </pre>
            </div>
          </Card>

          {/* Lessons Learned */}
          <Card className="p-8 mb-12 bg-transparent border-0">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-500" />
              Lessons Learned
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <h3 className="font-semibold text-green-400 mb-2">What Worked Well</h3>
                <ul className="space-y-2 text-foreground/80 text-sm">
                  <li>• Next.js App Router provides excellent DX and performance out of the box</li>
                  <li>• Supabase is perfect for MVPs - auth, database, and storage in one place</li>
                  <li>• Tailwind + Framer Motion combination enables rapid UI development</li>
                  <li>• Server Components reduce client-side JavaScript significantly</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <h3 className="font-semibold text-yellow-400 mb-2">Challenges Faced</h3>
                <ul className="space-y-2 text-foreground/80 text-sm">
                  <li>• MDX rendering quirks required careful content formatting</li>
                  <li>• Dark mode with CSS variables needed system color-scheme handling</li>
                  <li>• Image optimization strategy for user-uploaded content</li>
                  <li>• Balancing animations with performance on mobile devices</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <h3 className="font-semibold text-blue-400 mb-2">Future Improvements</h3>
                <ul className="space-y-2 text-foreground/80 text-sm">
                  <li>• Add view count analytics per article</li>
                  <li>• Implement newsletter subscription</li>
                  <li>• Add comment system for blog posts</li>
                  <li>• Create RSS feed for blog syndication</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Links */}
          <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Explore the Project</h2>
            
            <div className="flex flex-wrap gap-4">
              <a
                href={siteConfig.links.github + '/mycodingjourney'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <Github className="w-5 h-5" />
                View Source Code
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Visit Live Site
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border border-purple-500/50 hover:bg-purple-500/10 text-foreground rounded-lg font-medium transition-colors"
              >
                Read the Blog
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* Back to Case Studies */}
      <Section className="py-12 bg-background">
        <div className="container text-center">
          <Link
            href="/projects/case-studies"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Case Studies
          </Link>
        </div>
      </Section>
    </>
  )
}
