'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { CodeBlock, Pre } from './code-block'
import { LivePlayground } from './live-playground'
import { Callout } from './callout'
import Image from 'next/image'
import Link from 'next/link'

// Custom components for MDX rendering
const components = {
    // Override default elements
    pre: Pre,

    // Custom code block that detects 'live' modifier
    code: (props: React.ComponentPropsWithoutRef<'code'> & { live?: boolean }) => {
        const { className, children, live, ...rest } = props
        const language = className?.replace('language-', '') || 'text'
        const code = typeof children === 'string' ? children.trim() : String(children || '')

        // If it's a live code block, render the playground
        if (live) {
            const playgroundLanguage =
                language === 'jsx' || language === 'react' ? 'react' :
                    language === 'tsx' ? 'react-ts' :
                        language === 'ts' || language === 'typescript' ? 'typescript' :
                            'javascript'

            return <LivePlayground code={code} language={playgroundLanguage} />
        }

        // Otherwise render inline code
        return (
            <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400" {...rest}>
                {children}
            </code>
        )
    },

    // Headings with anchor links
    h1: ({ children, ...props }: { children?: React.ReactNode }) => (
        <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props}>
            {children}
        </h1>
    ),
    h2: ({ children, ...props }: { children?: React.ReactNode }) => {
        const id = typeof children === 'string'
            ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
            : undefined
        return (
            <h2 id={id} className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white scroll-mt-20" {...props}>
                <a href={`#${id}`} className="group">
                    {children}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 text-purple-500">#</span>
                </a>
            </h2>
        )
    },
    h3: ({ children, ...props }: { children?: React.ReactNode }) => {
        const id = typeof children === 'string'
            ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
            : undefined
        return (
            <h3 id={id} className="text-2xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white scroll-mt-20" {...props}>
                <a href={`#${id}`} className="group">
                    {children}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 text-purple-500">#</span>
                </a>
            </h3>
        )
    },
    h4: ({ children, ...props }: { children?: React.ReactNode }) => (
        <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white" {...props}>
            {children}
        </h4>
    ),

    // Paragraphs
    p: ({ children, ...props }: { children?: React.ReactNode }) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
            {children}
        </p>
    ),

    // Lists
    ul: ({ children, ...props }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed" {...props}>
            {children}
        </li>
    ),

    // Links
    a: ({ href, children, ...props }: { href?: string; children?: React.ReactNode }) => {
        const isExternal = href?.startsWith('http')
        if (isExternal) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    {...props}
                >
                    {children}
                </a>
            )
        }
        return (
            <Link href={href || '#'} className="text-purple-600 dark:text-purple-400 hover:underline font-medium" {...props}>
                {children}
            </Link>
        )
    },

    // Blockquotes
    blockquote: ({ children, ...props }: { children?: React.ReactNode }) => (
        <blockquote
            className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 pl-4 py-3 my-4 italic text-gray-700 dark:text-gray-300 rounded-r-lg"
            {...props}
        >
            {children}
        </blockquote>
    ),

    // Horizontal rule
    hr: () => (
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
    ),

    // Tables
    table: ({ children, ...props }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }: { children?: React.ReactNode }) => (
        <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
            {children}
        </thead>
    ),
    th: ({ children, ...props }: { children?: React.ReactNode }) => (
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }: { children?: React.ReactNode }) => (
        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800" {...props}>
            {children}
        </td>
    ),

    // Images with Next.js optimization
    img: ({ src, alt, ...props }: { src?: string; alt?: string }) => {
        if (!src) return null

        // For external images or when we can't determine dimensions
        if (src.startsWith('http')) {
            return (
                <span className="block my-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt || ''}
                        className="rounded-lg max-w-full h-auto"
                        {...props}
                    />
                    {alt && (
                        <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                            {alt}
                        </span>
                    )}
                </span>
            )
        }

        return (
            <span className="block my-6">
                <Image
                    src={src}
                    alt={alt || ''}
                    width={800}
                    height={450}
                    className="rounded-lg"
                    {...props}
                />
                {alt && (
                    <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                        {alt}
                    </span>
                )}
            </span>
        )
    },

    // Strong and emphasis
    strong: ({ children, ...props }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
            {children}
        </strong>
    ),
    em: ({ children, ...props }: { children?: React.ReactNode }) => (
        <em className="italic" {...props}>
            {children}
        </em>
    ),

    // Custom components
    Callout,
    LivePlayground,
    CodeBlock,
}

interface MDXContentProps {
    source: MDXRemoteSerializeResult
}

export function MDXContent({ source }: MDXContentProps) {
    return (
        <div className="prose prose-lg max-w-none dark:prose-invert">
            <MDXRemote {...source} components={components} />
        </div>
    )
}

export { components as mdxComponents }
