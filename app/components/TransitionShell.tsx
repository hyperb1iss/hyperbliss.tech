'use client'

// The client half of the (transition) layout: providers, header, the global
// pull-down terminal, and the page wrapper. The server layout feeds it the
// terminal's manifest and broadcast so the console is summonable on every route.

import { css } from '../../styled-system/css'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import ClientComponents from './ClientComponents'
import GlobalLayout from './GlobalLayout'
import Header from './Header'
import { HeaderProvider } from './HeaderContext'
import HyperspaceLoader from './HyperspaceLoader'
import { PageLoadProvider } from './PageLoadOrchestrator'
import TerminalConsole from './terminal/TerminalConsole'

const skipLinkStyles = css`
  position: fixed;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 10000;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--silk-circuit-cyan);
  border-radius: var(--radius-md);
  background: var(--silk-void-black);
  color: var(--silk-circuit-cyan);
  transform: translateY(-200%);
  &:focus {
    transform: translateY(0);
  }
`

interface TransitionShellProps {
  manifest: Manifest
  broadcast: Broadcast
  children: React.ReactNode
}

export default function TransitionShell({ manifest, broadcast, children }: TransitionShellProps) {
  return (
    <PageLoadProvider>
      <HeaderProvider>
        <ClientComponents />
        <a className={skipLinkStyles} href="#main-content">Skip to content</a>
        <Header />
        <TerminalConsole broadcast={broadcast} manifest={manifest} />
        <HyperspaceLoader />
        <GlobalLayout>{children}</GlobalLayout>
      </HeaderProvider>
    </PageLoadProvider>
  )
}
