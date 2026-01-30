'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Sun, Moon, TrendingUp, BarChart3, Github, Calendar, Users } from 'lucide-react'
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

export default function PeakHoursAnalysisCaseStudy() {
  const hourlyData = [
    { hour: '6am', vehicles: 120, delay: 0.5, color: 'bg-green-500' },
    { hour: '7am', vehicles: 380, delay: 1.2, color: 'bg-green-500' },
    { hour: '8am', vehicles: 650, delay: 4.8, color: 'bg-red-500' },
    { hour: '9am', vehicles: 580, delay: 3.2, color: 'bg-orange-500' },
    { hour: '10am', vehicles: 420, delay: 1.5, color: 'bg-yellow-500' },
    { hour: '11am', vehicles: 380, delay: 1.0, color: 'bg-green-500' },
    { hour: '12pm', vehicles: 400, delay: 1.2, color: 'bg-green-500' },
    { hour: '1pm', vehicles: 420, delay: 1.4, color: 'bg-yellow-500' },
    { hour: '2pm', vehicles: 400, delay: 1.1, color: 'bg-green-500' },
    { hour: '3pm', vehicles: 450, delay: 1.8, color: 'bg-yellow-500' },
    { hour: '4pm', vehicles: 520, delay: 2.5, color: 'bg-yellow-500' },
    { hour: '5pm', vehicles: 680, delay: 5.2, color: 'bg-red-500' },
    { hour: '6pm', vehicles: 620, delay: 4.1, color: 'bg-red-500' },
    { hour: '7pm', vehicles: 450, delay: 2.0, color: 'bg-yellow-500' },
    { hour: '8pm', vehicles: 320, delay: 0.8, color: 'bg-green-500' },
    { hour: '9pm', vehicles: 220, delay: 0.4, color: 'bg-green-500' },
  ]

  const dailyPattern = [
    { day: 'Monday', avgDelay: 2.8, status: 'worst' },
    { day: 'Tuesday', avgDelay: 2.1, status: 'moderate' },
    { day: 'Wednesday', avgDelay: 2.0, status: 'moderate' },
    { day: 'Thursday', avgDelay: 2.2, status: 'moderate' },
    { day: 'Friday', avgDelay: 2.5, status: 'moderate' },
    { day: 'Saturday', avgDelay: 1.2, status: 'best' },
    { day: 'Sunday', avgDelay: 0.8, status: 'best' },
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
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Time Series Analysis</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Peak Hours Analysis
                </h1>
              </div>
            </div>

            <p className="text-xl text-foreground/80 mb-8">
              Uncovering temporal patterns in Dublin&apos;s bus network - when are delays 
              worst, and how can commuters optimize their travel times?
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '8-9am', label: 'Worst Hour', icon: <Sun className="w-5 h-5" /> },
                { value: '5.2min', label: 'Peak Delay', icon: <Clock className="w-5 h-5" /> },
                { value: 'Monday', label: 'Worst Day', icon: <Calendar className="w-5 h-5" /> },
                { value: '680', label: 'Peak Buses', icon: <Users className="w-5 h-5" /> }
              ].map((metric, idx) => (
                <div 
                  key={idx}
                  className="text-center p-4 rounded-xl glass-morphism"
                >
                  <div className="text-orange-600 dark:text-orange-400 mb-2 flex justify-center">
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

      {/* Hourly Analysis */}
      <Section className="bg-background">
        <div className="container max-w-4xl">
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Sun className="w-6 h-6 text-orange-500" />
                Hourly Delay Pattern
              </h2>
              
              <p className="text-foreground/70 mb-6">
                Average delays by hour of day, showing clear morning and evening rush hour peaks.
              </p>

              {/* Visual Timeline */}
              <div className="relative mb-8">
                <div className="flex items-end justify-between h-40 gap-1">
                  {hourlyData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full ${data.color} rounded-t-sm transition-all hover:opacity-80`}
                        style={{ height: `${(data.delay / 5.5) * 100}%`, minHeight: '4px' }}
                        title={`${data.hour}: ${data.delay} min delay`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-foreground/60">
                  <span>6am</span>
                  <span>9am</span>
                  <span>12pm</span>
                  <span>3pm</span>
                  <span>6pm</span>
                  <span>9pm</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-foreground/70">&lt; 1.5 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-foreground/70">1.5-3 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-foreground/70">3-4 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-foreground/70">&gt; 4 min</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Daily Pattern */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                Day of Week Pattern
              </h2>

              <div className="space-y-3">
                {dailyPattern.map((day) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-foreground">{day.day}</div>
                    <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full flex items-center justify-end pr-3 ${
                          day.status === 'worst' ? 'bg-red-500' :
                          day.status === 'best' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${(day.avgDelay / 3) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">{day.avgDelay} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-foreground mb-2">💡 Key Insight</h4>
                <p className="text-sm text-foreground/70">
                  Monday mornings show 40% higher delays than the weekly average, likely due to 
                  &quot;weekend spillover&quot; effect and increased traffic from people returning to work.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Commuter Recommendations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">✅ Best Times to Travel</h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li>• Before 7:30am or after 9:30am (morning)</li>
                    <li>• Before 4:30pm or after 7:00pm (evening)</li>
                    <li>• Weekends show 60% fewer delays</li>
                    <li>• Wednesday is best weekday overall</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">⚠️ Times to Avoid</h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li>• 8:00-9:00am (worst morning hour)</li>
                    <li>• 5:00-6:00pm (worst evening hour)</li>
                    <li>• Monday mornings especially</li>
                    <li>• School start/end times on school routes</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-foreground/70">
                  <strong>Pro tip:</strong> Leaving just 15 minutes earlier in the morning 
                  can reduce your expected delay by up to 70%.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeInUp}>
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Python', 'Pandas', 'NumPy', 'Plotly', 'Seaborn',
                  'GTFS-RT API', 'SQLite', 'Jupyter', 'Statsmodels'
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

      {/* Related */}
      <Section className="py-16 bg-gradient-to-r from-orange-500/10 to-amber-500/10">
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
              href="/projects/case-studies/transit-delay-prediction"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-foreground rounded-lg font-medium transition-colors border border-border"
            >
              Delay Prediction →
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
