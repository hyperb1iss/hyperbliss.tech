// app/components/MobileNavLinks.tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'

const silkEase = [0.23, 1, 0.32, 1] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styled Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NavPanel = styled(motion.nav)`
  position: fixed;
  top: 76px;
  right: var(--space-3);
  width: min(260px, calc(100vw - var(--space-6)));
  z-index: 1001;

  /* Glass panel */
  background: rgba(10, 10, 18, 0.95);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);

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
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;

  @media (min-width: 769px) {
    display: none;
  }
`

const NavList = styled.ul`
  list-style: none;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`

const NavItem = styled(motion.li)`
  width: 100%;
`

const NavLink = styled(motion.a)<{ $active: boolean }>`
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

  color: ${({ $active }) => ($active ? 'var(--silk-circuit-cyan)' : 'var(--text-secondary)')};
  background: ${({ $active }) => ($active ? 'rgba(0, 255, 240, 0.08)' : 'transparent')};

  ${({ $active }) =>
    $active &&
    `
    text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
  `}

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--silk-quantum-purple);
    outline-offset: 2px;
  }
`

const NavIcon = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.2s ease;

  ${NavLink}:hover & {
    opacity: 1;
  }
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
      scale: 0.95,
      transition: { duration: 0.2, ease: silkEase },
      y: -10,
    },
    open: {
      opacity: 1,
      pointerEvents: 'auto' as const,
      scale: 1,
      transition: {
        delayChildren: 0.05,
        duration: 0.25,
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
    <NavPanel animate={open ? 'open' : 'closed'} initial="closed" ref={panelRef} variants={panelVariants}>
      <NavList>
        {NAV_ITEMS.map((item) => {
          const href = `/${item.toLowerCase()}`
          const isActive = pathname === href
          return (
            <NavItem key={item} variants={itemVariants}>
              <NavLink
                $active={isActive}
                aria-current={isActive ? 'page' : undefined}
                href={href}
                onClick={(e) => handleNavigation(href, e)}
              >
                <NavIcon $active={isActive}>{NAV_ICONS[item]}</NavIcon>
                {item}
              </NavLink>
            </NavItem>
          )
        })}
      </NavList>
    </NavPanel>
  )
}

export default MobileNavLinks
