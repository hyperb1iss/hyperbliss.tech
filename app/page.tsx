'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
  background: linear-gradient(135deg, var(--color-background), var(--color-secondary));
`;

const Title = styled(motion.h1)`
  font-size: 6rem;
  margin-bottom: 2rem;
  color: var(--color-accent);
  text-shadow: 0 0 10px rgba(255, 20, 147, 0.5);

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
  background-color: var(--color-accent);
  color: var(--color-background);
  padding: 1.5rem 3rem;
  border-radius: 50px;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Hyperbliss
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Hi, I'm Stefanie Kondik—a developer, designer, and tech enthusiast.
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
      <Footer />
    </>
  );
}