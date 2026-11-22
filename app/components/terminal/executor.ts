// Executor: resolves precedence and dispatches a parsed line.
//
// Precedence (§5.3): force sentinels win first (`:` native, `!` shell). With no
// force, an exact match on a native command name/alias wins, then a bare
// product or essay name prints its card; otherwise the line goes to the shell
// engine (when loaded). If nothing resolves, fuzzy "did you mean" against
// known commands and content names.

import { createElement } from 'react'
import { EntryCard, entryNames, findEntry } from './commands/entries'
import { parseLine } from './parser'
import { text } from './render'
import type { Command, TerminalContext } from './types'

/** Runs a sentinel-stripped line through the lazy shell engine. */
export type ShellRunner = (line: string, ctx: TerminalContext) => Promise<void>

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr = new Array<number>(b.length + 1)
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length]
}

/**
 * Nearest candidate within a length-scaled edit-distance threshold, or null.
 * Past a single edit the first letter has to agree, so a typo finds its word
 * (hlep, help) and keyboard mash does not find a stranger (asdf, df).
 */
export function nearestCommand(name: string, candidates: string[]): string | null {
  const threshold = Math.max(2, Math.floor(name.length / 3))
  const typed = name.toLowerCase()
  let best: string | null = null
  let bestDist = Number.POSITIVE_INFINITY
  for (const candidate of candidates) {
    const known = candidate.toLowerCase()
    const dist = levenshtein(typed, known)
    const plausible = dist <= 1 || (dist <= threshold && typed[0] === known[0])
    if (dist < bestDist && plausible) {
      best = candidate
      bestDist = dist
    }
  }
  return best
}

async function runNative(cmd: Command, args: string[], ctx: TerminalContext): Promise<void> {
  const out = await cmd.run(args, ctx)
  if (out !== undefined && out !== null && out !== false) ctx.print(out)
}

/** The line printed for a name nothing answers to, with the nearest real one. */
export function notFound(name: string, ctx: TerminalContext): void {
  const suggestion = nearestCommand(name, [...ctx.registry.names(), ...entryNames(ctx.manifest)])
  if (suggestion) {
    ctx.print(text(`command not found: ${name}. did you mean '${suggestion}'?`, 'stderr'))
  } else {
    ctx.print(text(`command not found: ${name}. type 'help' for the list`, 'stderr'))
  }
}

export async function execute(raw: string, ctx: TerminalContext, runShell?: ShellRunner): Promise<void> {
  const parsed = parseLine(raw)
  if (parsed.empty) return

  const { force, name, args, line } = parsed
  const native = ctx.registry.get(name)

  if (force === 'native') {
    if (native) await runNative(native, args, ctx)
    else notFound(name, ctx)
    return
  }

  if (force === 'shell') {
    if (runShell) await runShell(line, ctx)
    else ctx.print(text('shell is still loading, try again in a moment', 'stderr'))
    return
  }

  // No force: native wins, else hand the whole line to the shell, else fuzzy.
  if (native) {
    await runNative(native, args, ctx)
    return
  }
  // A product, essay or experiment typed by name, with nothing after it.
  const entry = args.length === 0 && line.trim() === name ? findEntry(ctx.manifest, name) : null
  if (entry) {
    ctx.print(createElement(EntryCard, { ctx, entry }))
    return
  }
  if (runShell) {
    await runShell(line, ctx)
    return
  }
  notFound(name, ctx)
}
