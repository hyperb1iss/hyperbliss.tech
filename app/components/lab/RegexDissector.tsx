'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaCopy, FaMicroscope, FaPlay, FaStop } from 'react-icons/fa6'
import { css } from '../../../styled-system/css'
import type { RegexSegment, SegmentColor } from '../../lib/regex-nightmares/types'

const SEGMENT_COLORS: Record<SegmentColor, { bg: string; glow: string; text: string }> = {
  cyan: { bg: 'rgba(0, 255, 240, 0.15)', glow: 'rgba(0, 255, 240, 0.6)', text: '#00fff0' },
  green: { bg: 'rgba(80, 250, 123, 0.15)', glow: 'rgba(80, 250, 123, 0.6)', text: '#50fa7b' },
  orange: { bg: 'rgba(255, 183, 77, 0.15)', glow: 'rgba(255, 183, 77, 0.6)', text: '#ffb74d' },
  pink: { bg: 'rgba(255, 117, 216, 0.15)', glow: 'rgba(255, 117, 216, 0.6)', text: '#ff75d8' },
  purple: { bg: 'rgba(162, 89, 255, 0.15)', glow: 'rgba(162, 89, 255, 0.6)', text: '#c084fc' },
  yellow: { bg: 'rgba(241, 250, 140, 0.15)', glow: 'rgba(241, 250, 140, 0.6)', text: '#f1fa8c' },
}

const containerStyles = css`
  margin: var(--space-6) 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(0, 255, 240, 0.12);
  background: rgba(8, 8, 16, 0.8);

  &:focus-within {
    border-color: rgba(0, 255, 240, 0.25);
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.08);
  }
`

const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: rgba(0, 255, 240, 0.05);
  border-bottom: 1px solid rgba(0, 255, 240, 0.08);
`

const headerLeftStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: rgba(0, 255, 240, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  svg { font-size: 1rem; }
`

const copyButtonStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 255, 240, 0.15);
  background: transparent;
  color: rgba(0, 255, 240, 0.5);
  font-family: var(--font-mono);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #00fff0;
    border-color: rgba(0, 255, 240, 0.4);
    background: rgba(0, 255, 240, 0.05);
  }

  svg { font-size: 0.85rem; }
`

const regexDisplayStyles = css`
  padding: var(--space-5) var(--space-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 1.4rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 255, 240, 0.2) transparent;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 240, 0.2);
    border-radius: 2px;
  }
`

const explanationPanelStyles = css`
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid rgba(0, 255, 240, 0.08);
  background: rgba(0, 0, 0, 0.3);
  min-height: 120px;
`

const segmentLabelStyles = css`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: var(--font-bold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: var(--space-2);
`

const segmentDescStyles = css`
  font-family: var(--font-body);
  font-size: 1.4rem;
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
`

const segmentPatternStyles = css`
  font-family: var(--font-mono);
  font-size: 1.2rem;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: var(--space-2);
  display: inline-block;
  word-break: break-all;
`

const controlsStyles = css`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 48px;
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid rgba(0, 255, 240, 0.06);
  background: rgba(0, 0, 0, 0.2);
`

const navButtonStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 255, 240, 0.2);
  background: rgba(0, 255, 240, 0.05);
  color: #00fff0;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(0, 255, 240, 0.12);
    border-color: rgba(0, 255, 240, 0.4);
    text-shadow: 0 0 8px rgba(0, 255, 240, 0.5);
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

const autoPlayButtonStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 117, 216, 0.25);
  background: rgba(255, 117, 216, 0.08);
  color: #ff75d8;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 117, 216, 0.15);
    border-color: rgba(255, 117, 216, 0.4);
  }

  svg { font-size: 0.9rem; }
`

const stepIndicatorStyles = css`
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`

const dotTrackStyles = css`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) 0;
`

const progressBarStyles = css`
  height: 2px;
  background: rgba(0, 255, 240, 0.1);
  overflow: hidden;
`

const keyHintStyles = css`
  font-family: var(--font-mono);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: var(--space-1);

  kbd {
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

interface RegexDissectorProps {
  regex: string
  segments: RegexSegment[]
}

export default function RegexDissector({ regex, segments }: RegexDissectorProps) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isActive = activeIndex >= 0

  const handlePrev = useCallback(() => {
    setAutoPlay(false)
    setActiveIndex((i) => Math.max(0, i - 1))
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((i) => {
      if (i >= segments.length - 1) {
        setAutoPlay(false)
        return i
      }
      return i + 1
    })
  }, [segments.length])

  const handleSegmentClick = useCallback((index: number) => {
    setAutoPlay(false)
    setActiveIndex(index)
  }, [])

  const handleStart = useCallback(() => {
    setActiveIndex(0)
  }, [])

  const handleReset = useCallback(() => {
    setAutoPlay(false)
    setActiveIndex(-1)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(regex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [regex])

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => {
      if (!prev && activeIndex < 0) setActiveIndex(0)
      return !prev
    })
  }, [activeIndex])

  useEffect(() => {
    if (!autoPlay || !isActive) return
    const timer = setInterval(() => {
      setActiveIndex((i) => {
        if (i >= segments.length - 1) {
          setAutoPlay(false)
          return i
        }
        return i + 1
      })
    }, 2800)
    return () => clearInterval(timer)
  }, [autoPlay, isActive, segments.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleKey = (e: KeyboardEvent) => {
      if (!isActive) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setAutoPlay(false)
        setActiveIndex((i) => Math.min(segments.length - 1, i + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setAutoPlay(false)
        setActiveIndex((i) => Math.max(0, i - 1))
      } else if (e.key === 'Escape') {
        setAutoPlay(false)
        setActiveIndex(-1)
      }
    }
    el.addEventListener('keydown', handleKey)
    return () => el.removeEventListener('keydown', handleKey)
  }, [isActive, segments.length])

  const buildSegmentSpans = () => {
    const spans: React.ReactNode[] = []
    let pos = 0

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      const idx = regex.indexOf(seg.pattern, pos)

      if (idx > pos) {
        const gap = regex.slice(pos, idx)
        spans.push(
          <span key={`gap-${i}`} style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            {gap}
          </span>,
        )
      }

      const colors = SEGMENT_COLORS[seg.color]
      const isCurrent = activeIndex === i
      const isDimmed = isActive && !isCurrent

      spans.push(
        <motion.span
          animate={{
            opacity: isDimmed ? 0.3 : 1,
            scale: isCurrent ? 1.02 : 1,
          }}
          key={`seg-${i}`}
          onClick={() => handleSegmentClick(i)}
          style={{
            background: isCurrent ? colors.bg : 'transparent',
            borderBottom: !isActive ? `1px dashed ${colors.text}40` : isCurrent ? `1px solid ${colors.text}` : 'none',
            borderRadius: '3px',
            color: colors.text,
            cursor: 'pointer',
            display: 'inline',
            padding: isCurrent ? '1px 3px' : '0',
            textShadow: isCurrent ? `0 0 10px ${colors.glow}` : 'none',
            transition: 'all 0.3s ease',
          }}
          title={seg.label}
          transition={{ duration: 0.3 }}
        >
          {seg.pattern}
        </motion.span>,
      )

      pos = idx >= 0 ? idx + seg.pattern.length : pos + seg.pattern.length
    }

    if (pos < regex.length) {
      spans.push(
        <span key="tail" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          {regex.slice(pos)}
        </span>,
      )
    }

    return spans
  }

  const activeSegment = isActive ? segments[activeIndex] : null
  const activeColors = activeSegment ? SEGMENT_COLORS[activeSegment.color] : null

  return (
    <div className={containerStyles} ref={containerRef} role="application">
      <div className={headerStyles}>
        <div className={headerLeftStyles}>
          <FaMicroscope /> Dissection
        </div>
        <motion.button className={copyButtonStyles} onClick={handleCopy} type="button" whileTap={{ scale: 0.95 }}>
          <FaCopy /> {copied ? 'Copied!' : 'Copy regex'}
        </motion.button>
      </div>

      {isActive && (
        <div className={progressBarStyles}>
          <motion.div
            animate={{ width: `${((activeIndex + 1) / segments.length) * 100}%` }}
            style={{
              background: activeColors
                ? `linear-gradient(90deg, ${activeColors.text}, ${activeColors.glow})`
                : '#00fff0',
              height: '100%',
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      )}

      <div className={regexDisplayStyles}>{buildSegmentSpans()}</div>

      <AnimatePresence mode="wait">
        {isActive && activeSegment && activeColors && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={explanationPanelStyles}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={activeIndex}
            transition={{ duration: 0.2 }}
          >
            <div className={segmentPatternStyles} style={{ color: activeColors.text }}>
              {activeSegment.pattern}
            </div>
            <div className={segmentLabelStyles} style={{ color: activeColors.text }}>
              {activeSegment.label}
            </div>
            <div className={segmentDescStyles}>{activeSegment.description}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {isActive && (
        <div className={dotTrackStyles}>
          {segments.map((seg, i) => (
            <motion.div
              animate={{
                background:
                  i === activeIndex
                    ? SEGMENT_COLORS[seg.color].text
                    : i < activeIndex
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                scale: i === activeIndex ? 1.4 : 1,
              }}
              key={i}
              onClick={() => handleSegmentClick(i)}
              style={{
                borderRadius: '50%',
                cursor: 'pointer',
                height: 6,
                width: 6,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      )}

      <div className={controlsStyles}>
        {/* Primary action — always in the same spot */}
        <motion.button
          className={navButtonStyles}
          onClick={!isActive ? handleStart : activeIndex >= segments.length - 1 ? handleReset : handleNext}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {!isActive ? (
            <>
              <FaMicroscope /> Step through ({segments.length} parts)
            </>
          ) : activeIndex >= segments.length - 1 ? (
            <>Done</>
          ) : (
            <>
              Next <FaChevronRight />
            </>
          )}
        </motion.button>

        {/* Center: step counter */}
        <span className={stepIndicatorStyles}>
          {isActive ? (
            <>
              {activeIndex + 1} / {segments.length}
            </>
          ) : (
            <div className={keyHintStyles}>
              <kbd>←</kbd>
              <kbd>→</kbd> navigate
            </div>
          )}
        </span>

        {/* Right: secondary controls */}
        <div style={{ alignItems: 'center', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {isActive && (
            <>
              <motion.button
                className={navButtonStyles}
                disabled={activeIndex === 0}
                onClick={handlePrev}
                type="button"
                whileTap={{ scale: 0.95 }}
              >
                <FaChevronLeft />
              </motion.button>
              <motion.button
                className={autoPlayButtonStyles}
                onClick={toggleAutoPlay}
                type="button"
                whileTap={{ scale: 0.95 }}
              >
                {autoPlay ? (
                  <>
                    <FaStop /> Pause
                  </>
                ) : (
                  <>
                    <FaPlay /> Auto
                  </>
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
