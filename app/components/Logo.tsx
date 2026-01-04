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
  transition: all 0.3s ease;

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
  animation: subtleGlow 3s ease-in-out infinite;
  transition: all 0.3s ease;
  will-change: filter;

  @keyframes subtleGlow {
    0%, 100% {
      filter: drop-shadow(0 0 8px rgba(162, 89, 255, 0.4));
    }
    50% {
      filter: drop-shadow(0 0 12px rgba(0, 255, 240, 0.5));
    }
  }

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
  font-size: 1.4rem;
  font-weight: 600;
  background: linear-gradient(
    90deg,
    var(--silk-circuit-cyan),
    var(--silk-quantum-purple),
    var(--silk-plasma-pink),
    var(--silk-circuit-cyan)
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  position: relative;
  white-space: nowrap;
  animation:
    slideIn 0.8s ease-out 0.3s both,
    glitchText 4s ease-in-out infinite,
    animateGradient 6s linear infinite;
  align-self: flex-end;
  margin-bottom: 0.8rem;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
      letter-spacing: 0.5em;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      letter-spacing: 0.15em;
    }
  }

  @keyframes glitchText {
    0%, 100% {
      text-shadow:
        0 0 2px rgba(0, 255, 240, 0.8),
        -1px 0 rgba(255, 0, 255, 0.5),
        1px 0 rgba(0, 255, 240, 0.5);
    }
    25% {
      text-shadow:
        0 0 2px rgba(162, 89, 255, 0.8),
        -2px 0 rgba(0, 255, 240, 0.5),
        2px 0 rgba(255, 117, 216, 0.5);
    }
    50% {
      text-shadow:
        0 0 2px rgba(255, 117, 216, 0.8),
        -1px 0 rgba(162, 89, 255, 0.5),
        1px 0 rgba(0, 255, 240, 0.5);
    }
    75% {
      text-shadow:
        0 0 2px rgba(0, 255, 240, 0.8),
        -2px 0 rgba(255, 117, 216, 0.5),
        1px 0 rgba(162, 89, 255, 0.5);
    }
  }

  @keyframes animateGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &::before {
    content: 'technologies';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 255, 240, 0.03) 50%,
      transparent 100%
    );
    background-size: 100% 5px;
    animation: scanline 8s linear infinite;
    opacity: 0.5;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  @keyframes scanline {
    0% { background-position: 0 0; }
    100% { background-position: 0 10px; }
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
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
