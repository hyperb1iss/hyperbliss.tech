// app/components/SparklingName.tsx

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`

const SparkleWrapper = styled.span`
  position: relative;
  display: inline-block;
`

const Sparkle = styled.span<{
  $size: number
  $top: number
  $left: number
  $delay: number
}>`
  position: absolute;
  display: block;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
  background-color: var(--color-accent);
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  opacity: 0;
  animation: ${sparkle} 2.5s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;
`

const HighlightedName = styled(motion.span)`
  color: var(--color-accent);
  font-weight: bold;
  text-shadow: 0 0 10px var(--color-accent);
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`

interface SparkleType {
  id: number
  size: number
  top: number
  left: number
  delay: number
}

interface SparklingNameProps {
  name: string
  sparkleCount?: number
  className?: string
}

const createSparkles = (count: number): SparkleType[] =>
  Array.from({ length: count }, (_, i) => ({
    delay: Math.random() * 1.5,
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
  }))

export const SparklingName: React.FC<SparklingNameProps> = ({ name, sparkleCount = 10, className }) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([])

  useEffect(() => {
    const sparklesArray = createSparkles(sparkleCount)
    setSparkles(sparklesArray)
  }, [sparkleCount])

  return (
    <SparkleWrapper className={className}>
      <HighlightedName transition={{ damping: 10, stiffness: 300, type: 'spring' }} whileHover={{ scale: 1.05 }}>
        {name}
      </HighlightedName>
      {sparkles.map((sparkle) => (
        <Sparkle $delay={sparkle.delay} $left={sparkle.left} $size={sparkle.size} $top={sparkle.top} key={sparkle.id} />
      ))}
    </SparkleWrapper>
  )
}

export default SparklingName
