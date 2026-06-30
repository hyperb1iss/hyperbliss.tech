'use client'

// The terminal as a pull-down console that IS the header's expansion. Opening it
// drives both isConsoleOpen (the panel/overlay) and isExpanded (the header bloom)
// so the CyberScape canvas reveals as the terminal drops — the terminal really is
// part of the expandable header. The panel is portaled to <body> to escape the
// nav's transform containing block (same reason MobileNavLinks portals), and
// renders nothing until mounted so the server pass stays SSR-safe.

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { css } from '../../../styled-system/css'
import { useHeaderContext } from '../HeaderContext'
import TerminalHero from './TerminalHero'

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
  background: radial-gradient(circle at 50% 0%, rgba(10, 6, 24, 0.55), rgba(4, 6, 14, 0.78));
  backdrop-filter: blur(2px);
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
  padding: var(--space-1-5) var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--silk-circuit-cyan);
  background: rgba(12, 10, 24, 0.92);
  border: 1px solid rgba(0, 255, 240, 0.4);
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 0 18px rgba(0, 255, 240, 0.18);
  -webkit-tap-highlight-color: transparent;
  transition: top var(--duration-normal) var(--ease-silk);

  &[data-open='true'] {
    top: calc(var(--nav-expanded) - 18px);
  }

  & .prompt {
    color: var(--text-secondary);
  }

  & svg {
    width: 14px;
    height: 14px;
  }

  &:hover,
  &:focus-visible {
    color: var(--text-primary);
    border-color: var(--silk-circuit-cyan);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.55), 0 0 26px rgba(0, 255, 240, 0.35);
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

  // The identity hero is the landing, so the console always starts closed and is
  // summoned from the handle. Just gate the portal until the client has mounted,
  // and make sure leaving home tears the header expansion back down (isExpanded
  // is global; a stranded `true` would leave other routes' navs expanded).
  useEffect(() => {
    setMounted(true)
    return () => {
      setConsoleOpen(false)
      setIsExpanded(false)
    }
  }, [setConsoleOpen, setIsExpanded])

  // The console IS the header expansion: move both flags together so the nav
  // blooms (revealing CyberScape) exactly as the terminal drops.
  const close = useCallback(() => {
    setConsoleOpen(false)
    setIsExpanded(false)
  }, [setConsoleOpen, setIsExpanded])

  const toggle = useCallback(() => {
    const next = !isConsoleOpen
    setConsoleOpen(next)
    setIsExpanded(next)
  }, [isConsoleOpen, setConsoleOpen, setIsExpanded])

  // Open is always deliberate, so treat it as a focused overlay: Escape closes
  // and body scroll locks on every breakpoint while the console is down.
  useEffect(() => {
    if (!isConsoleOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
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

      <motion.button
        animate={
          isConsoleOpen
            ? { boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 0 18px rgba(0,255,240,0.18)' }
            : {
                // Gentle pulse while closed so the pull-down reads as interactive.
                boxShadow: [
                  '0 6px 24px rgba(0,0,0,0.5), 0 0 14px rgba(0,255,240,0.15)',
                  '0 6px 24px rgba(0,0,0,0.5), 0 0 28px rgba(0,255,240,0.45)',
                  '0 6px 24px rgba(0,0,0,0.5), 0 0 14px rgba(0,255,240,0.15)',
                ],
              }
        }
        aria-expanded={isConsoleOpen}
        aria-label={isConsoleOpen ? 'Close terminal console' : 'Open terminal console'}
        className={handleStyles}
        data-open={isConsoleOpen}
        onClick={toggle}
        transition={
          isConsoleOpen ? { duration: 0.2 } : { duration: 2.4, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }
        }
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
      </motion.button>
    </div>,
    document.body,
  )
}
