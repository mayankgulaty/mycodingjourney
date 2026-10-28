'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { AppProps } from '../types'

interface NodeDef { id: string; label: string; deps: string[]; flaky?: boolean }
interface Level { name: string; hint: string; nodes: NodeDef[] }

const LEVELS: Level[] = [
  {
    name: 'Hello, DAG',
    hint: 'Run tasks from left to right. A task can only run once everything upstream has finished.',
    nodes: [
      { id: 'ingest', label: 'ingest', deps: [] },
      { id: 'validate', label: 'validate', deps: ['ingest'] },
      { id: 'transform', label: 'transform', deps: ['validate'] },
      { id: 'load', label: 'load_warehouse', deps: ['transform'] },
    ],
  },
  {
    name: 'Fan-in',
    hint: 'Joins need both parents. Click the roots first.',
    nodes: [
      { id: 'load', label: 'load_dwh', deps: ['dedupe'] },
      { id: 'notify', label: 'notify_slack', deps: ['load'] },
      { id: 'dedupe', label: 'dedupe', deps: ['join'] },
      { id: 'api', label: 'extract_api', deps: [] },
      { id: 'join', label: 'join_sources', deps: ['api', 'csv'] },
      { id: 'csv', label: 'extract_csv', deps: [] },
    ],
  },
  {
    name: 'Flaky upstream',
    hint: 'Some tasks time out the first time. Retry them. The orange ones are the flaky ones.',
    nodes: [
      { id: 'publish', label: 'publish_mart', deps: ['dq'] },
      { id: 'events', label: 'ingest_events', deps: [] },
      { id: 'dq', label: 'dq_checks', deps: ['enrich'], flaky: true },
      { id: 'users', label: 'ingest_users', deps: [] },
      { id: 'sess', label: 'sessionise', deps: ['events'] },
      { id: 'enrich', label: 'enrich', deps: ['sess', 'users'] },
      { id: 'dash', label: 'refresh_dashboard', deps: ['publish'] },
    ],
  },
  {
    name: 'Friday deploy',
    hint: 'Ten tasks, two flaky, no mercy. The scheduler is watching.',
    nodes: [
      { id: 'report', label: 'email_report', deps: ['mart', 'ml'] },
      { id: 'src1', label: 'extract_orders', deps: [] },
      { id: 'stage', label: 'stage_parquet', deps: ['clean1', 'clean2'], flaky: true },
      { id: 'src2', label: 'extract_payments', deps: [] },
      { id: 'clean1', label: 'clean_orders', deps: ['src1'] },
      { id: 'mart', label: 'build_mart', deps: ['stage'] },
      { id: 'clean2', label: 'clean_payments', deps: ['src2'] },
      { id: 'feat', label: 'features', deps: ['stage'] },
      { id: 'ml', label: 'score_model', deps: ['feat'], flaky: true },
      { id: 'cache', label: 'warm_cache', deps: ['mart'] },
    ],
  },
]

type Status = 'idle' | 'running' | 'done' | 'failed'

function layout(nodes: NodeDef[]) {
  const depth: Record<string, number> = {}
  const get = (id: string): number => {
    if (depth[id] !== undefined) return depth[id]
    const n = nodes.find((x) => x.id === id)!
    return (depth[id] = n.deps.length ? 1 + Math.max(...n.deps.map(get)) : 0)
  }
  nodes.forEach((n) => get(n.id))
  const cols = Math.max(...Object.values(depth)) + 1
  const byDepth: Record<number, NodeDef[]> = {}
  nodes.forEach((n) => (byDepth[depth[n.id]] ||= []).push(n))
  const pos: Record<string, { x: number; y: number }> = {}
  Object.entries(byDepth).forEach(([d, list]) => {
    list.forEach((n, i) => {
      pos[n.id] = { x: ((Number(d) + 0.5) / cols) * 100, y: ((i + 0.5) / list.length) * 100 }
    })
  })
  return pos
}

export function Pipeline({ os }: AppProps) {
  const [lvl, setLvl] = useState(0)
  const [status, setStatus] = useState<Record<string, Status>>({})
  const [fails, setFails] = useState(0)
  const [retries, setRetries] = useState(0)
  const [log, setLog] = useState<string[]>(['Scheduler online. Click a task to run it.'])
  const [best, setBest] = useState<Record<number, number>>(() => {
    try { return JSON.parse(localStorage.getItem('mcj-pipeline-best') || '{}') } catch { return {} }
  })
  const flakyUsed = useRef<Set<string>>(new Set())
  const timers = useRef<number[]>([])

  const level = LEVELS[lvl]
  const pos = useMemo(() => layout(level.nodes), [level])
  const done = level.nodes.every((n) => status[n.id] === 'done')
  const score = fails + retries

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const reset = (to: number) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    flakyUsed.current = new Set()
    setLvl(to); setStatus({}); setFails(0); setRetries(0)
    setLog([`Level ${to + 1}: ${LEVELS[to].name}. ${LEVELS[to].hint}`])
  }

  useEffect(() => {
    if (!done) return
    const prev = best[lvl]
    if (prev === undefined || score < prev) {
      const nb = { ...best, [lvl]: score }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- persists a high score once, when the level completes
      setBest(nb)
      try { localStorage.setItem('mcj-pipeline-best', JSON.stringify(nb)) } catch { /* private mode */ }
    }
    if (lvl === LEVELS.length - 1) os.toast('🏁 All DAGs green. You are hired. (Try `sudo hire-me`.)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const run = (n: NodeDef) => {
    const st = status[n.id] ?? 'idle'
    if (st === 'done' || st === 'running') return
    const blocked = n.deps.filter((d) => status[d] !== 'done')
    if (blocked.length) {
      setFails((f) => f + 1)
      setStatus((s) => ({ ...s, [n.id]: 'failed' }))
      setLog((l) => [...l, `✗ ${n.label}: upstream_failed (waiting on ${blocked.join(', ')})`])
      timers.current.push(window.setTimeout(() => setStatus((s) => (s[n.id] === 'failed' ? { ...s, [n.id]: 'idle' } : s)), 700))
      return
    }
    if (st === 'failed') setRetries((r) => r + 1)
    setStatus((s) => ({ ...s, [n.id]: 'running' }))
    setLog((l) => [...l, `▶ ${n.label}: running`])
    timers.current.push(window.setTimeout(() => {
      if (n.flaky && !flakyUsed.current.has(n.id)) {
        flakyUsed.current.add(n.id)
        setStatus((s) => ({ ...s, [n.id]: 'failed' }))
        setLog((l) => [...l, `✗ ${n.label}: timeout after 30s. Click to retry`])
        return
      }
      setStatus((s) => ({ ...s, [n.id]: 'done' }))
      setLog((l) => [...l, `✓ ${n.label}: success`])
    }, os.reduceMotion ? 50 : 450))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--pg-border)' }}>
        <strong>Pipeline Panic</strong>
        <span className="pg-chip">Level {lvl + 1}/{LEVELS.length}: {level.name}</span>
        <span className="pg-muted" style={{ fontSize: 12 }}>mistakes: {score}{best[lvl] !== undefined ? ` · best: ${best[lvl]}` : ''}</span>
        <span style={{ flex: 1 }} />
        <button type="button" className="pg-btn pg-ghost" onClick={() => reset(lvl)}>Restart</button>
        {LEVELS.map((_, i) => (
          <button key={i} type="button" aria-label={`Go to level ${i + 1}`} aria-current={i === lvl} className={i === lvl ? 'pg-btn' : 'pg-btn pg-ghost'} style={{ padding: '2px 8px' }} onClick={() => reset(i)}>{i + 1}</button>
        ))}
      </div>
      <p className="pg-muted" style={{ margin: 0, padding: '6px 12px', fontSize: 12 }}>{level.hint}</p>
      <div style={{ position: 'relative', flex: 1, minHeight: 200, margin: '0 12px' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
          {level.nodes.flatMap((n) => n.deps.map((d) => {
            const a = pos[d], b = pos[n.id]
            const ok = status[d] === 'done'
            return <line key={`${d}-${n.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ok ? 'var(--pg-accent)' : 'var(--pg-muted)'} strokeWidth={ok ? 0.7 : 0.4} strokeDasharray={ok ? undefined : '1.6 1.2'} vectorEffect="non-scaling-stroke" style={{ strokeWidth: ok ? 2.5 : 1.5 }} />
          }))}
        </svg>
        {level.nodes.map((n) => {
          const st = status[n.id] ?? 'idle'
          const colour = st === 'done' ? 'var(--pg-accent)' : st === 'failed' ? '#ff5f57' : st === 'running' ? '#febc2e' : 'var(--pg-panel)'
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => run(n)}
              aria-label={`${n.label}, ${st}${n.flaky ? ', flaky' : ''}, depends on ${n.deps.length ? n.deps.join(', ') : 'nothing'}`}
              className={`pg-mono${st === 'failed' && !os.reduceMotion ? ' pg-shake' : ''}`}
              style={{ position: 'absolute', left: `${pos[n.id].x}%`, top: `${pos[n.id].y}%`, transform: 'translate(-50%,-50%)', padding: '6px 10px', fontSize: 12, borderRadius: 8, border: `2px ${n.flaky ? 'dashed #ffa94d' : 'solid var(--pg-border)'}`, background: colour, color: st === 'done' ? 'var(--pg-accent-fg)' : st === 'idle' ? 'var(--pg-win-fg)' : '#111', whiteSpace: 'nowrap', maxWidth: '30%', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {st === 'done' ? '✓ ' : st === 'running' ? '… ' : st === 'failed' ? '✗ ' : ''}{n.label}
            </button>
          )
        })}
      </div>
      <div className="pg-term pg-mono" role="log" aria-live="polite" style={{ height: 82, flex: 'none', fontSize: 12, padding: '6px 12px', cursor: 'default', borderTop: '1px solid var(--pg-border)' }}>
        {log.slice(-5).map((l, i) => <div key={log.length - 5 + i} className={l.startsWith('✗') ? 'pg-err' : l.startsWith('✓') ? 'pg-ok' : ''}>{l}</div>)}
      </div>
      {done && (
        <div role="status" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--pg-accent)', color: 'var(--pg-accent-fg)', fontWeight: 600 }}>
          🎉 DAG green with {score} mistake{score === 1 ? '' : 's'}.
          {lvl < LEVELS.length - 1 ? <button type="button" className="pg-btn pg-ghost" style={{ color: 'inherit', borderColor: 'currentColor' }} onClick={() => reset(lvl + 1)}>Next level →</button> : <span>That was the last level. Respect.</span>}
        </div>
      )}
    </div>
  )
}
