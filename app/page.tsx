'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
  padding: 0 2rem;

  h1 {
    font-size: 3rem;
    color: #a239ca;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin-bottom: 2rem;
  }

  a.cta-button {
    background-color: #4717f6;
    color: #e7dfdd;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-size: 1rem;
    transition: background-color 0.3s ease-in-out;
  }

  a.cta-button:hover {
    background-color: #a239ca;
  }
`;

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Hyperbliss
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Hi, I'm Stefanie Kondik—a developer, designer, and tech enthusiast.
          Explore my projects, read my thoughts on tech, and connect with me.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link href="/about" className="cta-button">
            Learn More About Me
          </Link>
        </motion.div>
      </HeroSection>
      <Footer />
    </>
  );
}