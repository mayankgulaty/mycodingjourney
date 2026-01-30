'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Database, Globe, Layers, Layout, Terminal, Send, Github, Linkedin, Mail } from 'lucide-react'
import { Section } from '@/components/section'
import { InteractivePipeline } from '@/components/interactive-pipeline'
import { FloatingParticles, MultiLineTypewriter, TiltCard, RevealOnScroll } from '@/components/enhanced-animations'
import { siteConfig } from '@/lib/site'

export default function HomePage() {
  const skills = [
    { name: 'Python', icon: '🐍' },
    { name: 'Apache Spark', icon: '⚡' },
    { name: 'AWS', icon: '☁️' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Kubernetes', icon: '☸️' }
  ]

  const projects = [
    {
      title: 'Dublin Bus Real-Time Pipeline',
      description: 'Complete data pipeline tracking 700+ buses in real-time with interactive Streamlit dashboard.',
      tags: ['Python', 'GTFS-RT', 'Streamlit'],
      link: '/projects/case-studies/dublin-bus-pipeline',
      icon: <Database className="w-8 h-8 text-cyan-400" />
    },
    {
      title: 'Transit Delay Prediction',
      description: 'ML model predicting bus delays 15 minutes in advance with 87% accuracy using XGBoost.',
      tags: ['Python', 'XGBoost', 'ML'],
      link: '/projects/case-studies/transit-delay-prediction',
      icon: <Layers className="w-8 h-8 text-indigo-400" />
    },
    {
      title: 'This Portfolio Site',
      description: 'Modern full-stack web application with custom CMS, 100 Lighthouse score.',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      link: '/projects/case-studies/portfolio-website',
      icon: <Globe className="w-8 h-8 text-fuchsia-400" />
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <Section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border">
        <FloatingParticles />

        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-background to-background dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950 -z-10" />

        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 blur opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-border shadow-2xl">
                {/* Direct img tag as fallback/alternative if ProfilePhoto isn't imported yet, or we can use ProfilePhoto if imported */}
                <img src="/me.jpg" alt="Mayank" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-sm font-medium backdrop-blur-sm">
              Available for Data Engineering & Full-stack Roles
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-6 font-display"
          >
            I Build <span className="gradient-text">Scalable Systems</span>
          </motion.h1>

          <div className="h-20 mb-8 flex items-center justify-center">
            <MultiLineTypewriter
              lines={[
                "Data Engineer & Architect",
                "Full-Stack Developer",
                "Cloud Infrastructure Specialist"
              ]}
              speed={80}
              delay={2000}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Crafting robust data pipelines and interactive web experiences.
            Bridging the gap between complex backend logic and beautiful user interfaces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/projects" className="btn-primary group">
              View Projects
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="btn-secondary group">
              Contact Me
              <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform opacity-70" />
            </Link>
          </motion.div>

          {/* Social Proof / Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex gap-6 justify-center text-muted-foreground"
          >
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Github className="w-6 h-6" /></a>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Linkedin className="w-6 h-6" /></a>
            <a href={`mailto:${siteConfig.author.email}`} className="hover:text-blue-500 transition-colors"><Mail className="w-6 h-6" /></a>
          </motion.div>
        </div>
      </Section>

      {/* Skills Marquee */}
      <div className="border-y border-border bg-muted/50 backdrop-blur-sm py-8 overflow-hidden">
        <div className="container">
          <p className="text-center text-muted-foreground text-sm uppercase tracking-wider mb-6 font-semibold">Technologies I work with</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {skills.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="font-semibold text-foreground/80">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <Section className="bg-background relative">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="text-blue-500">Work</span></h2>
              <p className="text-muted-foreground max-w-xl text-lg">
                A selection of projects demonstrating my expertise in full-stack development and data engineering.
              </p>
            </div>
            <Link href="/projects" className="hidden md:flex items-center text-blue-500 hover:text-blue-400 transition-colors mt-6 md:mt-0">
              View all projects <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <RevealOnScroll key={idx} delay={idx * 0.1}>
                <TiltCard className="h-full">
                  <div className="glass-card h-full p-8 flex flex-col hover:border-blue-500/30 group">
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 w-fit group-hover:scale-110 transition-transform duration-500 border border-border">
                      {project.icon}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={project.link}
                      className="inline-flex items-center text-sm font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 group-hover:translate-x-2 transition-transform"
                    >
                      View Case Study <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/projects" className="btn-secondary">
              View All Projects
            </Link>
          </div>
        </div>
      </Section>

      {/* Interactive Pipeline Demo - "Innovative" Feature */}
      <Section className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Terminal className="w-3 h-3" /> Live Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Data Processing <span className="text-purple-500">Pipeline</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualizing the flow of data through a typical ETL process designed for high-availability systems.
            </p>
          </div>

          {/* Wrap the component to handle dark mode styles properly */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden p-6 backdrop-blur-sm shadow-xl">
            <InteractivePipeline />
          </div>
        </div>
      </Section>

      {/* Blog/Articles Snippet */}
      <Section className="py-24 bg-background">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
            <Code className="w-8 h-8 text-blue-500" />
            Latest from the Blog
          </h2>

          <div className="space-y-6">
            {[
              { title: "Scaling Next.js Applications on Vercel", date: "Oct 12, 2024", read: "5 min read", cat: "Engineering" },
              { title: "Optimizing Apache Spark Jobs for Cost", date: "Sep 28, 2024", read: "8 min read", cat: "Data" },
              { title: "Building a Design System with Tailwind CSS", date: "Sep 15, 2024", read: "6 min read", cat: "Design" }
            ].map((post, i) => (
              <Link href="/blog" key={i} className="block group">
                <article className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border transition-all cursor-pointer">
                  <div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span className="text-blue-500 font-medium">{post.cat}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">{post.title}</h3>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center text-sm text-muted-foreground gap-4">
                    <span>{post.read}</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Footer */}
      <Section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="container relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to <span className="gradient-text">Collaborate?</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            I am currently open to full-time opportunities and freelance projects. Let&apos;s build something extraordinary together.
          </p>
          <Link href="/contact" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/20">
            Get In Touch
          </Link>
        </div>
      </Section>
    </div>
  )
}