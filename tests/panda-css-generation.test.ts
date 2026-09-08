// @vitest-environment node
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

it('emits valid animation frames instead of atomic selectors inside keyframes', () => {
  const directory = mkdtempSync(join(tmpdir(), 'hyperbliss-panda-'))
  const output = join(directory, 'site.css')
  const require = createRequire(import.meta.url)
  const cli = join(dirname(require.resolve('@pandacss/dev/package.json')), 'bin.js')

  try {
    execFileSync(process.execPath, [cli, 'cssgen', '--outfile', output], { stdio: 'pipe' })
    const css = readFileSync(output, 'utf8')
    const animations = Array.from(css.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\}\s*)+)\}/g))
    expect(animations.map((match) => match[1])).toEqual(
      expect.arrayContaining(['silkStarFloat', 'silkStarGlow', 'silkGradientShift', 'silkHeroScrollWheel']),
    )

    for (const [, name, body] of animations) {
      const frames = Array.from(body.matchAll(/([^{}]+)\{[^{}]*\}/g))
      expect(frames.length, name).toBeGreaterThan(0)
      for (const [, selectors] of frames) {
        for (const selector of selectors.split(',')) {
          expect(selector.trim(), `Invalid frame selector in ${name}`).toMatch(/^(?:from|to|\d+(?:\.\d+)?%)$/)
        }
      }
    }
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
})
