// app/components/SilkCard.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaGithub } from 'react-icons/fa6'
import styled from 'styled-components'

const CardWrapper = styled(motion.div)`
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-lg));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-10);
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      var(--silk-quantum-purple-alpha-10) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-silk);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--silk-quantum-purple);
    box-shadow: var(--shadow-lg);
    
    &::before {
      opacity: 1;
    }
  }
`

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: var(--text-fluid-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
  position: relative;
  z-index: 1;
`

const CardMeta = styled.div`
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--silk-circuit-cyan);
  margin-bottom: var(--space-4);
  padding: var(--space-1) var(--space-3);
  background: var(--silk-circuit-cyan-alpha-10);
  border-left: 2px solid var(--silk-circuit-cyan);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  display: inline-block;
  position: relative;
  z-index: 1;
`

const CardDescription = styled.p`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--leading-relaxed);
  flex-grow: 1;
  position: relative;
  z-index: 1;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  position: relative;
  z-index: 1;
`

const Tag = styled.span`
  background: var(--surface-overlay);
  color: var(--text-secondary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) var(--ease-silk);
  
  &:hover {
    border-color: var(--silk-plasma-pink);
    color: var(--silk-plasma-pink);
    background: var(--silk-plasma-pink-alpha-10);
  }
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--space-4);
  position: relative;
  z-index: 1;
`

const CardLink = styled(Link)`
  font-family: var(--font-body);
  font-size: var(--text-fluid-sm);
  font-weight: var(--font-semibold);
  color: var(--silk-quantum-purple);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--duration-fast) var(--ease-silk);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--silk-quantum-purple-alpha-10);
    border-radius: var(--radius-md);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-silk);
  }
  
  &:hover {
    transform: translateX(4px);
    
    &::before {
      opacity: 1;
    }
    
    svg {
      transform: translateX(4px);
    }
  }
  
  svg {
    transition: transform var(--duration-fast) var(--ease-silk);
  }
`

const GithubLink = styled.a`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  padding: var(--space-2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-silk);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: var(--silk-circuit-cyan-alpha-10);
    border-radius: var(--radius-full);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-silk);
  }
  
  &:hover {
    color: var(--silk-circuit-cyan);
    transform: scale(1.1) rotate(10deg);
    
    &::before {
      opacity: 1;
    }
  }
`

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

interface SilkCardProps {
  title: string
  description: string
  link: string
  tags?: string[]
  meta?: string
  linkText?: string
  githubLink?: string
  index?: number
  className?: string
  style?: React.CSSProperties
}

export const SilkCard: React.FC<SilkCardProps> = ({
  title,
  description,
  link,
  tags,
  meta,
  linkText = 'Learn More',
  githubLink,
  index = 0,
  className,
  style,
}) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <CardWrapper
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      onMouseMove={handleMouseMove}
      style={style}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CardContent>
        <CardTitle>{title}</CardTitle>
        {meta && <CardMeta>{meta}</CardMeta>}
        <CardDescription>{description}</CardDescription>
        {tags && tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsContainer>
        )}
      </CardContent>
      <CardFooter>
        <CardLink href={link}>
          {linkText} <FaArrowRight />
        </CardLink>
        {githubLink && (
          <GithubLink href={githubLink} onClick={(e) => e.stopPropagation()} rel="noopener noreferrer" target="_blank">
            <FaGithub />
          </GithubLink>
        )}
      </CardFooter>
    </CardWrapper>
  )
}

export default SilkCard
