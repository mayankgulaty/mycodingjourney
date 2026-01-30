'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Clock, Users, CheckCircle, Bus, Brain, Route } from 'lucide-react'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'

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

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: 'dublin-bus-pipeline',
      title: 'Dublin Bus Real-Time Pipeline',
      subtitle: 'Live Transit Data Collection & Analysis',
      description: 'A complete data pipeline collecting real-time bus positions and delays from Transport for Ireland, with an interactive Streamlit dashboard.',
      icon: <Bus className="w-8 h-8" />,
      metrics: [
        { value: '708', label: 'Vehicles Tracked' },
        { value: '100K+', label: 'Data Points' },
        { value: '71.2%', label: 'On-Time Rate' },
        { value: '198', label: 'Routes' }
      ],
      tags: ['Python', 'GTFS-RT', 'SQLite', 'Pandas', 'Streamlit', 'Plotly'],
      status: 'Live',
      duration: '1 day',
      team: 'Solo project'
    },
    {
      id: 'transit-delay-prediction',
      title: 'Transit Delay Prediction',
      subtitle: 'ML-Powered Delay Forecasting',
      description: 'Machine learning model that predicts bus delays 15 minutes in advance with 87% accuracy, enabling proactive passenger notifications.',
      icon: <Brain className="w-8 h-8" />,
      metrics: [
        { value: '87%', label: 'Accuracy' },
        { value: '15min', label: 'Advance Warning' },
        { value: '100K+', label: 'Training Samples' },
        { value: '<50ms', label: 'Inference' }
      ],
      tags: ['Python', 'XGBoost', 'Scikit-learn', 'Pandas', 'GTFS-RT'],
      status: 'Prototype',
      duration: '1 day',
      team: 'Solo project'
    },
    {
      id: 'route-optimization',
      title: 'Route Performance Analysis',
      subtitle: 'Identifying Best & Worst Routes',
      description: 'Comprehensive analysis of 198 bus routes in Dublin, identifying bottlenecks and providing optimization recommendations.',
      icon: <Route className="w-8 h-8" />,
      metrics: [
        { value: '198', label: 'Routes Analyzed' },
        { value: '27%', label: 'Performance Gap' },
        { value: '5', label: 'Key Bottlenecks' },
        { value: '3', label: 'Quick Wins' }
      ],
      tags: ['Python', 'Pandas', 'GeoPandas', 'Folium', 'Data Analysis'],
      status: 'Complete',
      duration: '1 day',
      team: 'Solo project'
    },
    {
      id: 'peak-hours-analysis',
      title: 'Peak Hours Analysis',
      subtitle: 'Temporal Pattern Discovery',
      description: 'Time-series analysis revealing when Dublin buses are most delayed, helping commuters optimize their travel times.',
      icon: <Clock className="w-8 h-8" />,
      metrics: [
        { value: '8-9am', label: 'Worst Hour' },
        { value: '5.2min', label: 'Peak Delay' },
        { value: 'Monday', label: 'Worst Day' },
        { value: '70%', label: 'Reduction Possible' }
      ],
      tags: ['Python', 'Pandas', 'Plotly', 'Time Series', 'Statistics'],
      status: 'Complete',
      duration: '1 day',
      team: 'Solo project'
    },
    {
      id: 'portfolio-website',
      title: 'Full-Stack Portfolio Platform',
      subtitle: 'Modern Web Application with CMS',
      description: 'Built a high-performance portfolio website with custom CMS, demonstrating full-stack capabilities alongside data engineering expertise.',
      icon: <Code className="w-8 h-8" />,
      metrics: [
        { value: '100', label: 'Lighthouse Score' },
        { value: '<1s', label: 'Load Time' },
        { value: 'SSR', label: 'Server Rendering' },
        { value: 'A+', label: 'SEO Grade' }
      ],
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel'],
      status: 'Live',
      duration: '2 weeks',
      team: 'Solo project'
    }
  ]

  return (
    <>
      {/* Hero */}
      <Section className="py-16 md:py-24 relative overflow-hidden gradient-bg">
        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
              variants={fadeInUp}
            >
              Case <span className="text-shimmer">Studies</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-foreground/80 mb-8"
              variants={fadeInUp}
            >
              Deep dives into projects I&apos;ve built, including architecture decisions, 
              challenges overcome, and measurable business impact.
            </motion.p>
          </motion.div>
        </div>
      </Section>

      {/* Case Studies List */}
      <Section className="bg-background">
        <div className="container">
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden glass-morphism border-white/20 hover:border-purple-500/30 dark:border-white/20 dark:hover:border-purple-500/30 border-gray-200 hover:border-purple-300 dark:bg-white/5 bg-white/80 transition-all duration-500">
                  <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Project Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white">
                            {study.icon}
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                              {study.title}
                            </h2>
                            <p className="text-lg text-foreground/60">
                              {study.subtitle}
                            </p>
                          </div>
                        </div>

                        <p className="text-foreground/80 text-lg mb-6 leading-relaxed">
                          {study.description}
                        </p>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          {study.metrics.map((metric, idx) => (
                            <div 
                              key={idx}
                              className="text-center p-4 rounded-xl bg-purple-500/5 border border-purple-500/10"
                            >
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                                {metric.value}
                              </div>
                              <div className="text-xs text-foreground/60 uppercase tracking-wider">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {study.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline"
                              className="text-xs border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Right: Meta Info */}
                      <div className="lg:border-l lg:border-border lg:pl-8">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm text-foreground/60">Status</p>
                              <p className="font-semibold text-foreground">{study.status}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="text-sm text-foreground/60">Duration</p>
                              <p className="font-semibold text-foreground">{study.duration}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-purple-500" />
                            <div>
                              <p className="text-sm text-foreground/60">Team Size</p>
                              <p className="font-semibold text-foreground">{study.team}</p>
                            </div>
                          </div>

                          <Link
                            href={`/projects/case-studies/${study.id}`}
                            className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors mt-4"
                          >
                            Read Full Case Study
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Want to discuss a similar project?
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            I&apos;m always excited to tackle challenging data engineering and full-stack problems.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </>
  )
}
