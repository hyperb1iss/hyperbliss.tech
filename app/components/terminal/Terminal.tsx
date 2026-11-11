'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { styled } from '../../../styled-system/jsx'
import { categoryOf } from './analytics'
import { runBootSequence } from './boot'
import { type BootPhase, markVisited } from './bootState'
import { complete, fsPaths } from './complete'
import { createContext } from './context'
import { execute, type ShellRunner } from './executor'
import { History, loadHistory } from './history'
import { registry as sharedRegistry } from './registry'
import { OutputText } from './render'
import StatusBoard from './StatusBoard'
import type { CommandRegistry, LogEntry, OutputStream } from './types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Shell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: var(--font-mono);
  font-size: 1.4rem;
  line-height: 1.6;
  color: #f4f0ff;
  background: #08050f;
  border: 1px solid rgba(244, 240, 255, 0.16);
  border-radius: 1.4rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  cursor: text;
  transition: border-color var(--duration-normal) var(--ease-silk);

  /* One crisp line of the brand gradient across the top edge. */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
    background: linear-gradient(90deg, #e135ff, #ff6ac1 45%, #80ffea);
  }

  &:focus-within {
    border-color: rgba(128, 255, 234, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 1.5rem 2rem 1.1rem;
  border-bottom: 1px solid rgba(244, 240, 255, 0.08);
  user-select: none;
  flex-shrink: 0;
`

const TitleText = styled.span`
  font-size: 1.2rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b9b0cc;
`

const Keys = styled.span`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  color: #8f86a3;

  & kbd {
    font-family: inherit;
    font-size: 1.1rem;
    padding: 0.1rem 0.6rem;
    border: 1px solid rgba(244, 240, 255, 0.2);
    border-radius: 0.4rem;
    color: #d6cfe6;
  }
  & kbd:not(:first-child) {
    margin-left: 0.8rem;
  }

  @media (max-width: 640px) {
    display: none;
  }
`

const OutputLog = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.6rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(244, 240, 255, 0.22) transparent;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(244, 240, 255, 0.22);
    border-radius: var(--radius-full);
  }
`

const Row = styled.div`
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
`

const InputForm = styled.form`
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  padding: 1.2rem 2rem 1.6rem;
  border-top: 1px solid rgba(244, 240, 255, 0.08);
  flex-shrink: 0;
`

const Footer = styled.div`
  flex-shrink: 0;
  border-top: 1px solid rgba(244, 240, 255, 0.08);
`

const Prompt = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  white-space: pre;
  user-select: none;

  & .u { color: #80ffea; }
  & .h { color: #c3b3ff; }
  & .p { color: #ff9bdc; }
  & .s { color: #8f86a3; }
`

const InputCaret = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`

const StyledInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: inherit;
  color: #ffffff;
  caret-color: #80ffea;
  padding: 0;

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.7;
  }
`

const VisuallyHidden = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Hint = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  color: var(--text-muted);

  & .blink {
    animation: silkTerminalCaretBlink 1.1s step-end infinite;
    color: #80ffea;
  }

  @media (prefers-reduced-motion: reduce) {
    & .blink { animation: none; }
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Subcomponents
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function PromptLabel({ cwd }: { cwd: string }) {
  return (
    <Prompt aria-hidden="true">
      <span className="u">guest</span>
      <span className="s">@</span>
      <span className="h">hyperbliss</span>
      <span className="s">:</span>
      <span className="p">{cwd}</span>
      <span className="s">$ </span>
    </Prompt>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Terminal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface TerminalHandle {
  run(line: string): Promise<void>
  focus(): void
  print(node: React.ReactNode, stream?: OutputStream): void
  printAgentInput(line: string): void
  setCwd(cwd: string): void
}

export interface TerminalProps {
  manifest: Manifest
  broadcast: Broadcast
  registry?: CommandRegistry
  shellRunner?: ShellRunner
  /** Output present before any input (boot banner / neofetch — P3). */
  initialLog?: LogEntry[]
  /** Don't steal focus on mount (mobile: avoid popping the soft keyboard). */
  autoFocusInput?: boolean
  /** Fired with a coarse command category for analytics (never raw input). */
  onCommandCategory?: (category: string) => void
  /** Client-side deep-link navigation; defaults to a full navigation. */
  onNavigate?: (href: string) => void
  /** Boot phase (§5.6). Undefined skips the boot entirely (tests). */
  bootPhase?: BootPhase
  /** Commands to replay after boot (shared-session URL — T4.2). */
  replayCommands?: string[]
  /** Imperative handle (chips / boot sequence drive the terminal through this). */
  handleRef?: { current: TerminalHandle | null }
  /** Rendered inside the frame under the prompt (the quick command keys). */
  footer?: React.ReactNode
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export default function Terminal({
  manifest,
  broadcast,
  registry = sharedRegistry,
  shellRunner,
  initialLog = [],
  autoFocusInput = false,
  onCommandCategory,
  onNavigate,
  bootPhase,
  replayCommands,
  handleRef,
  footer,
}: TerminalProps) {
  const [log, setLog] = useState<LogEntry[]>(initialLog)
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [cwd, setCwd] = useState('/')

  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  // Seed above the highest seeded id so boot-provided initialLog entries (P3)
  // can't collide with runtime-generated ids.
  const idRef = useRef(initialLog.reduce((max, e) => Math.max(max, e.id), 0))
  // The shell owns authoritative cwd via session env; this mirror drives the
  // prompt display and is kept in sync through ctx.setCwd.
  const cwdRef = useRef('/')
  cwdRef.current = cwd
  const historyRef = useRef<History>(new History())
  const runRef = useRef<(line: string) => Promise<void>>(async () => {})
  const activeControllersRef = useRef<Set<AbortController>>(new Set())

  const paths = useMemo(() => fsPaths(manifest), [manifest])

  // Load persisted history on mount (client-only — no hydration mismatch).
  useEffect(() => {
    historyRef.current = new History(loadHistory(), { persist: true })
  }, [])

  const pushEntry = useCallback((node: React.ReactNode, stream: OutputStream = 'stdout', promptCwd?: string) => {
    // Capture the id NOW, not inside the updater: batched updaters run later
    // and would all read the final idRef.current, colliding keys.
    idRef.current += 1
    const id = idRef.current
    setLog((prev) => [...prev, { id, node, promptCwd, stream }])
  }, [])

  const clear = useCallback(() => {
    setLog([])
  }, [])

  // Stable entry point used by ctx.run, chips, and the imperative handle.
  const run = useCallback((line: string) => runRef.current(line), [])

  const printAgentInput = useCallback(
    (line: string) => {
      pushEntry(
        <Row>
          <PromptLabel cwd={cwdRef.current} />
          <OutputText stream="input">{`[agent] ${line}`}</OutputText>
        </Row>,
        'input',
      )
    },
    [pushEntry],
  )

  const abortActiveCommands = useCallback(() => {
    for (const controller of activeControllersRef.current) {
      controller.abort()
    }
    activeControllersRef.current.clear()
  }, [])

  const handleRun = useCallback(
    async (raw: string) => {
      if (raw.trim().length === 0) {
        pushEntry(<PromptLabel cwd={cwdRef.current} />, 'input')
        return
      }
      pushEntry(
        <Row>
          <PromptLabel cwd={cwdRef.current} />
          <OutputText stream="input">{raw}</OutputText>
        </Row>,
        'input',
      )
      historyRef.current.add(raw)
      onCommandCategory?.(categoryOf(raw))
      const controller = new AbortController()
      activeControllersRef.current.add(controller)

      const ctx = createContext({
        broadcast,
        clear,
        cwd: cwdRef.current,
        history: historyRef.current.entries,
        manifest,
        navigate: (href) => {
          if (onNavigate) onNavigate(href)
          else if (typeof window !== 'undefined') window.location.assign(href)
        },
        print: pushEntry,
        registry,
        run,
        setCwd,
        setTheme: (name) => {
          if (typeof document !== 'undefined') document.documentElement.setAttribute('data-terminal-theme', name)
        },
        signal: controller.signal,
      })
      try {
        await execute(raw, ctx, shellRunner)
      } catch (error) {
        if (!isAbortError(error)) throw error
      } finally {
        activeControllersRef.current.delete(controller)
      }
    },
    [broadcast, clear, manifest, onCommandCategory, onNavigate, pushEntry, registry, run, shellRunner],
  )

  useEffect(() => {
    runRef.current = handleRun
  }, [handleRun])

  useEffect(() => {
    return () => {
      abortActiveCommands()
    }
  }, [abortActiveCommands])

  // Autoscroll to newest output. `log` is the re-run trigger; the body reads
  // the ref so we always pin to the latest scrollHeight.
  // biome-ignore lint/correctness/useExhaustiveDependencies: log drives the re-run, ref is read in-body
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  useEffect(() => {
    if (autoFocusInput) inputRef.current?.focus()
  }, [autoFocusInput])

  useEffect(() => {
    if (handleRef) {
      handleRef.current = {
        focus: () => inputRef.current?.focus(),
        print: pushEntry,
        printAgentInput,
        run,
        setCwd,
      }
      return () => {
        handleRef.current = null
      }
    }
  }, [handleRef, printAgentInput, pushEntry, run])

  // Boot sequence (§5.6). Runs once the phase resolves; the full boot is
  // skippable via any key/pointer. markVisited fires here (not at resolve) so
  // strict-mode's double effect-invoke can't race first-visit detection.
  useEffect(() => {
    if (!bootPhase || bootPhase === 'pending') return
    let cancelled = false
    markVisited()
    const finale = async () => {
      if (replayCommands && replayCommands.length > 0) {
        for (const cmd of replayCommands) {
          if (cancelled) return
          await run(cmd)
        }
        return
      }
      pushEntry(<StatusBoard />)
    }
    void runBootSequence({ finale, isCancelled: () => cancelled, phase: bootPhase })
    return () => {
      cancelled = true
    }
  }, [bootPhase, pushEntry, run, replayCommands])

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const line = input
      setInput('')
      void run(line)
    },
    [input, run],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // ↑/↓ are intercepted ONLY here, on the focused input — the page scrolls
      // normally everywhere else (Q6, no scroll trap).
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = historyRef.current.prev(input)
        if (prev !== null) setInput(prev)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = historyRef.current.next()
        if (next !== null) setInput(next)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const result = complete(input, { commands: registry.names(), paths })
        if (result.matches.length === 1) {
          setInput(result.completedLine)
        } else if (result.matches.length > 1) {
          setInput(result.completedLine)
          pushEntry(<OutputText stream="system">{result.matches.join('   ')}</OutputText>)
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault()
        clear()
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault()
        abortActiveCommands()
        pushEntry(
          <Row>
            <PromptLabel cwd={cwdRef.current} />
            <OutputText stream="input">{`${input}^C`}</OutputText>
          </Row>,
          'input',
        )
        setInput('')
        historyRef.current.reset()
      }
    },
    [abortActiveCommands, clear, input, paths, pushEntry, registry],
  )

  const focusInput = useCallback(() => {
    // Don't steal focus mid text-selection.
    if (typeof window !== 'undefined' && window.getSelection()?.toString()) return
    inputRef.current?.focus()
  }, [])

  return (
    <Shell onMouseUp={focusInput}>
      <TitleBar>
        <TitleText>Hyperbliss console</TitleText>
        <Keys aria-hidden="true">
          <kbd>⌘K</kbd> commands <kbd>esc</kbd> close
        </Keys>
      </TitleBar>

      <OutputLog aria-label="Terminal output" aria-live="polite" ref={logRef} role="log" tabIndex={0}>
        {log.map((e) => (
          <Row key={e.id}>{e.node}</Row>
        ))}
      </OutputLog>

      <InputForm onSubmit={submit}>
        <PromptLabel cwd={cwd} />
        <VisuallyHidden htmlFor="terminal-input">Terminal input — type a command and press Enter</VisuallyHidden>
        <InputCaret>
          <StyledInput
            aria-describedby="terminal-hint"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="go"
            id="terminal-input"
            onBlur={() => setFocused(false)}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={input}
          />
          {input.length === 0 && (
            <Hint aria-hidden={focused} id="terminal-hint">
              {focused ? <span className="blink">▍</span> : <>try &apos;help&apos; · or tap a command below</>}
            </Hint>
          )}
        </InputCaret>
      </InputForm>
      {footer && <Footer>{footer}</Footer>}
    </Shell>
  )
}
