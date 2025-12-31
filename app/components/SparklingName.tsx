'use client'

// app/components/SparklingName.tsx
// Magical sparkle effect for names - because plain text is boring

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Animations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const twinkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  25% {
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.8) rotate(90deg);
  }
  75% {
    opacity: 1;
    transform: scale(1.1) rotate(135deg);
  }
`

const sparkleFloat = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(-8px) scale(1.2);
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
`

const starBurst = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
    filter: blur(0px);
  }
  20% {
    opacity: 1;
    transform: scale(1.2) rotate(72deg);
    filter: blur(0px);
  }
  40% {
    opacity: 0.9;
    transform: scale(0.9) rotate(144deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.1) rotate(216deg);
  }
  80% {
    opacity: 0.8;
    transform: scale(1) rotate(288deg);
  }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styled Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SparkleWrapper = styled.span`
  position: relative;
  display: inline-block;
`

// Different sparkle shapes
type SparkleShape = 'star' | 'diamond' | 'circle' | 'cross'

const getSparkleClipPath = (shape: SparkleShape) => {
  switch (shape) {
    case 'star':
      // 4-point star
      return 'polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)'
    case 'diamond':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    case 'circle':
      return 'circle(50% at 50% 50%)'
    case 'cross':
      // Plus/cross shape
      return 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)'
    default:
      return 'polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)'
  }
}

const getAnimation = (animationType: 'twinkle' | 'float' | 'burst') => {
  switch (animationType) {
    case 'twinkle':
      return css`${twinkle}`
    case 'float':
      return css`${sparkleFloat}`
    case 'burst':
      return css`${starBurst}`
    default:
      return css`${twinkle}`
  }
}

const Sparkle = styled.span<{
  $size: number
  $top: number
  $left: number
  $delay: number
  $duration: number
  $color: string
  $shape: SparkleShape
  $animationType: 'twinkle' | 'float' | 'burst'
  $blur: number
}>`
  position: absolute;
  display: block;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
  background: ${(props) => props.$color};
  clip-path: ${(props) => getSparkleClipPath(props.$shape)};
  opacity: 0;
  animation: ${(props) => getAnimation(props.$animationType)} ${(props) => props.$duration}s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;
  filter: blur(${(props) => props.$blur}px) drop-shadow(0 0 ${(props) => props.$size / 2}px ${(props) => props.$color});
  pointer-events: none;
  z-index: 10;
`

const HighlightedName = styled(motion.span)`
  background: linear-gradient(
    90deg,
    var(--silk-plasma-pink) 0%,
    var(--silk-circuit-cyan) 25%,
    var(--silk-quantum-purple) 50%,
    var(--silk-plasma-pink) 75%,
    var(--silk-circuit-cyan) 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 3s linear infinite;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  filter: drop-shadow(0 0 8px rgba(255, 117, 216, 0.4))
          drop-shadow(0 0 16px rgba(0, 255, 240, 0.2));
  transition: filter 0.3s ease;

  &:hover {
    filter: drop-shadow(0 0 12px rgba(255, 117, 216, 0.6))
            drop-shadow(0 0 24px rgba(0, 255, 240, 0.4))
            drop-shadow(0 0 32px rgba(162, 89, 255, 0.3));
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types & Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparkleType {
  id: number
  size: number
  top: number
  left: number
  delay: number
  duration: number
  color: string
  shape: SparkleShape
  animationType: 'twinkle' | 'float' | 'burst'
  blur: number
}

const SPARKLE_COLORS = [
  '#ff75d8', // plasma pink
  '#00fff0', // circuit cyan
  '#a259ff', // quantum purple
  '#ffffff', // white for extra pop
  '#80ffea', // light cyan
  '#e0aaff', // soft purple
]

const SPARKLE_SHAPES: SparkleShape[] = ['star', 'diamond', 'circle', 'cross']
const ANIMATION_TYPES: ('twinkle' | 'float' | 'burst')[] = ['twinkle', 'float', 'burst']

const createSparkles = (count: number): SparkleType[] =>
  Array.from({ length: count }, (_, i) => ({
    animationType: ANIMATION_TYPES[Math.floor(Math.random() * ANIMATION_TYPES.length)],
    blur: Math.random() * 0.5, // subtle blur for some sparkles
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3, // 3-6s duration - slower & dreamy
    id: i,
    left: Math.random() * 110, // centered spread
    shape: SPARKLE_SHAPES[Math.floor(Math.random() * SPARKLE_SHAPES.length)],
    size: 4 + Math.random() * 6, // 4-10px - dainty
    top: -20 + Math.random() * 115, // nudged up a hair
  }))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparklingNameProps {
  name: string
  sparkleCount?: number
  className?: string
}

export const SparklingName: React.FC<SparklingNameProps> = ({
  name,
  sparkleCount = 12,
  className
}) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([])

  useEffect(() => {
    const sparklesArray = createSparkles(sparkleCount)
    setSparkles(sparklesArray)

    // Regenerate sparkles periodically for variety
    const interval = setInterval(() => {
      setSparkles(createSparkles(sparkleCount))
    }, 8000)

    return () => clearInterval(interval)
  }, [sparkleCount])

  return (
    <SparkleWrapper className={className}>
      <HighlightedName
        transition={{ damping: 10, stiffness: 300, type: 'spring' }}
        whileHover={{ scale: 1.05 }}
      >
        {name}
      </HighlightedName>
      {sparkles.map((sparkle) => (
        <Sparkle
          $animationType={sparkle.animationType}
          $blur={sparkle.blur}
          $color={sparkle.color}
          $delay={sparkle.delay}
          $duration={sparkle.duration}
          $left={sparkle.left}
          $shape={sparkle.shape}
          $size={sparkle.size}
          $top={sparkle.top}
          key={sparkle.id}
        />
      ))}
    </SparkleWrapper>
  )
}

export default SparklingName
