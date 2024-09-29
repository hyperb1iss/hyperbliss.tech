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

// Modify the flicker keyframe animation
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

// Add a new keyframe for chromatic aberration
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

// Add this new keyframe for the color-shifting glow effect
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

// Add these new keyframes for the sparkle and shimmer effect
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

// Update these keyframes for emoji animations
const rotateOnce = keyframes`
  0%, 70% { transform: rotate(0deg); }
  80%, 100% { transform: rotate(var(--rotation-angle)); }
`;

/**
 * Styled components for the Logo
 */

const LogoText = styled.span`
  font-family: var(--font-logo);
  font-size: 3rem;
  background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
  background-size: 800% 800%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: ${animateGradient} 10s ease infinite,
    ${flicker} 8s step-end infinite,
    ${chromaticAberration} 3s ease-in-out infinite;
  transition: text-shadow 0.1s ease;

  &:hover {
    animation: ${animateGradient} 10s ease infinite,
      ${shiftingGlow} 4s linear infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }
`;

// Update the LogoEmojis styled component
const LogoEmojis = styled.span`
  font-size: 2.4rem;
  margin: 0 0.5rem;
  flex-shrink: 0;
  animation: ${sparkle} 3s ease-in-out infinite, ${shimmer} 5s linear infinite;
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
`;

// Update the GlowingEmoji styled component
const GlowingEmoji = styled(LogoEmojis)<{
  $animationDelay: number;
  $clockwise: boolean;
}>`
  --rotation-angle: ${(props) => (props.$clockwise ? "90deg" : "-90deg")};
  animation: ${rotateOnce} 20s ease-in-out infinite,
    ${sparkle} 3s ease-in-out infinite, ${shimmer} 5s linear infinite;
  animation-delay: ${(props) => props.$animationDelay}s, 0s, 0s;
  transition: text-shadow 0.3s ease;
  text-shadow: 0 0 1px #fff, 0 0 2px #a259ff;
  display: inline-block;
  transform-origin: center;

  &:hover {
    text-shadow: 0 0 1px #fff, 0 0 2px #00fff0, 0 0 3px #00fff0;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  max-width: 60%;
  white-space: nowrap;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: calc(100% - 80px);
    overflow: hidden;
  }
`;

/**
 * Function to generate random emoji animation props
 * @returns {object} Randomized animation delay and rotation direction
 */
const getRandomEmojiProps = () => ({
  $animationDelay: Math.random() * -20,
  $clockwise: Math.random() < 0.5,
});

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
    <LogoLink href="/" onClick={handleNavigation} ref={logoRef}>
      <LogoEmojis>🌠</LogoEmojis>
      <LogoText>𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼</LogoText>
      <LogoEmojis>✨</LogoEmojis>
      <GlowingEmoji {...getRandomEmojiProps()}>⎊</GlowingEmoji>
      <GlowingEmoji {...getRandomEmojiProps()}>⨳</GlowingEmoji>
      <GlowingEmoji {...getRandomEmojiProps()}>✵</GlowingEmoji>
      <GlowingEmoji {...getRandomEmojiProps()}>⊹</GlowingEmoji>
    </LogoLink>
  );
};

export default Logo;
