'use client'

// The hero: the interactive terminal as the entire first viewport. The Terminal
// is loaded client-only (ssr:false) over a deterministic skeleton so there's no
// hydration flash and no server/client markup mismatch. The command keys in its
// footer are the primary mobile navigation and drive it through its handle.

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { trackTerminalCommand } from '@/lib/analytics'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { styled } from '../../../styled-system/jsx'
import { type BootPhase, readBootInputs, resolveBootPhase } from './bootState'
import CommandChips from './CommandChips'
import CommandPalette from './CommandPalette'
import './commands'
import { fetchFsBodies } from './fsClient'
import { registry } from './registry'
import { decodeSession } from './share'
import { createShellSession, type ShellSession } from './shell'
import type { TerminalHandle } from './Terminal'
import { isWebMcpEnabled, registerAgentTools } from './webmcp'

const HeroWrap = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4) var(--space-6);

  @media (max-width: 768px) {
    padding: var(--space-4) var(--space-3) var(--space-4);
  }
`

const Frame = styled.div`
  width: 100%;
  height: clamp(420px, 70vh, 720px);
  min-height: 0;

  @media (max-width: 768px) {
    height: clamp(380px, 64vh, 560px);
  }
`

// Static pre-hydration placeholder; mirrors the terminal frame to avoid layout
// shift. No animation (the boot machine resolves motion once mounted — §5.6).
const Skeleton = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: var(--font-mono);
  font-size: 1.4rem;
  background: #08050f;
  border: 1px solid rgba(244, 240, 255, 0.16);
  border-radius: 1.4rem;
  overflow: hidden;

  & .body {
    flex: 1;
    padding: 5.6rem 2rem 2rem;
    color: #8f86a3;
  }
`

function TerminalSkeleton() {
  return (
    <Skeleton aria-hidden="true">
      <div className="body">guest@hyperbliss:/$ starting…</div>
    </Skeleton>
  )
}

const Terminal = dynamic(() => import('./Terminal'), {
  loading: () => <TerminalSkeleton />,
  ssr: false,
})

export interface TerminalHeroProps {
  manifest: Manifest
  broadcast: Broadcast
}

export default function TerminalHero({ manifest, broadcast }: TerminalHeroProps) {
  const router = useRouter()
  const handleRef = useRef<TerminalHandle | null>(null)
  const [autoFocus, setAutoFocus] = useState(false)

  // Resolve the boot phase and any shared-session replay together, so the
  // Terminal sees both at once and boots exactly once (§5.6, T4.2).
  const [boot, setBoot] = useState<{ phase: BootPhase; replay: string[] }>({ phase: 'pending', replay: [] })
  useEffect(() => {
    setBoot({ phase: resolveBootPhase(readBootInputs()), replay: decodeSession(window.location.hash) })
  }, [])

  // One shell session for human input and agent tools, preserving cwd/exports.
  const shellRef = useRef<ShellSession | null>(null)
  const shellSession = shellRef.current ?? createShellSession({ fetchBodies: fetchFsBodies })
  shellRef.current = shellSession

  // Auto-focus only on true mouse devices so we never pop the soft keyboard on
  // touch — chips are the touch entry point. `hover: hover` + `pointer: fine`
  // is the canonical "has a mouse" query and avoids mobile false-positives.
  useEffect(() => {
    setAutoFocus(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false)
  }, [])

  const [paletteOpen, setPaletteOpen] = useState(false)

  const runChip = useCallback((command: string) => {
    handleRef.current?.run(command)
    handleRef.current?.focus()
  }, [])

  const onNavigate = useCallback((href: string) => router.push(href), [router])

  useEffect(() => {
    if (!isWebMcpEnabled()) return
    return registerAgentTools({
      broadcast,
      execShell: shellSession.execShell,
      fetchBodies: fetchFsBodies,
      handleRef,
      manifest,
      navigate: onNavigate,
      onToolCall: (name) => trackTerminalCommand(`agent:${name}`),
      setTheme: (name) => document.documentElement.setAttribute('data-terminal-theme', name),
    })
  }, [broadcast, manifest, onNavigate, shellSession.execShell])

  // ⌘K / Ctrl+K toggles the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <HeroWrap aria-label="Interactive terminal — explore hyperbliss.tech">
      <Frame>
        <Terminal
          autoFocusInput={autoFocus}
          bootPhase={boot.phase}
          broadcast={broadcast}
          footer={<CommandChips onCategory={trackTerminalCommand} onRun={runChip} />}
          handleRef={handleRef}
          manifest={manifest}
          onCommandCategory={trackTerminalCommand}
          onNavigate={onNavigate}
          replayCommands={boot.replay.length > 0 ? boot.replay : undefined}
          shellRunner={shellSession.runShell}
        />
      </Frame>
      <CommandPalette
        onClose={() => setPaletteOpen(false)}
        onRun={(command) => {
          trackTerminalCommand(`palette:${command}`)
          handleRef.current?.run(command)
        }}
        open={paletteOpen}
        registry={registry}
      />
    </HeroWrap>
  )
}
