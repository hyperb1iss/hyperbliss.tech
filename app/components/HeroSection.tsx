// app/components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";

/**
 * Styled components for the Hero section
 */

// Wrapper for the Hero section
const HeroSectionWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 0 2rem;
  overflow: hidden;
`;

// Animated background with improved effect and reduced opacity
const AnimatedBackground = styled(motion.div)`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 0, 255, 0.15),
    transparent 70%
  );
  background-size: cover;
  opacity: 0.5; /* Reduced opacity */
  animation: rotateBG 60s linear infinite;
  z-index: -1;

  @keyframes rotateBG {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Neon lines with enhanced animation
const NeonLine = styled(motion.div)<{ left: number; duration: number }>`
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #ff00ff, transparent);
  left: ${(props) => props.left}%;
  animation: moveUpDown ${(props) => props.duration}s ease-in-out infinite;
  opacity: 0.3;

  @keyframes moveUpDown {
    0%,
    100% {
      transform: translateY(-100px);
    }
    50% {
      transform: translateY(100px);
    }
  }
`;

// Styled title with enhanced aesthetics
const Title = styled(motion.h1)`
  font-size: 6rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  text-shadow: 0 0 20px var(--color-primary);
  letter-spacing: 2px;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

// Styled subtitle with enhanced aesthetics
const Subtitle = styled(motion.p)`
  font-size: 2.4rem;
  max-width: 800px;
  margin-bottom: 2rem;
  color: var(--color-secondary);
  text-shadow: 0 0 15px var(--color-secondary);
  line-height: 1.6;
  font-family: var(--font-body);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

/**
 * HeroSection component
 * Renders the hero section with animated background and title.
 */
export default function HeroSection(): JSX.Element {
  return (
    <HeroSectionWrapper>
      {/* Animated background with improved effect and reduced opacity */}
      <AnimatedBackground />
      {/* Enhanced neon lines */}
      {[...Array(20)].map((_, index) => (
        <NeonLine
          key={index}
          left={Math.random() * 100}
          duration={Math.random() * 15 + 5}
        />
      ))}
      {/* Title */}
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome to <span className="glow">Hyperbliss</span>
      </Title>
      {/* Subtitle */}
      <Subtitle
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        Exploring the intersection of code, design, and innovation
      </Subtitle>
    </HeroSectionWrapper>
  );
}
