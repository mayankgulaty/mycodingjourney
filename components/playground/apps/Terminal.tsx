'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { buildFs, complete, exec, promptPath, WELCOME, type Line } from '../terminal-engine'
import type { AppProps } from '../types'

interface Entry extends Line { prompt?: string }

export function Terminal({ os, params }: AppProps) {
  const [entries, setEntries] = useState<Entry[]>(WELCOME)
  const [cwd, setCwd] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const hist = useRef<string[]>([])
  const histIdx = useRef<number>(-1)
  const scroller = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const cwdRef = useRef(cwd)
  useEffect(() => { cwdRef.current = cwd }, [cwd])

  const scrollDown = () => window.setTimeout(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight }), 10)

  const run = useCallback((line: string) => {
    const prompt = promptPath(cwdRef.current)
    if (line.trim()) { hist.current.push(line); histIdx.current = -1 }
    const res = exec(line, cwdRef.current, os, hist.current)
    if (res.clear) { setEntries([]); return }
    const first: Entry[] = [{ text: line, prompt }]
    if (res.cwd) setCwd(res.cwd)
    if (res.stream && !os.reduceMotion) {
      setEntries((e) => [...e, ...first])
      setBusy(true)
      res.lines.forEach((l, i) => {
        timers.current.push(window.setTimeout(() => {
          setEntries((e) => [...e, l])
          scrollDown()
          if (i === res.lines.length - 1) setBusy(false)
        }, 380 * (i + 1)))
      })
    } else {
      setEntries((e) => [...e, ...first, ...res.lines])
    }
    if (res.exit) timers.current.push(window.setTimeout(() => os.close('terminal'), 300))
    scrollDown()
  }, [os])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { inputRef.current?.focus() }, [])

  // commands pushed in from other apps (e.g. Finder "…in the terminal")
  const nonce = params.nonce
  const pending = typeof params.run === 'string' ? params.run : null
  const lastNonce = useRef<unknown>(undefined)
  useEffect(() => {
    if (pending && nonce !== lastNonce.current) {
      lastNonce.current = nonce
      run(pending)
    }
  }, [pending, nonce, run])

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(input); setInput(''); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!hist.current.length) return
      histIdx.current = histIdx.current === -1 ? hist.current.length - 1 : Math.max(0, histIdx.current - 1)
      setInput(hist.current[histIdx.current])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx.current === -1) return
      histIdx.current += 1
      if (histIdx.current >= hist.current.length) { histIdx.current = -1; setInput('') } else setInput(hist.current[histIdx.current])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = complete(input, cwd, buildFs(os), os.themes.map((t) => t.id))
      if (matches.length === 1) {
        const parts = input.split(/\s+/)
        parts[parts.length - 1] = matches[0]
        setInput(parts.join(' ') + (matches[0].endsWith('/') ? '' : ' '))
      } else if (matches.length > 1) {
        setEntries((en) => [...en, { text: input, prompt: promptPath(cwd) }, { text: matches.join('   '), cls: 'dim' }])
        scrollDown()
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault(); setEntries([])
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault()
      setEntries((en) => [...en, { text: input + '^C', prompt: promptPath(cwd) }]); setInput('')
    }
  }

  return (
    <div className="pg-term" ref={scroller} onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus() }}>
      <div role="log" aria-live="polite" aria-label="Terminal output">
        {entries.map((en, i) => (
          <div key={i}>
            {en.prompt !== undefined ? (
              <div className="pg-term-line"><span className="pg-prompt">visitor@mcj:{en.prompt}$</span><pre>{en.text}</pre></div>
            ) : en.href ? (
              <pre className={en.cls ? `pg-${en.cls}` : undefined}><a className="pg-link" href={en.href} target={en.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">{en.text}</a></pre>
            ) : (
              <pre className={en.cls ? `pg-${en.cls}` : undefined}>{en.text}</pre>
            )}
          </div>
        ))}
      </div>
      <div className="pg-term-line">
        <label htmlFor="pg-term-in" className="pg-prompt">visitor@mcj:{promptPath(cwd)}$</label>
        <input
          id="pg-term-in"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={busy}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Terminal command"
        />
      </div>
    </div>
  )
}
