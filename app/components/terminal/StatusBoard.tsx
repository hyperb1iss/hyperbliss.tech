// The console's landing display: the name on an LED wall. Every lit cell
// rides one color wave (the led-wave keyframes in globals.css, offset per
// column and row), and any cell flashes white under the pointer and fades
// back, so the sign can be painted on. Light is what the company makes, so
// the welcome is a toy made of it instead of a paragraph about it.

import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'

// A 5x7 dot-matrix face, only the letters the sign needs.
const GLYPHS: Record<string, string[]> = {
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
}

const WORD = 'HYPERBLISS'
const ROWS = 7

// One row of the wall: each letter's row, with a dark column between letters.
const rowBits = (row: number) =>
  [...WORD]
    .map((ch) => GLYPHS[ch][row])
    .join('0')
    .split('')

const CELLS = Array.from({ length: ROWS }, (_, row) =>
  rowBits(row).map((bit, col) => ({ col, id: `${row}-${col}`, lit: bit === '1', row })),
).flat()

const COLS = CELLS.length / ROWS

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.2rem 0 1.6rem;
`

const wallStyles = css`
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 2px;
  width: 100%;
  max-width: 76rem;

  @media (max-width: 640px) {
    gap: 1px;
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
    background: #e135ff;
    animation: led-wave 5s linear infinite;
  }

  &:hover {
    box-shadow: inset 0 0 0 2rem #ffffff;
    transition-duration: 0s;
  }
`

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1.5;
  color: #d6cfe6;
`

export default function StatusBoard() {
  return (
    <Wrap>
      <div aria-label="Hyperbliss" className={wallStyles} role="img" style={{ '--cols': COLS } as CSSProperties}>
        {CELLS.map((cell) => (
          <span
            className={cellStyles}
            data-lit={cell.lit}
            key={cell.id}
            style={cell.lit ? { animationDelay: `${-(cell.col * 0.085 + cell.row * 0.06).toFixed(3)}s` } : undefined}
          />
        ))}
      </div>
      <Sub>Open source tools for light, memory, and the terminal.</Sub>
    </Wrap>
  )
}
