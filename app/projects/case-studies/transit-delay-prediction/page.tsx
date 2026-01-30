'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Brain, TrendingUp, Clock, Target, Zap, BarChart3, Github, AlertTriangle, CheckCircle } from 'lucide-react'
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

export default function DelayPredictionCaseStudy() {
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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Machine Learning</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Transit Delay Prediction
                </h1>
              </div>
            </div>

            <p className="text-xl text-foreground/80 mb-8">
              Using machine learning to predict bus delays before they happen, enabling 
              proactive passenger notifications and route optimization.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '87%', label: 'Prediction Accuracy', icon: <Target className="w-5 h-5" /> },
                { value: '15min', label: 'Advance Warning', icon: <Clock className="w-5 h-5" /> },
                { value: '100K+', label: 'Training Samples', icon: <BarChart3 className="w-5 h-5" /> },
                { value: '< 50ms', label: 'Inference Time', icon: <Zap className="w-5 h-5" /> }
              ].map((metric, idx) => (
                <div 
                  key={idx}
                  className="text-center p-4 rounded-xl glass-morphism"
                >
                  <div className="text-purple-600 dark:text-purple-400 mb-2 flex justify-center">
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

      {/* Problem Statement */}
      <Section className="bg-background">
        <div className="container max-w-4xl">
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                The Problem
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Passengers waiting at bus stops have no way to know if their bus will be delayed 
                  until it&apos;s already late. This leads to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Frustrated passengers standing in the rain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Missed connections and appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Lack of trust in public transit</span>
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>Question:</strong> Can we predict delays before they happen using 
                  historical patterns and real-time data?
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Approach */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-500" />
                ML Approach
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Feature Engineering</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Time of day',
                      'Day of week',
                      'Route ID',
                      'Direction',
                      'Current position',
                      'Recent delays',
                      'Stop sequence',
                      'Distance to stop',
                      'Historical avg'
                    ].map((feature, idx) => (
                      <div key={idx} className="px-3 py-2 bg-purple-500/10 rounded-lg text-sm text-foreground/80 border border-purple-500/20">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Model Architecture</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-foreground/80">
{`Input Features (9)
      │
      ▼
┌─────────────────────┐
│ Gradient Boosting   │  XGBoost / LightGBM
│ Regressor           │  
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Predicted Delay     │  (minutes)
│ + Confidence Score  │
└─────────────────────┘`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Why Gradient Boosting?</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Handles mixed feature types (categorical + numerical)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Captures non-linear relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Fast inference for real-time predictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Interpretable feature importance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Model Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">MAE (Mean Absolute Error)</span>
                      <span className="font-mono text-foreground">1.8 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">RMSE</span>
                      <span className="font-mono text-foreground">2.4 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">R² Score</span>
                      <span className="font-mono text-foreground">0.74</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Within ±3 min accuracy</span>
                      <span className="font-mono text-green-500">87%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Feature Importance</h4>
                  <div className="space-y-2">
                    {[
                      { feature: 'Recent delays (last 3 stops)', importance: 34 },
                      { feature: 'Time of day', importance: 22 },
                      { feature: 'Route historical avg', importance: 18 },
                      { feature: 'Day of week', importance: 12 },
                      { feature: 'Distance to stop', importance: 8 },
                      { feature: 'Other', importance: 6 }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground/70">{item.feature}</span>
                          <span className="text-foreground/70">{item.importance}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${item.importance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-foreground/70 text-sm">
                The model achieves 87% accuracy within ±3 minutes, making it reliable enough 
                for passenger notifications while leaving room for improvement with more data.
              </p>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'NumPy',
                  'GTFS-RT API', 'SQLite', 'Plotly', 'Jupyter'
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

          {/* Code Link */}
          <motion.div {...fadeInUp}>
            <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/20">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Explore the Code</h2>
              <p className="text-foreground/70 mb-6">
                Full implementation including feature engineering, model training, 
                and evaluation notebooks.
              </p>
              <a
                href="https://github.com/mayankgulaty/mycodingjourney/tree/main/projects/dublin-bus-pipeline"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Related */}
      <Section className="py-16 bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
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
              href="/projects/case-studies/route-optimization"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-foreground rounded-lg font-medium transition-colors border border-border"
            >
              Route Optimization →
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
