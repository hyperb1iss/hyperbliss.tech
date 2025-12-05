// app/components/NavLinks.tsx
'use client'

import { type Easing, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { css, styled } from 'styled-components'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'

export const silkNavEase: Easing = [0.23, 1, 0.32, 1]

export const navLinkBaseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  text-transform: uppercase;
  letter-spacing: clamp(0.18em, 0.12em + 0.15vw, 0.32em);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-3xl);
  padding: clamp(0.9rem, 0.7rem + 0.45vw, 1.35rem) clamp(2.5rem, 1.2rem + 1.3vw, 4.75rem);
  font-size: clamp(1.1rem, 0.9rem + 0.55vw, 1.85rem);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  z-index: 1;
  transition:
    color var(--duration-fast) var(--ease-silk),
    background var(--duration-fast) var(--ease-silk),
    border-color var(--duration-fast) var(--ease-silk),
    transform var(--duration-fast) var(--ease-silk),
    box-shadow var(--duration-fast) var(--ease-silk);
  text-shadow: none;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    background: radial-gradient(circle at 30% 20%, rgba(0, 255, 240, 0.35), transparent 65%);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-silk);
    z-index: -1;
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 255, 240, 0.8);
    outline-offset: 3px;
  }

  @media (max-width: 1200px) {
    letter-spacing: 0.16em;
    font-size: 1.05rem;
    padding: var(--space-2) var(--space-4);
  }

  @media (max-width: 1024px) {
    letter-spacing: 0.14em;
    font-size: 0.95rem;
    padding: var(--space-2) var(--space-3);
  }
`

const NavLinksContainer = styled.ul`
  list-style: none;
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
  margin-left: auto;
  align-items: center;
  pointer-events: auto;

  @media (min-width: 769px) {
    gap: calc(var(--space-2) + 0.25vw);
  }

  @media (min-width: 1200px) {
    gap: calc(var(--space-3) + 0.5vw);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled.li`
  position: relative;
  display: inline-flex;
  align-items: center;
  isolation: isolate;
`

const StyledNavLink = styled(motion.a)<{ $active: boolean }>`
  ${navLinkBaseStyles}
  color: ${({ $active }) => ($active ? 'var(--silk-white)' : 'var(--text-secondary)')};
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, rgba(162, 89, 255, 0.25), rgba(0, 255, 240, 0.2))' : 'rgba(2, 6, 23, 0.65)'};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(0, 255, 240, 0.55)' : 'rgba(148, 163, 184, 0.25)')};
  box-shadow: ${({ $active }) =>
    $active
      ? '0 18px 35px rgba(0, 255, 240, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 12px 30px rgba(5, 5, 8, 0.45)'};

  ${({ $active }) =>
    !$active &&
    css`
      &::after {
        opacity: 0.45;
      }
    `}

  &:hover,
  &:focus-visible {
    color: var(--silk-white);
    border-color: rgba(0, 255, 240, 0.55);
    background: ${({ $active }) =>
      $active ? 'linear-gradient(135deg, rgba(162, 89, 255, 0.3), rgba(0, 255, 240, 0.3))' : 'rgba(15, 23, 42, 0.85)'};
    transform: translateY(-2px);
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
  }

  @media (min-width: 1400px) {
    padding: clamp(1rem, 0.8rem + 0.3vw, 1.4rem) clamp(3rem, 2rem + 1.2vw, 4rem);
  }
`

const ActiveGlow = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-3xl);
  background: radial-gradient(circle at 50% 50%, rgba(0, 255, 240, 0.45), rgba(162, 89, 255, 0.25));
  box-shadow: 0 0 30px rgba(0, 255, 240, 0.55);
  opacity: 0.65;
  pointer-events: none;
  z-index: 0;
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
            {isActive ? (
              <ActiveGlow layoutId="nav-active-glow" transition={{ duration: 0.45, ease: silkNavEase }} />
            ) : null}
            <StyledNavLink
              $active={isActive}
              aria-current={isActive ? 'page' : undefined}
              className={isActive ? 'active' : ''}
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
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
