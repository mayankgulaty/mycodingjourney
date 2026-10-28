/**
 * A deliberately tiny SQL engine for the playground. Runs entirely in the browser over a few small
 * in-memory tables. Supports: SELECT [DISTINCT] ... FROM t [WHERE] [GROUP BY] [HAVING] [ORDER BY] [LIMIT],
 * COUNT/SUM/AVG/MIN/MAX, ROUND/UPPER/LOWER/LENGTH/ABS, LIKE, IN, BETWEEN, IS [NOT] NULL, plus SHOW TABLES / DESCRIBE.
 */
import { DELAY_DISTRIBUTION, FLEET, OPERATORS, ROUTES, type Row } from './data/dublin'
import { PROJECT_ROWS, SKILL_ROWS } from './data/content'

type Val = string | number | boolean | null

export const TABLES: Record<string, Row[]> = {
  routes: ROUTES,
  delay_distribution: DELAY_DISTRIBUTION,
  operators: OPERATORS,
  fleet: [FLEET as unknown as Row],
  projects: PROJECT_ROWS,
  skills: SKILL_ROWS,
}

export const TABLE_NOTES: Record<string, string> = {
  routes: 'top 10 Dublin bus routes by sample size (real snapshot)',
  delay_distribution: 'delay buckets across 73,208 update records (real snapshot)',
  operators: 'routes per operator in the snapshot',
  fleet: 'one row of fleet-level totals',
  projects: 'projects in this playground',
  skills: 'what I work with',
}

export interface SqlResult {
  columns: string[]
  rows: Val[][]
  note?: string
}

class SqlError extends Error {}

// ---------- tokenizer ----------
type Tok = { t: 'num' | 'str' | 'id' | 'op' | 'eof'; v: string }

function tokenize(src: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (/\s/.test(c)) { i++; continue }
    if (c === '-' && src[i + 1] === '-') { while (i < src.length && src[i] !== '\n') i++; continue }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      let j = i
      while (j < src.length && /[0-9.]/.test(src[j])) j++
      out.push({ t: 'num', v: src.slice(i, j) }); i = j; continue
    }
    if (c === "'") {
      let j = i + 1, s = ''
      while (j < src.length) {
        if (src[j] === "'" && src[j + 1] === "'") { s += "'"; j += 2; continue }
        if (src[j] === "'") break
        s += src[j++]
      }
      if (j >= src.length) throw new SqlError('unterminated string literal')
      out.push({ t: 'str', v: s }); i = j + 1; continue
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++
      out.push({ t: 'id', v: src.slice(i, j) }); i = j; continue
    }
    const two = src.slice(i, i + 2)
    if (['<=', '>=', '<>', '!='].includes(two)) { out.push({ t: 'op', v: two }); i += 2; continue }
    if ('=<>+-*/(),.;'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue }
    throw new SqlError(`unexpected character '${c}'`)
  }
  out.push({ t: 'eof', v: '' })
  return out
}

// ---------- AST ----------
type Expr =
  | { k: 'num'; v: number }
  | { k: 'str'; v: string }
  | { k: 'null' }
  | { k: 'col'; name: string }
  | { k: 'star' }
  | { k: 'fn'; name: string; args: Expr[]; distinct?: boolean }
  | { k: 'bin'; op: string; l: Expr; r: Expr }
  | { k: 'not'; e: Expr }
  | { k: 'neg'; e: Expr }
  | { k: 'in'; e: Expr; list: Expr[]; neg: boolean }
  | { k: 'between'; e: Expr; lo: Expr; hi: Expr; neg: boolean }
  | { k: 'isnull'; e: Expr; neg: boolean }

interface Select {
  distinct: boolean
  items: { e: Expr; alias?: string; text: string }[]
  from: string
  where?: Expr
  groupBy: Expr[]
  having?: Expr
  orderBy: { e: Expr; desc: boolean }[]
  limit?: number
}

const AGG = new Set(['count', 'sum', 'avg', 'min', 'max'])
const RESERVED = new Set(['from', 'where', 'group', 'order', 'having', 'limit', 'as', 'and', 'or', 'not', 'by', 'asc', 'desc', 'like', 'in', 'is', 'between', 'select', 'distinct', 'null'])

class Parser {
  p = 0
  constructor(private toks: Tok[]) {}
  peek() { return this.toks[this.p] }
  next() { return this.toks[this.p++] }
  isKw(k: string) { const t = this.peek(); return t.t === 'id' && t.v.toLowerCase() === k }
  isOp(o: string) { const t = this.peek(); return t.t === 'op' && t.v === o }
  eatKw(k: string) { if (this.isKw(k)) { this.p++; return true } return false }
  eatOp(o: string) { if (this.isOp(o)) { this.p++; return true } return false }
  expectKw(k: string) { if (!this.eatKw(k)) throw new SqlError(`expected ${k.toUpperCase()} near '${this.peek().v || 'end of input'}'`) }
  expectOp(o: string) { if (!this.eatOp(o)) throw new SqlError(`expected '${o}' near '${this.peek().v || 'end of input'}'`) }

  parseSelect(): Select {
    this.expectKw('select')
    const distinct = this.eatKw('distinct')
    const items: Select['items'] = []
    do {
      if (this.isOp('*')) { this.next(); items.push({ e: { k: 'star' }, text: '*' }); continue }
      const startTok = this.p
      const e = this.parseExpr()
      const endTok = this.p
      let alias: string | undefined
      if (this.eatKw('as')) alias = this.next().v
      else if (this.peek().t === 'id' && !RESERVED.has(this.peek().v.toLowerCase())) alias = this.next().v
      items.push({ e, alias, text: this.toks.slice(startTok, endTok).map((t) => t.v).join('') })
    } while (this.eatOp(','))
    this.expectKw('from')
    const ft = this.next()
    if (ft.t !== 'id') throw new SqlError('expected a table name after FROM')
    const sel: Select = { distinct, items, from: ft.v, groupBy: [], orderBy: [] }
    if (this.eatKw('where')) sel.where = this.parseExpr()
    if (this.eatKw('group')) { this.expectKw('by'); do sel.groupBy.push(this.parseExpr()); while (this.eatOp(',')) }
    if (this.eatKw('having')) sel.having = this.parseExpr()
    if (this.eatKw('order')) {
      this.expectKw('by')
      do {
        const e = this.parseExpr()
        const desc = this.eatKw('desc')
        if (!desc) this.eatKw('asc')
        sel.orderBy.push({ e, desc })
      } while (this.eatOp(','))
    }
    if (this.eatKw('limit')) {
      const n = this.next()
      if (n.t !== 'num') throw new SqlError('LIMIT needs a number')
      sel.limit = Math.max(0, Math.floor(Number(n.v)))
    }
    this.eatOp(';')
    if (this.peek().t !== 'eof') throw new SqlError(`unexpected '${this.peek().v}'`)
    return sel
  }

  parseExpr(): Expr { return this.parseOr() }
  parseOr(): Expr { let l = this.parseAnd(); while (this.eatKw('or')) l = { k: 'bin', op: 'or', l, r: this.parseAnd() }; return l }
  parseAnd(): Expr { let l = this.parseNot(); while (this.eatKw('and')) l = { k: 'bin', op: 'and', l, r: this.parseNot() }; return l }
  parseNot(): Expr { if (this.eatKw('not')) return { k: 'not', e: this.parseNot() }; return this.parseCmp() }
  parseCmp(): Expr {
    const l = this.parseAdd()
    const t = this.peek()
    if (t.t === 'op' && ['=', '!=', '<>', '<', '>', '<=', '>='].includes(t.v)) { this.next(); return { k: 'bin', op: t.v, l, r: this.parseAdd() } }
    let neg = false
    const save = this.p
    if (this.isKw('not')) { this.next(); neg = true }
    if (this.eatKw('like')) { const r = this.parseAdd(); const e: Expr = { k: 'bin', op: 'like', l, r }; return neg ? { k: 'not', e } : e }
    if (this.eatKw('in')) {
      this.expectOp('(')
      const list: Expr[] = []
      do list.push(this.parseExpr()); while (this.eatOp(','))
      this.expectOp(')')
      return { k: 'in', e: l, list, neg }
    }
    if (this.eatKw('between')) { const lo = this.parseAdd(); this.expectKw('and'); const hi = this.parseAdd(); return { k: 'between', e: l, lo, hi, neg } }
    if (neg) this.p = save
    if (this.eatKw('is')) { const n = this.eatKw('not'); this.expectKw('null'); return { k: 'isnull', e: l, neg: n } }
    return l
  }
  parseAdd(): Expr {
    let l = this.parseMul()
    while (this.isOp('+') || this.isOp('-')) { const op = this.next().v; l = { k: 'bin', op, l, r: this.parseMul() } }
    return l
  }
  parseMul(): Expr {
    let l = this.parseUnary()
    while (this.isOp('*') || this.isOp('/')) { const op = this.next().v; l = { k: 'bin', op, l, r: this.parseUnary() } }
    return l
  }
  parseUnary(): Expr { if (this.eatOp('-')) return { k: 'neg', e: this.parseUnary() }; return this.parsePrimary() }
  parsePrimary(): Expr {
    const t = this.next()
    if (t.t === 'num') return { k: 'num', v: Number(t.v) }
    if (t.t === 'str') return { k: 'str', v: t.v }
    if (t.t === 'op' && t.v === '(') { const e = this.parseExpr(); this.expectOp(')'); return e }
    if (t.t === 'id') {
      const low = t.v.toLowerCase()
      if (low === 'null') return { k: 'null' }
      if (this.isOp('(')) {
        this.next()
        const args: Expr[] = []
        let distinct = false
        if (this.isOp('*')) { this.next(); args.push({ k: 'star' }) }
        else if (!this.isOp(')')) {
          distinct = this.eatKw('distinct')
          do args.push(this.parseExpr()); while (this.eatOp(','))
        }
        this.expectOp(')')
        return { k: 'fn', name: low, args, distinct }
      }
      return { k: 'col', name: t.v }
    }
    throw new SqlError(`unexpected '${t.v || 'end of input'}'`)
  }
}

// ---------- evaluation ----------
interface Ctx { rows: Row[]; alias?: Record<string, Val> }

function findKey(row: Row | undefined, name: string): string | undefined {
  if (!row) return undefined
  const l = name.toLowerCase()
  return Object.keys(row).find((k) => k.toLowerCase() === l)
}

function hasAgg(e: Expr | undefined): boolean {
  if (!e) return false
  switch (e.k) {
    case 'fn': return AGG.has(e.name) || e.args.some(hasAgg)
    case 'bin': return hasAgg(e.l) || hasAgg(e.r)
    case 'not': case 'neg': case 'isnull': return hasAgg(e.e)
    case 'in': return hasAgg(e.e) || e.list.some(hasAgg)
    case 'between': return hasAgg(e.e) || hasAgg(e.lo) || hasAgg(e.hi)
    default: return false
  }
}

function likeToRegex(p: string) {
  return new RegExp('^' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i')
}

function cmp(a: Val, b: Val): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

function ev(e: Expr, ctx: Ctx, cols: string[]): Val {
  switch (e.k) {
    case 'num': return e.v
    case 'str': return e.v
    case 'null': return null
    case 'star': return 1
    case 'col': {
      if (ctx.alias && Object.prototype.hasOwnProperty.call(ctx.alias, e.name.toLowerCase())) return ctx.alias[e.name.toLowerCase()]
      const k = findKey(ctx.rows[0], e.name)
      if (k === undefined) throw new SqlError(`no such column: ${e.name} (columns: ${cols.join(', ')})`)
      return (ctx.rows[0][k] ?? null) as Val
    }
    case 'neg': { const v = ev(e.e, ctx, cols); return v === null ? null : -Number(v) }
    case 'not': { const v = ev(e.e, ctx, cols); return v === null ? null : !v }
    case 'isnull': { const v = ev(e.e, ctx, cols) === null; return e.neg ? !v : v }
    case 'in': {
      const v = ev(e.e, ctx, cols)
      const hit = e.list.some((x) => ev(x, ctx, cols) === v)
      return e.neg ? !hit : hit
    }
    case 'between': {
      const v = ev(e.e, ctx, cols), lo = ev(e.lo, ctx, cols), hi = ev(e.hi, ctx, cols)
      if (v === null || lo === null || hi === null) return null
      const r = cmp(v, lo) >= 0 && cmp(v, hi) <= 0
      return e.neg ? !r : r
    }
    case 'bin': {
      if (e.op === 'and') {
        const l = ev(e.l, ctx, cols)
        if (l !== null && !l) return false
        const r = ev(e.r, ctx, cols)
        if (r !== null && !r) return false
        return l === null || r === null ? null : true
      }
      if (e.op === 'or') {
        const l = ev(e.l, ctx, cols)
        if (l) return true
        const r = ev(e.r, ctx, cols)
        return r ? true : l === null || r === null ? null : false
      }
      const l = ev(e.l, ctx, cols), r = ev(e.r, ctx, cols)
      if (l === null || r === null) return null
      switch (e.op) {
        case '=': return typeof l === 'number' && typeof r === 'number' ? l === r : String(l).toLowerCase() === String(r).toLowerCase()
        case '!=': case '<>': return typeof l === 'number' && typeof r === 'number' ? l !== r : String(l).toLowerCase() !== String(r).toLowerCase()
        case '<': return cmp(l, r) < 0
        case '>': return cmp(l, r) > 0
        case '<=': return cmp(l, r) <= 0
        case '>=': return cmp(l, r) >= 0
        case 'like': return likeToRegex(String(r)).test(String(l))
        case '+': return Number(l) + Number(r)
        case '-': return Number(l) - Number(r)
        case '*': return Number(l) * Number(r)
        case '/': return Number(r) === 0 ? null : Number(l) / Number(r)
      }
      throw new SqlError(`unknown operator ${e.op}`)
    }
    case 'fn': {
      if (AGG.has(e.name)) {
        if (e.name === 'count' && e.args[0]?.k === 'star') return ctx.rows.length
        if (e.args.length !== 1) throw new SqlError(`${e.name.toUpperCase()} takes one argument`)
        let vals = ctx.rows.map((r) => ev(e.args[0], { rows: [r] }, cols)).filter((v) => v !== null)
        if (e.distinct) vals = [...new Set(vals)]
        if (e.name === 'count') return vals.length
        if (vals.length === 0) return null
        if (e.name === 'min') return vals.reduce((a, b) => (cmp(a, b) <= 0 ? a : b))
        if (e.name === 'max') return vals.reduce((a, b) => (cmp(a, b) >= 0 ? a : b))
        const nums = vals.map(Number)
        const sum = nums.reduce((a, b) => a + b, 0)
        return e.name === 'sum' ? sum : sum / nums.length
      }
      const a = e.args.map((x) => ev(x, ctx, cols))
      switch (e.name) {
        case 'round': return a[0] === null ? null : Math.round(Number(a[0]) * 10 ** Number(a[1] ?? 0)) / 10 ** Number(a[1] ?? 0)
        case 'upper': return a[0] === null ? null : String(a[0]).toUpperCase()
        case 'lower': return a[0] === null ? null : String(a[0]).toLowerCase()
        case 'length': return a[0] === null ? null : String(a[0]).length
        case 'abs': return a[0] === null ? null : Math.abs(Number(a[0]))
      }
      throw new SqlError(`unknown function ${e.name.toUpperCase()}()`)
    }
  }
}

function label(item: Select['items'][number]): string {
  if (item.alias) return item.alias
  return item.text
}

export function runSql(input: string): SqlResult {
  try {
    const q = input.trim().replace(/;+\s*$/, '')
    if (!q) throw new SqlError('empty query')
    const low = q.toLowerCase()
    if (low === 'show tables' || low === '.tables') {
      return { columns: ['table', 'rows', 'about'], rows: Object.keys(TABLES).map((t) => [t, TABLES[t].length, TABLE_NOTES[t]]) }
    }
    const desc = low.match(/^(?:describe|desc|\.schema)\s+([a-z_]+)$/)
    if (desc) {
      const t = TABLES[desc[1]]
      if (!t) throw new SqlError(`no such table: ${desc[1]}`)
      return { columns: ['column', 'type'], rows: Object.entries(t[0]).map(([k, v]) => [k, typeof v === 'number' ? 'number' : 'text']) }
    }
    const sel = new Parser(tokenize(q)).parseSelect()
    const table = Object.keys(TABLES).find((t) => t === sel.from.toLowerCase())
    if (!table) throw new SqlError(`no such table: ${sel.from}. Try SHOW TABLES`)
    const src = TABLES[table]
    const cols = Object.keys(src[0] ?? {})

    // expand *
    const items: Select['items'] = sel.items.flatMap((it) => (it.e.k === 'star' ? cols.map((c) => ({ e: { k: 'col', name: c } as Expr, text: c })) : [it]))

    let rows = src
    if (sel.where) {
      if (hasAgg(sel.where)) throw new SqlError('aggregates are not allowed in WHERE (use HAVING)')
      rows = rows.filter((r) => Boolean(ev(sel.where!, { rows: [r] }, cols)))
    }

    const grouped = sel.groupBy.length > 0 || items.some((i) => hasAgg(i.e)) || hasAgg(sel.having)
    let groups: Row[][]
    if (grouped) {
      if (sel.groupBy.length === 0) groups = [rows]
      else {
        const map = new Map<string, Row[]>()
        for (const r of rows) {
          const key = JSON.stringify(sel.groupBy.map((g) => ev(g, { rows: [r] }, cols)))
          const arr = map.get(key)
          if (arr) arr.push(r); else map.set(key, [r])
        }
        groups = [...map.values()]
      }
    } else groups = rows.map((r) => [r])

    type Out = { vals: Val[]; ctx: Ctx }
    let out: Out[] = groups.map((g) => {
      const alias: Record<string, Val> = {}
      const vals = items.map((it) => {
        const v = ev(it.e, { rows: g }, cols)
        if (it.alias) alias[it.alias.toLowerCase()] = v
        return v
      })
      return { vals, ctx: { rows: g, alias } }
    })
    if (sel.having) out = out.filter((o) => Boolean(ev(sel.having!, o.ctx, cols)))
    if (sel.distinct) {
      const seen = new Set<string>()
      out = out.filter((o) => { const k = JSON.stringify(o.vals); if (seen.has(k)) return false; seen.add(k); return true })
    }
    if (sel.orderBy.length) {
      out = [...out].sort((a, b) => {
        for (const ob of sel.orderBy) {
          // allow ORDER BY <n> style via numbers? keep simple: expressions and aliases
          const va = ev(ob.e, a.ctx, cols), vb = ev(ob.e, b.ctx, cols)
          if (va === vb) continue
          if (va === null) return 1
          if (vb === null) return -1
          const c = cmp(va, vb)
          if (c !== 0) return ob.desc ? -c : c
        }
        return 0
      })
    }
    if (sel.limit !== undefined) out = out.slice(0, sel.limit)
    const result = out.map((o) => o.vals.map((v) => (typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1e4) / 1e4 : v)))
    return { columns: items.map(label), rows: result }
  } catch (err) {
    if (err instanceof SqlError) throw err
    throw new SqlError('could not run that query')
  }
}

export function safeRunSql(input: string): { ok: true; result: SqlResult } | { ok: false; error: string } {
  try { return { ok: true, result: runSql(input) } } catch (e) { return { ok: false, error: e instanceof Error ? e.message : 'error' } }
}

export const SAMPLE_QUERIES = [
  'SHOW TABLES',
  'SELECT * FROM delay_distribution ORDER BY records DESC',
  'SELECT category, records, ROUND(records * 100.0 / 73208, 1) AS pct FROM delay_distribution ORDER BY pct DESC',
  'SELECT route_id, avg_delay, on_time_rate FROM routes WHERE on_time_rate > 87 ORDER BY on_time_rate DESC LIMIT 5',
  'SELECT COUNT(*) AS routes, ROUND(AVG(on_time_rate), 1) AS avg_on_time FROM routes',
  'SELECT operator, routes FROM operators WHERE routes > 0 ORDER BY routes DESC',
  'SELECT kind, COUNT(*) AS n FROM projects GROUP BY kind',
]
