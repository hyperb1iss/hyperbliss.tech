import type { RegexMatchMode } from './types'

const FLAG_ORDER = ['d', 'g', 'i', 'm', 's', 'u', 'v', 'y'] as const
const MAX_MATCHES = 100

export interface RegexCapture {
  index: number
  value: string | undefined
}

export interface RegexMatch {
  captures: RegexCapture[]
  end: number
  namedCaptures: Record<string, string | undefined>
  start: number
  text: string
}

export interface RegexEvaluationConfig {
  flags?: string
  input: string
  jsRegex?: string
  jsValidator?: (input: string) => boolean
  matchMode?: RegexMatchMode
  maxInputLength?: number
  regex: string
}

export interface RegexEvaluation {
  engineLabel: string
  error: string | null
  execTimeUs: number
  isMatch: boolean
  matchMode: RegexMatchMode
  matches: RegexMatch[]
  skippedReason: string | null
}

function normalizeFlags(flags: string | undefined, purpose: 'scan' | 'test') {
  const wanted = new Set(flags ?? '')
  if (purpose === 'scan') {
    wanted.add('g')
    wanted.delete('y')
  } else {
    wanted.delete('g')
    wanted.delete('y')
  }
  return FLAG_ORDER.filter((flag) => wanted.has(flag)).join('')
}

function compileRegex(pattern: string, flags: string | undefined, purpose: 'scan' | 'test') {
  return new RegExp(pattern, normalizeFlags(flags, purpose))
}

function collectMatches(pattern: string, flags: string | undefined, input: string) {
  const re = compileRegex(pattern, flags, 'scan')
  const matches: RegexMatch[] = []
  let guard = 0

  for (let match = re.exec(input); match !== null && guard < MAX_MATCHES; match = re.exec(input)) {
    matches.push({
      captures: match.slice(1).map((value, index) => ({ index: index + 1, value })),
      end: match.index + match[0].length,
      namedCaptures: match.groups ?? {},
      start: match.index,
      text: match[0],
    })

    if (match[0].length === 0) {
      re.lastIndex += 1
      if (re.lastIndex > input.length) break
    }

    guard += 1
  }

  return matches
}

function testMatch(pattern: string, flags: string | undefined, input: string, matchMode: RegexMatchMode) {
  const match = compileRegex(pattern, flags, 'test').exec(input)
  if (!match) return false
  return matchMode === 'contains' || (match.index === 0 && match[0].length === input.length)
}

export function getRegexEngineLabel(config: Pick<RegexEvaluationConfig, 'jsRegex' | 'jsValidator' | 'regex'>) {
  if (config.jsValidator) return 'JavaScript validator'
  if (config.jsRegex && config.jsRegex !== config.regex) return 'JavaScript approximation'
  return 'JavaScript regex'
}

export function evaluateRegexInput(config: RegexEvaluationConfig): RegexEvaluation {
  const matchMode = config.matchMode ?? 'full'
  const engineLabel = getRegexEngineLabel(config)

  if (config.maxInputLength && config.input.length > config.maxInputLength) {
    return {
      engineLabel,
      error: null,
      execTimeUs: 0,
      isMatch: false,
      matches: [],
      matchMode,
      skippedReason: `Live execution is capped at ${config.maxInputLength} characters for this backtracking trap.`,
    }
  }

  const startedAt = performance.now()

  try {
    if (config.jsValidator) {
      const isMatch = config.jsValidator(config.input)
      return {
        engineLabel,
        error: null,
        execTimeUs: Math.round((performance.now() - startedAt) * 1000),
        isMatch,
        matches: isMatch
          ? [{ captures: [], end: config.input.length, namedCaptures: {}, start: 0, text: config.input }]
          : [],
        matchMode,
        skippedReason: null,
      }
    }

    const pattern = config.jsRegex ?? config.regex
    const matches = collectMatches(pattern, config.flags, config.input)
    const isMatch = testMatch(pattern, config.flags, config.input, matchMode)

    return {
      engineLabel,
      error: null,
      execTimeUs: Math.round((performance.now() - startedAt) * 1000),
      isMatch,
      matches,
      matchMode,
      skippedReason: null,
    }
  } catch (error) {
    return {
      engineLabel,
      error: error instanceof Error ? error.message : 'Regex execution failed',
      execTimeUs: 0,
      isMatch: false,
      matches: [],
      matchMode,
      skippedReason: null,
    }
  }
}
