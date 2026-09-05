// app/components/NavLinks.tsx
'use client'

import { type Easing, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { isNavigationActive, NAV_ITEMS, shouldHandleNavigation } from '../lib/navigation'

export const silkNavEase: Easing = [0.23, 1, 0.32, 1]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NavLinksContainer = styled.ul`
  list-style: none;
  display: flex;
  gap: clamp(var(--space-1), 1vw, var(--space-3));
  flex-shrink: 0;
  align-items: center;
  pointer-events: auto;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled.li`
  position: relative;
  display: inline-flex;
  align-items: center;
`

const navLinkBaseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  padding: var(--space-2) var(--space-3);
  font-size: clamp(1.25rem, 1.15rem + 0.25vw, 1.5rem);
  text-decoration: none;
  position: relative;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  border: none;

  transition:
    color var(--duration-fast) var(--ease-silk),
    text-shadow var(--duration-fast) var(--ease-silk),
    transform var(--duration-fast) var(--ease-silk);

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--silk-circuit-cyan) 20%, var(--silk-quantum-purple) 50%, var(--silk-circuit-cyan) 80%, transparent);
    box-shadow: 0 0 8px var(--silk-circuit-cyan);
    background-size: 200% 100%;
    transform: translateX(-50%) scaleX(0);
    opacity: 0;
    transition: transform var(--duration-normal) var(--ease-silk), opacity var(--duration-normal) var(--ease-silk);
  }

  &[aria-current], &:hover, &:focus-visible {
    color: var(--silk-circuit-cyan);
    text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);

    &::after {
      transform: translateX(-50%) scaleX(1);
      opacity: 1;
      animation: silkNavShimmer 6s ease-in-out infinite;
    }
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 255, 240, 0.5);
    outline-offset: 4px;
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * NavLinks component
 * Renders the desktop navigation links.
 */
const NavLinks: React.FC = () => {
  const pathname = usePathname()
  const animateAndNavigate = useAnimatedNavigation()

  const handleNavigation = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!shouldHandleNavigation(event)) return
    event.preventDefault()
    animateAndNavigate(href)
  }

  return (
    <NavLinksContainer>
      {NAV_ITEMS.map((item) => {
        const href = `/${item.toLowerCase()}`
        const isActive = isNavigationActive(pathname, href)

        return (
          <NavItem key={item}>
            <motion.a
              aria-current={isActive ? 'page' : undefined}
              className={navLinkBaseStyles}
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              whileTap={{ scale: 0.98 }}
            >
              {item}
            </motion.a>
          </NavItem>
        )
      })}
    </NavLinksContainer>
  )
}

export default NavLinks
