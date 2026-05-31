// Line parser. Resolves the app-level force sentinels (§5.3) and tokenizes the
// command name + args for native dispatch. The SHELL path never uses these
// tokens — it receives the sentinel-stripped line verbatim so just-bash does
// its own (correct) parsing of quotes, pipes, subshells, and redirections.

export type ForceTarget = 'shell' | 'native' | null

export interface ParsedLine {
  /** The original input. */
  raw: string
  /** Sentinel-stripped, trimmed line — what the shell engine receives. */
  line: string
  /** `!` forces shell, `:` forces native, else null. */
  force: ForceTarget
  /** First token, for native dispatch and fuzzy matching. */
  name: string
  /** Remaining tokens (quote-aware) for native handlers. */
  args: string[]
  empty: boolean
}

/** Quote-aware whitespace tokenizer for native command args. */
export function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null
  let hasToken = false

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      if (ch === quote) quote = null
      else current += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      hasToken = true
      continue
    }
    if (ch === ' ' || ch === '\t') {
      if (hasToken) {
        tokens.push(current)
        current = ''
        hasToken = false
      }
      continue
    }
    current += ch
    hasToken = true
  }
  if (hasToken) tokens.push(current)
  return tokens
}

export function parseLine(raw: string): ParsedLine {
  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    return { args: [], empty: true, force: null, line: '', name: '', raw }
  }

  let force: ForceTarget = null
  let body = trimmed
  if (trimmed.startsWith('!')) {
    force = 'shell'
    body = trimmed.slice(1).trim()
  } else if (trimmed.startsWith(':')) {
    force = 'native'
    body = trimmed.slice(1).trim()
  }

  const tokens = tokenize(body)
  return {
    args: tokens.slice(1),
    empty: body.length === 0,
    force,
    line: body,
    name: tokens[0] ?? '',
    raw,
  }
}
