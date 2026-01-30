/**
 * Simple markdown to HTML converter for preview purposes
 * This is a client-side preview - full MDX rendering happens server-side
 */
export function parseMarkdownPreview(markdown: string): string {
    let html = markdown

    // Escape HTML to prevent XSS, but we'll add our own tags
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    // Handle code blocks FIRST (before other transformations)
    // Match ```language\ncode\n```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const langLabel = lang ? `<div class="text-xs text-gray-400 mb-1">${lang}</div>` : ''
        return `<div class="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">${langLabel}<pre class="text-sm text-gray-100 font-mono whitespace-pre-wrap">${code.trim()}</pre></div>`
    })

    // Handle inline code (but not inside code blocks)
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm text-purple-600 dark:text-purple-400">$1</code>')

    // Handle callouts (:::type content :::)
    html = html.replace(/:::(info|tip|warning|danger|note)\s*([\s\S]*?):::/g, (_, type, content) => {
        const colors: Record<string, string> = {
            info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200',
            tip: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200',
            warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
            danger: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200',
            note: 'bg-gray-50 dark:bg-gray-800 border-gray-500 text-gray-800 dark:text-gray-200',
        }
        const colorClass = colors[type] || colors.note
        return `<div class="border-l-4 ${colorClass} p-4 my-4 rounded-r-lg">
            <strong class="uppercase text-xs tracking-wide">${type}</strong>
            <div class="mt-1">${content.trim()}</div>
        </div>`
    })

    // Headers (order matters - check ### before ## before #)
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-white">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-white">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-4 text-gray-900 dark:text-white">$1</h1>')

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 dark:text-purple-400 underline hover:no-underline" target="_blank" rel="noopener">$1</a>')

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-2 space-y-1">$&</ul>')

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>')

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />')

    // Paragraphs - wrap lines that aren't already wrapped in HTML tags
    const lines = html.split('\n')
    const processedLines: string[] = []
    let inParagraph = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Skip empty lines
        if (!line) {
            if (inParagraph) {
                processedLines.push('</p>')
                inParagraph = false
            }
            continue
        }

        // Check if line starts with a block element
        const isBlockElement = /^<(h[1-6]|div|ul|ol|li|blockquote|pre|hr|table)/.test(line) ||
            /<\/(h[1-6]|div|ul|ol|blockquote|pre|table)>$/.test(line)

        if (isBlockElement) {
            if (inParagraph) {
                processedLines.push('</p>')
                inParagraph = false
            }
            processedLines.push(line)
        } else {
            if (!inParagraph) {
                processedLines.push('<p class="my-3 text-gray-700 dark:text-gray-300 leading-relaxed">')
                inParagraph = true
            }
            processedLines.push(line)
        }
    }

    if (inParagraph) {
        processedLines.push('</p>')
    }

    return processedLines.join('\n')
}
