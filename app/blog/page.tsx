'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/section'
import { Card } from '@/components/card'
import { Badge } from '@/components/badge'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-[60vh] flex items-center">
        <div className="container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
              variants={fadeInUp}
            >
              My{' '}
              <span className="text-shimmer">Blog</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-white/70 mb-8"
              variants={fadeInUp}
            >
              Thoughts, tutorials, and insights from my coding journey
            </motion.p>
          </motion.div>
        </div>
      </Section>

      {/* Blog Posts */}
      <Section>
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Latest Posts</h2>
            <p className="text-lg text-gray-600 dark:text-white/70">
              {posts.length} article{posts.length !== 1 ? 's' : ''} published
            </p>
          </motion.div>
          
          {posts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold mb-4">No posts yet</h3>
              <p className="text-muted-foreground">
                I'm working on some great content. Check back soon!
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              {posts.map((post, index) => (
                <motion.div key={post.slug} variants={fadeInUp}>
                  <Card className="h-full glass-morphism border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 border-gray-200 hover:border-gray-300 dark:bg-white/5 bg-white/80 dark:backdrop-blur-md backdrop-blur-sm transition-all duration-500 hover:scale-105">
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70 mb-3">
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-white/70 mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 dark:border-white/30 dark:text-white/80">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-white/80 font-medium group"
                      >
                        Read More
                        <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* Newsletter Signup */}
      <Section className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
            <p className="text-lg text-gray-600 dark:text-white/70 mb-8">
              Get notified when I publish new articles and insights about web development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-white/30 bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Subscribe
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-white/70 mt-4">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
