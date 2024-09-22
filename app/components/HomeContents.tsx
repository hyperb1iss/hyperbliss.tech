// app/components/HomeContent.tsx

"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
  background: url("/images/cyberpunk-hero.jpg") center/cover no-repeat;
`;

const Title = styled(motion.h1)`
  font-size: 6rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
  text-shadow: 0 0 10px var(--color-primary);

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 2.4rem;
  max-width: 800px;
  margin-bottom: 4rem;
  color: var(--color-text);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAButton = styled(motion.a)`
  background-color: transparent;
  color: var(--color-accent);
  padding: 1.5rem 3rem;
  border: 2px solid var(--color-accent);
  border-radius: 50px;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: var(--color-accent);
    color: var(--color-background);
    box-shadow: 0 0 10px var(--color-accent);
  }
`;

export default function HomeContent() {
  return (
    <HeroSection>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="glow">Hyperbliss</span>
      </Title>
      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Hi, I&apos;m Stefanie Kondik—a developer, designer, and tech enthusiast.
        Explore my projects, read my thoughts on tech, and connect with me.
      </Subtitle>
      <CTAButton
        href="/about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More About Me
      </CTAButton>
    </HeroSection>
  );
}
