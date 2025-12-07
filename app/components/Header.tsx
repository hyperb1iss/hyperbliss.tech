// app/components/Header.tsx
'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { initializeCyberScape, triggerCyberScapeAnimation } from '../cyberscape/CyberScape'
import { useHeaderContext } from './HeaderContext'
import Logo from './Logo'
import MobileMenuIcon from './MobileMenuIcon'
import MobileNavLinks from './MobileNavLinks'
import NavLinks from './NavLinks'
import { usePageLoad } from './PageLoadOrchestrator'

/**
 * Styled components for the header
 */
const Nav = styled.nav<{ $isExpanded: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  padding: var(--space-3) var(--space-3) var(--space-4);
  height: ${(props) => (props.$isExpanded ? '200px' : '110px')};
  transition:
    height var(--duration-normal) var(--ease-silk),
    background var(--duration-normal) var(--ease-silk);
  z-index: 1000;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  pointer-events: none;
  background:
    radial-gradient(circle at 25% -10%, rgba(0, 255, 240, 0.12), transparent 50%),
    linear-gradient(180deg, rgba(6, 5, 15, 0.92) 0%, rgba(5, 6, 14, 0.75) 60%, rgba(5, 6, 14, 0.15) 100%);
  border-bottom: 1px solid rgba(0, 255, 240, 0.03);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: radial-gradient(circle at 50% 50%, rgba(0, 255, 240, 0.25), transparent 60%);
    opacity: 0.7;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: var(--space-2);
    height: ${(props) => (props.$isExpanded ? '180px' : '96px')};
  }
`

const NavOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background:
    linear-gradient(140deg, rgba(10, 4, 24, 0.5), rgba(4, 8, 24, 0.25)),
    radial-gradient(circle at 20% 30%, rgba(0, 255, 240, 0.08), transparent 50%),
    radial-gradient(circle at 80% 25%, rgba(162, 89, 255, 0.08), transparent 55%);
  border-top: 1px solid rgba(148, 163, 184, 0.06);
  border-bottom: 1px solid rgba(148, 163, 184, 0.03);
  pointer-events: none;
  z-index: 0;
`

const NavShadow = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(6, 5, 12, 0.35), transparent 85%);
  pointer-events: none;
  z-index: 0;
  filter: drop-shadow(0 8px 20px rgba(5, 8, 20, 0.25));
`

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1580px, calc(100% - var(--space-2)));
  padding: 0 clamp(var(--space-4), 2vw, var(--space-8));
  height: 100%;
  position: relative;
  pointer-events: all;
  z-index: 1;
  gap: var(--space-4);

  @media (max-width: 768px) {
    width: 100%;
    padding: var(--space-1) var(--space-3);
  }
`

const Canvas = styled(motion.canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; // Ensures the canvas scales to the full width
  height: 100%; // Ensures the canvas scales to the full height
  pointer-events: none;
  z-index: -1;
  mix-blend-mode: screen;
  filter: saturate(1.15) brightness(1.05);
  background: linear-gradient(180deg, rgba(20, 7, 43, 0.7) 0%, rgba(10, 5, 18, 0.15) 60%, transparent 100%);
`

const ChevronIcon = styled(motion.div)`
  position: absolute;
  bottom: 10px;
  left: 30px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  pointer-events: auto;
  color: rgba(0, 255, 240, 0.8);
  opacity: 0.9;
  transition: all var(--duration-fast) var(--ease-silk);
  z-index: 5;

  &:hover {
    opacity: 1;
    transform: translateY(-2px) scale(1.05);
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

const chevronVariants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 },
}

/**
 * Header component
 * Renders the main navigation header with animated effects and expandable CyberScape area.
 * @returns {JSX.Element} Rendered header
 */
const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const { isExpanded, setIsExpanded } = useHeaderContext()
  const { isInitialLoad } = usePageLoad()

  // Effect for initializing canvas and triggering CyberScape
  useEffect(() => {
    let cleanupCanvas: () => void = () => {}
    if (canvasRef.current && navRef.current) {
      cleanupCanvas = initializeCyberScape(
        canvasRef.current,
        navRef.current as unknown as HTMLAnchorElement,
        navRef.current as HTMLElement,
      )
    }

    // Cleanup on unmount
    return () => {
      if (cleanupCanvas) cleanupCanvas()
    }
  }, [])

  // Memoized debounced handler to prevent memory leaks
  const debouncedTrigger = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handler = (event: MouseEvent | TouchEvent) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          let x: number | undefined
          let y: number | undefined
          if (event instanceof MouseEvent) {
            x = event.clientX - rect.left
            y = event.clientY - rect.top
          } else if (event instanceof TouchEvent && event.touches.length > 0) {
            x = event.touches[0].clientX - rect.left
            y = event.touches[0].clientY - rect.top
          }
          if (x !== undefined && y !== undefined) {
            triggerCyberScapeAnimation(x, y)
          }
        }
      }, 100)
    }

    handler.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    return handler
  }, [])

  // Attach the interaction event listeners to the header for CyberScape
  useEffect(() => {
    const navElement = navRef.current
    if (navElement) {
      navElement.addEventListener('click', debouncedTrigger)
      navElement.addEventListener('touchstart', debouncedTrigger, {
        passive: true,
      })
    }
    return () => {
      if (navElement) {
        navElement.removeEventListener('click', debouncedTrigger)
        navElement.removeEventListener('touchstart', debouncedTrigger)
      }
      debouncedTrigger.cancel()
    }
  }, [debouncedTrigger])

  // Function to trigger CyberScape animation when menu is opened
  const triggerMenuAnimation = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = rect.right - 20 // 20px from the right edge
      const y = rect.top + 50 // Middle of the header height
      triggerCyberScapeAnimation(x, y)
    }
  }, [])

  // Handler for toggling menu
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev)
    triggerMenuAnimation()
  }, [triggerMenuAnimation])

  // Handler for toggling header expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Nav $isExpanded={isExpanded} ref={navRef}>
      <Canvas
        animate={{ opacity: 1 }}
        initial={{ opacity: isInitialLoad ? 0 : 1 }}
        ref={canvasRef}
        transition={{ delay: isInitialLoad ? 0.2 : 0, duration: isInitialLoad ? 0.8 : 0 }}
      />
      <NavOverlay aria-hidden="true" />
      <NavShadow aria-hidden="true" />
      <NavContent>
        <Logo />
        <NavLinks />
        <MobileMenuIcon menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </NavContent>
      {/* Mobile Navigation */}
      <MobileNavLinks open={menuOpen} setMenuOpen={setMenuOpen} />
      <ChevronIcon
        animate={isExpanded ? 'expanded' : 'collapsed'}
        initial="collapsed"
        onClick={toggleExpansion}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        variants={chevronVariants}
      >
        <svg
          aria-label="Toggle header expansion"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Toggle header expansion</title>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </ChevronIcon>
    </Nav>
  )
}

export default Header
