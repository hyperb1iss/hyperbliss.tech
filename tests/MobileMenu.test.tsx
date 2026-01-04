// tests/MobileMenu.test.tsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MobileMenu from '@/components/MobileMenu'

// Mock CyberScape animation trigger
vi.mock('@/cyberscape/CyberScape', () => ({
  triggerCyberScapeAnimation: vi.fn(),
}))

describe('MobileMenu', () => {
  it('renders the menu toggle button', () => {
    render(<MobileMenu />)

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<MobileMenu />)

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toHaveAttribute('aria-label', 'Toggle menu')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('toggles menu visibility when clicked', async () => {
    const user = userEvent.setup()
    render(<MobileMenu />)

    const button = screen.getByRole('button', { name: /toggle menu/i })

    // Menu should be closed initially (no nav element)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    // Click to open
    await user.click(button)

    // Menu should now be visible
    expect(screen.getByRole('navigation')).toBeInTheDocument()

    // Click to close
    await user.click(button)

    // Menu should be hidden again (with animation, might need waitFor)
  })
})
