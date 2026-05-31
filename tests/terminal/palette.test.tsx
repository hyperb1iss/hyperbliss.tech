// T4.1 — ⌘K command palette: fuzzy filter, keyboard nav, ARIA, run + close.

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CommandPalette from '@/components/terminal/CommandPalette'
import { Registry } from '@/components/terminal/registry'

function makeRegistry() {
  const r = new Registry()
  r.register({ group: 'meta', name: 'help', run: () => {}, summary: 'list commands' })
  r.register({ group: 'content', name: 'neofetch', run: () => {}, summary: 'system panel' })
  r.register({ group: 'content', name: 'projects', run: () => {}, summary: 'open-source work' })
  r.register({ hidden: true, name: 'sudo', run: () => {}, summary: 'nope' })
  return r
}

function setup() {
  const registry = makeRegistry()
  const onRun = vi.fn()
  const onClose = vi.fn()
  const user = userEvent.setup()
  render(<CommandPalette onClose={onClose} onRun={onRun} open={true} registry={registry} />)
  return { onClose, onRun, user }
}

describe('CommandPalette', () => {
  it('exposes combobox + listbox roles and hides hidden commands', () => {
    setup()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    const list = screen.getByRole('listbox')
    expect(within(list).getAllByRole('option').length).toBe(3) // help, neofetch, projects (not sudo)
    expect(within(list).queryByText('sudo')).not.toBeInTheDocument()
  })

  it('fuzzy-filters as you type', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('combobox'), 'nf') // subsequence of "neofetch"
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('neofetch')
  })

  it('runs the active command on Enter and closes', async () => {
    const { user, onRun, onClose } = setup()
    await user.type(screen.getByRole('combobox'), 'proj{Enter}')
    expect(onRun).toHaveBeenCalledWith('projects')
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates with arrows and marks the active option', async () => {
    const { user } = setup()
    const combo = screen.getByRole('combobox')
    await user.type(combo, '{ArrowDown}')
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    expect(combo).toHaveAttribute('aria-activedescendant', options[1].id)
  })

  it('closes on Escape', async () => {
    const { user, onClose } = setup()
    await user.type(screen.getByRole('combobox'), '{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
