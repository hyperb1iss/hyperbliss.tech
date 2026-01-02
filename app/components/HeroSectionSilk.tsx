'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { tinaField } from 'tinacms/dist/react'
import type { HeroSection } from '@/lib/tina'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import type { PagesQuery } from '../../tina/__generated__/types'
import { usePageLoad } from './PageLoadOrchestrator'
import { SparklingName } from './SparklingName'
import { StarButton } from './StarComponents'

interface HeroSectionSilkProps {
  hero?: HeroSection | null
  techTags?: string[] | null
  tinaPage?: PagesQuery['pages'] | null
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-24) var(--space-6) var(--space-16);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--space-20) var(--space-4) var(--space-12);
  }
`

const BackgroundCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  opacity: 0.4;
`

// Motion component styles (using css function for className)
const backgroundGradientStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background:
    radial-gradient(circle at 30% 20%, rgba(162, 89, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 70% 80%, rgba(0, 255, 240, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(255, 117, 216, 0.05) 0%, transparent 60%);
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
`

const contentContainerStyles = css`
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 var(--space-6);

  @media (max-width: 768px) {
    padding: 0 var(--space-4);
  }
`

const titleStyles = css`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-5xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-8);
  position: relative;

  @media (max-width: 768px) {
    font-size: var(--text-fluid-4xl);
  }
`

const TitleGradient = styled.span`
  background: linear-gradient(
    135deg,
    var(--silk-quantum-purple) 0%,
    var(--silk-circuit-cyan) 50%,
    var(--silk-plasma-pink) 100%
  );
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 4s ease infinite;

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

const TitleStatic = styled.span`
  color: var(--text-primary);
`

const subtitleStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-xl);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto var(--space-10);

  @media (max-width: 768px) {
    font-size: var(--text-fluid-lg);
  }
`

const tagCloudStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-10);
  max-width: 900px;
`

const skillTagStyles = css`
  padding: var(--space-2) var(--space-4);
  background: rgba(20, 20, 35, 0.85);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: clamp(1.1rem, 1rem + 0.2vw, 1.3rem);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: default;
  position: relative;
  overflow: hidden;
`

const ctaSectionStyles = css`
  display: flex;
  gap: var(--space-4);
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`

const secondaryButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  font-family: var(--font-body);
  font-size: clamp(1.8rem, 1.6rem + 0.5vw, 2.2rem);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  min-height: 56px;
  background: var(--surface-raised);
  color: var(--color-secondary);
  border: 1px solid var(--color-secondary);

  &:hover {
    background: rgba(0, 255, 240, 0.1);
    box-shadow: var(--glow-cyan);
  }
`

const scrollIndicatorStyles = css`
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
`

const scrollMouseStyles = css`
  width: 24px;
  height: 36px;
  border: 2px solid var(--border-default);
  border-radius: 12px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 8px;
    background: var(--silk-quantum-purple);
    border-radius: 2px;
    animation: scrollWheel 2s ease-in-out infinite;
  }

  @keyframes scrollWheel {
    0% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Particle System
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
}

const createParticles = (count: number, width: number, height: number): Particle[] => {
  return Array.from({ length: count }, () => ({
    color: Math.random() > 0.5 ? '#a259ff' : Math.random() > 0.5 ? '#00fff0' : '#ff75d8',
    opacity: Math.random() * 0.5 + 0.2,
    radius: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    x: Math.random() * width,
    y: Math.random() * height,
  }))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEFAULT_HERO: HeroSection = {
  name: 'Stefanie Jane',
  primaryCtaLink: '/projects',
  primaryCtaText: 'View Projects',
  scrollText: 'Scroll to explore',
  secondaryCtaLink: '/about',
  secondaryCtaText: 'Learn More',
  subtitle:
    "I'm Stefanie Jane, a full-stack engineer crafting elegant solutions at the intersection of art and technology. I build experiences that push the boundaries of what's possible on the web.",
  welcomeText: 'Welcome to',
}

const DEFAULT_TECH_TAGS = [
  'AI/ML',
  'Android',
  'AWS',
  'Backend',
  'BSP',
  'C/C++',
  'Cloud Services',
  'DevOps',
  'Embedded Systems',
  'Firmware',
  'Frontend',
  'Full Stack',
  'Golang',
  'Hardware Bringup',
  'Infrastructure',
  'IoT',
  'Java',
  'JavaScript',
  'Kotlin',
  'Linux Kernel',
  'Mobile Development',
  'Node.js',
  'Open Source',
  'Prototyping',
  'Python',
  'Qualcomm Snapdragon',
  'React',
  'Rust',
  'System Architecture',
  'Team Leadership',
  'TypeScript',
]

export default function HeroSectionSilk({ hero, techTags, tinaPage }: HeroSectionSilkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isInitialLoad } = usePageLoad()

  const heroContent = { ...DEFAULT_HERO, ...hero }
  const tags = techTags ?? DEFAULT_TECH_TAGS
  const tinaHero = tinaPage?.hero

  // Particle animation
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
    let animationId: number

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
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        particles.forEach((other) => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = (1 - distance / 100) * 0.2
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: isInitialLoad ? 0.3 : 0,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] as const,
      },
      y: 0,
    },
  }

  return (
    <HeroWrapper>
      <BackgroundCanvas ref={canvasRef} />
      <motion.div className={backgroundGradientStyles} />

      <motion.div animate="visible" className={contentContainerStyles} initial="hidden" variants={containerVariants}>
        <motion.h1
          className={titleStyles}
          data-tina-field={tinaHero ? tinaField(tinaHero, 'welcomeText') : undefined}
          variants={itemVariants}
        >
          <TitleStatic>{heroContent.welcomeText} </TitleStatic>
          <TitleGradient>hyperbliss</TitleGradient>
        </motion.h1>

        <motion.p
          className={subtitleStyles}
          data-tina-field={tinaHero ? tinaField(tinaHero, 'subtitle') : undefined}
          variants={itemVariants}
        >
          I'm{' '}
          <span data-tina-field={tinaHero ? tinaField(tinaHero, 'name') : undefined}>
            <SparklingName name={heroContent.name ?? 'Stefanie Jane'} sparkleCount={8} />
          </span>
          ,{' '}
          {heroContent.subtitle?.replace(/^I'm [^,]+, /, '') ??
            'a full-stack engineer crafting elegant solutions at the intersection of art and technology.'}
        </motion.p>

        <motion.div className={tagCloudStyles} variants={itemVariants}>
          {tags.map((tag, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className={skillTagStyles}
              initial={{ opacity: 0, scale: 0.8 }}
              key={tag}
              transition={{
                delay: isInitialLoad ? 0.5 + index * 0.02 : 0,
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className={ctaSectionStyles} variants={itemVariants}>
          <Link
            data-tina-field={tinaHero ? tinaField(tinaHero, 'primaryCtaText') : undefined}
            href={heroContent.primaryCtaLink ?? '/projects'}
            style={{ textDecoration: 'none' }}
          >
            <StarButton size="lg" variant="primary">
              {heroContent.primaryCtaText ?? 'View Projects'}
            </StarButton>
          </Link>

          <Link
            data-tina-field={tinaHero ? tinaField(tinaHero, 'secondaryCtaText') : undefined}
            href={heroContent.secondaryCtaLink ?? '/about'}
            style={{ textDecoration: 'none' }}
          >
            <motion.div className={secondaryButtonStyles} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {heroContent.secondaryCtaText ?? 'Learn More'}
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        className={scrollIndicatorStyles}
        initial={{ opacity: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div className={scrollMouseStyles} />
        <span data-tina-field={tinaHero ? tinaField(tinaHero, 'scrollText') : undefined}>
          {heroContent.scrollText ?? 'Scroll to explore'}
        </span>
      </motion.div>
    </HeroWrapper>
  )
}
