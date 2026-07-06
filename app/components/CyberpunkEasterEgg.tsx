'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const TYPED_CODE = 'cybercat'
const EASTER_EGG_DURATION_MS = 6200

const glyphs = ['✦', '◇', '✧', '△', '⟡', '✺', '⬡', '◆', '✶', '◈', '⟐', '✹']

const overlayStyles: CSSProperties = {
  alignItems: 'center',
  background:
    'radial-gradient(circle at 50% 45%, rgba(162, 89, 255, 0.22), rgba(10, 10, 20, 0.86) 42%, rgba(10, 10, 20, 0.96) 100%)',
  color: '#e0e0e0',
  display: 'flex',
  inset: 0,
  justifyContent: 'center',
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'fixed',
  zIndex: 9999,
}

const panelStyles: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.86), rgba(39, 13, 61, 0.72))',
  border: '1px solid rgba(0, 255, 240, 0.62)',
  borderRadius: '24px',
  boxShadow:
    '0 0 36px rgba(0, 255, 240, 0.36), inset 0 0 30px rgba(255, 117, 216, 0.16), 0 0 90px rgba(162, 89, 255, 0.28)',
  maxWidth: 'min(680px, calc(100vw - 32px))',
  padding: 'clamp(1.4rem, 5vw, 3.5rem)',
  position: 'relative',
  textAlign: 'center',
}

const sigilStyles: CSSProperties = {
  color: '#00fff0',
  fontFamily: 'Space Mono, monospace',
  fontSize: 'clamp(3rem, 16vw, 8rem)',
  letterSpacing: '0.04em',
  lineHeight: 0.9,
  marginBottom: '1rem',
  textShadow: '0 0 16px rgba(0, 255, 240, 0.92), 0 0 40px rgba(255, 117, 216, 0.78)',
}

const titleStyles: CSSProperties = {
  color: '#ff75d8',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: 'clamp(1.45rem, 5vw, 3.2rem)',
  letterSpacing: '0.16em',
  margin: 0,
  textShadow: '0 0 14px rgba(255, 117, 216, 0.9), 0 0 32px rgba(162, 89, 255, 0.72)',
  textTransform: 'uppercase',
}

const bodyStyles: CSSProperties = {
  color: '#e0e0e0',
  fontFamily: 'Rajdhani, sans-serif',
  fontSize: 'clamp(1rem, 2.6vw, 1.35rem)',
  margin: '1rem auto 0',
  maxWidth: '42rem',
  textShadow: '0 0 12px rgba(0, 255, 240, 0.36)',
}

const codeStyles: CSSProperties = {
  color: '#00fff0',
  display: 'block',
  fontFamily: 'Space Mono, monospace',
  fontSize: 'clamp(0.82rem, 2vw, 1rem)',
  letterSpacing: '0.12em',
  marginTop: '1.2rem',
  textShadow: '0 0 10px rgba(0, 255, 240, 0.72)',
  textTransform: 'uppercase',
}

const gridStyles: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(0, 255, 240, 0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 117, 216, 0.12) 1px, transparent 1px)',
  backgroundSize: '54px 54px',
  inset: '-20%',
  opacity: 0.34,
  position: 'absolute',
  transform: 'perspective(600px) rotateX(62deg) translateY(24%)',
  transformOrigin: '50% 100%',
}

function useEasterEggTrigger(onUnlock: () => void) {
  useEffect(() => {
    let konamiIndex = 0
    let typedBuffer = ''

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
        return
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      konamiIndex = key === KONAMI_CODE[konamiIndex] ? konamiIndex + 1 : Number(key === KONAMI_CODE[0])
      typedBuffer = `${typedBuffer}${key.length === 1 ? key : ''}`.slice(-TYPED_CODE.length)

      if (konamiIndex === KONAMI_CODE.length || typedBuffer === TYPED_CODE) {
        konamiIndex = 0
        typedBuffer = ''
        onUnlock()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onUnlock])
}

export default function CyberpunkEasterEgg() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const particles = useMemo(
    () =>
      glyphs.map((glyph, index) => ({
        delay: index * 0.11,
        glyph,
        left: `${8 + ((index * 17) % 86)}%`,
        top: `${12 + ((index * 29) % 72)}%`,
      })),
    [],
  )

  const unlockEasterEgg = useCallback(() => setIsUnlocked(true), [])

  useEasterEggTrigger(unlockEasterEgg)

  useEffect(() => {
    if (!isUnlocked) return undefined

    const timeout = window.setTimeout(() => setIsUnlocked(false), EASTER_EGG_DURATION_MS)
    return () => window.clearTimeout(timeout)
  }, [isUnlocked])

  return (
    <AnimatePresence>
      {isUnlocked && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-live="polite"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="status"
          style={overlayStyles}
          transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { opacity: [0.18, 0.42, 0.18], y: ['3%', '-2%', '3%'] }}
            style={gridStyles}
            transition={{ duration: 2.8, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
          />

          {!shouldReduceMotion &&
            particles.map((particle) => (
              <motion.span
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.8, 0.4], y: ['14px', '-46px'] }}
                key={`${particle.glyph}-${particle.left}-${particle.top}`}
                style={{
                  color: particle.glyph === '⬡' ? '#00fff0' : '#ff75d8',
                  fontSize: 'clamp(1rem, 3vw, 2rem)',
                  left: particle.left,
                  position: 'absolute',
                  textShadow: '0 0 16px currentColor',
                  top: particle.top,
                }}
                transition={{ delay: particle.delay, duration: 1.7, ease: 'easeOut', repeat: 2 }}
              >
                {particle.glyph}
              </motion.span>
            ))}

          <motion.section
            animate={
              shouldReduceMotion ? undefined : { filter: ['hue-rotate(0deg)', 'hue-rotate(18deg)', 'hue-rotate(0deg)'] }
            }
            initial={shouldReduceMotion ? undefined : { scale: 0.92, y: 18 }}
            style={panelStyles}
            transition={{ damping: 18, stiffness: 140, type: 'spring' }}
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { textShadow: ['0 0 16px #00fff0', '0 0 34px #ff75d8', '0 0 16px #00fff0'] }
              }
              style={sigilStyles}
              transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, repeatType: 'mirror' }}
            >
              ᓚᘏᗢ
            </motion.div>
            <h2 style={titleStyles}>Cybercat mode unlocked</h2>
            <p style={bodyStyles}>
              Root access granted to the SilkCircuit. Neon familiars deployed. Reality layer successfully purr-hacked.
            </p>
            <code style={codeStyles}>secret accepted :: ↑ ↑ ↓ ↓ ← → ← → b a</code>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
