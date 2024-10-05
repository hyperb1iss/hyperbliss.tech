// app/components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";

const HeroSectionWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 100%;  // Changed from min-height: 60vh
  padding: 2rem;
  overflow: hidden;
`;

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
  opacity: 0.5;
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

const Title = styled(motion.h1)`
  font-size: 4.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  text-shadow: 0 0 20px var(--color-primary);
  letter-spacing: 2px;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: 3.6rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 2.2rem;
  max-width: 600px;
  margin-bottom: 2rem;
  color: var(--color-secondary);
  text-shadow: 0 0 15px var(--color-secondary);
  line-height: 1.6;
  font-family: var(--font-body);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CTAButton = styled(motion.a)`
  background-color: transparent;
  color: var(--color-accent);
  padding: 1.2rem 2.4rem;
  border: 2px solid var(--color-accent);
  border-radius: 50px;
  font-size: 1.6rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: var(--color-accent);
    color: var(--color-background);
    box-shadow: 0 0 10px var(--color-accent);
  }
`;

export default function HeroSection(): JSX.Element {
  return (
    <HeroSectionWrapper>
      <AnimatedBackground />
      {[...Array(10)].map((_, index) => (
        <NeonLine
          key={index}
          left={Math.random() * 100}
          duration={Math.random() * 15 + 5}
        />
      ))}
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome to <span className="glow">Hyperbliss</span>
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        Exploring the intersection of code, design, and innovation
      </Subtitle>
      <CTAButton
        href="/about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More
      </CTAButton>
    </HeroSectionWrapper>
  );
}