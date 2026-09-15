// app/components/Logo.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Panda CSS Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1.5rem;
  overflow: visible;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    overflow: hidden;
    gap: 0;
  }

  &:hover {
    transform: scale(1.05);

    img {
      filter: drop-shadow(0 0 20px rgba(162, 89, 255, 0.8));
    }

    span {
      filter: drop-shadow(0 0 10px rgba(0, 255, 240, 0.8));
      transform: translateX(5px);
    }
  }
`

const logoImageStyles = css`
  height: 70px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  animation: silkLogoSubtleGlow 3s ease-in-out infinite;
  transition: filter 0.3s ease;
  will-change: filter;

  @media (max-width: 768px) {
    height: 60px;
    max-width: calc(100% - 60px); /* Leave room for menu icon */
    /* Disable filter animation on mobile to reduce GPU load */
    animation: none;
    filter: drop-shadow(0 0 6px rgba(162, 89, 255, 0.3));
  }

  @media (min-width: 1200px) {
    height: 80px;
  }
`

const TechnologiesText = styled.span`
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--silk-circuit-cyan);
  opacity: 0.85;
  position: relative;
  white-space: nowrap;
  align-self: flex-end;
  margin-bottom: 1rem;
  animation: silkLogoSlideIn 0.8s var(--ease-silk) 0.3s both;
  transition: opacity var(--duration-normal) var(--ease-silk);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: auto;
  overflow: visible;
  padding-left: 2rem;
  flex-shrink: 1;
  min-width: 0;

  @media (max-width: 768px) {
    padding-left: 0.5rem;
    overflow: hidden;
  }
`

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  height: 100%;
  overflow: visible;
  white-space: nowrap;
  padding: 0.5rem;

  @media (max-width: 768px) {
    overflow: hidden;
    padding: 0.25rem;
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Logo component
 * Renders the animated logo with emojis and text.
 */
const Logo: React.FC = () => {
  const logoRef = useRef<HTMLAnchorElement>(null)
  const animateAndNavigate = useAnimatedNavigation()

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault()
    animateAndNavigate('/')
  }

  return (
    <LogoContainer>
      <LogoLink href="/" onClick={handleNavigation} ref={logoRef}>
        <LogoWrapper>
          <Image
            alt="hyperbliss"
            className={logoImageStyles}
            height={70}
            priority={true}
            src="/images/logo.png"
            width={350}
          />
          <TechnologiesText>technologies</TechnologiesText>
        </LogoWrapper>
      </LogoLink>
    </LogoContainer>
  )
}

export default Logo
