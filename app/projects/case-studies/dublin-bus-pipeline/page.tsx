'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Database, MapPin, Clock, TrendingUp, Bus, Wifi, BarChart3, Github, ExternalLink } from 'lucide-react'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { DublinBusDashboard } from '@/components/dublin-bus-dashboard'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export default function DublinBusPipelineCaseStudy() {
  return (
    <>
      {/* Hero */}
      <Section className="py-16 md:py-24 relative overflow-hidden gradient-bg">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/projects/case-studies"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Case Studies
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <Bus className="w-8 h-8" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Personal Project</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Dublin Bus Real-Time Pipeline
                </h1>
              </div>
            </div>

            <p className="text-xl text-foreground/80 mb-8">
              A complete data pipeline that collects, processes, and visualizes real-time bus data 
              from Transport for Ireland, tracking 600+ vehicles across Dublin.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '708', label: 'Vehicles Tracked', icon: <Bus className="w-5 h-5" /> },
                { value: '73K+', label: 'Delay Records', icon: <Wifi className="w-5 h-5" /> },
                { value: '71.2%', label: 'On-Time Rate', icon: <Clock className="w-5 h-5" /> },
                { value: '198', label: 'Routes Covered', icon: <MapPin className="w-5 h-5" /> }
              ].map((metric, idx) => (
                <div 
                  key={idx}
                  className="text-center p-4 rounded-xl glass-morphism"
                >
                  <div className="text-green-600 dark:text-green-400 mb-2 flex justify-center">
                    {metric.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Problem */}
      <Section className="bg-background">
        <div className="container max-w-4xl">
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-500" />
                The Project
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Transport for Ireland provides a rich GTFS-Realtime API with live positions and 
                  delay data for all public transit in Ireland. This project builds a complete 
                  data pipeline to collect, store, and analyze this data.
                </p>
                <h3 className="font-semibold text-foreground mt-6 mb-3">Goals:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Ingest real-time vehicle positions from GTFS-RT API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Store data efficiently for historical analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Create interactive visualizations (maps, charts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Analyze delay patterns across routes</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* Architecture */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                Architecture
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8 overflow-x-auto">
                <pre className="text-sm text-foreground/80 font-mono whitespace-pre">
{`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   TFI API       │────▶│  Data Collector │────▶│   SQLite DB     │
│  (GTFS-RT)      │     │   (Python)      │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        Endpoints:                       ▼
                        • /Vehicles                ┌─────────────────┐
                        • /TripUpdates             │  Jupyter        │
                                                   │  Analysis       │
                                                   └────────┬────────┘
                                                            │
                                    ┌───────────────────────┼───────────────────┐
                                    ▼                       ▼                   ▼
                              ┌──────────┐           ┌──────────┐       ┌──────────┐
                              │ Live Map │           │  Delay   │       │  Route   │
                              │ (Folium) │           │ Analysis │       │  Stats   │
                              └──────────┘           └──────────┘       └──────────┘`}
                </pre>
              </div>

              <h3 className="font-semibold text-foreground mb-4">Data Model</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                  <h4 className="font-semibold text-foreground mb-2">Vehicle Positions</h4>
                  <p className="text-sm text-foreground/70">
                    GPS coordinates, vehicle ID, route ID, trip ID, timestamp, direction
                  </p>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                  <h4 className="font-semibold text-foreground mb-2">Trip Updates</h4>
                  <p className="text-sm text-foreground/70">
                    Arrival/departure delays, stop ID, trip ID, timestamp
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Interactive Dashboard */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12 bg-transparent border-0">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-green-500" />
                Live Dashboard Preview
              </h2>
              <DublinBusDashboard />
            </Card>
          </motion.div>

          {/* Visualizations */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <MapPin className="w-6 h-6 text-red-500" />
                Visualization Gallery
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="text-3xl mb-3">🗺️</div>
                  <h3 className="font-semibold text-foreground mb-2">Live Bus Map</h3>
                  <p className="text-foreground/70 text-sm">
                    Interactive Plotly map with 708 buses plotted in real-time. 
                    Dark mode with marker clustering for dense areas.
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20">
                  <div className="text-3xl mb-3">🔥</div>
                  <h3 className="font-semibold text-foreground mb-2">Density Heatmap</h3>
                  <p className="text-foreground/70 text-sm">
                    Heatmap showing bus concentration. Dublin City Centre (O&apos;Connell Street) 
                    clearly visible as the hotspot.
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold text-foreground mb-2">Delay Distribution</h3>
                  <p className="text-foreground/70 text-sm">
                    Histogram showing 71.2% on-time performance, with only 2% 
                    experiencing severe delays (&gt;15 min).
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold text-foreground mb-2">Performance Gauge</h3>
                  <p className="text-foreground/70 text-sm">
                    Real-time gauge showing on-time performance against 
                    industry benchmark of 80%.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Key Features */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Technical Highlights
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Efficient API Integration', detail: 'Handles GTFS-RT protocol with proper error handling and rate limiting' },
                  { title: 'Indexed SQLite Storage', detail: 'Optimized schema with indexes for fast time-series queries' },
                  { title: 'Incremental Collection', detail: 'Configurable polling intervals with state management' },
                  { title: 'Interactive Visualizations', detail: 'Folium maps with marker clustering, Plotly dashboards' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                    <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-foreground/70">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Python', 'Pandas', 'SQLite', 'GTFS-Realtime',
                  'Folium', 'Plotly', 'Jupyter', 'Requests'
                ].map((tech) => (
                  <Badge 
                    key={tech}
                    variant="secondary"
                    className="text-sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Links */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <h2 className="text-2xl font-bold mb-4 text-foreground">View the Code</h2>
              <p className="text-foreground/70 mb-6">
                The full source code, including data collector, analysis notebooks, and 
                documentation is available on GitHub.
              </p>
              <a
                href="https://github.com/mayankgulaty/mycodingjourney/tree/main/projects/dublin-bus-pipeline"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Want to see more data projects?
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Check out my other case studies showcasing enterprise-scale data engineering work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects/case-studies/enterprise-data-platform"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Enterprise Data Platform
            </Link>
            <Link
              href="/projects/case-studies"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-foreground rounded-lg font-medium transition-colors border border-border"
            >
              All Case Studies
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
