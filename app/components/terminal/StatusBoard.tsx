// The console's landing display: the name on the LED wall and the one line
// that says what the company makes. Light is what Hyperbliss ships, so the
// welcome is a toy made of it instead of a paragraph about it.

import { styled } from '../../../styled-system/jsx'
import LedSign from './LedSign'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.2rem 0 1.6rem;
`

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--term-soft);
`

export default function StatusBoard() {
  return (
    <Wrap>
      <LedSign label="Hyperbliss" text="HYPERBLISS" />
      <Sub>Open source tools for light, memory, and the terminal.</Sub>
    </Wrap>
  )
}
