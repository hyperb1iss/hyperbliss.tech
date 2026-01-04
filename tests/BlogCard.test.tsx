// tests/BlogCard.test.tsx

import { render, screen } from '@testing-library/react'
import { BlogCard } from '@/components/BlogCard'

describe('BlogCard', () => {
  const defaultProps = {
    description: 'This is a test description for the blog post.',
    link: '/blog/test-post',
    title: 'Test Blog Post',
  }

  it('renders the title and description', () => {
    render(<BlogCard {...defaultProps} />)

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('This is a test description for the blog post.')).toBeInTheDocument()
  })

  it('renders as a link to the blog post', () => {
    render(<BlogCard {...defaultProps} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/test-post')
  })

  it('renders tags when provided', () => {
    render(<BlogCard {...defaultProps} tags={['React', 'TypeScript', 'Testing']} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  it('renders date when provided', () => {
    render(<BlogCard {...defaultProps} date="2024-01-15" />)

    // Date is formatted via toLocaleDateString
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('renders author when provided', () => {
    render(<BlogCard {...defaultProps} author="Stefanie Jane" />)

    expect(screen.getByText('Stefanie Jane')).toBeInTheDocument()
  })

  it('uses custom link text when provided', () => {
    render(<BlogCard {...defaultProps} linkText="Continue Reading" />)

    expect(screen.getByText('Continue Reading')).toBeInTheDocument()
  })

  it('uses default link text when not provided', () => {
    render(<BlogCard {...defaultProps} />)

    expect(screen.getByText('Read Post')).toBeInTheDocument()
  })

  it('does not render meta section when no date or author', () => {
    render(<BlogCard {...defaultProps} />)

    // Calendar and User icons shouldn't be present
    expect(screen.queryByText(/FaCalendar/)).not.toBeInTheDocument()
  })
})
