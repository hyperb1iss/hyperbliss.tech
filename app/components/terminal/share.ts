// Shareable session URLs (T4.2). A session is encoded as a `;`-separated list
// of commands in the URL hash, e.g. /#neofetch;projects;cat%20about.md — on load
// the terminal replays them. Pure + tiny so it's trivially testable.

/** Commands we never replay or encode: they wipe the log, close the console,
 *  or are themselves meta. A replayed `exit` would shut the console on every
 *  open. */
const SKIP = new Set(['clear', 'cls', 'share', 'exit', 'quit', 'logout', 'reboot'])

const isReplayable = (command: string) => command.length > 0 && !SKIP.has(command.split(/\s+/)[0])

export function encodeSession(commands: readonly string[]): string {
  const useful = commands.map((c) => c.trim()).filter(isReplayable)
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
    .filter(isReplayable)
}

/** Build a full shareable URL from a command list. */
export function buildShareUrl(origin: string, commands: readonly string[]): string {
  const encoded = encodeSession(commands)
  return encoded ? `${origin}/#${encoded}` : `${origin}/`
}
