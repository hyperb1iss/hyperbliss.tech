// app/lib/og/fonts.ts

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface OgFont {
  data: Buffer
  name: string
  style: 'normal'
  weight: 400 | 600 | 700
}

let cached: OgFont[] | null = null

/**
 * Loads the brand fonts satori needs to render OG cards.
 * Files are vendored as static-instance woff (satori can't read woff2).
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  if (cached) return cached
  const dir = join(process.cwd(), 'app', 'lib', 'og', 'fonts')
  const [jura700, exo400, exo600, mono400] = await Promise.all([
    readFile(join(dir, 'jura-700.woff')),
    readFile(join(dir, 'exo-2-400.woff')),
    readFile(join(dir, 'exo-2-600.woff')),
    readFile(join(dir, 'space-mono-400.woff')),
  ])
  cached = [
    { data: jura700, name: 'Jura', style: 'normal', weight: 700 },
    { data: exo400, name: 'Exo 2', style: 'normal', weight: 400 },
    { data: exo600, name: 'Exo 2', style: 'normal', weight: 600 },
    { data: mono400, name: 'Space Mono', style: 'normal', weight: 400 },
  ]
  return cached
}
