'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Download, MapPin, Briefcase } from 'lucide-react'
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

export default function AboutPage() {
  const skills = [
    { category: 'Languages', items: ['Python', 'SQL', 'Advanced SQL'] },
    { category: 'Cloud', items: ['AWS (S3, Glue, Lambda, EMR)', 'Snowflake', 'Redshift'] },
    { category: 'Big Data', items: ['Apache Spark (PySpark)', 'Hadoop', 'ETL Pipeline Design'] },
    { category: 'Tools', items: ['Apache Airflow', 'Git', 'CI/CD', 'Docker', 'Jira'] },
    { category: 'Governance', items: ['Data Lineage', 'Data Quality Frameworks', 'Compliance'] }
  ]

  const timeline = [
    {
      year: '01/2022 – Present',
      title: 'Assistant Vice President, Data Engineer',
      company: 'Citi | Dublin, Ireland',
      description: 'Leading strategic migration of legacy DWH to AWS and Snowflake. Orchestrating complex ETL workflows and establishing data governance frameworks.'
    },
    {
      year: '02/2021 – 01/2022',
      title: 'Apps Dev Intermediate Programmer Analyst',
      company: 'Citi | Dublin, Ireland',
      description: 'Spearheaded integration of modern cloud technologies and led cross-functional development projects ensuring high code quality.'
    },
    {
      year: '01/2017 – 02/2021',
      title: 'Apps Dev Programmer Analyst',
      company: 'Citi | Dublin, Ireland',
      description: 'Developed robust core software applications, refactored codebases for efficiency, and resolved critical technical issues.'
    },
    {
      year: '08/2015 – 11/2015',
      title: 'Junior Associate, Technology',
      company: 'Nagarro | Gurugram, India',
      description: 'Provided troubleshooting for enterprise projects and collaborated on rapid prototyping initiatives.'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl font-bold mb-6">
                About{' '}
                <span className="gradient-text">Me</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {siteConfig.author.bio}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                I&apos;m an experienced Data Engineer and Assistant Vice President with over 9 years of expertise in designing scalable data architectures and cloud solutions. I specialize in migrating legacy systems to modern cloud platforms like AWS and Snowflake, and building robust ETL pipelines.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Available for opportunities
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Open to Remote & Relocation
                </Badge>
              </div>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/me.jpg"
                  alt={siteConfig.author.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 30%' }}
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary rounded-full opacity-20"></div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section className="bg-muted/50">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">Skills & Technologies</h2>
            <p className="text-lg text-muted-foreground">
              Technologies and tools I work with
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {skills.map((skillGroup, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 text-primary">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section>
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
            <p className="text-lg text-muted-foreground">
              A timeline of my professional experience
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-8 pb-8 last:pb-0"
                variants={fadeInUp}
              >
                <div className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full"></div>
                <div className="absolute left-2 top-4 w-0.5 h-full bg-border"></div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{item.company}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Education Section */}
      <Section className="bg-muted/50">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">Education</h2>
            <p className="text-lg text-muted-foreground">
              Academic background
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">MSc in Data Analytics</h3>
                  <p className="text-muted-foreground mb-1">National College of Ireland</p>
                  <p className="text-sm text-muted-foreground/80 mb-4">01/2016 – 01/2017</p>
                </div>
                <Badge variant="outline" className="self-start border-emerald-500/30 text-emerald-500">First Class Honors</Badge>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">B.Tech in Computer Science</h3>
                  <p className="text-muted-foreground mb-1">UPES</p>
                  <p className="text-sm text-muted-foreground/80 mb-4">01/2011 – 01/2015</p>
                </div>
                <Badge variant="outline" className="self-start">Open Source Specialization</Badge>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Certifications Section */}
      <Section>
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">Certifications</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              "Snowflake: Hands On Essentials - Data Warehouse, Data Applications, Data Sharing",
              "AWS: Machine Learning Foundations",
              "Udacity: AI Programming with Python Nanodegree",
              "SQL: Writing Advanced SQL Queries"
            ].map((cert, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="py-4 px-6 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{cert}</span>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>
    </>
  )
}
