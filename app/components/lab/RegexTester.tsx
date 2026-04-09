'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { FaCircleCheck, FaCircleXmark, FaClock, FaFlask, FaHashtag, FaTriangleExclamation } from 'react-icons/fa6'
import { css } from '../../../styled-system/css'
import type { RegexTestCase } from '../../lib/regex-nightmares/types'

const GROUP_COLORS = [
  '#00fff0',
  '#ff75d8',
  '#c084fc',
  '#50fa7b',
  '#ffb74d',
  '#f1fa8c',
  '#64b5f6',
  '#ef5350',
  '#4db6ac',
  '#ba68c8',
]

const containerStyles = css`
  margin: var(--space-6) 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 117, 216, 0.12);
  background: rgba(8, 8, 16, 0.8);
`

const headerStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 117, 216, 0.05);
  border-bottom: 1px solid rgba(255, 117, 216, 0.08);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: rgba(255, 117, 216, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  svg { font-size: 1rem; }
`

const bodyStyles = css`
  padding: var(--space-4) var(--space-5);
`

const inputWrapperStyles = css`
  position: relative;
  margin-bottom: var(--space-4);
`

const inputStyles = css`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  padding-right: var(--space-10);
  font-family: var(--font-mono);
  font-size: 1.4rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 117, 216, 0.4);
    box-shadow: 0 0 20px rgba(255, 117, 216, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
    font-style: italic;
  }
`

const resultBadgeStyles = css`
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: var(--font-bold);
`

const matchHighlightStyles = css`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  padding: var(--space-3) var(--space-4);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
  line-height: 1.8;
  word-break: break-all;
  white-space: pre-wrap;
  min-height: 40px;
  margin-bottom: var(--space-3);
`

const statsRowStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.4);

  span {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  svg { font-size: 0.9rem; }
`

const groupLegendStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
`

const groupTagStyles = css`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 1rem;
  border: 1px solid;
`

const presetsLabelStyles = css`
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-2);
`

const presetsGridStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`

const presetButtonStyles = css`
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--space-2);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
  }
`

const warningStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(241, 250, 140, 0.05);
  border: 1px solid rgba(241, 250, 140, 0.15);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: #f1fa8c;
  margin-bottom: var(--space-4);
`

interface RegexTesterProps {
  regex: string
  jsCompatible: boolean
  jsRegex?: string
  flags?: string
  testCases: RegexTestCase[]
}

export default function RegexTester({
  regex: rawRegex,
  jsCompatible,
  jsRegex,
  flags = '',
  testCases,
}: RegexTesterProps) {
  const [input, setInput] = useState('')

  const compiledRegex = useMemo(() => {
    if (!jsCompatible && !jsRegex) return null
    try {
      const pattern = jsRegex ?? rawRegex
      return new RegExp(pattern, flags || 'g')
    } catch {
      return null
    }
  }, [rawRegex, jsRegex, jsCompatible, flags])

  const { matchResult, execTimeUs } = useMemo(() => {
    if (!input || !compiledRegex) return { execTimeUs: 0, groupNames: [] as string[], matchResult: null }
    try {
      const re = new RegExp(compiledRegex.source, compiledRegex.flags)
      const matches: { end: number; groups: string[]; start: number }[] = []
      const names: Set<string> = new Set()
      let guard = 0

      const t0 = performance.now()
      for (let m = re.exec(input); m !== null && guard < 100; m = re.exec(input)) {
        const groups = m.slice(1).filter(Boolean)
        for (const g of groups) names.add(g)
        matches.push({ end: m.index + m[0].length, groups, start: m.index })
        if (m[0].length === 0) re.lastIndex++
        guard++
      }
      const t1 = performance.now()

      return {
        execTimeUs: Math.round((t1 - t0) * 1000),
        groupNames: Array.from(names),
        matchResult: matches,
      }
    } catch {
      return { execTimeUs: 0, groupNames: [], matchResult: null }
    }
  }, [input, compiledRegex])

  const fullMatch = useMemo(() => {
    if (!input || !compiledRegex) return false
    try {
      const anchoredSource = compiledRegex.source.replace(/^[\^]/, '').replace(/[$]$/, '')
      const fullRe = new RegExp(`^(?:${anchoredSource})$`, flags?.replace('g', '') || '')
      return fullRe.test(input)
    } catch {
      return false
    }
  }, [input, compiledRegex, flags])

  const renderHighlighted = useCallback(() => {
    if (!input)
      return <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>type to see matches...</span>
    if (!matchResult || matchResult.length === 0) {
      return <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{input}</span>
    }

    const parts: React.ReactNode[] = []
    let pos = 0
    for (let mi = 0; mi < matchResult.length; mi++) {
      const match = matchResult[mi]
      if (match.start > pos) {
        parts.push(
          <span key={`t-${pos}`} style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {input.slice(pos, match.start)}
          </span>,
        )
      }
      const color = GROUP_COLORS[mi % GROUP_COLORS.length]
      parts.push(
        <span
          key={`m-${match.start}`}
          style={{
            background: `${color}22`,
            borderBottom: `2px solid ${color}`,
            borderRadius: '2px',
            color,
            padding: '0 2px',
            textShadow: `0 0 8px ${color}66`,
          }}
        >
          {input.slice(match.start, match.end)}
        </span>,
      )
      pos = match.end
    }
    if (pos < input.length) {
      parts.push(
        <span key={`t-${pos}`} style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {input.slice(pos)}
        </span>,
      )
    }
    return parts
  }, [input, matchResult])

  const matchCount = matchResult?.length ?? 0

  return (
    <div className={containerStyles}>
      <div className={headerStyles}>
        <FaFlask /> Try It
      </div>
      <div className={bodyStyles}>
        {!compiledRegex && (
          <div className={warningStyles}>
            <FaTriangleExclamation />
            This regex uses PCRE features that can't be emulated in JavaScript. Interactive testing is disabled.
          </div>
        )}

        <div className={inputWrapperStyles}>
          <input
            className={inputStyles}
            disabled={!compiledRegex}
            onChange={(e) => setInput(e.target.value)}
            placeholder={compiledRegex ? 'Type a test string...' : 'JS-incompatible regex'}
            type="text"
            value={input}
          />
          <AnimatePresence>
            {input && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className={resultBadgeStyles}
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
              >
                {fullMatch ? (
                  <span style={{ alignItems: 'center', color: '#50fa7b', display: 'flex', gap: '4px' }}>
                    <FaCircleCheck /> Match
                  </span>
                ) : (
                  <span style={{ alignItems: 'center', color: '#ff6363', display: 'flex', gap: '4px' }}>
                    <FaCircleXmark /> No match
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {compiledRegex && <div className={matchHighlightStyles}>{renderHighlighted()}</div>}

        {input && matchResult && (
          <motion.div animate={{ opacity: 1 }} className={statsRowStyles} initial={{ opacity: 0 }}>
            <span style={{ color: matchCount > 0 ? '#50fa7b' : '#ff6363' }}>
              <FaHashtag /> {matchCount} match{matchCount !== 1 ? 'es' : ''}
            </span>
            <span>
              <FaClock /> {execTimeUs < 1000 ? `${execTimeUs}µs` : `${(execTimeUs / 1000).toFixed(1)}ms`}
            </span>
            {matchResult.some((m) => m.groups.length > 0) && (
              <span style={{ color: '#c084fc' }}>
                {matchResult[0].groups.length} group{matchResult[0].groups.length !== 1 ? 's' : ''}
              </span>
            )}
          </motion.div>
        )}

        {matchResult?.some((m) => m.groups.length > 0) && (
          <div className={groupLegendStyles}>
            {matchResult[0].groups.map((g, i) => (
              <div
                className={groupTagStyles}
                key={i}
                style={{
                  borderColor: `${GROUP_COLORS[i % GROUP_COLORS.length]}40`,
                  color: GROUP_COLORS[i % GROUP_COLORS.length],
                }}
              >
                <span style={{ opacity: 0.5 }}>\{i + 1}</span> {g.length > 20 ? `${g.slice(0, 20)}…` : g}
              </div>
            ))}
          </div>
        )}

        {testCases.length > 0 && (
          <>
            <div className={presetsLabelStyles}>Test cases</div>
            <div className={presetsGridStyles}>
              {testCases.map((tc) => (
                <motion.button
                  className={presetButtonStyles}
                  key={tc.input}
                  onClick={() => setInput(tc.input)}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tc.shouldMatch ? (
                    <FaCircleCheck style={{ color: '#50fa7b', fontSize: '0.9rem' }} />
                  ) : (
                    <FaCircleXmark style={{ color: '#ff6363', fontSize: '0.9rem' }} />
                  )}
                  {tc.label}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
