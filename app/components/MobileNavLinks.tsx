// app/components/MobileNavLinks.tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'
import { navLinkBaseStyles, silkNavEase } from './NavLinks'

/**
 * Styled components for mobile navigation
 */
const MobileNavLinksContainer = styled(motion.ul)`
  list-style: none;
  position: fixed;
  top: 110px;
  right: var(--space-2);
  width: min(320px, calc(100% - var(--space-4)));
  flex-direction: column;
  display: flex;
  gap: var(--space-2);
  z-index: 1001;
  padding: var(--space-3);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(148, 163, 184, 0.2);
  background:
    radial-gradient(circle at 12% 15%, rgba(162, 89, 255, 0.25), transparent 55%),
    radial-gradient(circle at 80% 10%, rgba(0, 255, 240, 0.25), transparent 60%),
    rgba(5, 5, 8, 0.92);
  box-shadow: 0 30px 65px rgba(5, 5, 8, 0.75);
  backdrop-filter: blur(var(--blur-xl));

  @media (min-width: 769px) {
    display: none;
  }
`

const MobileNavItem = styled(motion.li)`
  width: 100%;
`

const StyledNavLink = styled(motion.a)<{ $active: boolean }>`
  ${navLinkBaseStyles}
  width: 100%;
  font-size: 1.6rem;
  letter-spacing: 0.18em;
  padding: var(--space-3) var(--space-4);
  justify-content: center;
  color: ${({ $active }) => ($active ? 'var(--silk-white)' : 'var(--text-secondary)')};
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, rgba(162, 89, 255, 0.2), rgba(0, 255, 240, 0.18))' : 'rgba(2, 6, 23, 0.72)'};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(0, 255, 240, 0.45)' : 'rgba(148, 163, 184, 0.2)')};
  box-shadow: ${({ $active }) => ($active ? '0 12px 30px rgba(0, 255, 240, 0.2)' : '0 6px 18px rgba(5, 5, 8, 0.35)')};

  &:hover,
  &:focus-visible {
    color: var(--silk-white);
    border-color: rgba(0, 255, 240, 0.45);
    background: ${({ $active }) =>
      $active ? 'linear-gradient(135deg, rgba(162, 89, 255, 0.3), rgba(0, 255, 240, 0.3))' : 'rgba(15, 23, 42, 0.9)'};
    transform: translateX(6px);
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
  }
`

/**
 * Props interface for MobileNavLinks component.
 */
interface MobileNavLinksProps {
  open: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * MobileNavLinks component
 * Renders the mobile navigation links with animations.
 * @param {MobileNavLinksProps} props - Component props
 * @returns {JSX.Element} Rendered mobile navigation links
 */
const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ open, setMenuOpen }) => {
  const pathname = usePathname()
  const animateAndNavigate = useAnimatedNavigation()
  const mobileMenuRef = useRef<HTMLUListElement>(null)
  const mobileMenuVariants = {
    closed: { opacity: 0, pointerEvents: 'none', transition: { duration: 0.25 }, x: '105%' },
    open: {
      opacity: 1,
      pointerEvents: 'auto',
      transition: { duration: 0.3, ease: silkNavEase },
      x: 0,
    },
  }

  const mobileItemVariants = {
    closed: { opacity: 0, x: 24 },
    open: (index: number) => ({
      opacity: 1,
      transition: {
        delay: 0.05 * index + 0.05,
        duration: 0.3,
        ease: silkNavEase,
      },
      x: 0,
    }),
  }

  const handleNavigation = (href: string, event: React.MouseEvent) => {
    event.preventDefault()
    setMenuOpen(false)
    animateAndNavigate(href)
  }

  // Handler for clicking outside mobile menu
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        open &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.mobile-menu-icon')
      ) {
        setMenuOpen(false)
      }
    },
    [open, setMenuOpen],
  )

  // Effect for adding/removing click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <MobileNavLinksContainer
      animate={open ? 'open' : 'closed'}
      initial={false}
      ref={mobileMenuRef}
      variants={mobileMenuVariants}
    >
      {NAV_ITEMS.map((item, index) => (
        <MobileNavItem animate={open ? 'open' : 'closed'} custom={index} key={item} variants={mobileItemVariants}>
          <StyledNavLink
            $active={pathname === `/${item.toLowerCase()}`}
            aria-current={pathname === `/${item.toLowerCase()}` ? 'page' : undefined}
            href={`/${item.toLowerCase()}`}
            onClick={(e) => handleNavigation(`/${item.toLowerCase()}`, e)}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
          >
            {item}
          </StyledNavLink>
        </MobileNavItem>
      ))}
    </MobileNavLinksContainer>
  )
}

export default MobileNavLinks
