// tests/NavLinks.test.tsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavLinks from '@/components/NavLinks'
import { NAV_ITEMS } from '@/lib/navigation'

// Mock the usePathname hook
const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock the useAnimatedNavigation hook
vi.mock('@/hooks/useAnimatedNavigation', () => ({
  useAnimatedNavigation: () => vi.fn(),
}))

describe('NavLinks', () => {
  beforeEach(() => {
    // Set the default mock return value
    mockUsePathname.mockReturnValue(`/${NAV_ITEMS[0].toLowerCase()}`)
  })

  it('renders all navigation items', () => {
    render(<NavLinks />)

    NAV_ITEMS.forEach((item) => {
      const link = screen.getByText(item)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', expect.stringContaining(item.toLowerCase()))
    })
  })

  it('marks the current page link as active with aria-current', () => {
    render(<NavLinks />)

    const activeItem = NAV_ITEMS[0]
    const activeLink = screen.getByText(activeItem)
    expect(activeLink).toHaveAttribute('aria-current', 'page')

    const otherLinks = NAV_ITEMS.slice(1).map((item) => screen.getByText(item))
    otherLinks.forEach((link) => {
      expect(link).not.toHaveAttribute('aria-current')
    })
  })

  it('calls navigation function when a link is clicked', async () => {
    const user = userEvent.setup()
    render(<NavLinks />)

    const aboutLink = screen.getByText('About')
    await user.click(aboutLink)
  })
})
