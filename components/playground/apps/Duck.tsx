'use client'

import { useRef, useState } from 'react'
import type { AppProps } from '../types'

interface Msg { who: 'you' | 'duck'; text: string }

const RULES: [RegExp, string[]][] = [
  [/\b(null|none|nan|undefined)\b/i, ['Is it NULL, or is it the string "null"? Those are very different ducks.', 'NULL != NULL. Have you checked how your join treats it?']],
  [/\b(time ?zone|utc|dst|timestamp|date)\b/i, ['Timezones. Always the timezones. What is the offset on both sides?', 'Is that UTC, local time, or "whatever the server felt like"?']],
  [/\b(duplicate|dedupe|dupes?|twice)\b/i, ['Is the job idempotent? What happens if it runs twice?', 'Check the grain of your join keys. Quack.']],
  [/\b(join|fan.?out|cartesian)\b/i, ['Count the rows before and after the join. Did they multiply?', 'Is the right side unique on the join key?']],
  [/\b(spark|executor|shuffle|skew|oom|memory)\b/i, ['Skewed key? Look at the biggest partition in the Spark UI.', 'Can you filter earlier, before the shuffle?']],
  [/\b(airflow|dag|schedule|backfill)\b/i, ['Is the logical date what you think it is?', 'Did the upstream task actually finish, or just turn green?']],
  [/\b(cache|stale)\b/i, ['Is it stale, or is it wrong? How do you know?', 'Have you tried turning the cache off just once?']],
  [/\b(dns)\b/i, ['It is not DNS. ...Is it DNS?']],
  [/\b(regex|regexp)\b/i, ['Now you have two problems. Can a split() do it instead?']],
  [/\b(test|tests|failing|fails?|flaky)\b/i, ['What exactly is the assertion telling you? Read it out loud.', 'Does it fail alone, or only with the others?']],
  [/\b(deploy|prod|production)\b/i, ['What changed between the last good run and the first bad one?']],
  [/\b(sql|query|select|group by)\b/i, ['Try running it one clause at a time. Where do the rows go wrong?']],
]
const GENERIC = [
  'Interesting. And then what happens?',
  'Walk me through it line by line. Slowly. Quack.',
  'What did you expect to happen? What happened instead?',
  'Have you tried explaining it to me again, but louder?',
  'Which assumption have you not actually checked yet?',
  'Quack. (That means: print the value right before it breaks.)',
  'When did it last work? What changed since?',
  'Is it really the bug you think it is? Or is it a symptom?',
]

export function Duck({ os }: AppProps) {
  const [msgs, setMsgs] = useState<Msg[]>([{ who: 'duck', text: "Quack. I'm your rubber duck. Explain your bug to me. I won't judge, I'm a duck." }])
  const [text, setText] = useState('')
  const [quacks, setQuacks] = useState(0)
  const [wiggle, setWiggle] = useState(false)
  const turn = useRef(0)
  const box = useRef<HTMLDivElement>(null)

  const say = (t: string) => {
    const you = t.trim()
    if (!you) return
    const hit = RULES.find(([re]) => re.test(you))
    const pool = hit ? hit[1] : GENERIC
    const reply = pool[turn.current++ % pool.length]
    setMsgs((m) => [...m, { who: 'you', text: you }, { who: 'duck', text: reply }])
    setText('')
    window.setTimeout(() => box.current?.scrollTo({ top: box.current.scrollHeight }), 30)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
        <button
          type="button"
          aria-label="Squeeze the duck"
          onClick={() => {
            const q = quacks + 1
            setQuacks(q)
            setWiggle(true)
            window.setTimeout(() => setWiggle(false), 250)
            if (q === 10) os.toast('🦆 10 quacks. The duck is pleased.')
            if (q === 42) os.toast('🦆 42 quacks: the answer to life, the universe and your bug.')
            if (q === 100) { os.toast('🦆 100 quacks. Achievement unlocked: Duck Whisperer.'); os.matrix() }
          }}
          className={`${os.reduceMotion ? '' : 'pg-duck'}${wiggle ? ' pg-shake' : ''}`}
          style={{ background: 'none', border: 0, fontSize: 64, lineHeight: 1 }}
        >
          🦆
        </button>
        <div className="pg-muted pg-mono" style={{ fontSize: 11 }}>quacks: {quacks}</div>
      </div>
      <div ref={box} role="log" aria-live="polite" className="pg-selectable" style={{ flex: 1, overflow: 'auto', padding: '4px 14px', display: 'grid', alignContent: 'start', gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ justifySelf: m.who === 'you' ? 'end' : 'start', maxWidth: '85%', padding: '6px 11px', borderRadius: 14, background: m.who === 'you' ? 'var(--pg-accent)' : 'var(--pg-panel)', color: m.who === 'you' ? 'var(--pg-accent-fg)' : 'inherit', border: '1px solid var(--pg-border)' }}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); say(text) }} style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid var(--pg-border)' }}>
        <label htmlFor="pg-duck-in" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Explain your bug to the duck</label>
        <input id="pg-duck-in" value={text} onChange={(e) => setText(e.target.value)} placeholder="Explain your bug…" autoComplete="off" style={{ flex: 1, minWidth: 0, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--pg-border)', background: 'var(--pg-panel)', color: 'inherit', userSelect: 'text' }} />
        <button type="submit" className="pg-btn">Explain</button>
      </form>
    </div>
  )
}
