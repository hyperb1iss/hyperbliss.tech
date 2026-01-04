// tests/Logo.test.tsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Logo from '@/components/Logo'

// Mock the useAnimatedNavigation hook
vi.mock('@/hooks/useAnimatedNavigation', () => ({
  useAnimatedNavigation: () => vi.fn(),
}))

describe('Logo', () => {
  it('renders the logo image and technologies text', () => {
    render(<Logo />)

    // Check for the logo image
    const logoImage = screen.getByAltText('hyperbliss')
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', expect.stringContaining('logo.png'))

    // Check for the technologies text
    expect(screen.getByText('technologies')).toBeInTheDocument()
  })

  it('has a clickable link to home', async () => {
    const user = userEvent.setup()
    render(<Logo />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')

    await user.click(link)
  })

  it('applies correct structure', () => {
    render(<Logo />)

    // Check link structure
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')

    // Check image is present with correct alt
    const image = screen.getByAltText('hyperbliss')
    expect(image).toBeInTheDocument()
  })
})
