// Tab completion. The first token completes against command names; later
// tokens complete against virtual-FS paths (files + directories) derived from
// the manifest. Pure: candidates are injected so it's trivially testable.

import type { Manifest } from '@/lib/terminal/types'
import { tokenize } from './parser'

export interface Completion {
  /** The token fragment being completed. */
  token: string
  /** Matching candidates (sorted). */
  matches: string[]
  /** Longest common prefix of the matches (for partial completion). */
  commonPrefix: string
  /** The full line with the token replaced by the best completion. */
  completedLine: string
}

/** All completable paths from the manifest: every file plus its ancestor dirs. */
export function fsPaths(manifest: Manifest): string[] {
  const set = new Set<string>(['/'])
  for (const entry of manifest.entries) {
    set.add(entry.path)
    const segments = entry.path.split('/').filter(Boolean)
    let dir = ''
    for (let i = 0; i < segments.length - 1; i++) {
      dir += `/${segments[i]}`
      set.add(`${dir}/`)
    }
  }
  return [...set].sort()
}

function longestCommonPrefix(items: string[]): string {
  if (items.length === 0) return ''
  let prefix = items[0]
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }
  return prefix
}

export interface CompleteOptions {
  commands: string[]
  paths: string[]
}

export function complete(line: string, opts: CompleteOptions): Completion {
  // Strip a leading force sentinel for matching, but preserve it in the output.
  let prefix = ''
  let body = line
  if (line.startsWith('!') || line.startsWith(':')) {
    prefix = line[0]
    body = line.slice(1)
  }

  const tokens = tokenize(body)
  const endsWithSpace = /\s$/.test(body)
  const completingFirst = tokens.length === 0 || (tokens.length === 1 && !endsWithSpace)
  const token = endsWithSpace ? '' : (tokens[tokens.length - 1] ?? '')

  const candidates = completingFirst ? opts.commands : opts.paths
  const matches = [...new Set(candidates.filter((c) => c.startsWith(token)))].sort()

  if (matches.length === 0) {
    return { commonPrefix: token, completedLine: line, matches: [], token }
  }

  const commonPrefix = matches.length === 1 ? matches[0] : longestCommonPrefix(matches)
  const head = endsWithSpace ? body : body.slice(0, body.length - token.length)
  const completedLine = `${prefix}${head}${commonPrefix}`

  return { commonPrefix, completedLine, matches, token }
}
