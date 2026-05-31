import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Registry } from '@/components/terminal/registry'
import { text } from '@/components/terminal/render'
import Terminal from '@/components/terminal/Terminal'
import { testBroadcast, testManifest } from './_harness'

function setup() {
  const registry = new Registry()
  registry.register({ name: 'hello', run: () => 'hi there', summary: 'greet' })
  registry.register({ name: 'help', run: () => 'help text', summary: 'list commands' })
  registry.register({
    name: 'wipe',
    run: (_args, ctx) => {
      ctx.clear()
    },
    summary: 'clear',
  })
  const user = userEvent.setup()
  render(<Terminal autoFocusInput={true} broadcast={testBroadcast} manifest={testManifest} registry={registry} />)
  const input = screen.getByLabelText(/terminal input/i)
  return { input, user }
}

describe('Terminal', () => {
  it('exposes an accessible live log and labeled input', () => {
    setup()
    const log = screen.getByRole('log')
    expect(log).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByLabelText(/terminal input/i)).toBeInTheDocument()
  })

  it('echoes the typed command and renders its output', async () => {
    const { input, user } = setup()
    await user.type(input, 'hello{Enter}')
    const log = screen.getByRole('log')
    expect(within(log).getByText('hi there')).toBeInTheDocument()
    // the command line is echoed back
    expect(within(log).getAllByText('hello').length).toBeGreaterThan(0)
    // input is cleared after submit
    expect(input).toHaveValue('')
  })

  it('suggests a near command for typos', async () => {
    const { input, user } = setup()
    await user.type(input, 'helo{Enter}')
    expect(screen.getByText(/did you mean 'hello'|did you mean 'help'/)).toBeInTheDocument()
  })

  it('recalls history with ArrowUp', async () => {
    const { input, user } = setup()
    await user.type(input, 'hello{Enter}')
    await user.type(input, '{ArrowUp}')
    expect(input).toHaveValue('hello')
  })

  it('clears the log when a handler calls ctx.clear', async () => {
    const { input, user } = setup()
    await user.type(input, 'hello{Enter}')
    expect(within(screen.getByRole('log')).queryByText('hi there')).toBeInTheDocument()
    await user.type(input, 'wipe{Enter}')
    expect(within(screen.getByRole('log')).queryByText('hi there')).not.toBeInTheDocument()
  })

  it('completes a command on Tab', async () => {
    const { input, user } = setup()
    await user.type(input, 'hel')
    await user.tab()
    // "hel" → common prefix of help/hello is "hel"; type one more to disambiguate
    await user.clear(input)
    await user.type(input, 'hell')
    await user.keyboard('{Tab}')
    expect(input).toHaveValue('hello')
  })

  it('fires a coarse analytics category, never raw input', async () => {
    const registry = new Registry()
    registry.register({ name: 'help', run: () => text('hi'), summary: 'g' })
    const onCommandCategory = vi.fn()
    const user = userEvent.setup()
    render(
      <Terminal
        autoFocusInput={true}
        broadcast={testBroadcast}
        manifest={testManifest}
        onCommandCategory={onCommandCategory}
        registry={registry}
      />,
    )
    await user.type(screen.getByLabelText(/terminal input/i), 'help secret-arg-xyz{Enter}')
    expect(onCommandCategory).toHaveBeenCalledWith('cmd:help')
    for (const call of onCommandCategory.mock.calls) {
      expect(call[0]).not.toContain('secret-arg-xyz')
    }
  })
})
