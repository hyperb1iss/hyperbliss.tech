// Shared data types for the terminal hero.
// Pure data only — no React, importable by both server builders and the
// client terminal runtime.

export type ContentKind = 'about' | 'resume' | 'project' | 'post' | 'lab' | 'secret'

/**
 * Content kinds safe to expose publicly — both to the terminal's shell virtual
 * filesystem and to the browser-agent read tools. Excludes 'secret' so a future
 * private kind can't leak through `cat`/`grep` or read_content; both surfaces
 * must gate on this single set so their allow-lists can never drift apart.
 */
export const PUBLIC_CONTENT_KINDS: readonly ContentKind[] = ['about', 'resume', 'project', 'post', 'lab']

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
  /** Fingerprint of every file body. The client sends it with body requests,
   *  so a content change is a new URL and never a stale cached response. */
  version?: string
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
  latestPost: BroadcastLink | null
  /** The curated flagship products, in their pinned order. */
  flagships: BroadcastLink[]
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

/** FNV-1a over a string, as 8 hex digits. Small and dependency-free; this is a cache key, not security. */
export function fingerprint(text: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}
