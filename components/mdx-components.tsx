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
    h1: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.h1
          className={`text-4xl font-bold mb-6 gradient-text ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.h1>
      )
    },
    h2: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.h2
          className={`text-3xl font-semibold mb-4 mt-8 ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.h2>
      )
    },
    h3: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.h3
          className={`text-2xl font-semibold mb-3 mt-6 ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.h3>
      )
    },
    p: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.p
          className={`mb-4 leading-relaxed text-muted-foreground ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.p>
      )
    },
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
    pre: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.pre
          className={`bg-muted p-4 rounded-lg overflow-x-auto mb-4 ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.pre>
      )
    },
    ul: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.ul
          className={`list-disc list-inside mb-4 space-y-2 ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.ul>
      )
    },
    ol: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.ol
          className={`list-decimal list-inside mb-4 space-y-2 ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.ol>
      )
    },
    li: ({ children, ...props }) => (
      <li className="text-muted-foreground" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => {
      const { className, ...restProps } = props
      return (
        <motion.blockquote
          className={`border-l-4 border-primary pl-4 italic text-muted-foreground mb-4 ${className || ''}`}
          {...motionProps}
          {...restProps}
        >
          {children}
        </motion.blockquote>
      )
    },
    ...components,
  }
}

