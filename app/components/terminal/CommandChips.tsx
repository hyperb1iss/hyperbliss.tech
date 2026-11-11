'use client'

// Quick command keys inside the console frame, under the prompt. Real <button>s — the primary
// mobile navigation, so visitors never need the soft keyboard (§5.7).

import { styled } from '../../../styled-system/jsx'
import { chipCategory } from './analytics'

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1.2rem 2rem 1.4rem;

  @media (max-width: 640px) {
    padding: 1.2rem 1.4rem 1.4rem;
  }
`

const Chip = styled.button`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--term-soft);
  background: rgba(244, 240, 255, 0.05);
  border: 1px solid rgba(244, 240, 255, 0.16);
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  min-height: 36px;
  transition:
    color var(--duration-fast) var(--ease-silk),
    border-color var(--duration-fast) var(--ease-silk),
    background var(--duration-fast) var(--ease-silk),
    transform var(--duration-fast) var(--ease-silk);

  &:hover,
  &:focus-visible {
    color: #ffffff;
    border-color: var(--term-accent);
    background: rgba(128, 255, 234, 0.1);
    outline: none;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }
`

const DEFAULT_CHIPS = ['help', 'projects', 'blog', 'lab', 'about', 'contact', 'led hello <3', 'theme matrix']

export interface CommandChipsProps {
  commands?: string[]
  onRun: (command: string) => void
  onCategory?: (category: string) => void
}

export default function CommandChips({ commands = DEFAULT_CHIPS, onRun, onCategory }: CommandChipsProps) {
  return (
    <Row aria-label="Quick commands">
      {commands.map((command) => (
        <Chip
          key={command}
          onClick={() => {
            onCategory?.(chipCategory(command))
            onRun(command)
          }}
          type="button"
        >
          {command}
        </Chip>
      ))}
    </Row>
  )
}
