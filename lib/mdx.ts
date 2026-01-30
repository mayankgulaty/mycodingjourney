import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

// Serialize markdown content to MDX for rendering
export async function serializeMDX(content: string): Promise<MDXRemoteSerializeResult> {
    // Process custom syntax before serialization
    const processedContent = preprocessContent(content)

    const mdxSource = await serialize(processedContent, {
        mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
            format: 'mdx',
        },
        parseFrontmatter: false,
    })

    return mdxSource
}

// Preprocess content to handle custom syntax
function preprocessContent(content: string): string {
    let processed = content

    // Convert ```language live blocks to custom component syntax
    processed = processed.replace(
        /```(\w+)\s+live\n([\s\S]*?)```/g,
        (_, language, code) => {
            const escapedCode = code.trim().replace(/`/g, '\\`').replace(/\$/g, '\\$')
            return `<LivePlayground code={\`${escapedCode}\`} language="${language}" />`
        }
    )

    // Convert :::type callouts to Callout components
    processed = processed.replace(
        /:::(info|tip|warning|danger|note)(?:\s+(.+))?\n([\s\S]*?):::/g,
        (_, type, title, content) => {
            const titleProp = title ? ` title="${title.trim()}"` : ''
            return `<Callout type="${type}"${titleProp}>\n${content.trim()}\n</Callout>`
        }
    )

    return processed
}

// Extract table of contents from content
export function extractTOC(content: string): Array<{ id: string; title: string; level: number }> {
    const headings: Array<{ id: string; title: string; level: number }> = []
    const headingRegex = /^(#{2,4})\s+(.+)$/gm

    let match
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const title = match[2].trim()
        const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

        headings.push({ id, title, level })
    }

    return headings
}
