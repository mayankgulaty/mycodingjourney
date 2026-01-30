'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Route, MapPin, Clock, TrendingUp, BarChart3, Github, Zap, Target, AlertTriangle } from 'lucide-react'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export default function RouteOptimizationCaseStudy() {
  const routePerformance = [
    { route: '46A', avgDelay: -0.5, onTime: 78, status: 'excellent' },
    { route: '39A', avgDelay: 1.2, onTime: 72, status: 'good' },
    { route: '16', avgDelay: 2.8, onTime: 65, status: 'moderate' },
    { route: '77A', avgDelay: 4.1, onTime: 58, status: 'needs-improvement' },
    { route: '15', avgDelay: 5.6, onTime: 51, status: 'poor' },
  ]

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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white">
                <Route className="w-8 h-8" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Data Analysis</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Route Performance Analysis
                </h1>
              </div>
            </div>

            <p className="text-xl text-foreground/80 mb-8">
              Identifying the best and worst performing bus routes in Dublin through 
              comprehensive delay analysis and pattern recognition.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '198', label: 'Routes Analyzed', icon: <Route className="w-5 h-5" /> },
                { value: '27%', label: 'Performance Gap', icon: <TrendingUp className="w-5 h-5" /> },
                { value: '5', label: 'Key Bottlenecks', icon: <AlertTriangle className="w-5 h-5" /> },
                { value: '3', label: 'Optimization Wins', icon: <Target className="w-5 h-5" /> }
              ].map((metric, idx) => (
                <div 
                  key={idx}
                  className="text-center p-4 rounded-xl glass-morphism"
                >
                  <div className="text-blue-600 dark:text-blue-400 mb-2 flex justify-center">
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

      {/* Analysis */}
      <Section className="bg-background">
        <div className="container max-w-4xl">
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                Route Performance Ranking
              </h2>
              
              <p className="text-foreground/70 mb-6">
                Analysis of 198 bus routes across Dublin, ranked by on-time performance 
                and average delay times.
              </p>

              <div className="space-y-4">
                {routePerformance.map((route, idx) => (
                  <div 
                    key={route.route}
                    className={`p-4 rounded-lg border ${
                      route.status === 'excellent' ? 'bg-green-500/10 border-green-500/30' :
                      route.status === 'good' ? 'bg-blue-500/10 border-blue-500/30' :
                      route.status === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      route.status === 'needs-improvement' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-foreground/30">#{idx + 1}</span>
                        <div>
                          <span className="text-xl font-bold text-foreground">Route {route.route}</span>
                          <div className="text-sm text-foreground/60">
                            Avg Delay: {route.avgDelay > 0 ? '+' : ''}{route.avgDelay} min
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          route.onTime >= 70 ? 'text-green-500' :
                          route.onTime >= 60 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {route.onTime}%
                        </div>
                        <div className="text-sm text-foreground/60">On-Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-foreground/60 mt-4">
                * Showing top 5 and bottom 5 routes. Full analysis covers all 198 routes.
              </p>
            </Card>
          </motion.div>

          {/* Key Findings */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                Key Findings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                    🏆 Best Performers
                  </h3>
                  <ul className="space-y-1 text-foreground/70 text-sm">
                    <li>• Routes 46A, 39A maintain &gt;70% on-time</li>
                    <li>• Suburban routes generally perform better</li>
                    <li>• Off-peak hours show best performance</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    ⚠️ Problem Areas
                  </h3>
                  <ul className="space-y-1 text-foreground/70 text-sm">
                    <li>• City centre routes worst affected</li>
                    <li>• Rush hour (8-9am, 5-6pm) most delays</li>
                    <li>• Quays corridor is major bottleneck</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    📊 Patterns Discovered
                  </h3>
                  <ul className="space-y-1 text-foreground/70 text-sm">
                    <li>• Monday mornings worst for delays</li>
                    <li>• Weather correlation is weak (&lt;5%)</li>
                    <li>• School term affects specific routes</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                    💡 Recommendations
                  </h3>
                  <ul className="space-y-1 text-foreground/70 text-sm">
                    <li>• Add express services on worst routes</li>
                    <li>• Stagger school start times</li>
                    <li>• Real-time rerouting for bottlenecks</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Bottleneck Map */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <MapPin className="w-6 h-6 text-red-500" />
                Identified Bottlenecks
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
                <pre className="text-sm text-foreground/80 font-mono whitespace-pre overflow-x-auto">
{`                    DUBLIN BUS BOTTLENECK MAP
                    ========================

    Dublin Airport ←──────────────────────────────────→ Swords
           │                                              
           │ ◐ Minor delays                              
           │                                              
    Drumcondra ◐────────────────────────────────→ Howth
           │                                              
           │                                              
  ┌────────┼────────────────────────────────────────────┐
  │   ● ● ●│● ● CITY CENTRE CONGESTION ZONE ● ● ● ● ●  │
  │        │       ⬛ O'Connell Street ⬛                │
  │  Heuston ◐─────⬛────────────────⬛─────◐ Connolly  │
  │        │       ⬛   The Quays    ⬛                  │
  │        │● ● ● ●│● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │
  └────────┼───────┼────────────────────────────────────┘
           │       │                                      
     Tallaght ←────┼──────────────────────────→ Dun Laoghaire
                   │                                      
              ◐ Terenure                                  
                                                          
    Legend: ⬛ Severe delays  ◐ Moderate delays  ○ Minor`}
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">5</div>
                  <div className="text-xs text-foreground/60">Severe Bottlenecks</div>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">8</div>
                  <div className="text-xs text-foreground/60">Moderate Zones</div>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">85%</div>
                  <div className="text-xs text-foreground/60">Routes Affected</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeInUp}>
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Python', 'Pandas', 'GeoPandas', 'Folium', 'Plotly',
                  'GTFS-RT API', 'SQLite', 'Jupyter', 'Shapely'
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
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Related Case Studies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/projects/case-studies/dublin-bus-pipeline"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-foreground rounded-lg font-medium transition-colors border border-border"
            >
              Dublin Bus Pipeline →
            </Link>
            <Link
              href="/projects/case-studies/peak-hours-analysis"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-foreground rounded-lg font-medium transition-colors border border-border"
            >
              Peak Hours Analysis →
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
