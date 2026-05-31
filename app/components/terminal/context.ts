// Builds the TerminalContext handed to every command. The imperative pieces
// (print/clear/navigate/run) are closures owned by the Terminal component; this
// factory just assembles them with the data layer so handlers stay testable.

import type { ReactNode } from 'react'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import type { CommandRegistry, OutputStream, TerminalContext } from './types'

export interface ContextDeps {
  manifest: Manifest
  broadcast: Broadcast
  registry: CommandRegistry
  print: (node: ReactNode, stream?: OutputStream) => void
  clear: () => void
  navigate: (href: string) => void
  setTheme: (name: string) => void
  run: (line: string) => Promise<void>
  history?: readonly string[]
  cwd?: string
  setCwd?: (cwd: string) => void
  signal?: AbortSignal
}

export function createContext(deps: ContextDeps): TerminalContext {
  return {
    broadcast: deps.broadcast,
    clear: deps.clear,
    cwd: deps.cwd ?? '/',
    history: deps.history ?? [],
    manifest: deps.manifest,
    navigate: deps.navigate,
    print: deps.print,
    registry: deps.registry,
    run: deps.run,
    setCwd: deps.setCwd ?? (() => {}),
    setTheme: deps.setTheme,
    signal: deps.signal,
  }
}
