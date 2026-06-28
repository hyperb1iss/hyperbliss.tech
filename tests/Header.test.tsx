// tests/Header.test.tsx

import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

// Mock the HeaderContext
vi.mock('@/components/HeaderContext', () => ({
  useHeaderContext: () => ({ isExpanded: false, setIsExpanded: vi.fn() }),
}))

// Mock the useAnimatedNavigation hook
vi.mock('@/hooks/useAnimatedNavigation', () => ({
  useAnimatedNavigation: () => vi.fn(),
}))

// Controllable pathname so we can assert the home-route chevron suppression.
const nav = vi.hoisted(() => ({ pathname: '/about' }))
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
}))

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)
    const logoImage = screen.getByAltText('hyperbliss')
    expect(logoImage).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    const aboutLinks = screen.getAllByText(/about/i)
    const blogLinks = screen.getAllByText(/blog/i)
    const projectsLinks = screen.getAllByText(/projects/i)
    const resumeLinks = screen.getAllByText(/resume/i)

    expect(aboutLinks.length).toBeGreaterThan(0)
    expect(blogLinks.length).toBeGreaterThan(0)
    expect(projectsLinks.length).toBeGreaterThan(0)
    expect(resumeLinks.length).toBeGreaterThan(0)
  })

  it('renders mobile menu icon on small screens', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 500,
      writable: true,
    })

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    })

    window.dispatchEvent(new Event('resize'))

    render(<Header />)

    const mobileMenuIcon = screen.getByLabelText('Toggle menu')
    expect(mobileMenuIcon).toBeInTheDocument()
    expect(mobileMenuIcon).toHaveAttribute('role', 'button')
    expect(mobileMenuIcon).toHaveClass('mobile-menu-icon')
  })

  it('shows the expand chevron off the home route', () => {
    nav.pathname = '/about'
    render(<Header />)
    expect(screen.queryByTitle('Toggle header expansion')).toBeInTheDocument()
  })

  it('hides the expand chevron on home, where the terminal console owns the affordance', () => {
    nav.pathname = '/'
    render(<Header />)
    expect(screen.queryByTitle('Toggle header expansion')).not.toBeInTheDocument()
  })
})
