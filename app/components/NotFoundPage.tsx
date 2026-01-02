'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import PageWrapper from './PageWrapper'
import { StarButton } from './StarComponents'
import StyledLink from './StyledLink'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(20, 20, 35, 1) 0%,
    rgba(10, 10, 20, 1) 100%
  );
  overflow: hidden;
`

const StarFieldCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const lostStarContainerStyles = css`
  position: relative;
  margin-bottom: var(--space-8);
`

const lostStarStyles = css`
  width: 180px;
  height: auto;
  animation: glow 3s ease-in-out infinite;

  img {
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    width: 140px;
  }

  @keyframes glow {
    0%, 100% {
      filter: drop-shadow(0 0 20px rgba(162, 89, 255, 0.6))
              drop-shadow(0 0 40px rgba(0, 255, 240, 0.4));
      opacity: 0.9;
    }
    50% {
      filter: drop-shadow(0 0 30px rgba(162, 89, 255, 0.8))
              drop-shadow(0 0 60px rgba(0, 255, 240, 0.6));
      opacity: 1;
    }
  }
`

const sparkleBaseStyles = css`
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-secondary);
  animation: sparkle 2s ease-in-out infinite;

  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
`

const contentWrapperStyles = css`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--space-6);
  max-width: 700px;
`

const errorCodeStyles = css`
  font-family: var(--font-heading);
  font-size: clamp(8rem, 15vw, 14rem);
  font-weight: var(--font-black);
  margin: 0;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 50%,
    var(--color-accent) 100%
  );
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 4s ease infinite;
  text-shadow: none;
  line-height: 1;

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

const titleStyles = css`
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: var(--space-4) 0 var(--space-6);
  text-transform: uppercase;
  letter-spacing: 0.2em;
`

const messageStyles = css`
  font-family: var(--font-body);
  font-size: clamp(1.6rem, 2vw, 2rem);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  max-width: 500px;
`

const buttonContainerStyles = css`
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;

    > * {
      width: 100%;
    }
  }
`

const secondaryButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) var(--space-8);
  min-height: 56px;
  font-family: var(--font-body);
  font-size: clamp(1.8rem, 1.6rem + 0.5vw, 2.2rem);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--text-primary);
    border-color: var(--color-secondary);
    background: rgba(0, 255, 240, 0.05);
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types and Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparkleData {
  x: number
  y: number
  delay: number
}

interface HighlightProps {
  $color?: 'purple' | 'cyan' | 'pink'
  children: React.ReactNode
}

const Highlight: React.FC<HighlightProps> = ({ $color = 'cyan', children }) => {
  const colorMap = {
    cyan: 'var(--color-secondary)',
    pink: 'var(--color-accent)',
    purple: 'var(--color-primary)',
  }

  return <span style={{ color: colorMap[$color], fontWeight: 'var(--font-medium)' }}>{children}</span>
}

const LOST_MESSAGES = [
  'This star got lost searching for that page...',
  'Even shooting stars miss their targets sometimes.',
  'The cosmic winds blew this page into the void.',
  'This star wandered off the beaten path.',
  'Some destinations exist only in dreams.',
  'The universe hid this page from us.',
  'This star took a wrong turn at the nebula.',
  'Not all who wander are lost... but this page is.',
]

const SPARKLES: SparkleData[] = [
  { delay: 0, x: -20, y: 10 },
  { delay: 0.5, x: 110, y: 20 },
  { delay: 1, x: 90, y: 90 },
  { delay: 1.5, x: 0, y: 80 },
  { delay: 0.8, x: 50, y: -10 },
]

// Star interface for the warp field
interface WarpStar {
  x: number
  y: number
  z: number
  prevX: number
  prevY: number
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function NotFoundPage() {
  const [message, setMessage] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const _starsRef = useRef<WarpStar[]>([])

  // Initialize warp stars
  const _initStars = useCallback((count: number) => {
    const stars: WarpStar[] = []
    for (let i = 0; i < count; i++) {
      stars.push({
        prevX: 0,
        prevY: 0,
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000,
      })
    }
    return stars
  }, [])

  useEffect(() => {
    setMessage(LOST_MESSAGES[Math.floor(Math.random() * LOST_MESSAGES.length)])
  }, [])

  // Canvas starfield animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let stars: WarpStar[] = []
    const speed = 3
    const maxDepth = 1000
    const starCount = 300

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Clear fully on resize
      ctx.fillStyle = 'rgb(10, 10, 20)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const initializeStars = () => {
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      stars = []
      for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * canvas.width * 2
        const y = (Math.random() - 0.5) * canvas.height * 2
        const z = Math.random() * maxDepth
        const sx = cx + (x / z) * 300
        const sy = cy + (y / z) * 300
        stars.push({ prevX: sx, prevY: sy, x, y, z })
      }
    }

    resizeCanvas()
    initializeStars()
    window.addEventListener('resize', () => {
      resizeCanvas()
      initializeStars()
    })

    const animate = () => {
      const { width, height } = canvas
      const cx = width / 2
      const cy = height / 2

      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(10, 10, 20, 0.2)'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Store previous position before moving
        const prevSx = cx + (star.x / star.z) * 300
        const prevSy = cy + (star.y / star.z) * 300

        // Move star toward viewer
        star.z -= speed

        // Reset star if it passes the viewer
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
          star.z = maxDepth
          star.prevX = cx
          star.prevY = cy
          continue
        }

        // Project 3D to 2D
        const sx = cx + (star.x / star.z) * 300
        const sy = cy + (star.y / star.z) * 300

        // Skip if off screen
        if (sx < 0 || sx > width || sy < 0 || sy > height) continue

        // Calculate size and brightness based on depth
        const depthRatio = 1 - star.z / maxDepth
        const size = 0.5 + depthRatio * 2.5
        const brightness = 0.2 + depthRatio * 0.8

        // Draw star trail
        ctx.beginPath()
        ctx.moveTo(prevSx, prevSy)
        ctx.lineTo(sx, sy)
        ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.6})`
        ctx.lineWidth = size * 0.8
        ctx.stroke()

        // Draw star point
        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <PageWrapper>
      <Container>
        <StarFieldCanvas ref={canvasRef} />

        <motion.div className={contentWrapperStyles}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={lostStarContainerStyles}
            initial={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className={lostStarStyles}>
              <Image alt="Lost shooting star" height={180} priority={true} src="/images/star-icon.png" width={180} />
            </div>
            {SPARKLES.map((sparkle, i) => (
              <span
                className={sparkleBaseStyles}
                key={i}
                style={{
                  animationDelay: `${sparkle.delay}s`,
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                }}
              />
            ))}
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, scale: 1 }}
            className={errorCodeStyles}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            404
          </motion.h1>

          <motion.h2
            animate={{ opacity: 1, y: 0 }}
            className={titleStyles}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Lost in Space
          </motion.h2>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className={messageStyles}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {message} <Highlight $color="cyan">Let&apos;s guide you back</Highlight> to{' '}
            <Highlight $color="purple">familiar territory</Highlight>.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={buttonContainerStyles}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <StyledLink href="/">
              <StarButton size="lg" variant="primary">
                Return Home
              </StarButton>
            </StyledLink>
            <StyledLink href="/projects">
              <motion.button className={secondaryButtonStyles} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Explore Projects
              </motion.button>
            </StyledLink>
          </motion.div>
        </motion.div>
      </Container>
    </PageWrapper>
  )
}
