// Essay files are date-prefixed on disk; their public slugs are not.
import { describe, expect, it } from 'vitest'
import {
  getMarkdownSlugs,
  resolveMarkdownFile,
  resolveMarkdownFileOrNull,
  slugFromFilename,
} from '@/lib/contentCollections'

describe('essay slugs', () => {
  it('strips the date prefix from post filenames only', () => {
    expect(slugFromFilename('posts', '2026.07.21_loop-engineering.md')).toBe('loop-engineering')
    expect(slugFromFilename('posts', '2024.10.3_hypershell.md')).toBe('hypershell')
    expect(slugFromFilename('posts', 'undated.md')).toBe('undated')
    expect(slugFromFilename('projects', '2026.07.21_not-a-date-prefix.md')).toBe('2026.07.21_not-a-date-prefix')
  })

  it('lists clean slugs and resolves each back to its dated file', async () => {
    const slugs = await getMarkdownSlugs('posts')
    expect(slugs.length).toBeGreaterThan(0)
    for (const slug of slugs) {
      expect(slug).not.toMatch(/^\d{4}\.\d{2}\.\d{1,2}_/)
      const file = await resolveMarkdownFile('posts', slug)
      expect(file).toMatch(new RegExp(`^posts/(\\d{4}\\.\\d{2}\\.\\d{1,2}_)?${slug}\\.md$`))
    }
  })

  it('does not resolve the old dated slug or an unknown one', async () => {
    expect(await resolveMarkdownFileOrNull('posts', '2026.07.21_loop-engineering')).toBeNull()
    expect(await resolveMarkdownFileOrNull('posts', 'nope')).toBeNull()
    await expect(resolveMarkdownFile('posts', 'nope')).rejects.toThrow('Content not found')
  })
})
