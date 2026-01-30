'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'

interface CodeBlockProps {
    code: string
    language?: string
    title?: string
    highlightLines?: number[]
    showLineNumbers?: boolean
}

export function CodeBlock({
    code,
    language = 'text',
    title,
    highlightLines = [],
    showLineNumbers = true
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const lines = code.split('\n')

    // Language display names
    const languageNames: Record<string, string> = {
        js: 'JavaScript',
        javascript: 'JavaScript',
        ts: 'TypeScript',
        typescript: 'TypeScript',
        jsx: 'JSX',
        tsx: 'TSX',
        py: 'Python',
        python: 'Python',
        bash: 'Bash',
        sh: 'Shell',
        css: 'CSS',
        html: 'HTML',
        json: 'JSON',
        sql: 'SQL',
        yaml: 'YAML',
        yml: 'YAML',
        md: 'Markdown',
        markdown: 'Markdown',
        rust: 'Rust',
        go: 'Go',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        csharp: 'C#',
        php: 'PHP',
        ruby: 'Ruby',
        swift: 'Swift',
        kotlin: 'Kotlin',
        text: 'Plain Text'
    }

    const displayLanguage = languageNames[language.toLowerCase()] || language.toUpperCase()

    return (
        <div className="group relative my-6 rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-950 border border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-400">
                        {title || displayLanguage}
                    </span>
                </div>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <div className="overflow-x-auto">
                <pre className="p-4 text-sm leading-relaxed">
                    <code className={`language-${language}`}>
                        {lines.map((line, index) => {
                            const lineNumber = index + 1
                            const isHighlighted = highlightLines.includes(lineNumber)

                            return (
                                <div
                                    key={index}
                                    className={`flex ${isHighlighted ? 'bg-blue-500/20 -mx-4 px-4 border-l-2 border-blue-400' : ''}`}
                                >
                                    {showLineNumbers && (
                                        <span className="select-none text-gray-600 w-8 text-right mr-4 flex-shrink-0">
                                            {lineNumber}
                                        </span>
                                    )}
                                    <span className="text-gray-100 flex-1">{line || ' '}</span>
                                </div>
                            )
                        })}
                    </code>
                </pre>
            </div>
        </div>
    )
}

// Pre-component for use with MDX (wraps children)
interface PreProps {
    children?: React.ReactNode
    className?: string
    title?: string
    highlight?: string
}

export function Pre({ children, className, title, highlight }: PreProps) {
    // Extract language from className (e.g., "language-javascript")
    const language = className?.replace('language-', '') || 'text'

    // Extract code from children
    let code = ''
    if (typeof children === 'string') {
        code = children
    } else if (children && typeof children === 'object' && 'props' in children) {
        code = (children as { props: { children?: string } }).props.children || ''
    }

    // Parse highlight lines (e.g., "1,3-5,7")
    const highlightLines: number[] = []
    if (highlight) {
        highlight.split(',').forEach(part => {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number)
                for (let i = start; i <= end; i++) {
                    highlightLines.push(i)
                }
            } else {
                highlightLines.push(Number(part))
            }
        })
    }

    return (
        <CodeBlock
            code={code.trim()}
            language={language}
            title={title}
            highlightLines={highlightLines}
        />
    )
}
