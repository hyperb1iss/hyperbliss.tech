import { describe, expect, it } from 'vitest'
import { complete, fsPaths } from '@/components/terminal/complete'
import { History } from '@/components/terminal/history'
import { testManifest } from './_harness'

describe('History', () => {
  it('records entries and dedupes consecutive duplicates', () => {
    const h = new History()
    h.add('help')
    h.add('help')
    h.add('projects')
    expect(h.entries).toEqual(['help', 'projects'])
  })

  it('ignores blank lines', () => {
    const h = new History()
    h.add('   ')
    expect(h.entries).toHaveLength(0)
  })

  it('navigates ↑/↓ and restores the stashed draft', () => {
    const h = new History(['help', 'projects', 'now'])
    expect(h.prev('blo')).toBe('now') // ↑ stashes "blo"
    expect(h.prev('blo')).toBe('projects')
    expect(h.prev('blo')).toBe('help')
    expect(h.prev('blo')).toBe('help') // clamped at oldest
    expect(h.next()).toBe('projects')
    expect(h.next()).toBe('now')
    expect(h.next()).toBe('blo') // draft restored
  })

  it('returns null on ↑ with empty history', () => {
    expect(new History().prev('x')).toBeNull()
  })
})

describe('fsPaths', () => {
  it('includes files and their ancestor directories', () => {
    const paths = fsPaths(testManifest)
    expect(paths).toContain('/')
    expect(paths).toContain('/projects/')
    expect(paths).toContain('/blog/')
    expect(paths).toContain('/projects/sibyl.md')
    expect(paths).toContain('/about.md')
  })
})

describe('complete', () => {
  const commands = ['help', 'projects', 'blog', 'now', 'neofetch']
  const paths = fsPaths(testManifest)

  it('completes the first token against command names', () => {
    const r = complete('ne', { commands, paths })
    expect(r.matches).toEqual(['neofetch'])
    expect(r.completedLine).toBe('neofetch')
  })

  it('returns the common prefix when several commands match', () => {
    const r = complete('n', { commands, paths })
    expect(r.matches).toContain('now')
    expect(r.matches).toContain('neofetch')
    expect(r.commonPrefix).toBe('n')
  })

  it('completes a later token against FS paths', () => {
    const r = complete('cat /projects/sib', { commands, paths })
    expect(r.matches).toEqual(['/projects/sibyl.md'])
    expect(r.completedLine).toBe('cat /projects/sibyl.md')
  })

  it('completes a directory prefix to the common path', () => {
    const r = complete('ls /pro', { commands, paths })
    expect(r.completedLine).toBe('ls /projects/')
  })

  it('preserves a leading force sentinel', () => {
    const r = complete('!ne', { commands, paths })
    expect(r.completedLine).toBe('!neofetch')
  })

  it('reports no matches gracefully', () => {
    const r = complete('zzz', { commands, paths })
    expect(r.matches).toEqual([])
    expect(r.completedLine).toBe('zzz')
  })
})
