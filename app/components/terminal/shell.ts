// just-bash engine wrapper (§5.4). Lazily imports just-bash on first shell use
// (async chunk) and mounts the full content FS fetched once. Session state —
// cwd, exports — is carried across lines via `result.env` (verified in P0; the
// instance itself is stateless per exec). We never JS-parse `cd`; the whole
// line runs in one exec so compound forms, subshells, and pipes stay correct.

import type { ShellRunner } from './executor'
import type { FsBodies } from './fsClient'
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
  fetchBodies: (signal?: AbortSignal) => Promise<FsBodies>
}

/**
 * Build the shell runner the executor calls for non-native lines. Initialization
 * (dynamic import + FS fetch) is deferred to the first call and memoized; if it
 * fails, the next shell command retries.
 */
export function createShellRunner({ fetchBodies }: ShellDeps): ShellRunner {
  let init: Promise<BashLike> | null = null
  let sessionEnv: Record<string, string> = { ...BASE_ENV }

  function load(signal?: AbortSignal): Promise<BashLike> {
    if (!init) {
      init = (async () => {
        const [mod, bodies] = await Promise.all([import('just-bash/browser'), fetchBodies(signal)])
        const bash = new mod.Bash({
          cwd: '/',
          env: { HOME: '/', TERM: 'xterm-256color' },
          files: bodies,
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
      bash = await load(ctx.signal)
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
