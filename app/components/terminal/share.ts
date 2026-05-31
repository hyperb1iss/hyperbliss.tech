// Shareable session URLs (T4.2). A session is encoded as a `;`-separated list
// of commands in the URL hash, e.g. /#neofetch;projects;cat%20now.md — on load
// the terminal replays them. Pure + tiny so it's trivially testable.

/** Commands we never replay/encode (they reset or are themselves meta). */
const SKIP = new Set(['clear', 'cls', 'share'])

export function encodeSession(commands: readonly string[]): string {
  const useful = commands.map((c) => c.trim()).filter((c) => c.length > 0 && !SKIP.has(c.split(/\s+/)[0]))
  return useful.map(encodeURIComponent).join(';')
}

export function decodeSession(hash: string): string[] {
  const body = hash.replace(/^#/, '')
  if (!body) return []
  return body
    .split(';')
    .map((part) => {
      try {
        return decodeURIComponent(part).trim()
      } catch {
        return ''
      }
    })
    .filter((c) => c.length > 0)
}

/** Build a full shareable URL from a command list. */
export function buildShareUrl(origin: string, commands: readonly string[]): string {
  const encoded = encodeSession(commands)
  return encoded ? `${origin}/#${encoded}` : `${origin}/`
}
