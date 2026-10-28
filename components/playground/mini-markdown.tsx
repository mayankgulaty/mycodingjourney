import type { ReactNode } from 'react'

/** Small, safe markdown renderer (React elements only, no HTML injection) for in-window previews. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const key = `${keyPrefix}-${i++}`
    if (tok.startsWith('`')) out.push(<code key={key} className="pg-chip">{tok.slice(1, -1)}</code>)
    else if (tok.startsWith('**')) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>)
    else {
      const lm = tok.match(/\[([^\]]+)\]\(([^)\s]+)\)/)
      if (lm && /^(https?:\/\/|\/)/.test(lm[2])) out.push(<a key={key} className="pg-link" href={lm[2]} target="_blank" rel="noopener noreferrer">{lm[1]}</a>)
      else out.push(tok)
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function MiniMarkdown({ source }: { source: string }) {
  const lines = source.replace(/\r/g, '').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let k = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      blocks.push(<pre key={k++} className="pg-mono pg-panel" style={{ padding: 10, borderRadius: 8, overflow: 'auto', fontSize: 12 }}>{buf.join('\n')}</pre>)
      continue
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      const size = [0, 20, 17, 15, 14][h[1].length]
      blocks.push(<div key={k++} role="heading" aria-level={h[1].length + 1} style={{ fontWeight: 700, fontSize: size, margin: '14px 0 6px' }}>{inline(h[2], `h${k}`)}</div>)
      i++
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ''))
      blocks.push(<ul key={k++} style={{ margin: '6px 0', paddingLeft: 20, listStyle: 'disc' }}>{items.map((t, j) => <li key={j}>{inline(t, `l${k}-${j}`)}</li>)}</ul>)
      continue
    }
    if (line.startsWith('>')) {
      blocks.push(<blockquote key={k++} style={{ margin: '8px 0', paddingLeft: 10, borderLeft: '3px solid var(--pg-accent)' }} className="pg-muted">{inline(line.replace(/^>\s?/, ''), `q${k}`)}</blockquote>)
      i++
      continue
    }
    if (line.trim() === '' || /^\|/.test(line) || /^!\[/.test(line) || /^---+$/.test(line)) { i++; continue }
    const para: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,4}\s|```|\s*[-*]\s|>|\|)/.test(lines[i])) para.push(lines[i++])
    blocks.push(<p key={k++} style={{ margin: '6px 0' }}>{inline(para.join(' '), `p${k}`)}</p>)
  }
  return <div className="pg-selectable">{blocks}</div>
}
