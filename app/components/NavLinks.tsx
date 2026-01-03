// app/components/NavLinks.tsx
'use client'

import { type Easing, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'

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

  transition:
    color var(--duration-fast) var(--ease-silk),
    text-shadow var(--duration-fast) var(--ease-silk),
    transform var(--duration-fast) var(--ease-silk);

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

  const handleNavigation = (href: string, event: React.MouseEvent) => {
    event.preventDefault()
    animateAndNavigate(href)
  }

  return (
    <NavLinksContainer>
      {NAV_ITEMS.map((item) => {
        const href = `/${item.toLowerCase()}`
        const isActive = pathname === href

        // Dynamic styles for active state
        const dynamicStyles: React.CSSProperties = {
          color: isActive ? 'var(--silk-circuit-cyan)' : 'var(--text-secondary)',
          textShadow: isActive ? '0 0 20px rgba(0, 255, 240, 0.6), 0 0 40px rgba(0, 255, 240, 0.3)' : 'none',
        }

        return (
          <NavItem key={item}>
            <motion.a
              aria-current={isActive ? 'page' : undefined}
              className={navLinkBaseStyles}
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              style={dynamicStyles}
              whileTap={{ scale: 0.98 }}
            >
              <style>{`
                @keyframes shimmer {
                  0%, 100% { background-position: 200% 0; }
                  50% { background-position: -200% 0; }
                }
                .${navLinkBaseStyles.split(' ')[0]}::after {
                  content: '';
                  position: absolute;
                  bottom: -2px;
                  left: 50%;
                  width: ${isActive ? '100%' : '0'};
                  height: 2px;
                  background: linear-gradient(90deg, transparent, var(--silk-circuit-cyan) 20%, var(--silk-quantum-purple) 50%, var(--silk-circuit-cyan) 80%, transparent);
                  background-size: 200% 100%;
                  box-shadow: 0 0 8px var(--silk-circuit-cyan), 0 0 16px rgba(0, 255, 240, 0.4);
                  transform: translateX(-50%);
                  opacity: ${isActive ? '1' : '0'};
                  transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease;
                  ${isActive ? 'animation: shimmer 6s ease-in-out infinite;' : ''}
                }
                .${navLinkBaseStyles.split(' ')[0]}:hover::after {
                  width: 100%;
                  opacity: 1;
                  animation: shimmer 6s ease-in-out infinite;
                }
                .${navLinkBaseStyles.split(' ')[0]}:hover {
                  color: var(--silk-circuit-cyan);
                  text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
                }
              `}</style>
              {item}
            </motion.a>
          </NavItem>
        )
      })}
    </NavLinksContainer>
  )
}

export default NavLinks
