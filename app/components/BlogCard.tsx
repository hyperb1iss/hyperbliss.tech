// app/components/BlogCard.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaCalendar, FaUser } from 'react-icons/fa6'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
`

const CardWrapper = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08) 0%,
    rgba(30, 41, 59, 0.5) 40%,
    rgba(0, 255, 240, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(1.2);
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
    0 0 25px rgba(139, 92, 246, 0.2),
    0 0 40px rgba(0, 255, 240, 0.1),
    inset 0 0 20px rgba(224, 170, 255, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      #8b5cf6,
      #00fff0,
      #e0aaff
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.4;
    transition: opacity var(--duration-normal) var(--ease-silk);
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
      rgba(224, 170, 255, 0.05) 0%,
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
      rgba(139, 92, 246, 0.12) 0%,
      rgba(30, 41, 59, 0.55) 40%,
      rgba(0, 255, 240, 0.08) 100%
    );
    box-shadow: 
      0 10px 40px rgba(139, 92, 246, 0.3),
      0 20px 60px rgba(0, 255, 240, 0.15),
      inset 0 0 30px rgba(224, 170, 255, 0.08);
    
    &::before {
      opacity: 0.7;
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
    #e0aaff 0%,
    #00fff0 50%,
    #e0aaff 100%
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
  filter: drop-shadow(0 0 10px rgba(224, 170, 255, 0.4));
  transition: all var(--duration-normal) var(--ease-silk);
  
  ${CardWrapper}:hover & {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 15px rgba(0, 255, 240, 0.6));
  }
`

const CardMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: var(--font-medium);
  color: #8b5cf6;
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  position: relative;
  z-index: 1;
  
  span {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  svg {
    font-size: 1.2rem;
    color: #00fff0;
    filter: drop-shadow(0 0 4px rgba(0, 255, 240, 0.5));
  }
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
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: color var(--duration-fast) var(--ease-silk);
  
  ${CardWrapper}:hover & {
    color: var(--text-primary);
  }
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
    rgba(139, 92, 246, 0.15),
    rgba(0, 255, 240, 0.1)
  );
  color: #8b5cf6;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 1.2rem;
  font-weight: var(--font-medium);
  border: 1px solid rgba(139, 92, 246, 0.3);
  transition: all var(--duration-fast) var(--ease-silk);
  text-shadow: 0 0 6px rgba(139, 92, 246, 0.4);
  
  &:hover {
    border-color: rgba(0, 255, 240, 0.5);
    color: #00fff0;
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.2),
      rgba(224, 170, 255, 0.15)
    );
    text-shadow: 0 0 8px rgba(0, 255, 240, 0.6);
    transform: scale(1.1);
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
  color: #00fff0;
  text-decoration: none;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--duration-fast) var(--ease-silk);
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.08),
    rgba(139, 92, 246, 0.05)
  );
  border: 1px solid rgba(0, 255, 240, 0.25);
  text-shadow: 0 0 8px rgba(0, 255, 240, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.15),
      rgba(224, 170, 255, 0.15)
    );
    border-radius: var(--radius-md);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-silk);
  }
  
  &:hover {
    transform: translateX(4px);
    color: var(--silk-circuit-cyan);
    border-color: rgba(0, 255, 240, 0.4);
    box-shadow: 0 0 15px rgba(0, 255, 240, 0.3);
    
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

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

interface BlogCardProps {
  title: string
  description: string
  link: string
  tags?: string[]
  date?: string
  author?: string
  linkText?: string
  index?: number
  className?: string
  style?: React.CSSProperties
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  link,
  tags,
  date,
  author,
  linkText = 'Read Post',
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
          {(date || author) && (
            <CardMeta>
              {date && (
                <span>
                  <FaCalendar />
                  {new Date(date).toLocaleDateString()}
                </span>
              )}
              {author && (
                <span>
                  <FaUser />
                  {author}
                </span>
              )}
            </CardMeta>
          )}
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
        </CardFooter>
      </CardWrapper>
    </StyledLink>
  )
}

export default BlogCard
