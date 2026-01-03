// app/components/MobileNavLinks.tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { css } from '../../styled-system/css'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'

const silkEase = [0.23, 1, 0.32, 1] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const navPanelStyles = css`
  position: fixed;
  top: 76px;
  right: var(--space-3);
  width: min(260px, calc(100vw - var(--space-6)));
  z-index: 1001;

  /* Solid background - no backdrop-filter to avoid rendering bugs */
  background: rgb(12, 12, 20);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 255, 240, 0.15);

  /* Gradient top accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: var(--space-4);
    right: var(--space-4);
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--silk-quantum-purple) 30%,
      var(--silk-circuit-cyan) 70%,
      transparent
    );
    opacity: 0.6;
  }

  /* Soft shadow */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 0 60px rgba(0, 0, 0, 0.4);

  @media (min-width: 769px) {
    display: none !important;
  }
`

const navListStyles = css`
  list-style: none;
  padding: var(--space-3);
  padding-bottom: var(--space-4);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const navLinkStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: 1.8rem;
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  transition: all 0.2s ease;
  background: rgb(12, 12, 20);
  color: var(--text-secondary);

  &:hover {
    color: var(--text-primary);
    background: rgba(30, 30, 45, 1);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--silk-quantum-purple);
    outline-offset: 2px;
  }

  &[aria-current='page'] {
    color: var(--silk-circuit-cyan);
    background: rgba(0, 255, 240, 0.08);
    text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
  }
`

const navIconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  transition: opacity 0.2s ease;
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Nav Icons
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NAV_ICONS: Record<string, string> = {
  About: '◆',
  Blog: '◈',
  Projects: '▣',
  Resume: '◉',
}

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

  const handleNavigation = (href: string, event: React.MouseEvent) => {
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

  return (
    <motion.nav
      animate={open ? 'open' : 'closed'}
      className={navPanelStyles}
      initial="closed"
      ref={panelRef}
      style={{ background: 'rgb(12, 12, 20)' }}
      variants={panelVariants}
    >
      <ul className={navListStyles}>
        {NAV_ITEMS.map((item) => {
          const href = `/${item.toLowerCase()}`
          const isActive = pathname === href

          return (
            <motion.li key={item} style={{ width: '100%' }} variants={itemVariants}>
              <motion.a
                aria-current={isActive ? 'page' : undefined}
                className={navLinkStyles}
                href={href}
                onClick={(e) => handleNavigation(href, e)}
              >
                <span className={navIconStyles} style={{ opacity: isActive ? 1 : 0.5 }}>
                  {NAV_ICONS[item]}
                </span>
                {item}
              </motion.a>
            </motion.li>
          )
        })}
      </ul>
    </motion.nav>
  )
}

export default MobileNavLinks
