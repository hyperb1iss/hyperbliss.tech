'use client'

// Clickable command chips below the terminal. Real <button>s — the primary
// mobile navigation, so visitors never need the soft keyboard (§5.7).

import { styled } from '../../../styled-system/jsx'
import { chipCategory } from './analytics'

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  padding: var(--space-3) var(--space-2) 0;
`

const Chip = styled.button`
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: rgba(20, 20, 35, 0.7);
  border: 1px solid rgba(162, 89, 255, 0.35);
  border-radius: var(--radius-full);
  padding: var(--space-1-5) var(--space-4);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-silk);
  min-height: 36px;

  &::before {
    content: '$ ';
    color: var(--silk-circuit-cyan);
    opacity: 0.7;
  }

  &:hover,
  &:focus-visible {
    color: var(--text-primary);
    border-color: var(--silk-circuit-cyan);
    box-shadow: 0 0 14px rgba(0, 255, 240, 0.25);
    outline: none;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const DEFAULT_CHIPS = ['help', 'neofetch', 'projects', 'blog', 'now', 'contact', 'ssh hyperbliss.tech']

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
