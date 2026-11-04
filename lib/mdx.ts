import type { PluggableList } from 'unified'
import remarkGfm from 'remark-gfm'

/**
 * Article bodies are markdown, not MDX.
 *
 * next-mdx-remote compiles each post with `new Function`. Workers reject that,
 * and one article render spent hundreds of milliseconds of CPU doing it.
 * Callers render the string with react-markdown instead. This module only
 * rewrites the two custom syntaxes the editor emits (`:::callout` and
 * ```lang live) and never compiles or evaluates the source.
 */

export const articleRemarkPlugins: PluggableList = [remarkGfm]

export type CalloutKind = 'info' | 'tip' | 'warning' | 'danger' | 'note'

export type ArticleSegment =
  | { type: 'markdown'; markdown: string }
  | { type: 'callout'; kind: CalloutKind; title?: string; markdown: string }

const CALLOUT_KINDS = new Set<CalloutKind>(['info', 'tip', 'warning', 'danger', 'note'])

/** `:::error` is what the editor toolbar inserts. Render it as a danger callout. */
function calloutKind(raw: string): CalloutKind {
  if (raw === 'error') return 'danger'
  return CALLOUT_KINDS.has(raw as CalloutKind) ? (raw as CalloutKind) : 'note'
}

/**
 * Turn ```lang live fences into ```lang-live so the renderer can see the flag
 * without an MDX prop. Fences are rewritten before callouts are split, and
 * callouts are only recognized outside fences.
 */
function rewriteLiveFences(source: string): string {
  return source.replace(/```([A-Za-z0-9_+-]+)[ \t]+live[ \t]*\n/g, '```$1-live\n')
}

export function segmentArticle(source: string): ArticleSegment[] {
  const text = rewriteLiveFences(source)
  const segments: ArticleSegment[] = []
  const re = /```[\s\S]*?```|:::(info|tip|warning|danger|note|error)(?:[ \t]+([^\n]+))?\n([\s\S]*?):::/g
  let markdown = ''
  let last = 0

  for (let match = re.exec(text); match; match = re.exec(text)) {
    markdown += text.slice(last, match.index)
    if (match[0].startsWith('```')) {
      markdown += match[0]
    } else {
      if (markdown.trim()) segments.push({ type: 'markdown', markdown })
      markdown = ''
      const title = match[2]?.trim()
      segments.push({
        type: 'callout',
        kind: calloutKind(match[1]),
        title: title || undefined,
        markdown: match[3].trim(),
      })
    }
    last = match.index + match[0].length
  }

  markdown += text.slice(last)
  if (markdown.trim() || segments.length === 0) segments.push({ type: 'markdown', markdown })
  return segments
}

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
