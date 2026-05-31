// Shared data types for the terminal hero.
// Pure data only — no React, importable by both server builders and the
// client terminal runtime.

export type ContentKind = 'about' | 'now' | 'resume' | 'project' | 'post' | 'lab' | 'secret'

/**
 * One node in the virtual filesystem. The manifest is the authoritative file
 * tree: every path is known up front so recursive shell ops (grep -r, globs,
 * ls -R) can pre-materialize the matching subtree before handing off to the
 * shell engine. Bodies are never shipped here — they load lazily (§5.5).
 */
export interface ManifestEntry {
  /** Virtual absolute path, e.g. "/projects/ghostty-automator.md". */
  path: string
  kind: ContentKind
  title: string
  /** Excerpt / description — short, safe to ship. */
  summary: string
  tags: string[]
  date: string | null
  /** Deep route this content links into, e.g. "/projects/ghostty-automator/". */
  href: string | null
  /** Byte length of the body the lazy-FS will serve for this path. */
  bytes: number
  emoji: string | null
  github: string | null
  status: string | null
  latestVersion: string | null
}

export interface Manifest {
  entries: ManifestEntry[]
  /** ISO timestamp, stamped by the caller (scripts can't call Date.now). */
  generatedAt: string
}

/** A curated "currently shipping" release for the broadcast (§5.10). */
export interface BroadcastShip {
  project: string
  slug: string
  version: string
  url: string
  publishedAt: string
}

export interface BroadcastLink {
  title: string
  href: string
  date: string | null
}

/**
 * The "announce everything" payload painted by neofetch and used across native
 * commands. Computed server-side at build/ISR time.
 */
export interface Broadcast {
  focus: string
  location: string | null
  nowUpdated: string | null
  latestPost: BroadcastLink | null
  latestProject: BroadcastLink | null
  latestShip: BroadcastShip | null
  projectCount: number
  postCount: number
  labCount: number
  generatedAt: string
}

/** UTF-8 byte length without pulling in Node's Buffer (works client + server). */
export function byteLengthUtf8(text: string): number {
  let bytes = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.codePointAt(i) ?? 0
    if (code > 0xffff) i++ // surrogate pair consumes two UTF-16 units
    bytes += code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4
  }
  return bytes
}
