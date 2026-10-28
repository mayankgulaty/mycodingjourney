'use client'

import { useState } from 'react'
import { SAMPLE_QUERIES, TABLES, TABLE_NOTES, safeRunSql, type SqlResult } from '../sql-engine'
import type { AppProps } from '../types'

export function Sql({ params }: AppProps) {
  const [q, setQ] = useState(typeof params.query === 'string' ? params.query : SAMPLE_QUERIES[2])
  const [state, setState] = useState<{ result?: SqlResult; error?: string; ms?: number }>(() => {
    const r = safeRunSql(typeof params.query === 'string' ? params.query : SAMPLE_QUERIES[2])
    return r.ok ? { result: r.result, ms: 0 } : { error: r.error }
  })

  const run = (text = q) => {
    const t0 = performance.now()
    const r = safeRunSql(text)
    const ms = Math.round((performance.now() - t0) * 10) / 10
    setState(r.ok ? { result: r.result, ms } : { error: r.error, ms })
  }

  return (
    <div className="pg-split" style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <aside className="pg-panel" style={{ width: 170, flex: 'none', padding: 10, borderRight: '1px solid var(--pg-border)', overflow: 'auto', fontSize: 12 }}>
        <div className="pg-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Tables</div>
        {Object.keys(TABLES).map((t) => (
          <button key={t} type="button" title={TABLE_NOTES[t]} onClick={() => { const text = `SELECT * FROM ${t}`; setQ(text); run(text) }} className="pg-mono" style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 0, padding: '3px 4px', borderRadius: 4 }}>
            ▦ {t} <span className="pg-muted">({TABLES[t].length})</span>
          </button>
        ))}
        <div className="pg-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', margin: '14px 0 6px' }}>Examples</div>
        {SAMPLE_QUERIES.map((s) => (
          <button key={s} type="button" onClick={() => { setQ(s); run(s) }} className="pg-muted" style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 0, padding: '3px 4px', fontSize: 11, lineHeight: 1.3 }}>
            {s.length > 44 ? s.slice(0, 42) + '…' : s}
          </button>
        ))}
      </aside>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 10, borderBottom: '1px solid var(--pg-border)' }}>
          <label htmlFor="pg-sql" className="pg-muted" style={{ fontSize: 11 }}>SQL · runs in your browser · Ctrl/⌘+Enter to run</label>
          <textarea
            id="pg-sql"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run() } }}
            spellCheck={false}
            rows={4}
            className="pg-mono"
            style={{ display: 'block', width: '100%', resize: 'vertical', marginTop: 4, padding: 8, borderRadius: 8, border: '1px solid var(--pg-border)', background: 'var(--pg-term-bg)', color: 'var(--pg-term-fg)', fontSize: 13, userSelect: 'text' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <button type="button" className="pg-btn" onClick={() => run()}>▶ Run</button>
            <span className="pg-muted" style={{ fontSize: 12 }}>
              {state.error ? '' : state.result ? `${state.result.rows.length} row${state.result.rows.length === 1 ? '' : 's'} · ${state.ms} ms` : ''}
            </span>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }} className="pg-selectable">
          {state.error && <div role="alert" className="pg-mono" style={{ padding: 12, color: '#ff6b6b' }}>Error: {state.error}</div>}
          {state.result && (
            <table className="pg-table">
              <thead><tr>{state.result.columns.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {state.result.rows.map((r, i) => (
                  <tr key={i}>{r.map((v, j) => <td key={j} className={typeof v === 'number' ? 'pg-num' : ''}>{v === null ? <span className="pg-muted">NULL</span> : String(v)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="pg-muted" style={{ fontSize: 11, padding: '8px 12px' }}>
            Data: a real snapshot from my Dublin bus pipeline (9 polls over ~10 minutes, 30 Jan 2026), so it is a small sample, not a city-wide verdict.
          </p>
        </div>
      </div>
    </div>
  )
}
