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

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)
    const logo = screen.getByRole('link', { name: /𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼/i })
    expect(logo).toBeInTheDocument()
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
        addListener: vi.fn(), // Deprecated
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(), // Deprecated
      })),
      writable: true,
    })

    // Trigger a resize event
    window.dispatchEvent(new Event('resize'))

    const { container } = render(<Header />)
    console.log(container.innerHTML)

    const mobileMenuIcon = screen.getByLabelText('Toggle menu')
    expect(mobileMenuIcon).toBeInTheDocument()
    expect(mobileMenuIcon).toHaveAttribute('role', 'button')
    expect(mobileMenuIcon).toHaveClass('mobile-menu-icon')
  })
})
