'use client'

import { 
    Bold, 
    Italic, 
    Heading1, 
    Heading2, 
    Heading3, 
    List, 
    ListOrdered, 
    Link, 
    Image, 
    Code, 
    Quote, 
    Minus,
    Table,
    AlertCircle,
    Info,
    AlertTriangle
} from 'lucide-react'

interface MarkdownToolbarProps {
    textareaRef: React.RefObject<HTMLTextAreaElement>
    onContentChange: (content: string) => void
    content: string
}

export function MarkdownToolbar({ textareaRef, onContentChange, content }: MarkdownToolbarProps) {
    const insertText = (before: string, after: string = '', placeholder: string = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)
        const textToInsert = selectedText || placeholder

        const newContent = 
            content.substring(0, start) + 
            before + 
            textToInsert + 
            after + 
            content.substring(end)

        onContentChange(newContent)

        // Set cursor position after the operation
        setTimeout(() => {
            textarea.focus()
            const newCursorPos = start + before.length + textToInsert.length
            textarea.setSelectionRange(
                selectedText ? newCursorPos + after.length : start + before.length,
                selectedText ? newCursorPos + after.length : start + before.length + placeholder.length
            )
        }, 0)
    }

    const insertAtLineStart = (prefix: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const lineStart = content.lastIndexOf('\n', start - 1) + 1
        
        const newContent = 
            content.substring(0, lineStart) + 
            prefix + 
            content.substring(lineStart)

        onContentChange(newContent)

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, start + prefix.length)
        }, 0)
    }

    const insertBlock = (block: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const beforeCursor = content.substring(0, start)
        const afterCursor = content.substring(start)
        
        // Add newlines if needed
        const needsNewlineBefore = beforeCursor.length > 0 && !beforeCursor.endsWith('\n\n')
        const prefix = needsNewlineBefore ? (beforeCursor.endsWith('\n') ? '\n' : '\n\n') : ''
        
        const newContent = beforeCursor + prefix + block + afterCursor

        onContentChange(newContent)

        setTimeout(() => {
            textarea.focus()
            const newPos = start + prefix.length + block.indexOf('|cursor|')
            if (block.includes('|cursor|')) {
                const cleanBlock = block.replace('|cursor|', '')
                onContentChange(beforeCursor + prefix + cleanBlock + afterCursor)
                textarea.setSelectionRange(newPos, newPos)
            }
        }, 0)
    }

    const tools = [
        { 
            icon: Bold, 
            title: 'Bold (Ctrl+B)', 
            action: () => insertText('**', '**', 'bold text'),
            group: 'format'
        },
        { 
            icon: Italic, 
            title: 'Italic (Ctrl+I)', 
            action: () => insertText('*', '*', 'italic text'),
            group: 'format'
        },
        { 
            icon: Code, 
            title: 'Inline Code', 
            action: () => insertText('`', '`', 'code'),
            group: 'format'
        },
        { divider: true },
        { 
            icon: Heading1, 
            title: 'Heading 1', 
            action: () => insertAtLineStart('# '),
            group: 'heading'
        },
        { 
            icon: Heading2, 
            title: 'Heading 2', 
            action: () => insertAtLineStart('## '),
            group: 'heading'
        },
        { 
            icon: Heading3, 
            title: 'Heading 3', 
            action: () => insertAtLineStart('### '),
            group: 'heading'
        },
        { divider: true },
        { 
            icon: List, 
            title: 'Bullet List', 
            action: () => insertAtLineStart('- '),
            group: 'list'
        },
        { 
            icon: ListOrdered, 
            title: 'Numbered List', 
            action: () => insertAtLineStart('1. '),
            group: 'list'
        },
        { 
            icon: Quote, 
            title: 'Blockquote', 
            action: () => insertAtLineStart('> '),
            group: 'list'
        },
        { divider: true },
        { 
            icon: Link, 
            title: 'Link', 
            action: () => insertText('[', '](url)', 'link text'),
            group: 'insert'
        },
        { 
            icon: Image, 
            title: 'Image', 
            action: () => insertText('![', '](image-url)', 'alt text'),
            group: 'insert'
        },
        { 
            icon: Minus, 
            title: 'Horizontal Rule', 
            action: () => insertBlock('\n---\n'),
            group: 'insert'
        },
        { divider: true },
        { 
            icon: Code, 
            title: 'Code Block', 
            action: () => insertBlock('\n```javascript\n// your code here\n```\n'),
            group: 'code',
            className: 'text-green-600'
        },
        { 
            icon: Table, 
            title: 'Table', 
            action: () => insertBlock('\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n'),
            group: 'code'
        },
        { divider: true },
        { 
            icon: Info, 
            title: 'Info Callout', 
            action: () => insertBlock('\n:::info\nYour info message here\n:::\n'),
            group: 'callout',
            className: 'text-blue-500'
        },
        { 
            icon: AlertTriangle, 
            title: 'Warning Callout', 
            action: () => insertBlock('\n:::warning\nYour warning message here\n:::\n'),
            group: 'callout',
            className: 'text-yellow-500'
        },
        { 
            icon: AlertCircle, 
            title: 'Error Callout', 
            action: () => insertBlock('\n:::error\nYour error message here\n:::\n'),
            group: 'callout',
            className: 'text-red-500'
        },
    ]

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-t-lg border-b-0">
            {tools.map((tool, index) => {
                if ('divider' in tool) {
                    return (
                        <div 
                            key={`divider-${index}`} 
                            className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                        />
                    )
                }

                const Icon = tool.icon
                return (
                    <button
                        key={tool.title}
                        type="button"
                        onClick={tool.action}
                        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${tool.className || 'text-gray-600 dark:text-gray-400'}`}
                        title={tool.title}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                )
            })}
        </div>
    )
}
