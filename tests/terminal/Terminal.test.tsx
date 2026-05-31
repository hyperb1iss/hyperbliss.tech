import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
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

  it('runs the boot finale exactly once, even under StrictMode', async () => {
    render(
      <StrictMode>
        <Terminal bootPhase="skip-to-end" broadcast={testBroadcast} manifest={testManifest} />
      </StrictMode>,
    )
    // The finale paints the status console; StrictMode's double effect-invoke
    // must not duplicate it.
    await waitFor(() => expect(screen.getAllByText(/creative technologist/i).length).toBeGreaterThan(0))
    expect(screen.getAllByText(/creative technologist/i)).toHaveLength(1)
  })

  it('replays shared-session commands instead of neofetch', async () => {
    const registry = new Registry()
    const neofetch = vi.fn(() => text('NEO'))
    const projects = vi.fn(() => text('PROJ'))
    registry.register({ name: 'neofetch', run: neofetch, summary: 'sys' })
    registry.register({ name: 'projects', run: projects, summary: 'p' })
    render(
      <Terminal
        bootPhase="skip-to-end"
        broadcast={testBroadcast}
        manifest={testManifest}
        registry={registry}
        replayCommands={['projects']}
      />,
    )
    await waitFor(() => expect(projects).toHaveBeenCalled())
    expect(neofetch).not.toHaveBeenCalled()
  })

  it('assigns unique log keys when a command prints many lines in one tick', async () => {
    const registry = new Registry()
    registry.register({
      name: 'multi',
      run: (_args, ctx) => {
        for (let i = 0; i < 6; i++) ctx.print(text(`line ${i}`))
      },
      summary: 'prints many lines',
    })
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<Terminal autoFocusInput={true} broadcast={testBroadcast} manifest={testManifest} registry={registry} />)
    await user.type(screen.getByLabelText(/terminal input/i), 'multi{Enter}')
    await waitFor(() => expect(screen.getByText('line 5')).toBeInTheDocument())
    const dupKeyWarning = errorSpy.mock.calls.some((args) => args.some((a) => /same key/i.test(String(a))))
    expect(dupKeyWarning).toBe(false)
    errorSpy.mockRestore()
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
