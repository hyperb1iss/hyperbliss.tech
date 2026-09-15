import { describe, expect, it } from 'vitest'
import { createHeadingIdAssigner, extractHeadings, headingText, readingTime, slugifyHeading } from '@/lib/reading'

describe('slugifyHeading', () => {
  it('lowercases, strips punctuation, hyphenates', () => {
    expect(slugifyHeading('The Missing Manual')).toBe('the-missing-manual')
    expect(slugifyHeading("What's changed? (v2.0)")).toBe('whats-changed-v20')
    expect(slugifyHeading('`code` and *emphasis*')).toBe('code-and-emphasis')
  })
})

describe('extractHeadings', () => {
  const md = `# Title

Intro.

## The Three Forces

\`\`\`md
## not a heading
\`\`\`

### AI agents chose the [terminal](https://x)

## The Three Forces

## Something *shifted.*
`
  it('lists h2 and h3 with unique ids and skips fenced code', () => {
    expect(extractHeadings(md)).toEqual([
      { id: 'the-three-forces', level: 2, text: 'The Three Forces' },
      { id: 'ai-agents-chose-the-terminal', level: 3, text: 'AI agents chose the terminal' },
      { id: 'the-three-forces-2', level: 2, text: 'The Three Forces' },
      { id: 'something-shifted', level: 2, text: 'Something shifted.' },
    ])
  })
  it('strips inline markdown from heading text', () => {
    expect(headingText('**Bold** and `code`')).toBe('Bold and code')
  })
})

describe('createHeadingIdAssigner', () => {
  it('hands out the extracted ids in document order, including duplicates', () => {
    const assign = createHeadingIdAssigner([
      { id: 'a', level: 2, text: 'A' },
      { id: 'a-2', level: 2, text: 'A' },
    ])
    expect(assign(2, 'A')).toBe('a')
    expect(assign(2, 'A')).toBe('a-2')
    expect(assign(2, 'Unknown')).toBe('unknown')
  })
})

describe('readingTime', () => {
  it('rounds to whole minutes with a floor of one', () => {
    expect(readingTime('short')).toBe(1)
    expect(readingTime(Array(460).fill('word').join(' '))).toBe(2)
    expect(readingTime(`\`\`\`\n${Array(2000).fill('code').join(' ')}\n\`\`\`\nhi`)).toBe(1)
  })
})
