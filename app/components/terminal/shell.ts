// just-bash engine wrapper (§5.4). Lazily imports just-bash on first shell use
// (async chunk) and mounts the full content FS fetched once. Session state —
// cwd, exports — is carried across lines via `result.env` (verified in P0; the
// instance itself is stateless per exec). We never JS-parse `cd`; the whole
// line runs in one exec so compound forms, subshells, and pipes stay correct.

import type { Manifest } from '@/lib/terminal/types'
import type { ShellRunner } from './executor'
import type { FsBodies } from './fsClient'
import { tokenize } from './parser'
import { text } from './render'

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

const BASE_ENV: Record<string, string> = { HOME: '/', PWD: '/', TERM: 'xterm-256color' }

export interface ShellDeps {
  fetchBodies: (paths?: readonly string[], signal?: AbortSignal) => Promise<FsBodies>
}

function manifestPaths(manifest: Manifest): string[] {
  return manifest.entries.map((entry) => entry.path)
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

/**
 * Build the shell runner the executor calls for non-native lines. Initialization
 * (dynamic import + FS fetch) is deferred to the first call and memoized; if it
 * fails, the next shell command retries.
 */
export function createShellRunner({ fetchBodies }: ShellDeps): ShellRunner {
  let init: Promise<BashLike> | null = null
  let sessionEnv: Record<string, string> = { ...BASE_ENV }

  function load(manifest: Manifest): Promise<BashLike> {
    if (!init) {
      init = (async () => {
        const mod = await import('just-bash/browser')
        const bash = new mod.Bash({
          cwd: '/',
          env: { HOME: '/', TERM: 'xterm-256color' },
          files: createLazyFiles(manifest, fetchBodies),
          javascript: false,
          python: false,
        }) as unknown as BashLike
        sessionEnv = { ...bash.getEnv() }
        return bash
      })().catch((err) => {
        init = null // reset so a later command re-attempts the import/fetch
        throw err
      })
    }
    return init
  }

  return async (line, ctx) => {
    let bash: BashLike
    try {
      bash = await load(ctx.manifest)
      if (shouldBatchMaterialize(line)) {
        await fetchBodies(manifestPaths(ctx.manifest), ctx.signal)
      } else {
        const paths = exactPathsToMaterialize(line, ctx.manifest, sessionEnv.PWD || '/')
        if (paths.length > 0) await fetchBodies(paths, ctx.signal)
      }
    } catch {
      ctx.print(text('shell unavailable — run the command again to retry loading it', 'stderr'))
      return
    }

    let result: BashExecResult
    try {
      result = await bash.exec(line, {
        cwd: sessionEnv.PWD || '/',
        env: sessionEnv,
        replaceEnv: true,
        signal: ctx.signal,
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      if (err instanceof Error && err.message.includes('virtual FS unavailable')) {
        ctx.print(text('shell unavailable — run the command again to retry loading it', 'stderr'))
        return
      }
      ctx.print(text(`shell error: ${err instanceof Error ? err.message : String(err)}`, 'stderr'))
      return
    }

    sessionEnv = result.env
    if (result.env.PWD) ctx.setCwd(result.env.PWD)

    const stdout = result.stdout.replace(/\n$/, '')
    const stderr = result.stderr.replace(/\n$/, '')
    if (stdout.length > 0) ctx.print(text(stdout, 'stdout'))
    if (stderr.length > 0) ctx.print(text(stderr, 'stderr'))
  }
}
