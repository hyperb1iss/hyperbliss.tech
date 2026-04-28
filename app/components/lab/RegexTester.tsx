'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { FaCircleCheck, FaCircleXmark, FaClock, FaFlask, FaHashtag, FaTriangleExclamation } from 'react-icons/fa6'
import { css } from '../../../styled-system/css'
import { evaluateRegexInput, getRegexEngineLabel } from '../../lib/regex-nightmares/evaluator'
import type { RegexMatchMode, RegexTestCase } from '../../lib/regex-nightmares/types'

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

const modeNoticeStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: rgba(0, 255, 240, 0.04);
  border: 1px solid rgba(0, 255, 240, 0.12);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: rgba(0, 255, 240, 0.72);
  margin-bottom: var(--space-4);
`

const caseVerdictStyles = css`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  margin-bottom: var(--space-3);
  border: 1px solid;
`

interface RegexTesterProps {
  regex: string
  jsCompatible: boolean
  jsRegex?: string
  flags?: string
  testCases: RegexTestCase[]
  jsValidator?: (input: string) => boolean
  matchMode?: RegexMatchMode
  maxInputLength?: number
}

export default function RegexTester({
  regex: rawRegex,
  jsCompatible,
  jsRegex,
  flags = '',
  testCases,
  jsValidator,
  matchMode = 'full',
  maxInputLength,
}: RegexTesterProps) {
  const [input, setInput] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const hasValidator = Boolean(jsValidator)
  const canRun = jsCompatible || Boolean(jsRegex) || hasValidator

  const syntaxError = useMemo(() => {
    if (!canRun || hasValidator) return null
    return evaluateRegexInput({
      flags,
      input: '',
      jsRegex,
      matchMode: 'contains',
      regex: rawRegex,
    }).error
  }, [rawRegex, jsRegex, canRun, flags, hasValidator])

  const engineLabel = useMemo(
    () => getRegexEngineLabel({ jsRegex, jsValidator, regex: rawRegex }),
    [rawRegex, jsRegex, jsValidator],
  )

  const evaluation = useMemo(() => {
    if (!hasInteracted || !canRun || syntaxError) return null
    return evaluateRegexInput({
      flags,
      input,
      jsRegex,
      jsValidator,
      matchMode,
      maxInputLength,
      regex: rawRegex,
    })
  }, [rawRegex, jsRegex, flags, input, canRun, hasInteracted, jsValidator, matchMode, maxInputLength, syntaxError])

  const selectedCase = useMemo(() => {
    if (!hasInteracted) return null
    return testCases.find((tc) => tc.input === input) ?? null
  }, [hasInteracted, input, testCases])

  const renderHighlighted = useCallback(() => {
    if (!hasInteracted)
      return <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>type to see matches...</span>
    if (!evaluation || evaluation.matches.length === 0) {
      return <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{input}</span>
    }

    const parts: React.ReactNode[] = []
    let pos = 0
    for (let mi = 0; mi < evaluation.matches.length; mi++) {
      const match = evaluation.matches[mi]
      if (match.start > pos) {
        parts.push(
          <span key={`t-${mi}`} style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {input.slice(pos, match.start)}
          </span>,
        )
      }
      const color = GROUP_COLORS[mi % GROUP_COLORS.length]
      const isZeroWidth = match.start === match.end
      parts.push(
        <span
          key={`m-${mi}`}
          style={{
            background: `${color}22`,
            borderBottom: `2px solid ${color}`,
            borderRadius: '2px',
            color,
            padding: isZeroWidth ? '0 4px' : '0 2px',
            textShadow: `0 0 8px ${color}66`,
          }}
          title={isZeroWidth ? `zero-width match at index ${match.start}` : undefined}
        >
          {isZeroWidth ? '∅' : input.slice(match.start, match.end)}
        </span>,
      )
      pos = match.end
    }
    if (pos < input.length) {
      parts.push(
        <span key="tail" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {input.slice(pos)}
        </span>,
      )
    }
    return parts
  }, [input, evaluation, hasInteracted])

  const matchCount = evaluation?.matches.length ?? 0
  const firstMatchWithCaptures = evaluation?.matches.find((match) => match.captures.length > 0)
  const visibleCaptures = firstMatchWithCaptures?.captures.filter((capture) => capture.value !== undefined) ?? []
  const namedCaptures = firstMatchWithCaptures?.namedCaptures ?? {}
  const caseAgrees = Boolean(selectedCase && evaluation && selectedCase.shouldMatch === evaluation.isMatch)
  const passLabel = matchMode === 'contains' ? 'Found' : 'Full match'
  const failLabel = matchMode === 'contains' ? 'Not found' : 'No full match'

  return (
    <div className={containerStyles}>
      <div className={headerStyles}>
        <FaFlask /> Try It
      </div>
      <div className={bodyStyles}>
        {(!canRun || syntaxError) && (
          <div className={warningStyles}>
            <FaTriangleExclamation />
            {syntaxError ??
              "This regex uses PCRE features that can't be emulated in JavaScript. Interactive testing is disabled."}
          </div>
        )}

        {canRun && !syntaxError && engineLabel !== 'JavaScript regex' && (
          <div className={modeNoticeStyles}>
            <FaTriangleExclamation />
            Testing uses a {engineLabel.toLowerCase()} because the displayed pattern is not native ECMAScript.
          </div>
        )}

        {testCases.length > 0 && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div className={presetsLabelStyles}>Test cases</div>
            <div className={presetsGridStyles}>
              {testCases.map((tc) => (
                <motion.button
                  className={presetButtonStyles}
                  key={`${tc.label}-${tc.input}`}
                  onClick={() => {
                    setHasInteracted(true)
                    setInput(tc.input)
                  }}
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
          </div>
        )}

        <div className={inputWrapperStyles}>
          <input
            className={inputStyles}
            disabled={!canRun || Boolean(syntaxError)}
            onChange={(e) => {
              setHasInteracted(true)
              setInput(e.target.value)
            }}
            placeholder={
              hasValidator
                ? 'Type a test string (JS validator)...'
                : canRun && !syntaxError
                  ? 'Type a test string...'
                  : 'JS-incompatible regex'
            }
            type="text"
            value={input}
          />
          <AnimatePresence>
            {hasInteracted && evaluation && !evaluation.skippedReason && !evaluation.error && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className={resultBadgeStyles}
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
              >
                {evaluation.isMatch ? (
                  <span style={{ alignItems: 'center', color: '#50fa7b', display: 'flex', gap: '4px' }}>
                    <FaCircleCheck /> {passLabel}
                  </span>
                ) : (
                  <span style={{ alignItems: 'center', color: '#ff6363', display: 'flex', gap: '4px' }}>
                    <FaCircleXmark /> {failLabel}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {canRun && !syntaxError && hasInteracted && evaluation && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {evaluation.skippedReason && (
                <div className={warningStyles}>
                  <FaTriangleExclamation />
                  {evaluation.skippedReason}
                </div>
              )}

              {evaluation.error && (
                <div className={warningStyles}>
                  <FaTriangleExclamation />
                  {evaluation.error}
                </div>
              )}

              {selectedCase && !evaluation.skippedReason && !evaluation.error && (
                <div
                  className={caseVerdictStyles}
                  style={{
                    background: caseAgrees ? 'rgba(80, 250, 123, 0.06)' : 'rgba(255, 99, 99, 0.06)',
                    borderColor: caseAgrees ? 'rgba(80, 250, 123, 0.2)' : 'rgba(255, 99, 99, 0.2)',
                    color: caseAgrees ? '#50fa7b' : '#ff6363',
                  }}
                >
                  {caseAgrees ? <FaCircleCheck /> : <FaCircleXmark />}
                  Expected {selectedCase.shouldMatch ? passLabel.toLowerCase() : failLabel.toLowerCase()}, engine{' '}
                  {caseAgrees ? 'agrees' : 'disagrees'}
                </div>
              )}

              <div className={matchHighlightStyles}>{renderHighlighted()}</div>

              {!evaluation.skippedReason && !evaluation.error && (
                <div className={statsRowStyles}>
                  <span style={{ color: matchCount > 0 ? '#50fa7b' : '#ff6363' }}>
                    <FaHashtag /> {matchCount} match{matchCount !== 1 ? 'es' : ''}
                  </span>
                  <span>
                    <FaClock />{' '}
                    {evaluation.execTimeUs < 1000
                      ? `${evaluation.execTimeUs}µs`
                      : `${(evaluation.execTimeUs / 1000).toFixed(1)}ms`}
                  </span>
                  {visibleCaptures.length > 0 && (
                    <span style={{ color: '#c084fc' }}>
                      {visibleCaptures.length} group{visibleCaptures.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span>{evaluation.matchMode === 'contains' ? 'search mode' : 'full-string mode'}</span>
                </div>
              )}

              {visibleCaptures.length > 0 && (
                <div className={groupLegendStyles}>
                  {visibleCaptures.map((capture, i) => (
                    <div
                      className={groupTagStyles}
                      key={capture.index}
                      style={{
                        borderColor: `${GROUP_COLORS[i % GROUP_COLORS.length]}40`,
                        color: GROUP_COLORS[i % GROUP_COLORS.length],
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>\{capture.index}</span>{' '}
                      {capture.value === ''
                        ? '(empty)'
                        : capture.value && capture.value.length > 20
                          ? `${capture.value.slice(0, 20)}…`
                          : capture.value}
                    </div>
                  ))}
                  {Object.entries(namedCaptures).map(([name, value], i) => (
                    <div
                      className={groupTagStyles}
                      key={name}
                      style={{
                        borderColor: `${GROUP_COLORS[(visibleCaptures.length + i) % GROUP_COLORS.length]}40`,
                        color: GROUP_COLORS[(visibleCaptures.length + i) % GROUP_COLORS.length],
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>{name}</span> {value || '(empty)'}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
