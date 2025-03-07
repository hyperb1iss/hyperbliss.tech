// app/components/Logo.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";
import { keyframes, styled } from "styled-components";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";

/**
 * Keyframe animations for the logo
 */

// Define the keyframes for the gradient animation
const animateGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Flicker keyframe animation
const flicker = keyframes`
  0%, 5%, 10%, 15%, 20%, 25%, 30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%, 100% {
    opacity: 1;
    text-shadow: 
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 3px #a259ff,
      0 0 4px #a259ff,
      0 0 5px #a259ff,
      0 0 6px #a259ff,
      0 0 7px #a259ff;
  }
  1%, 7%, 33%, 47%, 78%, 93% {
    opacity: 0.8;
    text-shadow: 
      0 0 1px #000,
      0 0 2px #000,
      0 0 3px #a259ff,
      0 0 4px #a259ff,
      0 0 5px #a259ff;
  }
  2%, 8%, 34%, 48%, 79%, 94% {
    opacity: 0.9;
    text-shadow: 
      1px 0 1px #00fff0,
      -1px 0 1px #ff00ff,
      0 0 3px #a259ff,
      0 0 5px #a259ff,
      0 0 7px #a259ff;
  }
`;

// Keyframe for chromatic aberration
const chromaticAberration = keyframes`
  0%, 95%, 100% {
    text-shadow: 
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 3px #a259ff,
      0 0 4px #a259ff,
      0 0 5px #a259ff;
  }
  50% {
    text-shadow: 
      -1px 0 1px #00fff0,
      1px 0 1px #ff00ff,
      0 0 3px #a259ff,
      0 0 5px #a259ff;
  }
`;

// Keyframe for the color-shifting glow effect
const shiftingGlow = keyframes`
  0%, 100% {
    text-shadow: 
      1px 0 1px #00fff0,
      -1px 0 1px #ff00ff,
      0 0 3px #00fff0,
      0 0 5px #00fff0,
      0 0 7px #00fff0;
  }
  25% {
    text-shadow: 
      1px 0 1px #ff00ff,
      -1px 0 1px #00fff0,
      0 0 3px #ff00ff,
      0 0 5px #ff00ff,
      0 0 7px #ff00ff;
  }
  50% {
    text-shadow: 
      1px 0 1px #a259ff,
      -1px 0 1px #00fff0,
      0 0 3px #a259ff,
      0 0 5px #a259ff,
      0 0 7px #a259ff;
  }
  75% {
    text-shadow: 
      1px 0 1px #00fff0,
      -1px 0 1px #a259ff,
      0 0 3px #00fff0,
      0 0 5px #00fff0,
      0 0 7px #00fff0;
  }
`;

// Keyframes for the sparkle and shimmer effect
const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.95); }
`;

const shimmer = keyframes`
  0% { text-shadow: -1px -1px 2px rgba(255,255,255,0.3), 1px 1px 2px rgba(255,255,255,0.3); }
  25% { text-shadow: 1px -1px 2px rgba(255,255,255,0.3), -1px 1px 2px rgba(255,255,255,0.3); }
  50% { text-shadow: 1px 1px 2px rgba(255,255,255,0.3), -1px -1px 2px rgba(255,255,255,0.3); }
  75% { text-shadow: -1px 1px 2px rgba(255,255,255,0.3), 1px -1px 2px rgba(255,255,255,0.3); }
  100% { text-shadow: -1px -1px 2px rgba(255,255,255,0.3), 1px 1px 2px rgba(255,255,255,0.3); }
`;

/**
 * Styled components for the Logo
 */

const LogoText = styled.span`
  font-family: var(--font-logo);
  font-size: 2.6rem; // Baseline size (matches mobile view)
  background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
  background-size: 800% 800%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation:
    ${animateGradient} 10s ease infinite,
    ${flicker} 8s step-end infinite,
    ${chromaticAberration} 3s ease-in-out infinite;
  transition: text-shadow 0.1s ease;

  &:hover {
    animation:
      ${animateGradient} 10s ease infinite,
      ${shiftingGlow} 4s linear infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }

  @media (min-width: 769px) {
    font-size: calc(2.2rem + 0.8vw); // Increased base size for desktop
  }

  @media (min-width: 1200px) {
    font-size: calc(2.4rem + 0.8vw); // Further increase for very large screens
  }
`;

const LogoEmojis = styled.span`
  font-size: 1.8rem; // Baseline size (matches mobile view)
  margin: 0 0.5rem;
  flex-shrink: 0;
  animation:
    ${sparkle} 3s ease-in-out infinite,
    ${shimmer} 5s linear infinite;
  display: inline-block;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    animation: ${shimmer} 2s linear infinite;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    position: relative;
    z-index: 1;
    padding-top: 5px;
  }

  @media (min-width: 769px) {
    font-size: calc(1.6rem + 0.4vw); // Increased base size for desktop
  }

  @media (min-width: 1200px) {
    font-size: calc(1.8rem + 0.4vw); // Further increase for very large screens
  }
`;

const GlowingEmoji = styled(LogoEmojis)`
  animation: ${chromaticAberration} 3s ease-in-out infinite;
  transition: text-shadow 0.3s ease;
  display: inline-block;

  &:hover {
    animation: ${shiftingGlow} 4s linear infinite;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: auto;
  overflow: hidden;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
`;

/**
 * Logo component
 * Renders the animated logo with emojis and text.
 * @returns {JSX.Element} Rendered logo component
 */
const Logo: React.FC = () => {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const animateAndNavigate = useAnimatedNavigation();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    animateAndNavigate("/");
  };

  return (
    <LogoContainer>
      <LogoLink href="/" onClick={handleNavigation} ref={logoRef}>
        <LogoEmojis>🌠</LogoEmojis>
        <LogoText>𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼</LogoText>
        <LogoEmojis>✨</LogoEmojis>
        {["⎊", "⨳", "✵", "⊹"].map((emoji, index) => (
          <GlowingEmoji key={index}>{emoji}</GlowingEmoji>
        ))}
      </LogoLink>
    </LogoContainer>
  );
};

export default Logo;
