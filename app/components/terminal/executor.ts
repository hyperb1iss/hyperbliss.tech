// Executor: resolves precedence and dispatches a parsed line.
//
// Precedence (§5.3): force sentinels win first (`:` native, `!` shell). With no
// force, an exact match on a native command name/alias wins; otherwise the line
// goes to the shell engine (when loaded). If nothing resolves, fuzzy "did you
// mean" against known commands.

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

/** Nearest candidate within a length-scaled edit-distance threshold, or null. */
export function nearestCommand(name: string, candidates: string[]): string | null {
  const threshold = Math.max(2, Math.floor(name.length / 3))
  let best: string | null = null
  let bestDist = Number.POSITIVE_INFINITY
  for (const candidate of candidates) {
    const dist = levenshtein(name.toLowerCase(), candidate.toLowerCase())
    if (dist < bestDist && dist <= threshold) {
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

function didYouMean(name: string, ctx: TerminalContext): void {
  const suggestion = nearestCommand(name, ctx.registry.names())
  if (suggestion) {
    ctx.print(text(`command not found: ${name} — did you mean '${suggestion}'?`, 'stderr'))
  } else {
    ctx.print(text(`command not found: ${name} — type 'help' for a list`, 'stderr'))
  }
}

export async function execute(raw: string, ctx: TerminalContext, runShell?: ShellRunner): Promise<void> {
  const parsed = parseLine(raw)
  if (parsed.empty) return

  const { force, name, args, line } = parsed
  const native = ctx.registry.get(name)

  if (force === 'native') {
    if (native) await runNative(native, args, ctx)
    else didYouMean(name, ctx)
    return
  }

  if (force === 'shell') {
    if (runShell) await runShell(line, ctx)
    else ctx.print(text('shell unavailable — real shell commands load in a moment', 'stderr'))
    return
  }

  // No force: native wins, else hand the whole line to the shell, else fuzzy.
  if (native) {
    await runNative(native, args, ctx)
    return
  }
  if (runShell) {
    await runShell(line, ctx)
    return
  }
  didYouMean(name, ctx)
}
