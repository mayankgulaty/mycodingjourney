import type { ReactNode } from 'react'
import Markdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import { articleRemarkPlugins, segmentArticle, type CalloutKind } from '@/lib/mdx'
import { Callout } from './callout'
import { CodeBlock } from './code-block'
import { LiveBlock } from './live-block'

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return textOf((node as { props?: { children?: ReactNode } }).props?.children)
  }
  return ''
}

function headingId(children: ReactNode): string | undefined {
  const text = textOf(children).trim()
  if (!text) return undefined
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

function codeFrom(children: ReactNode): { text: string; className?: string } {
  if (typeof children === 'string' || typeof children === 'number') return { text: String(children) }
  if (Array.isArray(children)) {
    return children.reduce(
      (acc, child) => {
        const part = codeFrom(child)
        return { text: acc.text + part.text, className: acc.className || part.className }
      },
      { text: '', className: undefined as string | undefined },
    )
  }
  if (children && typeof children === 'object' && 'props' in children) {
    const props = (children as { props?: { children?: ReactNode; className?: string } }).props
    const inner = codeFrom(props?.children)
    return { text: inner.text, className: props?.className || inner.className }
  }
  return { text: '' }
}

const components = {
  pre: ({ children }: { children?: ReactNode }) => {
    const { text, className } = codeFrom(children)
    const match = /language-([\w+-]+)/.exec(className || '')
    let language = match?.[1] || 'text'
    const live = language.endsWith('-live')
    if (live) language = language.slice(0, -'-live'.length) || 'javascript'
    const code = text.replace(/\n$/, '')
    if (live) return <LiveBlock code={code.trim()} language={language} />
    return <CodeBlock code={code.trim()} language={language} />
  },
  code: ({ className, children }: { className?: string; children?: ReactNode }) => {
    const text = textOf(children)
    const block = Boolean(className?.startsWith('language-')) || text.includes('\n')
    if (block) return <code className={className}>{children}</code>
    return (
      <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400">
        {children}
      </code>
    )
  },
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => {
    const id = headingId(children)
    return (
      <h2 id={id} className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white scroll-mt-20">
        <a href={id ? `#${id}` : undefined} className="group">
          {children}
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-purple-500">#</span>
        </a>
      </h2>
    )
  },
  h3: ({ children }: { children?: ReactNode }) => {
    const id = headingId(children)
    return (
      <h3 id={id} className="text-2xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white scroll-mt-20">
        <a href={id ? `#${id}` : undefined} className="group">
          {children}
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-purple-500">#</span>
        </a>
      </h3>
    )
  },
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{children}</h4>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href || '#'} className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
        {children}
      </Link>
    )
  },
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 pl-4 py-3 my-4 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
  table: ({ children }: { children?: ReactNode }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800">
      {children}
    </td>
  ),
  img: ({ src, alt }: { src?: string | Blob; alt?: string }) => {
    if (!src || typeof src !== 'string') return null
    if (src.startsWith('http')) {
      return (
        <span className="block my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt || ''} className="rounded-lg max-w-full h-auto" />
          {alt ? (
            <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{alt}</span>
          ) : null}
        </span>
      )
    }
    return (
      <span className="block my-6">
        <Image src={src} alt={alt || ''} width={800} height={450} className="rounded-lg" />
        {alt ? (
          <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{alt}</span>
        ) : null}
      </span>
    )
  },
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
}

function MarkdownBody({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null
  return (
    <Markdown remarkPlugins={articleRemarkPlugins} components={components}>
      {markdown}
    </Markdown>
  )
}

function CalloutBody({ kind, title, markdown }: { kind: CalloutKind; title?: string; markdown: string }) {
  return (
    <Callout type={kind} title={title}>
      <MarkdownBody markdown={markdown} />
    </Callout>
  )
}

export function MDXContent({ source }: { source: string }) {
  const segments = segmentArticle(source)
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      {segments.map((segment, index) =>
        segment.type === 'callout' ? (
          <CalloutBody key={index} kind={segment.kind} title={segment.title} markdown={segment.markdown} />
        ) : (
          <MarkdownBody key={index} markdown={segment.markdown} />
        ),
      )}
    </div>
  )
}
