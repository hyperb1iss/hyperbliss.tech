'use client'

// The terminal as a pull-down console that IS the header's expansion. Opening it
// drives both isConsoleOpen (the panel/overlay) and isExpanded (the header bloom)
// so the CyberScape canvas reveals as the terminal drops — the terminal really is
// part of the expandable header. The panel is portaled to <body> to escape the
// nav's transform containing block (same reason MobileNavLinks portals), and
// renders nothing until mounted so the server pass stays SSR-safe.

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { css } from '../../../styled-system/css'
import { useHeaderContext } from '../HeaderContext'
import TerminalHero from './TerminalHero'
import { restoreTerminalTheme } from './theme'

const silkEase = [0.23, 1, 0.32, 1] as const

// The nav heights from Header.tsx, collapsed and expanded, per breakpoint. The
// console only shows while the header is expanded, so the panel tucks under the
// expanded bar; the handle rides between the two as it opens and closes.
const offsetVars = css`
  --nav-collapsed: 110px;
  --nav-expanded: 200px;
  @media (max-width: 768px) {
    --nav-collapsed: 96px;
    --nav-expanded: 180px;
  }
`

const backdropStyles = css`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(5, 3, 8, 0.82);
`

const panelStyles = css`
  position: fixed;
  top: var(--nav-expanded);
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  justify-content: center;
  padding: 0 var(--space-3);
  /* Only the centered terminal captures input; the flanks stay click-through so
     tapping beside it falls to the backdrop and closes the console. */
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`

// Caps the console to the space under the nav and scrolls internally, so on
// short phones (body scroll locked while open) the command chips below the
// terminal stay reachable instead of falling off-screen.
const scrollStyles = css`
  width: 100%;
  max-width: 960px;
  max-height: calc(100dvh - var(--nav-expanded) - var(--space-3));
  overflow-y: auto;
  overscroll-behavior: contain;
`

const handleStyles = css`
  position: fixed;
  /* Rides under the collapsed bar when closed, and down under the expanded bar
     when open, easing in step with the nav's own height transition. */
  top: calc(var(--nav-collapsed) - 18px);
  left: 50%;
  transform: translateX(-50%);
  /* Above the nav (z-100) so the part that straddles the bar stays tappable —
     otherwise the nav eats the top ~18px and the touch target shrinks. */
  z-index: 101;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
  padding: 0.6rem 2rem;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--term-dim);
  background: var(--term-bg-2);
  border: 1px solid rgba(244, 240, 255, 0.22);
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
  -webkit-tap-highlight-color: transparent;
  transition:
    top var(--duration-normal) var(--ease-silk),
    border-color var(--duration-normal) var(--ease-silk),
    color var(--duration-normal) var(--ease-silk);

  &[data-open='true'] {
    top: calc(var(--nav-expanded) - 18px);
  }

  & .prompt {
    color: var(--term-ink);
  }

  /* A blinking block after the prompt says "type here" while the console is
     closed; the global reduced-motion rule holds it still. */
  & .caret {
    width: 0.8rem;
    height: 1.5rem;
    margin-left: -0.2rem;
    background: var(--term-accent);
    animation: silkTerminalCaretBlink 1.1s step-end infinite;
  }
  &[data-open='true'] .caret {
    display: none;
  }

  & svg {
    width: 14px;
    height: 14px;
    color: var(--term-accent);
  }

  &:hover,
  &:focus-visible {
    color: #ffffff;
    border-color: var(--term-accent);
    outline: none;
  }
`

interface TerminalConsoleProps {
  manifest: Manifest
  broadcast: Broadcast
}

export default function TerminalConsole({ manifest, broadcast }: TerminalConsoleProps) {
  const { isConsoleOpen, setConsoleOpen, setIsExpanded } = useHeaderContext()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // The console always starts closed and is summoned from the handle. Gate the
  // portal until the client has mounted, and tear the expansion down on unmount
  // (isExpanded is global; a stranded `true` would leave the nav expanded).
  useEffect(() => {
    setMounted(true)
    // The saved console theme also colors the handle, so it applies up front.
    restoreTerminalTheme()
    return () => {
      setConsoleOpen(false)
      setIsExpanded(false)
    }
  }, [setConsoleOpen, setIsExpanded])

  // The console is mounted by the layout and survives navigation, so a command
  // that links into a route (projects, blog, ...) closes it as the page changes.
  useEffect(() => {
    if (!pathname) return
    setConsoleOpen(false)
    setIsExpanded(false)
  }, [pathname, setConsoleOpen, setIsExpanded])

  // The console IS the header expansion: move both flags together so the nav
  // blooms (revealing CyberScape) exactly as the terminal drops.
  const close = useCallback(() => {
    setConsoleOpen(false)
    setIsExpanded(false)
  }, [setConsoleOpen, setIsExpanded])

  const handleRef = useRef<HTMLButtonElement>(null)

  const toggle = useCallback(() => {
    const next = !isConsoleOpen
    setConsoleOpen(next)
    setIsExpanded(next)
  }, [isConsoleOpen, setConsoleOpen, setIsExpanded])

  // Open is always deliberate, so treat it as a focused overlay: Escape closes
  // and the page behind stops scrolling on every breakpoint while the console
  // is down. The lock goes on the root element, which is what scrolls; body
  // only clips.
  useEffect(() => {
    if (!isConsoleOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      close()
      // Hand focus back to the handle so keyboard users land where they left.
      handleRef.current?.focus({ preventScroll: true })
    }
    window.addEventListener('keydown', onKey)

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = prevOverflow
    }
  }, [isConsoleOpen, close])

  if (!mounted) return null

  return createPortal(
    <div className={offsetVars}>
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className={backdropStyles}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: 0.2, ease: silkEase }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={panelStyles}
            exit={{ opacity: 0, y: -16 }}
            initial={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: silkEase }}
          >
            <div className={scrollStyles}>
              <TerminalHero broadcast={broadcast} manifest={manifest} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        aria-expanded={isConsoleOpen}
        aria-label={isConsoleOpen ? 'Close terminal console' : 'Open terminal console'}
        className={handleStyles}
        data-open={isConsoleOpen}
        onClick={toggle}
        ref={handleRef}
        type="button"
      >
        <motion.svg
          animate={{ rotate: isConsoleOpen ? 180 : 0 }}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          transition={{ duration: 0.3, ease: silkEase }}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
        <span className="prompt">guest@hyperbliss:~$</span>
        <span aria-hidden="true" className="caret" />
      </button>
    </div>,
    document.body,
  )
}
