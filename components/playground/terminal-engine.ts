import { siteConfig } from '@/lib/site'
import { FORTUNES, PROJECTS, SKILLS } from './data/content'
import { DELAY_DISTRIBUTION, ROUTES, OPERATORS } from './data/dublin'
import { safeRunSql, TABLES, type SqlResult } from './sql-engine'
import type { AppId, OsApi } from './types'

export interface Line { text: string; cls?: 'err' | 'dim' | 'ok'; href?: string }
export interface ExecResult {
  lines: Line[]
  cwd?: string[]
  clear?: boolean
  exit?: boolean
  /** print line by line with a short delay (skipped for reduced motion) */
  stream?: boolean
}

type FsNode = string | (() => string) | { [name: string]: FsNode }
type Dir = { [name: string]: FsNode }

const out = (...t: string[]): Line[] => t.map((text) => ({ text }))
const err = (t: string): Line[] => [{ text: t, cls: 'err' }]

function csv(rows: Record<string, string | number | null>[]) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  return [cols.join(','), ...rows.map((r) => cols.map((c) => r[c]).join(','))].join('\n')
}

export function buildFs(os: OsApi): Dir {
  const projects: Dir = {}
  for (const p of PROJECTS) {
    projects[`${p.id}.md`] = `# ${p.name} (${p.kind})\n${p.tagline}\n\n${p.details.join('\n\n')}\n\nstack: ${p.stack.join(', ')}\n${p.links.map((l) => `${l.label}: ${l.href}`).join('\n')}`
  }
  const blog: Dir = {}
  for (const p of os.posts) blog[`${p.slug}.md`] = `# ${p.title}\n${p.date}${p.readingTime ? ` · ${p.readingTime} min read` : ''}\n\n${p.excerpt}\n\nRead it: /blog/${p.slug}  (or: open blog ${p.slug})`
  return {
    'about.md': `# ${siteConfig.author.name}\n\n${siteConfig.author.bio}\n\nBased in Ireland. ${siteConfig.author.location}.\nTry: projects, blog, sudo hire-me`,
    'skills.txt': SKILLS.join('\n'),
    'resume.pdf': 'cat: resume.pdf: binary file. Try: open resume',
    projects,
    blog,
    data: {
      'routes.csv': () => csv(ROUTES),
      'delay_distribution.csv': () => csv(DELAY_DISTRIBUTION),
      'operators.csv': () => csv(OPERATORS),
      'README.txt': 'Real snapshot of the Dublin bus pipeline. Query it: sql SELECT * FROM routes LIMIT 3',
    },
    '.secrets': 'SECRET_SAUCE=idempotent merges\nFAVOURITE_JOIN=left\nEASTER_EGGS=more than you think. Keep looking.\nHINT=the Konami code works here too.',
  }
}

function resolve(cwd: string[], path: string): string[] | null {
  const parts = path.startsWith('/') || path.startsWith('~') ? [] : [...cwd]
  const raw = path.replace(/^~/, '').split('/').filter(Boolean)
  for (const seg of raw) {
    if (seg === '.') continue
    if (seg === '..') { parts.pop(); continue }
    parts.push(seg)
  }
  return parts
}

function nodeAt(fs: Dir, path: string[] | null): FsNode | undefined {
  if (!path) return undefined
  let cur: FsNode = fs
  for (const p of path) {
    if (typeof cur === 'string' || typeof cur === 'function') return undefined
    cur = cur[p]
    if (cur === undefined) return undefined
  }
  return cur
}
const isDir = (n: FsNode | undefined): n is Dir => typeof n === 'object' && n !== null

export const promptPath = (cwd: string[]) => '~' + (cwd.length ? '/' + cwd.join('/') : '')

function asciiTable(r: SqlResult): string[] {
  const cells = r.rows.map((row) => row.map((v) => (v === null ? 'NULL' : String(v))))
  const widths = r.columns.map((c, i) => Math.min(40, Math.max(c.length, ...cells.map((row) => row[i].length))))
  const fmt = (row: string[]) => row.map((c, i) => (c.length > widths[i] ? c.slice(0, widths[i] - 1) + '…' : c).padEnd(widths[i])).join(' │ ')
  return [fmt(r.columns), widths.map((w) => '─'.repeat(w)).join('─┼─'), ...cells.map(fmt), `(${r.rows.length} row${r.rows.length === 1 ? '' : 's'})`]
}

const LOGO = [
  '   ╭───────╮   ',
  '   │ ◉   ◉ │   ',
  '   │   │   │   ',
  '   ├─◉─┴─◉─┤   ',
  '   │ mcj-OS│   ',
  '   ╰───────╯   ',
]

function neofetch(os: OsApi, cwd: string[]): Line[] {
  const up = Math.max(1, Math.round((Date.now() - os.startedAt) / 1000))
  const info = [
    `visitor@mycodingjourney`,
    '───────────────────────',
    `OS: mcj-OS 1.0 (Next.js 16, React 19)`,
    `Host: ${siteConfig.url.replace('https://', '')}`,
    `Shell: mcjsh (definitely not bash)`,
    `Theme: ${os.themes.find((t) => t.id === os.themeId)?.name ?? os.themeId}`,
    `Uptime: ${up}s (and counting)`,
    `Packages: ${PROJECTS.length} projects, ${os.posts.length} posts`,
    `CPU: 1x caffeinated`,
    `Memory: 47 browser tabs open`,
    `Location: ${promptPath(cwd)}`,
  ]
  const n = Math.max(LOGO.length, info.length)
  return Array.from({ length: n }, (_, i) => ({ text: `${(LOGO[i] ?? ' '.repeat(15))}  ${info[i] ?? ''}` }))
}

const COWSAY = (msg: string) => {
  const w = Math.min(Math.max(msg.length, 4), 40)
  const wrapped = msg.match(new RegExp(`.{1,${w}}`, 'g')) ?? [msg]
  const top = ' ' + '_'.repeat(w + 2)
  const bottom = ' ' + '-'.repeat(w + 2)
  const body = wrapped.map((l) => `| ${l.padEnd(w)} |`)
  return [top, ...body, bottom, '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||']
}

const HELP = [
  'Commands (hidden ones exist, keep poking):',
  '  help                 this list',
  '  ls [-a] [dir]        list files        cd, pwd, cat, tree',
  '  about, projects, blog   quick tours',
  '  open <app> [arg]     terminal projects blog about pipeline sql duck settings resume',
  '  sql <query>          query the real Dublin bus data (try: sql SHOW TABLES)',
  '  theme [name]         list or switch themes',
  '  neofetch, whoami, date, uname, history, clear',
  '  fortune, cowsay <text>, matrix, play, duck',
  '  sudo hire-me         you know you want to',
]

const APP_ALIASES: Record<string, AppId> = {
  terminal: 'terminal', term: 'terminal', projects: 'projects', finder: 'projects', blog: 'blog', about: 'about',
  pipeline: 'pipeline', game: 'pipeline', play: 'pipeline', sql: 'sql', duck: 'duck', settings: 'settings', appearance: 'settings', themes: 'settings',
}

export const COMMANDS = [
  'help', 'ls', 'cd', 'cat', 'pwd', 'tree', 'about', 'projects', 'blog', 'open', 'sql', 'theme', 'neofetch', 'whoami', 'date', 'uname',
  'history', 'clear', 'fortune', 'cowsay', 'matrix', 'play', 'duck', 'sudo', 'echo', 'exit', 'hostname', 'man', 'konami', 'coffee',
]

export function complete(partial: string, cwd: string[], fs: Dir, themes: string[]): string[] {
  const parts = partial.split(/\s+/)
  if (parts.length <= 1) return COMMANDS.filter((c) => c.startsWith(parts[0]))
  const [cmd, last] = [parts[0], parts[parts.length - 1]]
  if (cmd === 'theme') return themes.filter((t) => t.startsWith(last))
  if (cmd === 'open') return Object.keys(APP_ALIASES).concat('resume').filter((t) => t.startsWith(last))
  const slash = last.lastIndexOf('/')
  const dirPart = slash >= 0 ? last.slice(0, slash + 1) : ''
  const namePart = slash >= 0 ? last.slice(slash + 1) : last
  const dirPath = resolve(cwd, dirPart || '.')
  const dir = nodeAt(fs, dirPath)
  if (!isDir(dir)) return []
  return Object.keys(dir).filter((n) => n.startsWith(namePart) && (namePart.startsWith('.') || !n.startsWith('.'))).map((n) => dirPart + n + (isDir(dir[n]) ? '/' : ''))
}

export function exec(raw: string, cwd: string[], os: OsApi, history: string[]): ExecResult {
  const input = raw.trim()
  if (!input) return { lines: [] }
  const fs = buildFs(os)
  const [cmd, ...args] = input.split(/\s+/)
  const rest = input.slice(cmd.length).trim()

  switch (cmd.toLowerCase()) {
    case 'help': case '?': return { lines: out(...HELP) }
    case 'clear': return { lines: [], clear: true }
    case 'exit': case 'logout': return { lines: out('logout'), exit: true }
    case 'pwd': return { lines: out('/home/visitor' + (cwd.length ? '/' + cwd.join('/') : '')) }
    case 'whoami': return { lines: out('visitor  (a very welcome one)') }
    case 'hostname': return { lines: out('mycodingjourney') }
    case 'date': return { lines: out(new Date().toString()) }
    case 'uname': return { lines: out(args.includes('-a') ? 'mcj-OS 1.0 mycodingjourney 16.0.0-react19 #1 SMP PREEMPT x86_64 Browser/GNU' : 'mcj-OS') }
    case 'echo': return { lines: out(rest.replace(/^["']|["']$/g, '')) }
    case 'history': return { lines: history.map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}` })) }
    case 'neofetch': return { lines: neofetch(os, cwd) }
    case 'fortune': return { lines: out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]) }
    case 'cowsay': return { lines: out(...COWSAY(rest || 'moo. I mean: SELECT * FROM cows;')) }
    case 'matrix': os.matrix(); return { lines: out(os.reduceMotion ? 'Matrix rain is off because you asked for reduced motion. Take the blue pill.' : 'Wake up, visitor…') }
    case 'konami': return { lines: out('Try typing it on the keyboard, not here:', '↑ ↑ ↓ ↓ ← → ← → B A') }
    case 'coffee': case 'make': return { lines: rest.includes('sandwich') ? out('What? Make it yourself.') : out('☕ Brewing… done. (Your pipeline is still red though.)') }
    case 'play': case 'duck': os.open(cmd === 'play' ? 'pipeline' : 'duck'); return { lines: out(cmd === 'play' ? 'Launching Pipeline Panic…' : 'Quack.') }
    case 'about': os.open('about'); return { lines: out(...String(nodeAt(fs, ['about.md'])).split('\n')) }
    case 'resume': os.open('about'); return { lines: [{ text: 'Résumé: /resume.pdf', href: '/resume.pdf' }] }
    case 'projects': {
      os.open('projects')
      return { lines: [...out('Projects (also open in Finder):'), ...PROJECTS.map((p) => ({ text: `  ${p.icon} ${p.name.padEnd(22)} ${p.tagline}` }))] }
    }
    case 'blog': {
      os.open('blog')
      if (!os.posts.length) return { lines: out('No posts loaded. Full blog: /blog') }
      return { lines: [...out('Latest posts (also open in the Blog app):'), ...os.posts.map((p) => ({ text: `  ${p.date.padEnd(16)} ${p.title}` }))] }
    }
    case 'theme': case 'themes': {
      const visible = os.themes
      if (!args[0]) return { lines: out('Themes (current marked with *):', ...visible.map((t) => `  ${t.id === os.themeId ? '*' : ' '} ${t.id.padEnd(10)} ${t.name} · ${t.blurb}`), 'Usage: theme <name>') }
      const t = visible.find((x) => x.id === args[0].toLowerCase())
      if (!t) return { lines: err(`theme: unknown theme '${args[0]}'`) }
      os.setTheme(t.id)
      return { lines: out(`Theme set to ${t.name}.`) }
    }
    case 'open': {
      const name = (args[0] || '').toLowerCase()
      if (!name) return { lines: err('usage: open <terminal|projects|blog|about|pipeline|sql|duck|settings|resume> [arg]') }
      if (name === 'resume') { window.open('/resume.pdf', '_blank', 'noopener'); return { lines: out('Opening /resume.pdf …') } }
      const app = APP_ALIASES[name]
      if (!app) return { lines: err(`open: unknown app '${name}'`) }
      os.open(app, name === 'blog' && args[1] ? { slug: args[1] } : name === 'projects' && args[1] ? { project: args[1] } : {})
      return { lines: out(`Opening ${app}…`) }
    }
    case 'sql': {
      if (!rest) return { lines: out('usage: sql <query>   e.g. sql SELECT * FROM delay_distribution', 'tables: ' + Object.keys(TABLES).join(', ')) }
      const r = safeRunSql(rest)
      if (!r.ok) return { lines: err('sql: ' + r.error) }
      return { lines: out(...asciiTable(r.result)) }
    }
    case 'ls': {
      const showAll = args.some((a) => a === '-a' || a === '-la' || a === '-al')
      const target = args.find((a) => !a.startsWith('-'))
      const path = resolve(cwd, target ?? '.')
      const n = nodeAt(fs, path)
      if (n === undefined || n === null) return { lines: err(`ls: cannot access '${target}': No such file or directory`) }
      if (!isDir(n)) return { lines: out(target ?? '') }
      const names = Object.keys(n).filter((k) => showAll || !k.startsWith('.')).sort()
      if (!names.length) return { lines: [] }
      return { lines: out(names.map((k) => (isDir(n[k]) ? k + '/' : k)).join('   ')) }
    }
    case 'cd': {
      const path = resolve(cwd, args[0] ?? '~')
      const n = nodeAt(fs, path)
      if (!isDir(n)) return { lines: err(`cd: ${args[0]}: ${n === undefined ? 'No such file or directory' : 'Not a directory'}`) }
      return { lines: [], cwd: path! }
    }
    case 'cat': {
      if (!args[0]) return { lines: err('usage: cat <file>') }
      const path = resolve(cwd, args[0])
      const n = nodeAt(fs, path)
      if (n === undefined) return { lines: err(`cat: ${args[0]}: No such file or directory`) }
      if (isDir(n)) return { lines: err(`cat: ${args[0]}: Is a directory`) }
      const text = typeof n === 'function' ? n() : n
      return { lines: out(...text.split('\n')) }
    }
    case 'tree': {
      const lines: string[] = ['.']
      const walk = (d: Dir, prefix: string) => {
        const keys = Object.keys(d).filter((k) => !k.startsWith('.')).sort()
        keys.forEach((k, i) => {
          const last = i === keys.length - 1
          lines.push(`${prefix}${last ? '└── ' : '├── '}${k}${isDir(d[k]) ? '/' : ''}`)
          if (isDir(d[k])) walk(d[k] as Dir, prefix + (last ? '    ' : '│   '))
        })
      }
      walk(fs, '')
      return { lines: out(...lines) }
    }
    case 'sudo': {
      const sub = args.join(' ').toLowerCase()
      if (sub === 'hire-me' || sub === 'hire me' || sub === 'hireme') {
        return {
          stream: true,
          lines: [
            { text: '[sudo] password for recruiter: ********' },
            { text: 'Verifying credentials… ✓', cls: 'dim' },
            { text: 'Checking availability… ✓ open to opportunities', cls: 'dim' },
            { text: 'Access granted.', cls: 'ok' },
            { text: '→ /hire  (the polite way to hire me)', href: '/hire' },
            { text: '→ /contact  (or just say hi)', href: '/contact' },
            { text: `→ ${siteConfig.author.email}`, href: `mailto:${siteConfig.author.email}` },
          ],
        }
      }
      if (sub.startsWith('rm -rf /') || sub === 'rm -rf *') {
        return {
          stream: true,
          lines: [
            { text: 'rm: removing /usr, /etc, /home, /var…', cls: 'err' },
            { text: 'rm: removing /dev/null… (it was empty anyway)', cls: 'err' },
            { text: 'rm: removing the cloud bill… ✓ (finally)', cls: 'ok' },
            { text: 'rm: removing node_modules… 4.2 GB freed. Nobody noticed.', cls: 'dim' },
            { text: 'Just kidding. This is a browser tab. Nothing was harmed.' },
          ],
        }
      }
      if (sub.includes('make me a sandwich')) return { lines: out('Okay.') }
      if (!sub) return { lines: err('usage: sudo <command>   (hint: sudo hire-me)') }
      return { lines: err('visitor is not in the sudoers file. This incident will be reported to /dev/null.') }
    }
    case 'rm': return { lines: err('rm: permission denied. The filesystem is read-only, and so is my willingness.') }
    case 'mkdir': case 'touch': case 'mv': case 'cp': return { lines: err(`${cmd}: read-only filesystem`) }
    case 'vim': case 'vi': case 'nano': case 'emacs': return { lines: out(cmd === 'emacs' ? 'Emacs is a great OS. It lacks a decent editor.' : 'You are now trapped. (Hint: :q! does not work here either.)') }
    case 'ping': return { lines: out(`PING ${args[0] || 'localhost'}: 56 data bytes`, `64 bytes: icmp_seq=0 ttl=64 time=0.042 ms`, '--- 1 packets transmitted, 1 received, 0% packet loss ---') }
    case 'git': {
      if (args[0] === 'log') return { lines: out('commit 3bfc618  Merge pull request #8: quick fixes', 'commit cd057fd  fix: absolute page titles', '… and then I wrote this whole desktop.') }
      if (args[0] === 'blame') return { lines: out('Everything: Mayank Gulaty') }
      return { lines: out('git: it worked on my branch.') }
    }
    case 'docker': return { lines: out('CONTAINER ID   IMAGE            STATUS', 'a1b2c3d4e5f6   pipeline:latest  Up 3 minutes (unhealthy, but trying its best)') }
    case 'kubectl': return { lines: out('NAME                   READY   STATUS             RESTARTS', 'etl-worker-7d9f8       1/1     Running            0', 'etl-worker-flaky-x2k   0/1     CrashLoopBackOff   17') }
    case 'airflow': return { lines: out('dag_id            state', 'dublin_bus_etl    success', 'friday_deploy     failed (it is always Friday)') }
    case 'spark-submit': return { lines: out('Submitting application… 199/200 tasks complete.', 'Waiting on the last task (it has all the skew).') }
    case 'top': case 'htop': return { lines: out('PID   %CPU  COMMAND', '1     99.9  chrome (this tab)', '42    0.1   mcjsh', '404   0.0   motivation (not found)') }
    case 'man': return { lines: out(args[0] ? `No manual entry for ${args[0]}. Try: help` : 'What manual page do you want? Try: help') }
    case 'curl': case 'wget': return { lines: out('Network access is disabled. The best requests are the ones you never make.') }
    case '42': return { lines: out('Yes. But what is the question?') }
    case 'hello': case 'hi': return { lines: out('Hello, visitor. Type help.') }
    case 'cd..': return { lines: err('cd..: command not found. (Windows habit? Put a space.)') }
    default:
      return { lines: err(`${cmd}: command not found. Try 'help'.`) }
  }
}

export const WELCOME: Line[] = [
  { text: 'mcjsh 1.0 · type help to get started · Tab completes · try: neofetch', cls: 'dim' },
]
