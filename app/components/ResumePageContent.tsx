// app/components/ResumePageContent.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { FiDownload } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import styled, { keyframes, StyleSheetManager } from 'styled-components'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

// Animations
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(162, 89, 255, 0.3),
      inset 0 0 20px rgba(162, 89, 255, 0.05);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(0, 255, 240, 0.4),
      inset 0 0 30px rgba(0, 255, 240, 0.08);
  }
`

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`

// Main container with SilkCircuit styling
const ResumeContainer = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-lg));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-10);
  animation: ${glowPulse} 8s ease-in-out infinite;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 255, 240, 0.02) 50%,
      transparent 100%
    );
    animation: ${scanline} 15s linear infinite;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: var(--space-8) var(--space-6);
    border-radius: var(--radius-lg);
  }
`

// Enhanced markdown wrapper with SilkCircuit typography
const MarkdownWrapper = styled.div`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
  position: relative;
  z-index: 1;

  h1 {
    font-family: 'Audiowide', var(--font-heading);
    font-size: var(--text-fluid-4xl);
    font-weight: var(--font-black);
    background: linear-gradient(
      135deg,
      var(--silk-quantum-purple) 0%,
      var(--silk-circuit-cyan) 50%,
      var(--silk-plasma-pink) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-6);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-shadow: 0 0 30px rgba(162, 89, 255, 0.5);
  }

  /* Tagline and contact links */
  & > p:nth-of-type(1) {
    text-align: center;
    font-size: var(--text-fluid-base);
    color: var(--silk-plasma-pink);
    font-weight: var(--font-medium);
    margin-bottom: var(--space-4);
    letter-spacing: 0.08em;
    opacity: 0.9;
  }
  
  & > p:nth-of-type(2) {
    text-align: center;
    margin-bottom: var(--space-8);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-3);
    
    a {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: rgba(162, 89, 255, 0.1);
      border: 1px solid rgba(162, 89, 255, 0.3);
      border-radius: var(--radius-full);
      font-size: 1.3rem;
      font-family: var(--font-body);
      font-weight: var(--font-medium);
      transition: all var(--duration-fast) var(--ease-silk);
      
      &:hover {
        background: rgba(255, 117, 216, 0.15);
        border-color: var(--silk-plasma-pink);
        transform: translateY(-2px);
      }
    }
  }

  h2 {
    font-family: 'Audiowide', var(--font-heading);
    font-size: var(--text-fluid-2xl);
    font-weight: var(--font-bold);
    color: var(--silk-circuit-cyan);
    margin-top: var(--space-10);
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid rgba(0, 255, 240, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    
    &::before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 1.2em;
      background: linear-gradient(
        180deg,
        var(--silk-circuit-cyan) 0%,
        var(--silk-quantum-purple) 50%,
        transparent 100%
      );
    }
  }

  h3 {
    font-family: 'Audiowide', var(--font-heading);
    font-size: var(--text-fluid-xl);
    font-weight: var(--font-semibold);
    color: var(--silk-plasma-pink);
    margin-top: var(--space-8);
    margin-bottom: var(--space-4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  h4 {
    font-family: var(--font-body);
    font-size: var(--text-fluid-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
  }

  ul {
    list-style: none;
    margin: var(--space-4) 0;
    padding: 0;
  }

  li {
    position: relative;
    padding-left: var(--space-8);
    margin-bottom: var(--space-3);
    color: var(--text-secondary);
    transition: all var(--duration-fast) var(--ease-silk);
    
    &::before {
      content: '◆';
      position: absolute;
      left: var(--space-2);
      color: var(--silk-quantum-purple);
      font-size: 0.8em;
    }
    
    &:hover {
      color: var(--text-primary);
      transform: translateX(4px);
      
      &::before {
        color: var(--silk-circuit-cyan);
      }
    }
  }

  a {
    color: var(--silk-circuit-cyan);
    font-weight: var(--font-medium);
    text-decoration: none;
    position: relative;
    transition: all var(--duration-fast) var(--ease-silk);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        var(--silk-circuit-cyan) 0%,
        var(--silk-plasma-pink) 100%
      );
      transition: width var(--duration-normal) var(--ease-silk);
    }

    &:hover {
      color: var(--silk-plasma-pink);
      
      &::after {
        width: 100%;
      }
    }
  }

  p {
    margin-bottom: var(--space-6);
    line-height: var(--leading-relaxed);
  }

  strong {
    color: var(--silk-quantum-purple);
    font-weight: var(--font-semibold);
  }
  
  /* Skill badges styling */
  p:has(a[href*="wikipedia"], a[href*="golang"], a[href*="java"]) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin: var(--space-4) 0;
    
    a {
      display: inline-block;
      padding: var(--space-2) var(--space-4);
      background: rgba(162, 89, 255, 0.08);
      border: 1px solid rgba(162, 89, 255, 0.2);
      border-radius: var(--radius-full);
      font-size: 1.3rem;
      font-family: var(--font-body);
      font-weight: var(--font-medium);
      color: var(--text-primary);
      transition: all var(--duration-fast) var(--ease-silk);
      
      &::after {
        display: none;
      }
      
      &:hover {
        background: var(--silk-quantum-purple-alpha-10);
        border-color: var(--silk-quantum-purple);
        transform: translateY(-2px) scale(1.05);
      }
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: var(--text-fluid-3xl);
    }
    
    h2 {
      font-size: var(--text-fluid-xl);
    }
    
    h3 {
      font-size: var(--text-fluid-lg);
    }
  }
`

// Download button with new styling
const DownloadButton = styled(motion.a)`
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--silk-quantum-purple);
  color: var(--silk-white);
  border-radius: var(--radius-full);
  border: 2px solid var(--silk-quantum-purple);
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all var(--duration-normal) var(--ease-silk);
  z-index: 100;
  box-shadow: 0 4px 20px rgba(162, 89, 255, 0.4);

  svg {
    width: 1.4em;
    height: 1.4em;
  }
  
  span {
    display: none;
    
    @media (min-width: 768px) {
      display: inline;
    }
  }

  &:hover {
    background: var(--silk-plasma-pink);
    border-color: var(--silk-plasma-pink);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 30px rgba(255, 117, 216, 0.5);
  }

  @media (max-width: 768px) {
    bottom: var(--space-6);
    right: var(--space-6);
    padding: var(--space-3);
    
    svg {
      width: 1.6em;
      height: 1.6em;
    }
  }
`

// Function to filter out props that shouldn't be forwarded to DOM elements
const shouldForwardProp = (prop: string): boolean => {
  const invalidProps = ['node']
  return !invalidProps.includes(prop)
}

// Interface for ResumePageContent component props
interface ResumePageContentProps {
  content: string
}

/**
 * ResumePageContent component
 * Renders the resume content with SilkCircuit styling and animations.
 */
const ResumePageContent: React.FC<ResumePageContentProps> = ({ content }) => {
  return (
    <PageLayout>
      <PageTitle>Resume</PageTitle>
      <ResumeContainer
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <MarkdownWrapper>
          <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </StyleSheetManager>
        </MarkdownWrapper>
      </ResumeContainer>

      <DownloadButton
        aria-label="Download Resume as PDF"
        download={true}
        href="/resume.pdf"
        title="Download Resume as PDF"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiDownload />
        <span>Download PDF</span>
      </DownloadButton>
    </PageLayout>
  )
}

export default ResumePageContent
