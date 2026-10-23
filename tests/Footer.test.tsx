// tests/Footer.test.tsx

import { render, screen, within } from '@testing-library/react'
import Footer from '@/components/Footer'
import { FOOTER_COLUMNS } from '@/lib/navigation'
import { COMPANY_LINKS } from '@/lib/socials'

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />)
    expect(screen.getByText('hyperbliss')).toBeInTheDocument()
  })

  it('renders the company accounts with correct accessibility labels', () => {
    render(<Footer />)

    COMPANY_LINKS.forEach(({ label }) => {
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

  it("leaves the founder's personal accounts to her page", () => {
    render(<Footer />)

    for (const label of ['Instagram', 'LinkedIn', 'Spotify']) {
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument()
    }
  })

  it('renders the product and company columns', () => {
    render(<Footer />)

    for (const column of FOOTER_COLUMNS) {
      const nav = screen.getByRole('navigation', { name: column.title })
      for (const { href, label } of column.links) {
        // Link normalizes the trailing slash per the router config, so compare the path.
        const link = within(nav).getByRole('link', { name: label })
        expect(link.getAttribute('href')?.replace(/\/$/, '')).toBe(href.replace(/\/$/, ''))
      }
    }
  })

  it('names the LLC in the copyright with the current year', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} Hyperbliss Technologies LLC`)).toBeInTheDocument()
  })

  it('renders with correct semantic structure', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})
