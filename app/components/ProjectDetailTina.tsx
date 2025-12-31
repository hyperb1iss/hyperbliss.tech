// app/components/ProjectDetailTina.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { FaGithub } from 'react-icons/fa6'
import styled, { keyframes } from 'styled-components'
import { TinaMarkdownContent } from 'tinacms/dist/rich-text'
import { StarDivider } from './StarComponents'
import TinaContent from './TinaContent'

interface ProjectDetailTinaProps {
  title: string
  github: string
  body: TinaMarkdownContent | string | null
  author?: string
  tags?: string[]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Animations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styled Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`

const TitleWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: clamp(2.8rem, 4vw, 5rem);
  font-weight: var(--font-black);
  margin: 0;
  background: linear-gradient(
    135deg,
    var(--color-secondary) 0%,
    var(--color-primary) 30%,
    var(--color-accent) 60%,
    var(--color-secondary) 100%
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientShift} 6s ease infinite;
  filter: drop-shadow(0 0 30px rgba(0, 255, 240, 0.3));
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TagsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
`

const Tag = styled.span`
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.15) 0%,
    rgba(162, 89, 255, 0.1) 100%
  );
  color: var(--color-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-md);
  font-size: clamp(1.2rem, 1.2vw, 1.5rem);
  font-weight: var(--font-medium);
  border: 1px solid rgba(0, 255, 240, 0.2);
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: default;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.25) 0%,
      rgba(162, 89, 255, 0.2) 100%
    );
    border-color: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 240, 0.2);
  }
`

const DividerWrapper = styled(motion.div)`
  margin: 2rem 0 3rem;
`

const Content = styled(motion.div)`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.7;
  color: var(--color-text);
`

const ActionsWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-subtle);
`

const GitHubButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-8);
  min-height: 56px;
  font-family: var(--font-body);
  font-size: clamp(1.6rem, 1.4rem + 0.4vw, 2rem);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  text-decoration: none;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.1) 0%,
    rgba(162, 89, 255, 0.15) 100%
  );
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-silk);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.2) 0%,
      rgba(162, 89, 255, 0.25) 100%
    );
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 8px 25px rgba(0, 255, 240, 0.25),
      0 0 40px rgba(162, 89, 255, 0.15);
    border-color: var(--color-primary);

    &::before {
      opacity: 1;
    }
  }

  svg {
    font-size: 1.4em;
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }
`

const Decoration = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 255, 240, 0.1) 0%,
    transparent 70%
  );
  animation: ${pulse} 4s ease-in-out infinite;
  pointer-events: none;

  &:nth-child(1) {
    top: -50px;
    left: -50px;
  }

  &:nth-child(2) {
    bottom: -30px;
    right: -30px;
    animation-delay: 2s;
    background: radial-gradient(
      circle,
      rgba(162, 89, 255, 0.1) 0%,
      transparent 70%
    );
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ProjectDetailTina: React.FC<ProjectDetailTinaProps> = ({ title, github, body, tags }) => {
  return (
    <Container>
      <HeroSection>
        <Decoration />
        <Decoration />

        <TitleWrapper animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
          <Title>{title}</Title>
        </TitleWrapper>

        {tags && tags.length > 0 && (
          <TagsContainer animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsContainer>
        )}
      </HeroSection>

      <DividerWrapper animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <StarDivider compact={true} />
      </DividerWrapper>

      <Content animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <TinaContent content={body} />
      </Content>

      {github && (
        <ActionsWrapper
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <GitHubButton href={github} rel="noopener noreferrer" target="_blank">
            <FaGithub />
            <span>View on GitHub</span>
          </GitHubButton>
        </ActionsWrapper>
      )}
    </Container>
  )
}

export default ProjectDetailTina
