// Terminal runtime contract. Handlers read everything from `ctx` (testable);
// they never import page data directly.

import type { ReactNode } from 'react'
import type { Broadcast, Manifest } from '@/lib/terminal/types'

/** Visual stream a log entry belongs to. */
export type OutputStream = 'stdout' | 'stderr' | 'ok' | 'system' | 'input'

export interface LogEntry {
  id: number
  stream: OutputStream
  node: ReactNode
  /** The prompt cwd shown before an echoed input line. */
  promptCwd?: string
}

export interface HistoryAPI {
  readonly entries: readonly string[]
  add(line: string): void
  /** Walk backwards (↑). `draft` is the in-progress line stashed on first press. */
  prev(draft: string): string | null
  /** Walk forwards (↓); returns the stashed draft at the end. */
  next(): string | null
  reset(): void
}

export type CommandGroup = 'meta' | 'content' | 'shell' | 'fun'

export interface TerminalContext {
  manifest: Manifest
  broadcast: Broadcast
  /** Append a node to the output log. */
  print(node: ReactNode, stream?: OutputStream): void
  /** Clear the output log. */
  clear(): void
  /** Client-side deep-link navigation. */
  navigate(href: string): void
  /** Switch the visual theme by name. */
  setTheme(name: string): void
  /** Run a full command line programmatically (chips, replay, did-you-mean). */
  run(line: string): Promise<void>
  registry: CommandRegistry
  /** Current shell working directory ('/' until the shell engine loads). */
  cwd: string
  /** Cooperative cancellation for long-running output. */
  signal?: AbortSignal
}

// `void` lets a handler return nothing (it printed via ctx) or a ReactNode to
// print — the intended dual contract, not a confusing union.
// biome-ignore lint/suspicious/noConfusingVoidType: handlers may return a node OR nothing
export type CommandOutput = ReactNode | void
export type CommandRun = (args: string[], ctx: TerminalContext) => CommandOutput | Promise<CommandOutput>

export interface Command {
  name: string
  aliases?: string[]
  summary: string
  usage?: string
  hidden?: boolean
  group?: CommandGroup
  run: CommandRun
}

export interface CommandRegistry {
  register(command: Command): void
  /** Exact match on name or alias. */
  get(nameOrAlias: string): Command | undefined
  /** All registered commands, registration order. */
  all(): Command[]
  /** Non-hidden commands, for `help` and chips. */
  visible(): Command[]
  /** All invokable tokens (names + aliases), for completion + fuzzy match. */
  names(): string[]
}
