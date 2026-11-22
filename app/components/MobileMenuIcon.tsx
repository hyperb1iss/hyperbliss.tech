// app/components/MobileMenuIcon.tsx
'use client'

import { motion } from 'framer-motion'
import { css } from '../../styled-system/css'

const mobileMenuIconContainerStyles = css`
  display: none;
  width: 44px;
  height: 44px;
  /* A 24 by 21 glyph inside the 44px touch target; the lines sit 7px apart,
     which is the distance the open state travels to cross them. */
  padding: 11.5px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-right: 0.4rem;
  z-index: 1100;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid var(--silk-circuit-cyan);
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`

const menuLineStyles = css`
  width: 100%;
  height: 2px;
  background-color: #f4f0ff;
  border-radius: 2px;
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
    open: { rotate: 45, translateY: 7 },
  }

  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  }

  const bottomLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -7 },
  }

  return (
    <motion.button
      aria-controls="mobile-navigation"
      aria-expanded={menuOpen}
      aria-label="Toggle menu"
      className={`${mobileMenuIconContainerStyles} mobile-menu-icon`}
      id="mobile-menu-toggle"
      onClick={(e) => {
        e.stopPropagation()
        toggleMenu()
      }}
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        animate={menuOpen ? 'open' : 'closed'}
        className={menuLineStyles}
        transition={{ duration: 0.3 }}
        variants={topLineVariants}
      />
      <motion.span
        animate={menuOpen ? 'open' : 'closed'}
        className={menuLineStyles}
        transition={{ duration: 0.3 }}
        variants={middleLineVariants}
      />
      <motion.span
        animate={menuOpen ? 'open' : 'closed'}
        className={menuLineStyles}
        transition={{ duration: 0.3 }}
        variants={bottomLineVariants}
      />
    </motion.button>
  )
}

export default MobileMenuIcon
