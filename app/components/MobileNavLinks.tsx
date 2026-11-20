// app/components/MobileNavLinks.tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { css } from '../../styled-system/css'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { isNavItemActive, NAV_ITEMS, shouldHandleNavigation } from '../lib/navigation'

const silkEase = [0.23, 1, 0.32, 1] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const navPanelStyles = css`
  position: fixed;
  top: 84px;
  right: var(--space-3);
  width: 20rem;
  max-width: calc(100vw - var(--space-6));
  z-index: 9999 !important;
  isolation: isolate;
  overflow: hidden;

  /* Solid background - no backdrop-filter to avoid rendering bugs */
  background: #0a0612;
  border-radius: 1.2rem;
  border: 1px solid rgba(244, 240, 255, 0.16);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);

  /* One crisp line of the brand gradient across the top edge. */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
    background: linear-gradient(90deg, #e135ff, #ff6ac1 45%, #80ffea);
  }

  @media (min-width: 769px) {
    display: none !important;
  }
`

const navListStyles = css`
  list-style: none;
  padding: 1.1rem 0.8rem 0.8rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const navLinkStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 0 1.4rem;
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.8rem;
  cursor: pointer;
  position: relative;
  transition:
    color 0.2s ease,
    background 0.2s ease;
  background: transparent;
  color: #d6cfe6;

  &:hover {
    color: #ffffff;
    background: rgba(244, 240, 255, 0.06);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #80ffea;
    outline-offset: -2px;
  }

  &[aria-current='page'] {
    color: #ffffff;
    background: rgba(128, 255, 234, 0.1);
    box-shadow: inset 2px 0 0 #80ffea;
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface MobileNavLinksProps {
  open: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ open, setMenuOpen }) => {
  const pathname = usePathname()
  const animateAndNavigate = useAnimatedNavigation()
  const panelRef = useRef<HTMLElement>(null)

  const panelVariants = {
    closed: {
      opacity: 0,
      pointerEvents: 'none' as const,
      transition: { duration: 0.15, ease: silkEase },
      y: -8,
    },
    open: {
      opacity: 1,
      pointerEvents: 'auto' as const,
      transition: {
        delayChildren: 0.05,
        duration: 0.2,
        ease: silkEase,
        staggerChildren: 0.04,
      },
      y: 0,
    },
  }

  const itemVariants = {
    closed: { opacity: 0, x: 12 },
    open: {
      opacity: 1,
      transition: { duration: 0.2, ease: silkEase },
      x: 0,
    },
  }

  const handleNavigation = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!shouldHandleNavigation(event)) return
    event.preventDefault()
    setMenuOpen(false)
    animateAndNavigate(href)
  }

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.mobile-menu-icon')
      ) {
        setMenuOpen(false)
      }
    },
    [open, setMenuOpen],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('a')?.focus({ preventScroll: true })
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      document.getElementById('mobile-menu-toggle')?.focus()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, setMenuOpen])

  const content = (
    <motion.nav
      animate={open ? 'open' : 'closed'}
      aria-label="Mobile navigation"
      className={navPanelStyles}
      id="mobile-navigation"
      // The closed panel still occupies its box over the terminal handle, so
      // inert keeps its faded links out of hit-testing, focus, and the a11y
      // tree instead of relying on pointer-events alone.
      inert={!open}
      initial="closed"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget?.id !== 'mobile-menu-toggle') {
          setMenuOpen(false)
        }
      }}
      ref={panelRef}
      variants={panelVariants}
    >
      <ul className={navListStyles}>
        {NAV_ITEMS.map((item) => {
          const { href, label } = item
          const isActive = isNavItemActive(pathname, item)

          return (
            <motion.li key={href} style={{ width: '100%' }} variants={itemVariants}>
              <motion.a
                aria-current={isActive ? 'page' : undefined}
                className={navLinkStyles}
                href={href}
                onClick={(e) => handleNavigation(href, e)}
              >
                {label}
              </motion.a>
            </motion.li>
          )
        })}
      </ul>
    </motion.nav>
  )

  // Portal to body to escape nav's transform containing block
  return createPortal(content, document.body)
}

export default MobileNavLinks
