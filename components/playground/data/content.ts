import type { Row } from './dublin'

export interface ProjectInfo {
  id: string
  name: string
  icon: string
  kind: string
  tagline: string
  details: string[]
  stack: string[]
  links: { label: string; href: string }[]
}

// Only real projects. Descriptions stay close to what is publicly verifiable.
export const PROJECTS: ProjectInfo[] = [
  {
    id: 'dublin-bus',
    name: 'Dublin Bus Pipeline',
    icon: '🚌',
    kind: 'data engineering',
    tagline: 'Real-time transit data pipeline',
    details: [
      "Collects real-time bus positions and delays from Transport for Ireland's GTFS-Realtime API, stores them in SQLite and computes delay analytics, with a Streamlit dashboard on top.",
      'The demo dataset in this playground (see the SQL app) is a real snapshot: 9 polls, 708 vehicles, 198 routes.',
      'Write-ups: the case study and the blog posts about route reliability, peak hours and delay prediction.',
    ],
    stack: ['Python', 'GTFS-Realtime', 'SQLite', 'Streamlit'],
    links: [
      { label: 'Case study', href: '/projects/case-studies/dublin-bus-pipeline' },
      { label: 'All projects', href: '/projects' },
    ],
  },
  {
    id: 'quarry',
    name: 'Quarry',
    icon: '⛏️',
    kind: 'iOS app',
    tagline: 'SQL & Data Interview practice',
    details: [
      'Free iOS app for practising SQL, pandas and Python interview problems, with 168 problems in version 1.1.',
      'Code is graded on-device and practice works fully offline.',
    ],
    stack: ['Swift', 'Pyodide'],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/us/app/quarry-sql-data-interview/id6785931623' }],
  },
  {
    id: 'faders',
    name: 'Faders',
    icon: '📻',
    kind: 'iOS / watchOS app',
    tagline: "Radio that doesn't suck",
    details: [
      'A radio app for iPhone, iPad, Apple Watch and Made for iPhone Duo: stations, the song that is playing, lyrics.',
      'No account and no tracking.',
    ],
    stack: ['Swift', 'watchOS'],
    links: [{ label: 'Support & privacy', href: 'https://github.com/mayankgulaty/faders-app' }],
  },
  {
    id: 'flowbit',
    name: 'Flowbit Studio',
    icon: '🛠️',
    kind: 'studio',
    tagline: 'Design-and-engineering studio in Dublin',
    details: [
      'Two-person studio building websites, AI systems and automation for businesses. I lead engineering and automation.',
    ],
    stack: ['Web', 'AI workflows', 'Automation'],
    links: [{ label: 'flowbitstudio.com', href: 'https://www.flowbitstudio.com/' }],
  },
  {
    id: 'voicestudio',
    name: 'VoiceStudio',
    icon: '🎙️',
    kind: 'open source',
    tagline: 'Fully-local voice cloning, dubbing and dictation',
    details: ['Open-source, fully-local alternative to cloud voice tools. Public on GitHub.'],
    stack: ['Open source', 'Local AI'],
    links: [
      { label: 'voicestudio.sh', href: 'https://voicestudio.sh' },
      { label: 'GitHub', href: 'https://github.com/mayankgulaty/voicestudio' },
    ],
  },
]

export const SKILLS = [
  'Python', 'SQL', 'Apache Spark', 'AWS', 'Airflow', 'Data modelling', 'ETL / ELT', 'TypeScript', 'React / Next.js', 'Swift',
]

export const FORTUNES = [
  'There are only two hard things in data engineering: cache invalidation, naming things, and exactly-once delivery.',
  "A SQL query walks into a bar, sees two tables and asks: 'Mind if I join you?'",
  'It works on my machine. It also works in prod. Nobody knows why.',
  'The pipeline is green. Be suspicious.',
  "Data quality is like oxygen: nobody notices it until it's missing.",
  "SELECT * FROM life WHERE bugs = 0; -- 0 rows returned.",
  'Idempotency: doing the same thing twice and still being right. Also a good marriage.',
  "Backfills are just time travel with a bigger cloud bill.",
  "There's no such thing as 'just a quick schema change'.",
  'NULL is not zero, not empty, and certainly not your friend.',
  "'We'll fix it in the next sprint' is the 'thoughts and prayers' of tech debt.",
  'A data lake without governance is a data swamp with a nice logo.',
  'Late-arriving data is just data with a different sense of time.',
  'Eventually consistent, eventually correct, eventually promoted.',
  'Friends do not let friends parse CSV by hand.',
  'It was DNS. It is always DNS. Except when it is timezones.',
  'You can tell a senior engineer by how many things they refuse to build.',
  'Premature optimisation is the root of all evil. Premature abstraction is its cousin.',
]

export const PROJECT_ROWS: Row[] = PROJECTS.map((p) => ({ name: p.name, kind: p.kind, stack: p.stack.join(', ') }))

export const SKILL_ROWS: Row[] = SKILLS.map((s, i) => ({ id: i + 1, skill: s }))
