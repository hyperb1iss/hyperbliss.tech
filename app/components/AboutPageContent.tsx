// app/components/AboutPageContent.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import SparklingName from './SparklingName'

// Animations
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const glowShift = keyframes`
  0%, 100% {
    box-shadow:
      0 0 20px rgba(162, 89, 255, 0.4),
      0 0 40px rgba(162, 89, 255, 0.2),
      inset 0 0 20px rgba(162, 89, 255, 0.1);
  }
  33% {
    box-shadow:
      0 0 20px rgba(0, 255, 240, 0.4),
      0 0 40px rgba(0, 255, 240, 0.2),
      inset 0 0 20px rgba(0, 255, 240, 0.1);
  }
  66% {
    box-shadow:
      0 0 20px rgba(255, 117, 216, 0.4),
      0 0 40px rgba(255, 117, 216, 0.2),
      inset 0 0 20px rgba(255, 117, 216, 0.1);
  }
`

const ContentWrapper = styled(motion.div)`
  display: block;
  width: 90%;
  max-width: 1000px;
  margin: var(--space-8) auto;
  padding: var(--space-10);
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-lg));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(162, 89, 255, 0.05) 0%,
      transparent 70%
    );
    animation: ${floatAnimation} 20s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: var(--space-6);
  }
`

const ProfileImage = styled(motion.img)`
  float: left;
  width: clamp(200px, 25vw, 280px);
  height: auto;
  border-radius: var(--radius-xl);
  margin: 0 var(--space-8) var(--space-6) 0;
  transition: all var(--duration-normal) var(--ease-silk);
  position: relative;
  filter: saturate(1.2) brightness(1.1);
  border: 2px solid var(--silk-quantum-purple);
  animation: ${glowShift} 6s ease-in-out infinite;

  &:hover {
    transform: scale(1.05) rotate(2deg);
    border-color: var(--silk-plasma-pink);
  }

  @media (max-width: 768px) {
    float: none;
    margin: 0 auto var(--space-6) auto;
    width: 70%;
    max-width: 250px;
    display: block;
  }
`

const TextContent = styled(motion.div)`
  width: 100%;
  position: relative;
  z-index: 1;
`

const Paragraph = styled.p`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  transition: all var(--duration-fast) var(--ease-silk);
  letter-spacing: 0.02em;

  &:hover {
    color: var(--text-primary);
  }

  &:first-of-type {
    font-size: var(--text-fluid-lg);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-8);
    
    &::first-letter {
      font-size: 3em;
      font-weight: var(--font-bold);
      float: left;
      margin: 0.1em 0.1em 0 0;
      line-height: 0.8;
      background: linear-gradient(
        135deg,
        var(--silk-quantum-purple) 0%,
        var(--silk-circuit-cyan) 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`

const StyledLink = styled.a`
  color: var(--silk-circuit-cyan);
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: all var(--duration-fast) var(--ease-silk);
  position: relative;
  padding: 0 0.2em;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
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
`

const SkillsSection = styled(motion.div)`
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid var(--border-subtle);
`

const SectionTitle = styled.h3`
  font-family: 'Audiowide', var(--font-heading);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-bold);
  color: var(--silk-circuit-cyan);
  margin-bottom: var(--space-6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
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
      var(--silk-quantum-purple) 100%
    );
  }
`

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-4);
`

const SkillChip = styled(motion.div)`
  padding: var(--space-2) var(--space-3);
  background: rgba(162, 89, 255, 0.1);
  border: 1px solid rgba(162, 89, 255, 0.3);
  border-radius: var(--radius-full);
  text-align: center;
  font-size: 1.3rem;
  font-weight: var(--font-medium);
  transition: all var(--duration-fast) var(--ease-silk);
  cursor: default;
  
  &:hover {
    background: rgba(255, 117, 216, 0.15);
    border-color: var(--silk-plasma-pink);
    transform: translateY(-2px) scale(1.05);
  }
`

const AboutPageContent: React.FC = () => {
  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python', 
    'AWS', 'Docker', 'Kubernetes', 'GraphQL',
    'Android', 'Rust', 'AI/ML', 'WebGL'
  ]

  return (
    <PageLayout>
      <PageTitle>About</PageTitle>
      <ContentWrapper
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <ProfileImage
          alt="Stefanie Jane"
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          src="/images/profile.jpg"
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <TextContent>
          <Paragraph>
            Welcome! I'm <SparklingName name="Stefanie Jane" />, a full-stack engineer and creative technologist 
            passionate about building extraordinary digital experiences. With over two decades in tech, I've journeyed 
            from kernel hacking to cloud architecture, always seeking the perfect fusion of art and code.
          </Paragraph>
          <Paragraph>
            My expertise spans the entire technology stack—from embedded systems and Android OS development to 
            modern web frameworks and AI/ML applications. I've led teams at companies like T-Mobile and Microsoft, 
            pioneered open-source innovations, and consistently pushed the boundaries of what's possible in software.
          </Paragraph>
          <Paragraph>
            Beyond code, I'm a music producer, hardware tinkerer, and perpetual learner. I believe the best 
            technology emerges at the intersection of diverse disciplines. Whether I'm crafting elegant algorithms, 
            designing intuitive interfaces, or composing electronic music, I bring creativity and precision to 
            everything I create.
          </Paragraph>
          <Paragraph>
            Currently, I'm focused on building next-generation AI-powered applications and exploring the frontiers 
            of human-computer interaction. I'm always excited to collaborate on projects that challenge conventions 
            and create meaningful impact.
          </Paragraph>
          <Paragraph>
            Want to build something amazing together? Feel free to reach out via{' '}
            <StyledLink href="mailto:stef@hyperbliss.tech">email</StyledLink> or connect on{' '}
            <StyledLink href="https://linkedin.com/in/hyperb1iss" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </StyledLink>. You can also explore my open-source work on{' '}
            <StyledLink href="https://github.com/hyperb1iss" target="_blank" rel="noopener noreferrer">
              GitHub
            </StyledLink>.
          </Paragraph>
        </TextContent>
        
        <SkillsSection
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <SectionTitle>Core Technologies</SectionTitle>
          <SkillGrid>
            {skills.map((skill, index) => (
              <SkillChip
                key={skill}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {skill}
              </SkillChip>
            ))}
          </SkillGrid>
        </SkillsSection>
      </ContentWrapper>
    </PageLayout>
  )
}

export default AboutPageContent