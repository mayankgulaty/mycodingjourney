import type { MDXComponents } from 'mdx/types'
import { motion } from 'framer-motion'

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <motion.h1
        className="text-4xl font-bold mb-6 gradient-text"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children, ...props }) => (
      <motion.h2
        className="text-3xl font-semibold mb-4 mt-8"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.h2>
    ),
    h3: ({ children, ...props }) => (
      <motion.h3
        className="text-2xl font-semibold mb-3 mt-6"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.h3>
    ),
    p: ({ children, ...props }) => (
      <motion.p
        className="mb-4 leading-relaxed text-muted-foreground"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.p>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-primary hover:underline font-medium"
        {...props}
      >
        {children}
      </a>
    ),
    code: ({ children, ...props }) => (
      <code
        className="bg-muted px-2 py-1 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <motion.pre
        className="bg-muted p-4 rounded-lg overflow-x-auto mb-4"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.pre>
    ),
    ul: ({ children, ...props }) => (
      <motion.ul
        className="list-disc list-inside mb-4 space-y-2"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.ul>
    ),
    ol: ({ children, ...props }) => (
      <motion.ol
        className="list-decimal list-inside mb-4 space-y-2"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-muted-foreground" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <motion.blockquote
        className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4"
        {...motionProps}
        {...props}
      >
        {children}
      </motion.blockquote>
    ),
    ...components,
  }
}

