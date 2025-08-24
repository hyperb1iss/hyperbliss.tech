// app/components/SilkCard.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaGithub } from 'react-icons/fa6'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
`

const CardWrapper = styled(motion.div)
  .attrs({
    'data-component': 'silk-card-v2',
  })
  .withConfig({
    shouldForwardProp: (prop) => !['$isHovered', '$mouseX', '$mouseY'].includes(prop),
  })`
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.12) 0%,
    rgba(0, 229, 255, 0.08) 20%,
    rgba(30, 25, 45, 0.6) 50%,
    rgba(38, 198, 218, 0.08) 80%,
    rgba(0, 172, 193, 0.12) 100%
  );
  backdrop-filter: blur(20px) saturate(1.3);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
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
  box-shadow: 
    0 0 20px rgba(0, 255, 240, 0.2),
    0 0 40px rgba(0, 229, 255, 0.15),
    0 0 15px rgba(38, 198, 218, 0.18),
    inset 0 0 20px rgba(0, 172, 193, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      #00fff0,
      #00e5ff,
      #26c6da,
      #00acc1,
      #0097a7,
      #00bcd4
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity var(--duration-normal) var(--ease-silk);
    background-size: 200% 200%;
    animation: borderFlow 8s ease infinite;
  }
  
  @keyframes borderFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-silk);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.18) 0%,
      rgba(0, 229, 255, 0.12) 25%,
      rgba(30, 25, 45, 0.65) 50%,
      rgba(38, 198, 218, 0.1) 75%,
      rgba(0, 172, 193, 0.18) 100%
    );
    box-shadow: 
      0 10px 40px rgba(0, 255, 240, 0.35),
      0 20px 60px rgba(0, 229, 255, 0.25),
      0 5px 25px rgba(38, 198, 218, 0.2),
      inset 0 0 30px rgba(0, 172, 193, 0.12);
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 1;
    }
  }
`

const CardTitle = styled.h3`
  font-family: 'Audiowide', var(--font-display);
  font-size: var(--text-fluid-xl);
  font-weight: var(--font-bold);
  background: linear-gradient(
    90deg,
    #ff75d8 0%,
    #00fff0 33%,
    #d946ef 66%,
    #ff75d8 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  filter: drop-shadow(0 0 8px rgba(0, 255, 240, 0.3));
  transition: all var(--duration-normal) var(--ease-silk);
  
  ${CardWrapper}:hover & {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 20px rgba(0, 255, 240, 0.7))
            drop-shadow(0 0 35px rgba(0, 229, 255, 0.4));
  }
`

const CardMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: var(--font-semibold);
  color: var(--silk-circuit-cyan);
  margin-bottom: var(--space-4);
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(
    90deg,
    rgba(0, 255, 240, 0.2),
    rgba(0, 255, 240, 0.1)
  );
  border-left: 3px solid var(--silk-circuit-cyan);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  display: inline-block;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 10px rgba(0, 255, 240, 0.5);
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
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.15),
    rgba(0, 172, 193, 0.1)
  );
  color: #00fff0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 1.2rem;
  font-weight: var(--font-medium);
  border: 1px solid rgba(0, 255, 240, 0.3);
  backdrop-filter: blur(8px);
  transition: all var(--duration-fast) var(--ease-silk);
  text-shadow: 0 0 8px rgba(0, 255, 240, 0.5);
  
  &:hover {
    background: linear-gradient(
      135deg,
      rgba(0, 229, 255, 0.25),
      rgba(0, 255, 240, 0.2)
    );
    border-color: #00fff0;
    color: #ffffff;
    text-shadow: 0 0 12px rgba(0, 255, 240, 0.8);
    transform: scale(1.05) translateY(-2px);
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

const CardButton = styled.div`
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: var(--font-semibold);
  color: #003d4d;
  text-decoration: none;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--duration-normal) var(--ease-silk);
  position: relative;
  background: linear-gradient(
    135deg,
    #00fff0,
    #00acc1
  );
  border: none;
  box-shadow: 
    0 4px 15px rgba(0, 255, 240, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      #00acc1,
      #00fff0
    );
    border-radius: var(--radius-md);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }
  
  &:hover {
    transform: translateX(4px) scale(1.02);
    box-shadow: 
      0 6px 25px rgba(0, 255, 240, 0.6),
      0 0 40px rgba(0, 172, 193, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      opacity: 0.3;
    }
    
    svg {
      transform: translateX(4px);
    }
  }
  
  svg {
    transition: transform var(--duration-normal) var(--ease-silk);
    position: relative;
    z-index: 1;
  }
`

const GithubLink = styled.button`
  color: #003d4d;
  font-size: var(--text-lg);
  padding: var(--space-2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal) var(--ease-silk);
  position: relative;
  background: linear-gradient(
    135deg,
    #00fff0,
    #00e5ff
  );
  border: none;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 10px rgba(0, 255, 240, 0.4);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      #00acc1,
      #00fff0
    );
    border-radius: var(--radius-full);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }
  
  &:hover {
    transform: scale(1.15) rotate(10deg);
    box-shadow: 0 4px 20px rgba(0, 255, 240, 0.6);
    
    &::before {
      opacity: 0.3;
    }
    
    svg {
      position: relative;
      z-index: 1;
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
    <StyledLink href={link}>
      <CardWrapper
        animate={{ opacity: 1, y: 0 }}
        className={className}
        initial={{ opacity: 0, y: 20 }}
        onMouseMove={handleMouseMove}
        style={style}
        transition={{
          delay: index * 0.1,
          duration: 0.6,
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
          <CardButton>
            {linkText} <FaArrowRight />
          </CardButton>
          {githubLink && (
            <GithubLink
              aria-label="View on GitHub"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                window.open(githubLink, '_blank', 'noopener,noreferrer')
              }}
              type="button"
            >
              <FaGithub />
            </GithubLink>
          )}
        </CardFooter>
      </CardWrapper>
    </StyledLink>
  )
}

export default SilkCard
