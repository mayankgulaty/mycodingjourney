/**
 * Small regex highlighter. No WASM, no grammar runtime, no eval.
 * Unknown languages stay plain so ASCII diagrams are not recolored.
 */

export type TokenKind = 'plain' | 'comment' | 'string' | 'keyword' | 'number'

export type Token = { text: string; kind: TokenKind }

const KEYWORDS: Record<string, readonly string[]> = {
  python: [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
    'continue', 'def', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if',
    'import', 'in', 'is', 'lambda', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
    'with', 'yield',
  ],
  javascript: [
    'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
    'else', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'if',
    'import', 'let', 'new', 'null', 'return', 'switch', 'this', 'throw', 'true', 'try',
    'typeof', 'undefined', 'var', 'while', 'yield',
  ],
  bash: [
    'if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'in', 'case', 'esac',
    'function', 'return', 'echo', 'exit', 'export', 'local', 'cd', 'source',
  ],
  sql: [
    'select', 'from', 'where', 'and', 'or', 'insert', 'into', 'values', 'update', 'set',
    'delete', 'join', 'left', 'right', 'inner', 'on', 'group', 'by', 'order', 'limit',
    'as', 'create', 'table', 'not', 'null', 'distinct', 'with',
  ],
  json: ['true', 'false', 'null'],
}

type Family = 'python' | 'javascript' | 'bash' | 'sql' | 'json' | 'plain'

function family(language: string): Family {
  switch (language.toLowerCase()) {
    case 'py':
    case 'python':
      return 'python'
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
    case 'javascript':
    case 'ts':
    case 'tsx':
    case 'typescript':
      return 'javascript'
    case 'sh':
    case 'bash':
    case 'shell':
    case 'zsh':
      return 'bash'
    case 'sql':
      return 'sql'
    case 'json':
      return 'json'
    default:
      return 'plain'
  }
}

function pattern(kind: Family): RegExp | null {
  switch (kind) {
    case 'python':
      return /#.*$|"""(?:\\.|[^"\\])*"""|'''(?:\\.|[^'\\])*'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][\w]*\b/g
    case 'bash':
      return /#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[A-Za-z_][\w-]*\b/g
    case 'json':
      return /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b/g
    case 'sql':
    case 'javascript':
      return /\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b/g
    default:
      return null
  }
}

export function highlightLine(line: string, language: string): Token[] {
  const kind = family(language)
  const re = pattern(kind)
  if (!line || !re) return [{ text: line, kind: 'plain' }]

  const keywords = KEYWORDS[kind] ?? []
  const caseInsensitive = kind === 'sql' || kind === 'bash'
  const tokens: Token[] = []
  let last = 0
  re.lastIndex = 0

  for (let match = re.exec(line); match; match = re.exec(line)) {
    if (match.index > last) tokens.push({ text: line.slice(last, match.index), kind: 'plain' })
    const text = match[0]
    let tokenKind: TokenKind = 'plain'
    if (text.startsWith('#') || text.startsWith('//')) tokenKind = 'comment'
    else if (text.startsWith('"') || text.startsWith("'") || text.startsWith('`')) tokenKind = 'string'
    else if (text[0] === '-' || (text[0] >= '0' && text[0] <= '9')) tokenKind = 'number'
    else if (caseInsensitive ? keywords.includes(text.toLowerCase()) : keywords.includes(text)) tokenKind = 'keyword'
    tokens.push({ text, kind: tokenKind })
    last = match.index + text.length
    if (match.index === re.lastIndex) re.lastIndex += 1
  }

  if (last < line.length) tokens.push({ text: line.slice(last), kind: 'plain' })
  return tokens.length > 0 ? tokens : [{ text: line, kind: 'plain' }]
}
