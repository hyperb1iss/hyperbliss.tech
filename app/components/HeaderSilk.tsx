'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { initializeCyberScape } from '../cyberscape/CyberScape'
import { SilkButton } from '../styles/silkcircuit/components'
import { ThemeToggle } from '../styles/silkcircuit/theme'
import { usePageLoad } from './PageLoadOrchestrator'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styled Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HeaderWrapper = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  transition: all var(--duration-normal) var(--ease-silk);
  
  ${({ $scrolled }) =>
    $scrolled
      ? `
    background: var(--surface-glass);
    backdrop-filter: blur(var(--blur-xl));
    border-bottom: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-lg);
  `
      : `
    background: transparent;
  `}
`

const HeaderContent = styled.div`
  max-width: var(--container-2xl);
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`

const Logo = styled(Link)`
  font-family: var(--font-display);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-black);
  color: var(--silk-circuit-cyan);
  text-decoration: none;
  letter-spacing: var(--tracking-wider);
  position: relative;
  transition: all var(--duration-normal) var(--ease-silk);
  
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      var(--silk-quantum-purple), 
      var(--silk-circuit-cyan), 
      var(--silk-plasma-pink)
    );
    transition: width var(--duration-normal) var(--ease-silk);
  }
  
  &:hover {
    color: var(--silk-quantum-purple);
    text-shadow: var(--glow-purple);
    
    &::before {
      width: 100%;
    }
  }
`

const NavSection = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-8);
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: var(--space-6);
`

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  font-weight: var(--font-medium);
  color: ${({ $active }) => ($active ? 'var(--silk-quantum-purple)' : 'var(--text-secondary)')};
  text-decoration: none;
  position: relative;
  transition: all var(--duration-fast) var(--ease-silk);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: var(--silk-quantum-purple);
    transition: width var(--duration-fast) var(--ease-silk);
  }
  
  &:hover {
    color: var(--silk-quantum-purple);
    
    &::after {
      width: 100%;
    }
  }
`

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`

const MobileMenuButton = styled(motion.button)`
  display: none;
  padding: var(--space-2);
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`

const MenuLine = styled(motion.span)`
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: var(--radius-full);
`

const Canvas = styled(motion.canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-xl));
  border-left: 1px solid var(--border-subtle);
  padding: var(--space-24) var(--space-6) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  z-index: var(--z-modal);
`

const MobileNavLink = styled(Link)`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  text-decoration: none;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) var(--ease-silk);
  
  &:hover {
    color: var(--silk-quantum-purple);
    padding-left: var(--space-2);
  }
`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: calc(var(--z-modal) - 1);
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Navigation Data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/resume', label: 'Resume' },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function HeaderSilk() {
  const pathname = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isInitialLoad } = usePageLoad()

  // Scroll progress for animations
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize CyberScape
  useEffect(() => {
    if (canvasRef.current && headerRef.current) {
      const cleanup = initializeCyberScape(canvasRef.current, headerRef.current as any, headerRef.current)
      return cleanup
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <HeaderWrapper
        $scrolled={scrolled}
        animate={{ y: 0 }}
        initial={{ y: -100 }}
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        transition={{
          delay: isInitialLoad ? 0.2 : 0,
          duration: isInitialLoad ? 0.5 : 0,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <Canvas
          animate={{ opacity: 1 }}
          initial={{ opacity: isInitialLoad ? 0 : 1 }}
          ref={canvasRef}
          transition={{
            delay: isInitialLoad ? 0.3 : 0,
            duration: isInitialLoad ? 0.8 : 0,
          }}
        />

        <HeaderContent>
          <LogoSection>
            <Logo href="/">hyperbliss</Logo>
          </LogoSection>

          <NavSection>
            <NavLinks>
              {navItems.map((item) => (
                <NavLink $active={pathname === item.href} href={item.href} key={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </NavLinks>
          </NavSection>

          <ActionsSection>
            <ThemeToggle />

            <SilkButton
              $size="sm"
              $variant="primary"
              as={Link}
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </SilkButton>

            <MobileMenuButton
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <MenuLine
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 6 : 0,
                }}
              />
              <MenuLine
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                }}
              />
              <MenuLine
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? -6 : 0,
                }}
              />
            </MobileMenuButton>
          </ActionsSection>
        </HeaderContent>
      </HeaderWrapper>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <Overlay
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <MobileMenu
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            initial={{ x: '100%' }}
            transition={{ damping: 25, stiffness: 300, type: 'spring' }}
          >
            {navItems.map((item) => (
              <MobileNavLink href={item.href} key={item.href}>
                {item.label}
              </MobileNavLink>
            ))}
            <MobileNavLink href="/contact">Contact</MobileNavLink>
          </MobileMenu>
        </>
      )}
    </>
  )
}
