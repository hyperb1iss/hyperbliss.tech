// Text on an LED wall. Every lit cell rides one color wave (the led-wave
// keyframes in globals.css, offset per column and row) after switching on
// column by column, and any cell flashes white under the pointer and fades
// back, so the wall can be painted on. Colors come from the console theme.

import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'

// A 5x7 dot-matrix face. The heart stands in for "<3".
const GLYPHS: Record<string, string[]> = {
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
  '?': ['01110', '10001', '00001', '00010', '00100', '00000', '00100'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00000', '00100'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '♥': ['00000', '01010', '11111', '11111', '01110', '00100', '00000'],
}

const ROWS = 7
/** Longest line the wall holds before it wraps, and the most it will show. */
const LINE_CHARS = 12
const MAX_CHARS = 48

/** Uppercase, swap "<3" for the heart, and drop what the face cannot draw. */
export function ledText(raw: string): string {
  return [...raw.toUpperCase().replaceAll('<3', '♥')]
    .filter((ch) => ch in GLYPHS)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CHARS)
}

/** Break on words so each line fits the wall; a longer word is cut to fit. */
export function ledLines(text: string, lineChars = LINE_CHARS): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    let rest = word
    while (rest.length > lineChars) {
      if (line) lines.push(line)
      lines.push(rest.slice(0, lineChars))
      rest = rest.slice(lineChars)
      line = ''
    }
    if (!rest) continue
    if (line && line.length + 1 + rest.length > lineChars) {
      lines.push(line)
      line = rest
    } else {
      line = line ? `${line} ${rest}` : rest
    }
  }
  if (line) lines.push(line)
  return lines
}

function cellsFor(line: string) {
  const rows = Array.from({ length: ROWS }, (_, row) =>
    [...line]
      .map((ch) => GLYPHS[ch][row])
      .join('0')
      .split(''),
  )
  const cols = rows[0].length
  const cells = rows.flatMap((bits, row) =>
    bits.map((bit, col) => ({ col, id: `${row}-${col}`, lit: bit === '1', row })),
  )
  return { cells, cols }
}

const stackStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.6rem 0;
`

const wallStyles = css`
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 2px;
  width: 100%;
  max-width: calc(var(--cols) * var(--cell, 1.3rem));

  @media (max-width: 640px) {
    gap: 1px;
  }
`

// A marquee: one long wall sliding right to left through its frame. The
// track is padded by the frame's width so the text enters from the right edge
// and leaves fully on the left (led-scroll in globals.css).
const frameStyles = css`
  overflow: hidden;
  padding: 0.6rem 0;
`

const trackStyles = css`
  display: flex;
  width: max-content;
  padding-left: 100%;
  animation: led-scroll var(--scroll-time, 12s) linear infinite;

  & > div {
    width: calc(var(--cols) * var(--cell, 1.1rem));
    max-width: none;
  }

  @media (prefers-reduced-motion: reduce) {
    padding-left: 0;
    animation: none;
  }
`

const cellStyles = css`
  aspect-ratio: 1;
  border-radius: 1px;
  background: rgba(244, 240, 255, 0.06);
  /* The white flash is an inset shadow, so it can sit over the animated
     background: instant under the pointer, a slow fade once it leaves. */
  box-shadow: inset 0 0 0 0 #ffffff;
  transition: box-shadow 1.4s ease-out;

  &[data-lit='true'] {
    background-color: var(--led-1, #e135ff);
    animation:
      led-on 0.45s ease-out backwards,
      led-wave 5s linear infinite;
  }

  &:hover {
    box-shadow: inset 0 0 0 2rem #ffffff;
    transition-duration: 0s;
  }
`

interface LedSignProps {
  text: string
  /** Accessible name; defaults to the text itself. */
  label?: string
  /** Largest cell size, as a CSS length. Small signs (neofetch) pass less. */
  cell?: string
  /** Characters per line before the text wraps. */
  lineChars?: number
  /** One line sliding through its frame instead of wrapping. */
  scroll?: boolean
}

export default function LedSign({ text, label, cell, lineChars, scroll = false }: LedSignProps) {
  const clean = ledText(text)
  const lines = scroll ? [clean].filter(Boolean) : ledLines(clean, lineChars)
  const walls = (
    <>
      {lines.map((line, lineIndex) => {
        const { cells, cols } = cellsFor(line)
        return (
          <div
            className={wallStyles}
            key={`${lineIndex}-${line}`}
            style={{ '--cols': cols, ...(cell ? { '--cell': cell } : {}) } as CSSProperties}
          >
            {cells.map((c) => (
              <span
                className={cellStyles}
                data-lit={c.lit}
                key={c.id}
                style={
                  c.lit
                    ? {
                        animationDelay: `${(lineIndex * 0.12 + c.col * 0.012).toFixed(3)}s, ${-(c.col * 0.085 + c.row * 0.06).toFixed(3)}s`,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )
      })}
    </>
  )
  if (scroll) {
    // About eight cells a second, however long the text is.
    const seconds = Math.max(6, Math.round((clean.length * 6 + 40) / 8))
    return (
      <div aria-label={label ?? text} className={frameStyles} role="img">
        <div className={trackStyles} style={{ '--scroll-time': `${seconds}s` } as CSSProperties}>
          {walls}
        </div>
      </div>
    )
  }
  return (
    <div aria-label={label ?? text} className={stackStyles} role="img">
      {walls}
    </div>
  )
}
