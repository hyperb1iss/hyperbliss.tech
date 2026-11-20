import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { SilkButton } from '@/styles/silkcircuit/components'

const sizes = [
  ['sm', 'padding_var(--space-2)_var(--space-4)', 'font-size_var(--text-sm)'],
  ['md', 'padding_var(--space-3)_var(--space-6)', 'font-size_clamp(1.5rem,_1.3rem_+_0.4vw,_1.8rem)'],
  ['lg', 'padding_var(--space-4)_var(--space-8)', 'font-size_clamp(1.8rem,_1.6rem_+_0.5vw,_2.2rem)'],
] as const

describe('SilkCircuit button composition', () => {
  it.each(sizes)('resolves %s button sizing before emitting atomic classes', (size, padding, fontSize) => {
    render(<SilkButton $size={size}>Action</SilkButton>)
    const classes = Array.from(screen.getByRole('button').classList)
    expect(classes.filter((name) => name.startsWith('padding_'))).toEqual([padding])
    expect(classes.filter((name) => name.startsWith('font-size_'))).toEqual([fontSize])
  })

  it('preserves button behavior, refs and caller classes', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <SilkButton $variant="secondary" className="custom-action" disabled={true} ref={ref}>
        Save
      </SilkButton>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('custom-action', 'color_var(--color-secondary)')
    expect(ref.current).toBe(button)
    expect(button).not.toHaveAttribute('$variant')
  })
})
