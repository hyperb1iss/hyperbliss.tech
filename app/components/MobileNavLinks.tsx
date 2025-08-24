// app/components/MobileNavLinks.tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { keyframes, styled } from 'styled-components'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'
import { NAV_ITEMS } from '../lib/navigation'

/**
 * Keyframe animation for slide-in effect.
 */
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

/**
 * Styled components for mobile navigation
 */
const MobileNavLinksContainer = styled.ul<{ open: boolean }>`
  list-style: none;
  position: fixed;
  top: 100px;
  right: 0;
  background-color: rgba(10, 10, 20, 0.95);
  width: 250px;
  flex-direction: column;
  display: flex;
  z-index: 1001;
  padding: 1rem 1rem;
  border-radius: 10px 0 0 10px;
  box-shadow: -5px 0 20px rgba(162, 89, 255, 0.5);
  border-left: 1px solid rgba(162, 89, 255, 0.4);
  opacity: ${(props) => (props.open ? 1 : 0)};
  transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(100%)')};
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  pointer-events: ${(props) => (props.open ? 'all' : 'none')};

  li {
    padding: 1rem;
    text-align: center;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;

    &:hover {
      background-color: rgba(162, 89, 255, 0.2);
      transform: scale(1.05);
    }
  }
`

const MobileNavItem = styled(motion.li)<{ $index: number; $open: boolean }>`
  @media (max-width: 768px) {
    opacity: 0;
    transform: translateX(20px);
    animation: ${slideIn} 0.3s forwards;
    animation-delay: ${(props) => (props.$open ? props.$index * 0.1 : 0)}s;
  }
`

const StyledNavLink = styled.a<{ $active: boolean }>`
  font-family: var(--font-body);
  font-size: 2.2rem;
  font-weight: 700;
  color: ${(props) => (props.$active ? '#00ffff' : '#ffffff')};
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  text-shadow:
    0 0 1px #000,
    0 0 2px #000,
    0 0 3px ${(props) => (props.$active ? '#00ffff' : '#ffffff')};

  &:hover,
  &:focus {
    color: #00ffff;
    text-shadow:
      0 0 1px #000,
      0 0 2px #000,
      0 0 3px #00ffff,
      0 0 5px #00ffff,
      0 0 7px #00ffff;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #00ffff;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    box-shadow: 0 0 5px #00ffff;
  }

  &:hover::after,
  &:focus::after {
    transform: scaleX(1);
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 0.5rem 0;
    display: block;
    width: 100%;
    text-align: center;
    color: ${(props) => (props.$active ? '#00ffff' : '#ffffff')};

    &::after {
      bottom: 0;
    }
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
    <MobileNavLinksContainer open={open} ref={mobileMenuRef}>
      {NAV_ITEMS.map((item, index) => (
        <MobileNavItem $index={index} $open={open} key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StyledNavLink
            $active={pathname === `/${item.toLowerCase()}`}
            href={`/${item.toLowerCase()}`}
            onClick={(e) => handleNavigation(`/${item.toLowerCase()}`, e)}
          >
            {item}
          </StyledNavLink>
        </MobileNavItem>
      ))}
    </MobileNavLinksContainer>
  )
}

export default MobileNavLinks
