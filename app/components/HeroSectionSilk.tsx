'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { TECH_TAGS } from '../lib/constants'
import { SilkButton } from '../styles/silkcircuit/components'
import { usePageLoad } from './PageLoadOrchestrator'
import { SparklingName } from './SparklingName'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styled Components
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

const BackgroundGradient = styled(motion.div)`
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
`

const ContentContainer = styled(motion.div)`
  max-width: var(--container-xl);
  margin: 0 auto;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Title = styled(motion.h1)`
  font-family: 'Audiowide', var(--font-display);
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

const Subtitle = styled(motion.p)`
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

const TagCloud = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-10);
  max-width: 900px;
`

const SkillTag = styled(motion.div)<{ $index: number }>`
  padding: var(--space-2) var(--space-4);
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-lg));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 1.4rem;
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: default;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, 
      ${({ $index }) =>
        $index % 3 === 0
          ? 'var(--silk-quantum-purple)'
          : $index % 3 === 1
            ? 'var(--silk-circuit-cyan)'
            : 'var(--silk-plasma-pink)'} 0%, 
      transparent 70%
    );
    opacity: 0;
    transition: all var(--duration-normal) var(--ease-silk);
  }
  
  &:hover {
    color: var(--text-primary);
    border-color: ${({ $index }) =>
      $index % 3 === 0
        ? 'var(--silk-quantum-purple)'
        : $index % 3 === 1
          ? 'var(--silk-circuit-cyan)'
          : 'var(--silk-plasma-pink)'};
    transform: translateY(-2px) scale(1.05);
    
    &::before {
      width: 100%;
      height: 100%;
      opacity: 0.1;
    }
  }
`

const CTASection = styled(motion.div)`
  display: flex;
  gap: var(--space-4);
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`

const ScrollIndicator = styled(motion.div)`
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

const ScrollMouse = styled(motion.div)`
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
// Particle System (Simplified)
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

export default function HeroSectionSilk() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isInitialLoad } = usePageLoad()
  const { scrollY } = useScroll()

  // Parallax transforms
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

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

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Draw connections
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

  // Animation variants
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
        ease: [0.23, 1, 0.32, 1],
      },
      y: 0,
    },
  }

  return (
    <HeroWrapper>
      <BackgroundCanvas ref={canvasRef} />
      <BackgroundGradient style={{ opacity, y }} />

      <ContentContainer animate="visible" initial="hidden" variants={containerVariants}>
        <Title variants={itemVariants}>
          <TitleStatic>Welcome to </TitleStatic>
          <TitleGradient>hyperbliss</TitleGradient>
        </Title>

        <Subtitle variants={itemVariants}>
          I'm <SparklingName name="Stefanie Jane" sparkleCount={8} />, a full-stack engineer crafting elegant solutions
          at the intersection of art and technology. I build experiences that push the boundaries of what's possible on
          the web.
        </Subtitle>

        <TagCloud variants={itemVariants}>
          {TECH_TAGS.map((tag, index) => (
            <SkillTag
              $index={index}
              animate={{ opacity: 1, scale: 1 }}
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
            </SkillTag>
          ))}
        </TagCloud>

        <CTASection variants={itemVariants}>
          <Link href="/projects" style={{ textDecoration: 'none' }}>
            <SilkButton
              $size="lg"
              $variant="primary"
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </SilkButton>
          </Link>

          <Link href="/about" style={{ textDecoration: 'none' }}>
            <SilkButton
              $size="lg"
              $variant="secondary"
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </SilkButton>
          </Link>
        </CTASection>
      </ContentContainer>

      <ScrollIndicator animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 1.5 }}>
        <ScrollMouse />
        <span>Scroll to explore</span>
      </ScrollIndicator>
    </HeroWrapper>
  )
}
