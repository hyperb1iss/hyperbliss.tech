'use client'

// ⌘K command palette (T4.1). A fuzzy launcher over the registered commands,
// following the ARIA combobox/listbox pattern. Selecting an item runs it in
// the terminal.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { styled } from '../../../styled-system/jsx'
import type { CommandRegistry } from './types'

/** Case-insensitive subsequence match — the chars of `q` appear in order. */
function fuzzy(q: string, text: string): boolean {
  if (q.length === 0) return true
  const query = q.toLowerCase()
  const hay = text.toLowerCase()
  let i = 0
  for (const ch of hay) {
    if (ch === query[i]) i += 1
    if (i === query.length) return true
  }
  return false
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 24vh;
  background: rgba(5, 3, 8, 0.7);
`

const Panel = styled.div`
  position: relative;
  width: min(600px, 92vw);
  max-height: 56vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
  font-size: 1.4rem;
  background: #0c0815;
  border: 1px solid rgba(244, 240, 255, 0.2);
  border-radius: 1.4rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
  overflow: hidden;

  /* One crisp line of the brand gradient across the top edge. */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
    background: linear-gradient(90deg, #e135ff, #ff6ac1 45%, #80ffea);
  }
`

const Field = styled.input`
  width: 100%;
  padding: 1.8rem 2rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(244, 240, 255, 0.1);
  outline: none;
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 1.6rem;
  caret-color: #80ffea;

  &::placeholder {
    color: #8f86a3;
  }
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.8rem;
  overflow-y: auto;
`

const Item = styled.li`
  display: flex;
  align-items: baseline;
  gap: 1.4rem;
  padding: 0.8rem 1.2rem;
  border-radius: 0.8rem;
  cursor: pointer;

  &[aria-selected='true'] {
    background: rgba(128, 255, 234, 0.1);
  }
  & .name {
    color: #80ffea;
  }
  & .sum {
    color: #d6cfe6;
    font-family: var(--font-body);
    font-weight: 300;
  }
  & .grp {
    margin-left: auto;
    color: #8f86a3;
    font-size: 1.2rem;
  }
`

const Empty = styled.div`
  padding: 1.6rem 2rem;
  color: #8f86a3;
`

export interface CommandPaletteProps {
  registry: CommandRegistry
  open: boolean
  onClose: () => void
  onRun: (command: string) => void
}

export default function CommandPalette({ registry, open, onClose, onRun }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const results = useMemo(() => {
    if (!open) return []
    return registry.visible().filter((c) => fuzzy(query, `${c.name} ${c.summary}`))
  }, [open, query, registry])

  // Reset + focus when opened.
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)))
  }, [results.length])

  const choose = useCallback(
    (index: number) => {
      const cmd = results[index]
      if (cmd) {
        onRun(cmd.name)
        onClose()
      }
    },
    [results, onRun, onClose],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        choose(active)
      }
    },
    [active, results.length, choose, onClose],
  )

  if (!open) return null

  const optionId = (i: number) => `${listId}-opt-${i}`

  return (
    <Backdrop
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Panel aria-label="Command palette" aria-modal="true" role="dialog">
        <Field
          aria-activedescendant={results.length > 0 ? optionId(active) : undefined}
          aria-controls={listId}
          aria-expanded="true"
          aria-label="Search commands"
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Run a command…"
          ref={inputRef}
          role="combobox"
          spellCheck={false}
          type="text"
          value={query}
        />
        {results.length === 0 ? (
          <Empty>no matching command</Empty>
        ) : (
          <List aria-label="Commands" id={listId} role="listbox">
            {results.map((c, i) => (
              <Item
                aria-selected={i === active}
                id={optionId(i)}
                key={c.name}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(i)
                }}
                onMouseEnter={() => setActive(i)}
                role="option"
              >
                <span className="name">{c.name}</span>
                <span className="sum">{c.summary}</span>
                {c.group && <span className="grp">{c.group}</span>}
              </Item>
            ))}
          </List>
        )}
      </Panel>
    </Backdrop>
  )
}
