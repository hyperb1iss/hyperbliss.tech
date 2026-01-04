// tests/Footer.test.tsx

import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import { SOCIAL_LINKS } from '@/lib/socials'

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />)
    expect(screen.getByText('hyperbliss')).toBeInTheDocument()
  })

  it('renders all social links with correct accessibility labels', () => {
    render(<Footer />)

    SOCIAL_LINKS.forEach(({ label }) => {
      const link = screen.getByLabelText(label)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('renders the RSS feed link', () => {
    render(<Footer />)

    const rssLink = screen.getByLabelText('RSS Feed')
    expect(rssLink).toBeInTheDocument()
    expect(rssLink).toHaveAttribute('href', '/api/rss')
  })

  it('renders the current year in copyright', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })

  it('renders with correct semantic structure', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})
