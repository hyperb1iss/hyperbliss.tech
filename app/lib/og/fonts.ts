// app/lib/og/fonts.ts

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface OgFont {
  data: Buffer
  name: string
  style: 'normal'
  weight: 400 | 600 | 900
}

let cached: OgFont[] | null = null

/**
 * Loads the brand fonts satori needs to render OG cards: Archivo at 125%
 * width and weight 900 for titles, Sora for body text, Geist Mono for labels.
 * Files are vendored static TTF instances, because satori reads neither
 * variable fonts nor woff2.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  if (cached) return cached
  const dir = join(process.cwd(), 'app', 'lib', 'og', 'fonts')
  const [archivo900, sora400, sora600, mono400] = await Promise.all([
    readFile(join(dir, 'archivo-expanded-900.ttf')),
    readFile(join(dir, 'sora-400.ttf')),
    readFile(join(dir, 'sora-600.ttf')),
    readFile(join(dir, 'geist-mono-400.ttf')),
  ])
  cached = [
    { data: archivo900, name: 'Archivo Expanded', style: 'normal', weight: 900 },
    { data: sora400, name: 'Sora', style: 'normal', weight: 400 },
    { data: sora600, name: 'Sora', style: 'normal', weight: 600 },
    { data: mono400, name: 'Geist Mono', style: 'normal', weight: 400 },
  ]
  return cached
}
