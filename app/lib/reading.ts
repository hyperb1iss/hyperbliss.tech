// Reading helpers for the essay and project pages: heading ids that match
// between the table of contents and the rendered markdown, and a reading time.

export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

/** GitHub-style slug: lowercase, punctuation stripped, spaces to hyphens. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Plain text of a heading line: inline code, emphasis, and link syntax removed. */
export function headingText(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}

/**
 * h2 and h3 headings from markdown, in order, with ids unique within the
 * document (a repeated heading gets -2, -3, ...). Fenced code is skipped so a
 * commented `## heading` inside a block never becomes an entry.
 */
export function extractHeadings(markdown: string): Heading[] {
  const seen = new Map<string, number>()
  const out: Heading[] = []
  let fence: string | null = null
  for (const line of markdown.split(/\r?\n/)) {
    const marker = /^(`{3,}|~{3,})/.exec(line)
    if (marker) {
      if (!fence) fence = marker[1][0]
      else if (marker[1][0] === fence && /^(`{3,}|~{3,})\s*$/.test(line)) fence = null
      continue
    }
    if (fence) continue
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line)
    if (!m) continue
    const text = headingText(m[2])
    if (!text) continue
    const base = slugifyHeading(text) || 'section'
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    out.push({ id: n === 1 ? base : `${base}-${n}`, level: m[1].length === 2 ? 2 : 3, text })
  }
  return out
}

/** Minutes at a comfortable 230 words per minute, never below one. */
export function readingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 230))
}

/** Assign ids to rendered headings in document order, matching extractHeadings. */
export function createHeadingIdAssigner(headings: Heading[]) {
  let index = 0
  return (level: 2 | 3, text: string): string | undefined => {
    // Walk forward to the next heading of this level whose text matches; the
    // renderer and the extractor see the same document, so this stays in step.
    for (let i = index; i < headings.length; i++) {
      if (headings[i].level === level && headings[i].text === text) {
        index = i + 1
        return headings[i].id
      }
    }
    return slugifyHeading(text) || undefined
  }
}
