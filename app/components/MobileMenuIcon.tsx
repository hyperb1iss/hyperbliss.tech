// app/components/MobileMenuIcon.tsx
'use client'

import { motion } from 'framer-motion'
import { styled } from 'styled-components'

/**
 * Styled component for the mobile menu icon container.
 */
const MobileMenuIconContainer = styled(motion.div)`
  display: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 1rem;
  z-index: 1100;
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.7));

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`

/**
 * Styled component for the menu lines.
 */
const MenuLine = styled(motion.span)`
  width: 100%;
  height: 3px;
  background-color: var(--color-accent);
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.7);
`

/**
 * Props interface for MobileMenuIcon component.
 */
interface MobileMenuIconProps {
  menuOpen: boolean
  toggleMenu: () => void
}

/**
 * MobileMenuIcon component
 * Renders the mobile menu icon with animation.
 * @param {MobileMenuIconProps} props - Component props
 * @returns {JSX.Element} Rendered mobile menu icon
 */
const MobileMenuIcon: React.FC<MobileMenuIconProps> = ({ menuOpen, toggleMenu }) => {
  const topLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 10 },
  }

  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  }

  const bottomLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -10 },
  }

  return (
    <MobileMenuIconContainer
      aria-label="Toggle menu"
      className="mobile-menu-icon"
      onClick={toggleMenu}
      role="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MenuLine animate={menuOpen ? 'open' : 'closed'} transition={{ duration: 0.3 }} variants={topLineVariants} />
      <MenuLine animate={menuOpen ? 'open' : 'closed'} transition={{ duration: 0.3 }} variants={middleLineVariants} />
      <MenuLine animate={menuOpen ? 'open' : 'closed'} transition={{ duration: 0.3 }} variants={bottomLineVariants} />
    </MobileMenuIconContainer>
  )
}

export default MobileMenuIcon
