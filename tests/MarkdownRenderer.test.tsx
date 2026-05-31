import { render, screen } from '@testing-library/react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ProjectMarkdownRenderer from '@/components/ProjectMarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders blog markdown with readable semantic classes', () => {
    const content = [
      '## Field Notes',
      '',
      'A paragraph with `code`.',
      '',
      '| Thing | Status |',
      '| --- | --- |',
      '| Source | Clean |',
      '',
      '```ts',
      'const answer = 42',
      '```',
    ].join('\n')
    const { container } = render(<MarkdownRenderer content={content} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Field Notes' })).toHaveClass('markdown-prose__h2')
    expect(container.querySelector('p')).toHaveClass('markdown-prose__paragraph')
    expect(screen.getByText('code')).toHaveClass('markdown-prose__inline-code')
    expect(container.querySelector('table')).toHaveClass('markdown-prose__table')
    expect(container.querySelector('th')).toHaveClass('markdown-prose__th')
    expect(container.querySelector('pre')).toHaveClass('blog-code', 'blog-syntax')
    expect(screen.getByRole('button', { name: 'Copy code' })).toHaveClass('blog-code__copy')
  })

  it('renders lone blog images as silk figures outside paragraph wrappers', () => {
    const { container } = render(
      <MarkdownRenderer content={'![[wide] Neon terminal](/images/blog/terminal.png "Terminal")'} />,
    )

    const figure = container.querySelector('figure')
    expect(figure).toHaveClass('silk-figure', 'silk-breakout-wide')
    expect(figure?.parentElement?.tagName).not.toBe('P')
    expect(screen.getByRole('img', { name: 'Neon terminal' })).toHaveAttribute('src', '/images/blog/terminal.png')
    expect(screen.getByText('Terminal')).toBeInTheDocument()
  })
})

describe('ProjectMarkdownRenderer', () => {
  it('renders project markdown with readable semantic classes', () => {
    const content = [
      '## Capabilities',
      '',
      'Inline `memory` matters.',
      '',
      '| Feature | Detail |',
      '| --- | --- |',
      '| Memory | Graph |',
      '',
      '```ts',
      'const neon = true',
      '```',
    ].join('\n')
    const { container } = render(<ProjectMarkdownRenderer content={content} />)

    expect(container.firstElementChild).toHaveClass('project-markdown')
    expect(screen.getByRole('heading', { level: 2, name: 'Capabilities' })).toHaveClass('project-markdown__h2')
    expect(screen.getByText('memory')).toHaveClass('project-markdown__inline-code')
    expect(container.querySelector('table')).toHaveClass('project-markdown__table')
    expect(container.querySelector('thead')).toHaveClass('project-markdown__thead')
    expect(container.querySelector('tbody')).toHaveClass('project-markdown__tbody')
    expect(container.querySelector('th')).toHaveClass('project-markdown__th')
    expect(container.querySelector('td')).toHaveClass('project-markdown__td')
    expect(container.querySelector('pre')).toHaveClass('project-code', 'project-syntax')
    expect(screen.getByRole('button', { name: 'Copy code' })).toHaveClass('project-code__copy')
  })
})
