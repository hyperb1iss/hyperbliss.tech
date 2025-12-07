// app/components/NavLinks.tsx
'use client'

import { type Easing, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { styled } from 'styled-components'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'

export const silkNavEase: Easing = [0.23, 1, 0.32, 1]

const NavLinksContainer = styled.ul`
  list-style: none;
  display: flex;
  gap: var(--space-1);
  flex-shrink: 0;
  margin-left: auto;
  align-items: center;
  pointer-events: auto;

  @media (min-width: 769px) {
    gap: var(--space-2);
  }

  @media (min-width: 1200px) {
    gap: var(--space-3);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled.li`
  position: relative;
  display: inline-flex;
  align-items: center;
`

const StyledNavLink = styled(motion.a)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: var(--font-semibold);
  padding: var(--space-2) var(--space-3);
  font-size: clamp(1.6rem, 1.4rem + 0.5vw, 2.2rem);
  text-decoration: none;
  position: relative;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;

  color: ${({ $active }) => ($active ? 'var(--silk-circuit-cyan)' : 'var(--text-secondary)')};
  text-shadow: ${({ $active }) =>
    $active ? '0 0 20px rgba(0, 255, 240, 0.6), 0 0 40px rgba(0, 255, 240, 0.3)' : 'none'};

  transition:
    color var(--duration-fast) var(--ease-silk),
    text-shadow var(--duration-fast) var(--ease-silk),
    transform var(--duration-fast) var(--ease-silk);

  /* Underline indicator */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${({ $active }) => ($active ? '80%' : '0')};
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--silk-circuit-cyan), transparent);
    transform: translateX(-50%);
    transition: width var(--duration-normal) var(--ease-silk);
    box-shadow: ${({ $active }) =>
      $active ? '0 0 10px var(--silk-circuit-cyan), 0 0 20px rgba(0, 255, 240, 0.4)' : 'none'};
  }

  &:hover,
  &:focus-visible {
    color: var(--silk-circuit-cyan);
    text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);

    &::after {
      width: 60%;
    }
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 255, 240, 0.5);
    outline-offset: 4px;
  }

  @media (min-width: 1200px) {
    padding: var(--space-2) var(--space-4);
    font-size: 1.9rem;
  }

  @media (min-width: 1400px) {
    padding: var(--space-3) var(--space-5);
    font-size: 2.1rem;
  }
`

/**
 * NavLinks component
 * Renders the desktop navigation links.
 * @returns {JSX.Element} Rendered navigation links
 */
const NavLinks: React.FC = () => {
  const pathname = usePathname()
  const animateAndNavigate = useAnimatedNavigation()

  const handleNavigation = (href: string, event: React.MouseEvent) => {
    event.preventDefault()
    animateAndNavigate(href)
  }

  return (
    <NavLinksContainer>
      {NAV_ITEMS.map((item) => {
        const href = `/${item.toLowerCase()}`
        const isActive = pathname === href
        return (
          <NavItem key={item}>
            <StyledNavLink
              $active={isActive}
              aria-current={isActive ? 'page' : undefined}
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              whileTap={{ scale: 0.98 }}
            >
              {item}
            </StyledNavLink>
          </NavItem>
        )
      })}
    </NavLinksContainer>
  )
}

export default NavLinks
