// app/components/HeroSection.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { TECH_TAGS } from '../lib/constants'
import { useHeaderContext } from './HeaderContext'
import { usePageLoad } from './PageLoadOrchestrator'
import SparklingName from './SparklingName'

const HeroSectionWrapper = styled.section<{ $isHeaderExpanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8rem 16px 4rem;
  overflow: hidden;
  transition: padding-top 0.3s ease;
`

const ContentWrapper = styled(motion.div)`
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 768px) {
    max-width: 800px; /* Restrict max-width to prevent overflow */
  }

  @media (min-width: 1200px) {
    max-width: 1000px;
  }
`

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
}

/**
 * Creates an array of particles for the animated background.
 * @param count - Number of particles to create.
 * @param width - Width of the canvas.
 * @param height - Height of the canvas.
 * @returns Array of Particle objects.
 */
const createParticles = (count: number, width: number, height: number): Particle[] => {
  return Array.from({ length: count }, () => ({
    color: `rgba(${Math.floor(Math.random() * 100) + 155}, ${
      Math.floor(Math.random() * 100) + 155
    }, 255, ${Math.random() * 0.3 + 0.2})`,
    radius: Math.random() * 1.5 + 0.5,
    vx: Math.random() * 0.2 - 0.1,
    vy: Math.random() * 0.2 - 0.1,
    x: Math.random() * width,
    y: Math.random() * height,
  }))
}

/**
 * AnimatedBackground component
 * Renders an animated particle background using canvas.
 */
const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles = createParticles(50, canvas.width, canvas.height)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <ParticleCanvas ref={canvasRef} />
}

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 5vw, 6rem);
  margin-bottom: 2.5rem;
  color: var(--color-primary);
  text-shadow: 0 0 20px var(--color-primary);
  letter-spacing: 2px;
  font-family: var(--font-heading);
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      var(--color-primary),
      var(--color-primary),
      var(--color-accent),
      var(--color-primary),
      var(--color-primary)
    );
    background-size: 200% 100%;
  }

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`

const HyperblissSpan = styled.span`
  background: linear-gradient(
    45deg,
    var(--color-primary),
    var(--color-accent),
    var(--color-secondary)
  );
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50 s%;
    }
  }
`

const Subtitle = styled(motion.p)`
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  margin-bottom: 2rem;
  color: var(--color-secondary);
  text-shadow: 0 0 15px var(--color-secondary);
  line-height: 1.6;
  font-family: var(--font-body);

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`

const TagCloud = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 2rem;
  max-width: 100%;
`

const Tag = styled(motion.span)`
  background-color: rgba(162, 89, 255, 0.1);
  color: var(--color-accent);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: clamp(1.3rem, 1.5vw, 1.6rem);
  transition: all 0.3s ease;
  border: 1px solid rgba(162, 89, 255, 0.3);
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(162, 89, 255, 0.2);

  &:hover {
    background-color: rgba(162, 89, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(162, 89, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(162, 89, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 0.4rem 0.8rem;
  }
`

const CTAButton = styled(motion.a)`
  background-color: transparent;
  color: var(--color-accent);
  padding: 1rem 2rem;
  border: 2px solid var(--color-accent);
  border-radius: 50px;
  font-size: clamp(1.5rem, 1.5vw, 2rem);
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-accent);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--color-background);
    box-shadow: 0 0 15px rgba(162, 89, 255, 0.7);
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  @media (max-width: 768px) {
    font-size: 1.45rem;
    padding: 0.8rem 1.6rem;
  }
`

const ButtonText = styled.span`
  position: relative;
  z-index: 2;
`

const tags = TECH_TAGS

/**
 * HeroSection component
 * The main hero section of the homepage with animated text and a CTA button.
 * Adjusted font sizes and padding for better widescreen support.
 */
export default function HeroSection(): React.ReactElement {
  const { isExpanded } = useHeaderContext()
  const { isInitialLoad } = usePageLoad()

  return (
    <HeroSectionWrapper $isHeaderExpanded={isExpanded}>
      <AnimatedBackground />
      <ContentWrapper
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: isInitialLoad ? 0 : 1, y: isInitialLoad ? 20 : 0 }}
        transition={{ duration: isInitialLoad ? 0.5 : 0, ease: 'easeOut' }}
      >
        <Title
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: isInitialLoad ? 0 : 1, y: isInitialLoad ? -20 : 0 }}
          transition={{ delay: isInitialLoad ? 0.1 : 0, duration: isInitialLoad ? 0.5 : 0 }}
        >
          Welcome to <HyperblissSpan>Hyperbliss</HyperblissSpan>
        </Title>
        <Subtitle>
          I&apos;m <SparklingName name="Stefanie Jane" />, a multifaceted software engineer and leader. I do everything
          from embedded systems to cloud to mobile, all the way across the stack and back. Welcome to my personal site!
          You&apos;ll find my blog, projects, and more about me here.
        </Subtitle>
        <TagCloud>
          {tags.map((tag, index) => (
            <Tag
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: isInitialLoad ? 0 : 1, scale: isInitialLoad ? 0.8 : 1 }}
              key={tag}
              transition={{ delay: isInitialLoad ? 0.3 + index * 0.02 : 0, duration: isInitialLoad ? 0.3 : 0 }}
            >
              {tag}
            </Tag>
          ))}
        </TagCloud>
        <CTAButton href="/about" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ButtonText>Learn More</ButtonText>
        </CTAButton>
      </ContentWrapper>
    </HeroSectionWrapper>
  )
}
