'use client'

// app/components/SparklingName.tsx
// Magical sparkle effect for names - gentle and whimsical

import { motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { styled } from '../../styled-system/jsx'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SparkleWrapper = styled.span`
  position: relative;
  display: inline-block;
`

const nameStyles: React.CSSProperties = {
  color: '#ff75d8',
  cursor: 'default',
  fontWeight: 'inherit',
  position: 'relative' as const,
  textShadow: '0 0 10px rgba(255, 117, 216, 0.7), 0 0 20px rgba(0, 255, 240, 0.5)',
}

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
}

const SPARKLE_COLORS = [
  '#ff75d8', // plasma pink
  '#00fff0', // circuit cyan
  '#a259ff', // quantum purple
  '#ffffff', // white
  '#e0aaff', // soft purple
]

// Seeded random for consistent sparkle generation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const generateSparkle = (id: number, seed: number): SparkleType => {
  const r1 = seededRandom(seed)
  const r2 = seededRandom(seed + 1)
  const r3 = seededRandom(seed + 2)
  const r4 = seededRandom(seed + 3)
  const r5 = seededRandom(seed + 4)

  return {
    color: SPARKLE_COLORS[Math.floor(r1 * SPARKLE_COLORS.length)],
    delay: r2 * 3, // Staggered delays up to 3s
    duration: 2.5 + r3 * 1.5, // 2.5-4s duration
    id,
    left: -5 + r4 * 110,
    size: 6 + r5 * 8,
    top: -15 + seededRandom(seed + 5) * 130,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sparkle Component (Infinite looping animation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparkleProps {
  sparkle: SparkleType
}

const Sparkle: React.FC<SparkleProps> = ({ sparkle }) => {
  return (
    <motion.span
      animate={{
        opacity: [0, 1, 1, 0],
        rotate: [0, 90, 180],
        scale: [0, 1, 0.8, 0],
      }}
      initial={{ opacity: 0, scale: 0 }}
      style={{
        background: sparkle.color,
        borderRadius: '1px',
        boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}, 0 0 ${sparkle.size}px ${sparkle.color}`,
        clipPath: 'polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)',
        height: sparkle.size,
        left: `${sparkle.left}%`,
        pointerEvents: 'none',
        position: 'absolute',
        top: `${sparkle.top}%`,
        width: sparkle.size,
        zIndex: 10,
      }}
      transition={{
        delay: sparkle.delay,
        duration: sparkle.duration,
        ease: 'easeInOut',
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1 + sparkle.delay, // Variable gap between loops
      }}
    />
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparklingNameProps {
  name: string
  sparkleCount?: number
  className?: string
}

export const SparklingName: React.FC<SparklingNameProps> = ({ name, sparkleCount = 8, className }) => {
  const [mounted, setMounted] = useState(false)

  // Generate sparkles with stable seeds based on index
  const sparkles = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: sparkleCount }, (_, i) => generateSparkle(i, i * 100))
  }, [sparkleCount, mounted])

  // Only render sparkles client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SparkleWrapper className={className}>
      <motion.span
        style={nameStyles}
        suppressHydrationWarning={true}
        transition={{ damping: 15, stiffness: 200, type: 'spring' }}
        whileHover={{ scale: 1.02 }}
      >
        {name}
      </motion.span>
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} sparkle={sparkle} />
      ))}
    </SparkleWrapper>
  )
}

export default SparklingName
