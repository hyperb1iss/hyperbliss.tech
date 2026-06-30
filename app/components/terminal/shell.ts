// just-bash engine wrapper (§5.4). Lazily imports just-bash on first shell use
// (async chunk) and mounts the full content FS fetched once. Session state —
// cwd, exports — is carried across lines via `result.env` (verified in P0; the
// instance itself is stateless per exec). We never JS-parse `cd`; the whole
// line runs in one exec so compound forms, subshells, and pipes stay correct.

import { type ContentKind, type Manifest, PUBLIC_CONTENT_KINDS } from '@/lib/terminal/types'
import type { ShellRunner } from './executor'
import type { FsBodies } from './fsClient'
import { tokenize } from './parser'
import { text } from './render'
import type { TerminalContext } from './types'

interface BashExecResult {
  stdout: string
  stderr: string
  exitCode: number
  env: Record<string, string>
}

interface BashLike {
  exec(line: string, opts: ExecOpts): Promise<BashExecResult>
  getEnv(): Record<string, string>
}

interface ExecOpts {
  env?: Record<string, string>
  cwd?: string
  replaceEnv?: boolean
  signal?: AbortSignal
}

interface BashCreateOptions {
  cwd: string
  env: Record<string, string>
  executionLimits?: {
    maxCommandCount?: number
    maxGlobOperations?: number
    maxHeredocSize?: number
    maxLoopIterations?: number
    maxOutputSize?: number
    maxStringLength?: number
  }
  files: Record<string, () => Promise<string>>
  javascript: boolean
  python: boolean
}

type BashFactory = (options: BashCreateOptions) => BashLike | Promise<BashLike>

const BASE_ENV: Record<string, string> = { HOME: '/', PWD: '/', TERM: 'xterm-256color' }
// Human-typed commands get a timeout too (the agent passes its own 8s). Without
// one, a wedged just-bash engine holds the shared session lock forever and
// starves every later command; on timeout the session is reset and rebuilt.
const DEFAULT_SHELL_TIMEOUT_MS = 15_000
const SHELL_ENGINE_LIMIT = 16_384
const SHELL_EXECUTION_LIMITS: NonNullable<BashCreateOptions['executionLimits']> = {
  maxCommandCount: 2000,
  maxGlobOperations: 5000,
  maxHeredocSize: SHELL_ENGINE_LIMIT,
  maxLoopIterations: 1000,
  maxOutputSize: SHELL_ENGINE_LIMIT,
  maxStringLength: SHELL_ENGINE_LIMIT,
}

export interface ExecShellResult {
  stdout: string
  stderr: string
  exitCode: number
}

export interface ShellExecutionContext {
  manifest: Manifest
  print?: TerminalContext['print']
  setCwd?: TerminalContext['setCwd']
  signal?: AbortSignal
}

export interface ExecShellOptions {
  timeoutMs?: number
}

export interface ShellDeps {
  fetchBodies: (paths?: readonly string[], signal?: AbortSignal) => Promise<FsBodies>
  createBash?: BashFactory
}

export type ExecShell = (
  line: string,
  ctx: ShellExecutionContext,
  options?: ExecShellOptions,
) => Promise<ExecShellResult>

export interface ShellSession {
  runShell: ShellRunner
  execShell: ExecShell
}

export class ShellUnavailableError extends Error {
  constructor() {
    super('shell unavailable')
    this.name = 'ShellUnavailableError'
  }
}

export class ShellTimeoutError extends Error {
  constructor() {
    super('shell command timed out')
    this.name = 'ShellTimeoutError'
  }
}

const PUBLIC_KINDS = new Set<ContentKind>(PUBLIC_CONTENT_KINDS)

// Only mount publicly-exposable content into the shell FS — never 'secret'
// kinds — so cat/grep can't reach what the agent read tools also hide. Shares
// PUBLIC_CONTENT_KINDS with webmcp.ts so the two allow-lists can't drift.
function manifestPaths(manifest: Manifest): string[] {
  return manifest.entries.filter((entry) => PUBLIC_KINDS.has(entry.kind)).map((entry) => entry.path)
}

function shouldBatchMaterialize(line: string): boolean {
  return /\bgrep\b[^|;&]*(?:\s-r|\s-R|--recursive)/.test(line) || /[*?[\]]/.test(line)
}

function normalizeVirtualPath(token: string, cwd: string): string {
  const absolute = token.startsWith('/') ? token : `${cwd === '/' ? '' : cwd}/${token}`
  const parts: string[] = []
  for (const part of absolute.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') parts.pop()
    else parts.push(part)
  }
  return `/${parts.join('/')}`
}

function exactPathsToMaterialize(line: string, manifest: Manifest, cwd: string): string[] {
  const known = new Set(manifestPaths(manifest))
  return tokenize(line)
    .filter((token) => token.endsWith('.md'))
    .map((token) => normalizeVirtualPath(token, cwd))
    .filter((path) => known.has(path))
}

function createLazyFiles(
  manifest: Manifest,
  fetchBodies: ShellDeps['fetchBodies'],
): Record<string, () => Promise<string>> {
  return Object.fromEntries(
    manifestPaths(manifest).map((path) => [
      path,
      async () => {
        try {
          const bodies = await fetchBodies([path])
          const body = bodies[path]
          if (body === undefined) throw new Error(`missing body: ${path}`)
          return body
        } catch (err) {
          throw new Error(`virtual FS unavailable: ${err instanceof Error ? err.message : String(err)}`)
        }
      },
    ]),
  )
}

async function defaultCreateBash(options: BashCreateOptions): Promise<BashLike> {
  const mod = await import('just-bash/browser')
  return new mod.Bash(options) as unknown as BashLike
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : error instanceof Error && error.name === 'AbortError'
}

function abortReason(signal: AbortSignal): Error {
  if (signal.reason instanceof Error) return signal.reason
  return new DOMException('Aborted', 'AbortError')
}

function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return
  throw abortReason(signal)
}

function trimTrailingNewline(value: string): string {
  return value.replace(/\n$/, '')
}

function isVirtualFsError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('virtual FS unavailable')
}

export function createShellSession({ createBash = defaultCreateBash, fetchBodies }: ShellDeps): ShellSession {
  let init: Promise<BashLike> | null = null
  let sessionEnv: Record<string, string> = { ...BASE_ENV }
  let sessionLock: Promise<void> = Promise.resolve()
  let generation = 0

  function resetSession(): void {
    generation += 1
    init = null
    sessionEnv = { ...BASE_ENV }
    sessionLock = Promise.resolve()
  }

  function load(manifest: Manifest, expectedGeneration: number): Promise<BashLike> {
    if (!init) {
      init = (async () => {
        const bash = await createBash({
          cwd: '/',
          env: { HOME: '/', TERM: 'xterm-256color' },
          executionLimits: SHELL_EXECUTION_LIMITS,
          files: createLazyFiles(manifest, fetchBodies),
          javascript: false,
          python: false,
        })
        if (expectedGeneration === generation) sessionEnv = { ...bash.getEnv() }
        return bash
      })().catch((err) => {
        init = null // reset so a later command re-attempts the import/fetch
        throw err
      })
    }
    return init
  }

  async function waitForTurn(previous: Promise<void>, signal?: AbortSignal): Promise<void> {
    if (!signal) {
      await previous
      return
    }
    throwIfAborted(signal)
    await new Promise<void>((resolve, reject) => {
      const onAbort = () => reject(abortReason(signal))
      signal.addEventListener('abort', onAbort, { once: true })
      previous.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort))
    })
  }

  async function withSessionLock<T>(signal: AbortSignal | undefined, fn: () => Promise<T>): Promise<T> {
    throwIfAborted(signal)
    const previous = sessionLock
    let release!: () => void
    let acquired = false
    sessionLock = new Promise((resolve) => {
      release = resolve
    })
    try {
      await waitForTurn(previous, signal)
      acquired = true
      throwIfAborted(signal)
      return await fn()
    } finally {
      if (acquired) release()
      else void previous.finally(release)
    }
  }

  function createExecutionSignal(parent: AbortSignal | undefined, timeoutMs: number | undefined) {
    const controller = new AbortController()
    const abortFromParent = () => {
      if (!controller.signal.aborted && parent) controller.abort(abortReason(parent))
    }
    if (parent?.aborted) abortFromParent()
    else parent?.addEventListener('abort', abortFromParent, { once: true })
    const timer =
      timeoutMs && timeoutMs > 0
        ? globalThis.setTimeout(() => controller.abort(new ShellTimeoutError()), timeoutMs)
        : null

    return {
      dispose: () => {
        if (timer) globalThis.clearTimeout(timer)
        parent?.removeEventListener('abort', abortFromParent)
      },
      signal: controller.signal,
    }
  }

  async function awaitWithSignal<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
    if (signal.aborted) throw abortReason(signal)
    let cleanup = () => {}
    const aborted = new Promise<never>((_resolve, reject) => {
      const onAbort = () => reject(abortReason(signal))
      cleanup = () => signal.removeEventListener('abort', onAbort)
      signal.addEventListener('abort', onAbort, { once: true })
    })
    try {
      return await Promise.race([operation, aborted])
    } finally {
      cleanup()
    }
  }

  const execShell: ExecShell = async (line, ctx, options = {}) => {
    const managed = createExecutionSignal(ctx.signal, options.timeoutMs)
    const runGeneration = generation
    let acquired = false
    let settled = false
    const operation = withSessionLock(managed.signal, async () => {
      acquired = true
      if (runGeneration !== generation) throw new ShellUnavailableError()
      let bash: BashLike
      try {
        bash = await load(ctx.manifest, runGeneration)
        throwIfAborted(managed.signal)
        if (shouldBatchMaterialize(line)) {
          await fetchBodies(manifestPaths(ctx.manifest), managed.signal)
        } else {
          const paths = exactPathsToMaterialize(line, ctx.manifest, sessionEnv.PWD || '/')
          if (paths.length > 0) await fetchBodies(paths, managed.signal)
        }
        if (runGeneration !== generation) throw new ShellUnavailableError()
        throwIfAborted(managed.signal)
      } catch (error) {
        if (isAbortError(error)) throw error
        throw new ShellUnavailableError()
      }

      let result: BashExecResult
      try {
        result = await bash.exec(line, {
          cwd: sessionEnv.PWD || '/',
          env: { ...sessionEnv },
          replaceEnv: true,
          signal: managed.signal,
        })
      } catch (error) {
        if (isAbortError(error)) throw error
        if (isVirtualFsError(error)) throw new ShellUnavailableError()
        throw error
      }

      if (runGeneration !== generation) throw new ShellUnavailableError()
      sessionEnv = { ...result.env }
      if (result.env.PWD) ctx.setCwd?.(result.env.PWD)

      return {
        exitCode: result.exitCode,
        stderr: trimTrailingNewline(result.stderr),
        stdout: trimTrailingNewline(result.stdout),
      }
    }).finally(() => {
      settled = true
    })
    operation.catch(() => {})

    try {
      return await awaitWithSignal(operation, managed.signal)
    } catch (error) {
      operation.catch(() => {})
      if (!settled && acquired && (error instanceof ShellTimeoutError || isAbortError(error))) {
        resetSession()
      }
      throw error
    } finally {
      managed.dispose()
    }
  }

  const runShell: ShellRunner = async (line, ctx) => {
    let result: ExecShellResult
    try {
      result = await execShell(line, ctx, { timeoutMs: DEFAULT_SHELL_TIMEOUT_MS })
    } catch (error) {
      if (isAbortError(error)) return
      if (error instanceof ShellUnavailableError) {
        ctx.print(text('shell unavailable — run the command again to retry loading it', 'stderr'))
        return
      }
      ctx.print(text(`shell error: ${error instanceof Error ? error.message : String(error)}`, 'stderr'))
      return
    }

    if (result.stdout.length > 0) ctx.print(text(result.stdout, 'stdout'))
    if (result.stderr.length > 0) ctx.print(text(result.stderr, 'stderr'))
  }

  return {
    execShell,
    runShell,
  }
}

/**
 * Build the shell runner the executor calls for non-native lines. Initialization
 * (dynamic import + FS fetch) is deferred to the first call and memoized; if it
 * fails, the next shell command retries.
 */
export function createShellRunner(deps: ShellDeps): ShellRunner {
  return createShellSession(deps).runShell
}
