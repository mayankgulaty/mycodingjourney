'use client'

import {
    Sandpack,
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackConsole,
} from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import { useState } from 'react'
import { Play, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'

interface LivePlaygroundProps {
    code: string
    language?: 'javascript' | 'typescript' | 'react' | 'react-ts'
    title?: string
    showConsole?: boolean
    dependencies?: Record<string, string>
}

// Template configurations for different languages
const templates = {
    javascript: {
        files: {
            '/index.js': { code: '' },
        },
        entry: '/index.js',
        environment: 'vanilla' as const,
    },
    typescript: {
        files: {
            '/index.ts': { code: '' },
        },
        entry: '/index.ts',
        environment: 'vanilla-ts' as const,
    },
    react: {
        files: {
            '/App.js': { code: '' },
            '/index.js': {
                code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
                hidden: true,
            },
        },
        entry: '/App.js',
        environment: 'create-react-app' as const,
    },
    'react-ts': {
        files: {
            '/App.tsx': { code: '' },
            '/index.tsx': {
                code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);`,
                hidden: true,
            },
        },
        entry: '/App.tsx',
        environment: 'create-react-app' as const,
    },
}

export function LivePlayground({
    code,
    language = 'react',
    title,
    showConsole = false,
    dependencies = {},
}: LivePlaygroundProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showConsolePanel, setShowConsolePanel] = useState(showConsole)

    const template = templates[language]

    // Build files object with the user's code
    const files: Record<string, { code: string; hidden?: boolean }> = {}

    // Copy template files
    for (const [path, file] of Object.entries(template.files)) {
        files[path] = { ...file }
    }

    // Set the user's code in the entry file
    files[template.entry] = { code }

    return (
        <div className={`my-6 rounded-xl overflow-hidden border border-gray-700 bg-gray-900 ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-gray-400">
                        {title || `Live ${language.toUpperCase()} Playground`}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowConsolePanel(!showConsolePanel)}
                        className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    >
                        Console
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        aria-label={isExpanded ? 'Minimize' : 'Maximize'}
                    >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Sandpack Editor */}
            <SandpackProvider
                template={template.environment === 'create-react-app' ? 'react' : 'vanilla'}
                files={files}
                customSetup={{
                    dependencies: {
                        ...(language.includes('react') ? { react: '^18.2.0', 'react-dom': '^18.2.0' } : {}),
                        ...dependencies,
                    },
                }}
                theme={atomDark}
                options={{
                    recompileMode: 'delayed',
                    recompileDelay: 500,
                }}
            >
                <SandpackLayout className={isExpanded ? 'h-[calc(100vh-8rem)]' : 'h-[400px]'}>
                    <SandpackCodeEditor
                        showTabs={false}
                        showLineNumbers
                        showInlineErrors
                        wrapContent
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
                        <SandpackPreview
                            showOpenInCodeSandbox={false}
                            showRefreshButton
                            style={{ flex: 1 }}
                        />
                        {showConsolePanel && (
                            <SandpackConsole
                                style={{ height: '150px' }}
                                showHeader
                            />
                        )}
                    </div>
                </SandpackLayout>
            </SandpackProvider>
        </div>
    )
}

// Simple version for just showing output (no editing)
interface CodeOutputProps {
    code: string
    language?: 'javascript' | 'typescript' | 'react' | 'react-ts'
}

export function CodeOutput({ code, language = 'javascript' }: CodeOutputProps) {
    return (
        <div className="my-6 rounded-xl overflow-hidden border border-gray-700">
            <Sandpack
                template={language.includes('react') ? 'react' : 'vanilla'}
                files={{
                    '/App.js': code,
                }}
                theme={atomDark}
                options={{
                    showTabs: false,
                    showLineNumbers: false,
                    editorHeight: 0,
                    editorWidthPercentage: 0,
                }}
            />
        </div>
    )
}
