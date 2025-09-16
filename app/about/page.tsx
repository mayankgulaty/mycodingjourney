'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
    { category: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'Express.js', 'FastAPI', 'PostgreSQL', 'MongoDB'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code'] },
    { category: 'Mobile', items: ['React Native', 'Expo', 'Flutter', 'iOS', 'Android'] }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Senior Full-Stack Developer',
      company: 'Tech Company',
      description: 'Leading development of scalable web applications and mentoring junior developers.'
    },
    {
      year: '2022',
      title: 'Full-Stack Developer',
      company: 'Startup Inc',
      description: 'Built and maintained multiple web applications using modern technologies.'
    },
    {
      year: '2020',
      title: 'Frontend Developer',
      company: 'Digital Agency',
      description: 'Created responsive and interactive user interfaces for various clients.'
    },
    {
      year: '2018',
      title: 'Computer Science Degree',
      company: 'University',
      description: 'Graduated with a Bachelor\'s degree in Computer Science.'
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
                I&apos;m passionate about creating digital experiences that are not only functional 
                but also beautiful and intuitive. With over 5 years of experience in web development, 
                I&apos;ve had the opportunity to work with amazing teams and build products that impact 
                thousands of users.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Available for work</Badge>
                <Badge variant="outline">Open to collaboration</Badge>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/avatar.jpg"
                  alt={siteConfig.author.name}
                  fill
                  className="object-cover"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {skills.map((skillGroup, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card>
                  <h3 className="text-xl font-semibold mb-4">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm">
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
            <h2 className="text-4xl font-bold mb-4">My Journey</h2>
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

      {/* Values Section */}
      <Section className="bg-muted/50">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">What I Value</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide my work
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                title: 'Quality',
                description: 'I believe in writing clean, maintainable code and creating products that users love.',
                icon: '✨'
              },
              {
                title: 'Learning',
                description: 'Technology evolves rapidly, and I\'m always eager to learn new tools and techniques.',
                icon: '📚'
              },
              {
                title: 'Collaboration',
                description: 'Great products are built by great teams. I value open communication and teamwork.',
                icon: '🤝'
              }
            ].map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>
    </>
  )
}

