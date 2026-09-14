// tests/NavLinks.test.tsx

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavLinks from '@/components/NavLinks'
import { NAV_ITEMS } from '@/lib/navigation'

// Mock the usePathname hook
const mockUsePathname = vi.fn()
const navigate = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock the useAnimatedNavigation hook
vi.mock('@/hooks/useAnimatedNavigation', () => ({
  useAnimatedNavigation: () => navigate,
}))

describe('NavLinks', () => {
  beforeEach(() => {
    navigate.mockClear()
    // Set the default mock return value
    mockUsePathname.mockReturnValue(NAV_ITEMS[0].href)
  })

  it('renders all navigation items', () => {
    render(<NavLinks />)

    NAV_ITEMS.forEach((item) => {
      const link = screen.getByText(item.label)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    })
  })

  it('marks the current page link as active with aria-current', () => {
    render(<NavLinks />)

    const activeLink = screen.getByText(NAV_ITEMS[0].label)
    expect(activeLink).toHaveAttribute('aria-current', 'page')

    const otherLinks = NAV_ITEMS.slice(1).map((item) => screen.getByText(item.label))
    otherLinks.forEach((link) => {
      expect(link).not.toHaveAttribute('aria-current')
    })
  })

  it.each(['/blog/', '/blog/a-post/'])('keeps the section active on %s', (pathname) => {
    mockUsePathname.mockReturnValue(pathname)
    render(<NavLinks />)
    expect(screen.getByText('Writing')).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1)
  })

  it('preserves browser navigation for modified clicks', () => {
    render(<NavLinks />)
    fireEvent.click(screen.getByText('About'), { metaKey: true })
    fireEvent.click(screen.getByText('Writing'), { ctrlKey: true })
    expect(navigate).not.toHaveBeenCalled()
  })

  it('calls navigation function when a link is clicked', async () => {
    const user = userEvent.setup()
    render(<NavLinks />)

    const aboutLink = screen.getByText('About')
    await user.click(aboutLink)
    expect(navigate).toHaveBeenCalledWith('/about')
  })
})
