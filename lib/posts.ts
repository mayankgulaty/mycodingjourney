export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  content: string
  readingTime: string
}

// Static blog posts data
const postsData: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World - Welcome to My Coding Journey',
    excerpt: 'Welcome to my personal blog where I\'ll be sharing my coding journey, thoughts on web development, and the lessons I\'ve learned along the way.',
    date: '2024-01-15',
    author: 'Your Name',
    tags: ['welcome', 'introduction', 'blog'],
    content: `# Hello World - Welcome to My Coding Journey

Welcome to my personal blog! I'm excited to share my coding journey with you and document the lessons I learn along the way.

## Why I Started This Blog

After years of coding and building various projects, I realized that I had accumulated a wealth of knowledge and experiences that could be valuable to others. This blog is my way of:

- **Sharing knowledge** with the developer community
- **Documenting my learning process** for future reference
- **Connecting with like-minded developers** who share similar interests
- **Reflecting on my experiences** and the challenges I face

## What You Can Expect

In this blog, I'll be covering topics such as:

- **Web Development** - React, Next.js, TypeScript, and modern frontend technologies
- **Backend Development** - Node.js, Python, databases, and API design
- **Best Practices** - Code quality, testing, and development workflows
- **Career Insights** - Lessons learned from working in the tech industry
- **Project Walkthroughs** - Deep dives into interesting projects I've built

## My Coding Philosophy

I believe that great software is built through:

1. **Continuous Learning** - Technology evolves rapidly, and we must keep up
2. **Clean Code** - Writing code that's not just functional, but maintainable
3. **User-Centric Design** - Building products that solve real problems
4. **Collaboration** - Great software is built by great teams

## Let's Connect

I'd love to hear from you! Feel free to reach out through:

- [Email](mailto:hello@mycodingjourney.com)
- [GitHub](https://github.com/mycodingjourney)
- [LinkedIn](https://linkedin.com/in/mycodingjourney)

Thank you for joining me on this journey. I look forward to sharing more content with you soon!

---

*This is just the beginning. Stay tuned for more posts about web development, coding tips, and insights from my journey as a developer.*`,
    readingTime: '5 min read'
  },
  {
    slug: 'why-i-built-this',
    title: 'Why I Built This Website - A Developer\'s Perspective',
    excerpt: 'Exploring the reasons behind building a personal website as a developer, from showcasing skills to building a personal brand in the tech industry.',
    date: '2024-01-10',
    author: 'Your Name',
    tags: ['personal-brand', 'web-development', 'career', 'portfolio'],
    content: `# Why I Built This Website - A Developer's Perspective

As a developer, I've always believed that the best way to showcase your skills is through your work. That's exactly why I built this website - to create a space where I can demonstrate my abilities while sharing my journey with others.

## The Importance of a Personal Website

In today's digital world, having a personal website is more than just a nice-to-have; it's essential for developers who want to:

### 1. Showcase Your Skills
A personal website is the perfect platform to demonstrate your technical abilities. Instead of just telling people what you can do, you can show them through:

- **Live projects** that visitors can interact with
- **Code examples** that demonstrate your coding style
- **Technical blog posts** that showcase your knowledge
- **Case studies** that explain your problem-solving process

### 2. Build Your Personal Brand
Your website is your digital business card. It's where people go to learn more about you, your work, and your personality. A well-designed personal website helps you:

- **Stand out** from other developers
- **Tell your story** in your own words
- **Control your narrative** and how you're perceived
- **Build credibility** in your field

### 3. Document Your Journey
One of the most valuable aspects of having a personal website is the ability to document your learning journey. This includes:

- **Blog posts** about challenges you've overcome
- **Tutorials** that help others learn
- **Project retrospectives** that analyze what went well and what didn't
- **Career insights** that can benefit other developers

## The Technical Decisions

When building this website, I made several key technical decisions:

### Next.js 14 with App Router
I chose Next.js 14 because it offers:
- **Server-side rendering** for better SEO
- **Static site generation** for optimal performance
- **Built-in optimization** for images and fonts
- **Excellent developer experience** with TypeScript support

### TypeScript
TypeScript provides:
- **Type safety** that catches errors at compile time
- **Better IDE support** with autocomplete and refactoring
- **Self-documenting code** that's easier to maintain
- **Improved collaboration** when working with teams

### Tailwind CSS
For styling, I chose Tailwind CSS because it:
- **Speeds up development** with utility-first classes
- **Ensures consistency** across the design
- **Makes responsive design** easier to implement
- **Reduces CSS bundle size** through purging

### Framer Motion
For animations, I used Framer Motion to:
- **Create smooth transitions** between pages
- **Add engaging micro-interactions** that delight users
- **Implement scroll-triggered animations** that guide attention
- **Enhance the overall user experience**

## The Design Philosophy

The design of this website is based on several principles:

### Minimalism
I believe in the power of simplicity. A clean, uncluttered design:
- **Focuses attention** on the content
- **Improves readability** and user experience
- **Loads faster** with less visual noise
- **Works well** across different devices

### Accessibility
Accessibility is not optional - it's essential. This website:
- **Uses semantic HTML** for better screen reader support
- **Implements proper color contrast** for readability
- **Includes keyboard navigation** for all interactive elements
- **Follows WCAG guidelines** for inclusive design

### Performance
Performance directly impacts user experience. This website:
- **Optimizes images** for different screen sizes
- **Implements lazy loading** for better initial load times
- **Uses efficient animations** that don't block the main thread
- **Minimizes bundle size** through code splitting

## The Content Strategy

Content is what makes a personal website valuable. My content strategy includes:

### Technical Blog Posts
- **Tutorials** that teach specific skills
- **Case studies** that analyze real projects
- **Best practices** that I've learned over time
- **Tool reviews** that help others make informed decisions

### Project Showcases
- **Detailed project descriptions** with technical specifications
- **Live demos** that visitors can interact with
- **Code repositories** that others can learn from
- **Lessons learned** from each project

### Personal Insights
- **Career advice** based on my experiences
- **Industry observations** and trends
- **Learning resources** that have helped me grow
- **Mistakes and failures** that others can learn from

## The Future

This website is just the beginning. I plan to:

- **Regularly publish** new blog posts and tutorials
- **Add more interactive** projects and demos
- **Expand the content** to cover more topics
- **Improve the user experience** based on feedback
- **Build a community** around shared interests

## Conclusion

Building a personal website as a developer is one of the best investments you can make in your career. It's not just about showcasing your skills - it's about building your personal brand, documenting your journey, and contributing to the developer community.

If you're thinking about building your own website, I encourage you to start. You don't need to have everything figured out from the beginning. Start simple, iterate, and let it grow with you.

---

*What's your experience with personal websites? I'd love to hear your thoughts and learn from your journey. Feel free to reach out and share your story!*`,
    readingTime: '8 min read'
  },
  {
    slug: 'building-ai-design-tool-tutorial',
    title: 'Building an AI-Powered Design Tool: A Complete Tutorial',
    excerpt: 'Learn how to build a modern AI design tool with Next.js, TypeScript, and OpenAI API. Complete step-by-step guide with code examples and best practices.',
    date: '2024-01-20',
    author: 'Mayank',
    tags: ['tutorial', 'ai', 'nextjs', 'typescript', 'openai', 'design-tools'],
    content: `# Building an AI-Powered Design Tool: A Complete Tutorial

In this comprehensive tutorial, I'll walk you through building a modern AI-powered design tool from scratch. We'll create a full-stack application that generates logos, color palettes, and design suggestions using artificial intelligence.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Setting Up the Project](#setting-up-the-project)
4. [Building the UI Components](#building-the-ui-components)
5. [Integrating AI APIs](#integrating-ai-apis)
6. [Adding Advanced Features](#adding-advanced-features)
7. [Deployment](#deployment)
8. [Conclusion](#conclusion)

## Project Overview

Our AI Design Tool will feature:

- **Logo Generation**: AI-powered logo creation using text prompts
- **Color Palette Generator**: Smart color scheme suggestions
- **Design Suggestions**: AI-driven design tips and trends
- **Export Functionality**: Download generated designs
- **Modern UI**: Glassmorphism design with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **AI Integration**: OpenAI API (DALL-E, GPT-4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Custom CSS with glassmorphism effects

## Setting Up the Project

### 1. Initialize Next.js Project

\`\`\`bash
npx create-next-app@latest ai-design-tool --typescript --tailwind --eslint --app
cd ai-design-tool
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install framer-motion openai lucide-react clsx tailwind-merge
\`\`\`

### 3. Configure TailwindCSS

\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
\`\`\`

## Building the UI Components

### 1. Main Layout Component

\`\`\`tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Design Tool - Create Amazing Designs with AI',
  description: 'Generate logos, color palettes, and design suggestions using AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen gradient-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
\`\`\`

### 2. Logo Generator Component

\`\`\`tsx
// src/components/LogoGenerator.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Sparkles, Copy } from 'lucide-react'

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([])

  const generateLogo = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      // In production, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock generated logos
      const mockLogos = [
        'https://via.placeholder.com/400x400/6366f1/ffffff?text=Logo+1',
        'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Logo+2',
        'https://via.placeholder.com/400x400/06b6d4/ffffff?text=Logo+3',
        'https://via.placeholder.com/400x400/10b981/ffffff?text=Logo+4',
      ]
      
      setGeneratedLogos(mockLogos)
    } catch (error) {
      console.error('Error generating logo:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-yellow-400" />
          AI Logo Generator
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 font-medium">
              Describe your logo
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Modern tech company logo with geometric shapes"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <motion.button
            onClick={generateLogo}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Logo
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Generated Logos Display */}
      {generatedLogos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            Generated Logos ({generatedLogos.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedLogos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism p-6 rounded-2xl card-hover"
              >
                <div className="aspect-square bg-white/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={logo}
                    alt={\`Generated logo \${index + 1}\`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  onClick={() => downloadLogo(logo)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
\`\`\`

## Integrating AI APIs

### 1. OpenAI API Integration

\`\`\`tsx
// src/lib/openai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateLogo(prompt: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: \`Create a professional logo: \${prompt}\`,
      n: 4,
      size: "1024x1024",
      quality: "standard",
    })
    
    return response.data.map(img => img.url).filter(Boolean)
  } catch (error) {
    console.error('Error generating logo:', error)
    throw new Error('Failed to generate logo')
  }
}

export async function generateColorPalette(mood: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a color theory expert. Generate 5 complementary colors for the given mood or style. Return only hex codes separated by commas."
        },
        {
          role: "user",
          content: \`Generate a color palette for: \${mood}\`
        }
      ],
      max_tokens: 100,
    })
    
    const colors = response.choices[0].message.content?.split(',').map(c => c.trim()) || []
    return colors
  } catch (error) {
    console.error('Error generating color palette:', error)
    throw new Error('Failed to generate color palette')
  }
}
\`\`\`

### 2. API Route for Logo Generation

\`\`\`tsx
// src/app/api/generate-logo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateLogo } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }
    
    const logos = await generateLogo(prompt)
    
    return NextResponse.json({ logos })
  } catch (error) {
    console.error('Error in generate-logo API:', error)
    return NextResponse.json(
      { error: 'Failed to generate logo' },
      { status: 500 }
    )
  }
}
\`\`\`

## Adding Advanced Features

### 1. Color Palette Generator

\`\`\`tsx
// src/components/ColorPaletteGenerator.tsx
export default function ColorPaletteGenerator() {
  const [mood, setMood] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPalettes, setGeneratedPalettes] = useState<Array<{
    id: string
    colors: string[]
    name: string
  }>>([])

  const generatePalette = async () => {
    if (!mood.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      })
      
      const data = await response.json()
      setGeneratedPalettes(data.palettes)
    } catch (error) {
      console.error('Error generating palette:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  return (
    <div className="space-y-8">
      {/* Input and generation logic */}
      <motion.div className="glass-morphism p-8 rounded-2xl">
        {/* Component implementation */}
      </motion.div>
    </div>
  )
}
\`\`\`

### 2. Design Suggestions Component

\`\`\`tsx
// src/components/DesignSuggestions.tsx
export default function DesignSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState('trends')
  const [suggestions, setSuggestions] = useState([])

  const categories = [
    { id: 'trends', label: 'Design Trends', icon: TrendingUp },
    { id: 'colors', label: 'Color Theory', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout Tips', icon: Layout },
  ]

  const generateSuggestions = async (category: string) => {
    setSelectedCategory(category)
    
    try {
      const response = await fetch('/api/design-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })
      
      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Category selection and suggestions display */}
    </div>
  )
}
\`\`\`

## Styling with Glassmorphism

\`\`\`css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .gradient-bg {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
  
  .glass-morphism {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }
  
  .card-hover {
    @apply transition-all duration-300 hover:scale-105 hover:shadow-xl;
  }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
\`\`\`

## Deployment

### 1. Environment Variables

\`\`\`bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### 2. Vercel Deployment

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### 3. Vercel Configuration

\`\`\`json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "OPENAI_API_KEY": "@openai_api_key"
  }
}
\`\`\`

## Best Practices

### 1. Error Handling

Always implement proper error handling for API calls:

\`\`\`tsx
try {
  const response = await fetch('/api/generate-logo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate logo')
  }
  
  const data = await response.json()
  return data
} catch (error) {
  console.error('Error:', error)
  throw error
}
\`\`\`

### 2. Loading States

Implement loading states for better UX:

\`\`\`tsx
const [isGenerating, setIsGenerating] = useState(false)

// In your component
{isGenerating ? (
  <div className="flex items-center justify-center">
    <RefreshCw className="animate-spin" size={20} />
    <span className="ml-2">Generating...</span>
  </div>
) : (
  <button onClick={generateLogo}>
    Generate Logo
  </button>
)}
\`\`\`

### 3. Type Safety

Use TypeScript interfaces for better type safety:

\`\`\`tsx
interface GeneratedLogo {
  id: string
  url: string
  prompt: string
  createdAt: Date
}

interface ColorPalette {
  id: string
  name: string
  colors: string[]
  mood: string
}
\`\`\`

## Performance Optimization

### 1. Image Optimization

\`\`\`tsx
import Image from 'next/image'

<Image
  src={logo.url}
  alt="Generated logo"
  width={400}
  height={400}
  className="object-cover"
  priority={index < 2} // Prioritize first two images
/>
\`\`\`

### 2. Code Splitting

\`\`\`tsx
import dynamic from 'next/dynamic'

const LogoGenerator = dynamic(() => import('./LogoGenerator'), {
  loading: () => <div>Loading...</div>
})
\`\`\`

## Conclusion

Building an AI-powered design tool is an excellent way to showcase modern web development skills. This tutorial covered:

- Setting up a Next.js project with TypeScript
- Creating reusable UI components
- Integrating AI APIs (OpenAI)
- Implementing glassmorphism design
- Adding animations with Framer Motion
- Deploying to Vercel

The key to success is focusing on user experience, proper error handling, and clean, maintainable code. This project demonstrates skills in:

- **Frontend Development**: React, Next.js, TypeScript
- **AI Integration**: OpenAI API, prompt engineering
- **UI/UX Design**: Modern design patterns, animations
- **Full-Stack Development**: API routes, database integration
- **Deployment**: Vercel, environment configuration

## Next Steps

To extend this project further, consider adding:

- User authentication and saved designs
- More AI models (Stable Diffusion, Midjourney)
- Advanced export options (SVG, PDF)
- Real-time collaboration features
- Mobile app version

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

*This tutorial is part of my ongoing series on building modern web applications. Follow me for more tutorials and project breakdowns!*

**GitHub Repository**: [ai-design-tool](https://github.com/mayank/ai-design-tool)
**Live Demo**: [ai-design-tool.vercel.app](https://ai-design-tool.vercel.app)`,
    readingTime: '15 min read'
  }
]

export function getAllPosts(): Post[] {
  return postsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  return postsData.find(post => post.slug === slug) || null
}

export function getPostSlugs(): string[] {
  return postsData.map(post => post.slug)
}
