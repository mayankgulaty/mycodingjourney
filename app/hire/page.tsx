'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Download, 
  Mail, 
  Linkedin, 
  Github,
  Clock,
  Globe,
  Building,
  Code,
  Database,
  Cloud
} from 'lucide-react'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { siteConfig } from '@/lib/site'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
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

export default function HireMePage() {
  const preferredRoles = [
    {
      title: 'Senior Data Engineer',
      icon: <Database className="w-6 h-6" />,
      description: 'Building scalable data pipelines, ETL systems, and data platforms',
      skills: ['Apache Spark', 'Kafka', 'Airflow', 'AWS/GCP', 'Python', 'SQL']
    },
    {
      title: 'Staff/Principal Engineer',
      icon: <Building className="w-6 h-6" />,
      description: 'Technical leadership, architecture decisions, and team mentoring',
      skills: ['System Design', 'Technical Strategy', 'Cross-team Collaboration']
    },
    {
      title: 'Full-Stack Developer',
      icon: <Code className="w-6 h-6" />,
      description: 'End-to-end web application development with modern technologies',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL']
    },
    {
      title: 'Cloud Data Architect',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Designing cloud-native data architectures and migrations',
      skills: ['AWS', 'Snowflake', 'Terraform', 'Data Governance']
    }
  ]

  const workPreferences = [
    { icon: <Globe className="w-5 h-5" />, label: 'Remote-friendly', detail: 'Open to fully remote or hybrid arrangements' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location flexible', detail: 'Based in Ireland, open to relocation for the right opportunity' },
    { icon: <Clock className="w-5 h-5" />, label: 'Full-time preferred', detail: 'Also open to contract roles (6+ months)' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Available soon', detail: 'Can start within 4-6 weeks notice period' }
  ]

  const whatIBring = [
    '8+ years of hands-on experience in data engineering and software development',
    'Proven track record migrating legacy systems to modern cloud architectures',
    'Experience at Fortune 500 companies (Citi) with enterprise-scale systems',
    'Rare combination of data engineering depth + full-stack development skills',
    'Strong communication skills - can translate technical concepts for stakeholders',
    'Self-starter who thrives in ambiguous situations'
  ]

  const idealCompany = [
    'Values engineering excellence and invests in technical infrastructure',
    'Solves interesting problems with data at scale',
    'Has a culture of continuous learning and growth',
    'Supports work-life balance and flexible work arrangements',
    'Makes a positive impact (fintech, healthcare, climate tech, or similar)'
  ]

  return (
    <>
      {/* Hero */}
      <Section className="py-16 md:py-24 relative overflow-hidden gradient-bg">
        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
                Available for opportunities
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
              variants={fadeInUp}
            >
              Let&apos;s Work <span className="text-shimmer">Together</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-foreground/80 mb-8"
              variants={fadeInUp}
            >
              I&apos;m actively looking for my next challenge. Here&apos;s everything you need to know 
              about working with me.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${siteConfig.author.email}?subject=Job Opportunity`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Me
              </a>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-foreground rounded-lg font-medium transition-colors border border-border"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Quick Info */}
      <Section className="bg-background py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workPreferences.map((pref, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center glass-morphism">
                  <div className="text-purple-600 dark:text-purple-400 mb-3 flex justify-center">
                    {pref.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{pref.label}</h3>
                  <p className="text-sm text-foreground/60">{pref.detail}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Preferred Roles */}
      <Section className="bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Roles I&apos;m Looking For
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              I&apos;m most effective in these types of positions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preferredRoles.map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full glass-morphism hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{role.title}</h3>
                      <p className="text-foreground/70 mb-4">{role.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {role.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* What I Bring */}
      <Section className="bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                What I Bring to the Table
              </h2>
              <div className="space-y-4">
                {whatIBring.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                My Ideal Company
              </h2>
              <div className="space-y-4">
                {idealCompany.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Connect */}
      <Section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Connect?
            </h2>
            <p className="text-xl text-foreground/70 mb-8">
              The best way to reach me is via email or LinkedIn. I typically respond within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={`mailto:${siteConfig.author.email}?subject=Job Opportunity`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                {siteConfig.author.email}
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn Profile
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>

            <p className="text-sm text-foreground/60">
              Recruiters and hiring managers: Feel free to reach out! I&apos;m always happy to chat 
              about interesting opportunities.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Quick Links */}
      <Section className="bg-background py-12">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about" className="text-foreground/60 hover:text-foreground transition-colors">
              About Me →
            </Link>
            <Link href="/projects/case-studies" className="text-foreground/60 hover:text-foreground transition-colors">
              Case Studies →
            </Link>
            <Link href="/blog" className="text-foreground/60 hover:text-foreground transition-colors">
              Technical Blog →
            </Link>
            <a href="/resume.pdf" download className="text-foreground/60 hover:text-foreground transition-colors">
              Download Resume →
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}
