// Contact-block parsing: the resume's contact links are soft-wrapped across
// several markdown lines. The parser must capture every channel rather than
// stopping at the first line (which previously leaked raw markdown / dropped
// links on the resume page).

import { describe, expect, it } from 'vitest'
import { parseResume } from '@/lib/resumeParser'

describe('parseResume contact block', () => {
  it('captures every channel from a multi-line wrapped contact block', () => {
    const md = [
      '# Stefanie Jane',
      '',
      '**Engineering Leader**',
      '',
      '📧 [stef@hyperbliss.tech](mailto:stef@hyperbliss.tech) | 💼',
      '[LinkedIn](https://www.linkedin.com/in/hyperb1iss) | 🐙',
      '[GitHub](https://github.com/hyperb1iss) | 🌐 [Web](https://hyperbliss.tech) | 🔗',
      '[Links](https://linktr.ee/hyperb1iss)',
      '',
      '## Summary',
      '',
      'A summary paragraph.',
    ].join('\n')

    const { contact } = parseResume(md)

    expect(contact).toEqual({
      email: 'stef@hyperbliss.tech',
      github: 'https://github.com/hyperb1iss',
      linkedin: 'https://www.linkedin.com/in/hyperb1iss',
      links: 'https://linktr.ee/hyperb1iss',
      website: 'https://hyperbliss.tech',
    })
  })

  it('parses a single-line contact block', () => {
    const md = [
      '# Jane Doe',
      '',
      '📧 [me@example.com](mailto:me@example.com) | 🐙 [GitHub](https://github.com/jane)',
      '',
      '## Summary',
      '',
      'Hello.',
    ].join('\n')

    const { contact } = parseResume(md)

    expect(contact.email).toBe('me@example.com')
    expect(contact.github).toBe('https://github.com/jane')
    expect(contact.linkedin).toBeUndefined()
  })

  it('does not treat an @ mention inside a section as contact info', () => {
    const md = ['# Jane Doe', '', '## Summary', '', 'Reach me anytime, I respond to every message @ scale.'].join('\n')

    const { contact } = parseResume(md)

    expect(contact.email).toBeUndefined()
  })
})

describe('parseResume skill sub-categories', () => {
  it('reads a bold label as a category whether the colon is inside or outside the bold', () => {
    const md = [
      '# Jane Doe',
      '',
      '## Skills',
      '',
      '### Technical Expertise',
      '',
      '**Cloud & Infrastructure**: AWS | Kubernetes | PostgreSQL',
      '',
      '**Specialized Domains:** AI/ML | IoT | Realtime Systems',
    ].join('\n')

    const { skills } = parseResume(md)

    expect(skills['Cloud & Infrastructure'].map((s) => s.name)).toEqual(['AWS', 'Kubernetes', 'PostgreSQL'])
    expect(skills['Specialized Domains'].map((s) => s.name)).toEqual(['AI/ML', 'IoT', 'Realtime Systems'])
  })

  it('does not glue a bold label onto the first tag when that tag is plain text', () => {
    const md = ['# Jane Doe', '', '## Skills', '', '### Expertise', '', '**Specialized Domains**: AI/ML | IoT'].join(
      '\n',
    )

    const tagNames = Object.values(parseResume(md).skills)
      .flat()
      .map((s) => s.name)

    expect(tagNames).toContain('AI/ML')
    expect(tagNames.some((name) => name.includes('Specialized Domains'))).toBe(false)
  })
})
