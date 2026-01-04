'use client'

// app/components/SparklingName.tsx
// Magical sparkle effect for names - gentle and whimsical

import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
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

const generateSparkle = (id: number): SparkleType => ({
  color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 2,
  id,
  left: -5 + Math.random() * 110,
  size: 6 + Math.random() * 8,
  top: -15 + Math.random() * 130,
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sparkle Component (Framer Motion for reliable animations)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparkleProps {
  sparkle: SparkleType
  onComplete: () => void
}

const Sparkle: React.FC<SparkleProps> = ({ sparkle, onComplete }) => {
  return (
    <motion.span
      animate={{
        opacity: [0, 1, 1, 0],
        rotate: [0, 90, 180],
        scale: [0, 1, 0.8, 0],
      }}
      initial={{ opacity: 0, scale: 0 }}
      onAnimationComplete={onComplete}
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
  const [sparkles, setSparkles] = useState<SparkleType[]>([])
  const idCounterRef = useRef(0)

  // Only generate sparkles client-side to avoid hydration mismatch
  useEffect(() => {
    const initialSparkles = Array.from({ length: sparkleCount }, (_, i) => generateSparkle(i))
    setSparkles(initialSparkles)
    idCounterRef.current = sparkleCount
  }, [sparkleCount])

  // When a sparkle completes, regenerate it with new random values
  const handleSparkleComplete = (id: number) => {
    const newId = idCounterRef.current++
    setSparkles((prev) => {
      const newSparkles = prev.filter((s) => s.id !== id)
      const newSparkle = generateSparkle(newId)
      return [...newSparkles, newSparkle]
    })
  }

  return (
    <SparkleWrapper className={className}>
      <motion.span
        style={nameStyles}
        transition={{ damping: 15, stiffness: 200, type: 'spring' }}
        whileHover={{ scale: 1.02 }}
      >
        {name}
      </motion.span>
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} onComplete={() => handleSparkleComplete(sparkle.id)} sparkle={sparkle} />
      ))}
    </SparkleWrapper>
  )
}

export default SparklingName
