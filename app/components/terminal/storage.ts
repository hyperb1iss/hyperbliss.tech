// Safe storage wrappers. Private-mode Safari and locked-down browsers throw on
// access to localStorage/sessionStorage; every call is guarded so the terminal
// degrades to in-memory behavior instead of crashing. Shared by history (§5.7)
// and the boot state machine (§5.6).

function get(store: 'local' | 'session', key: string): string | null {
  try {
    const s = store === 'local' ? window.localStorage : window.sessionStorage
    return s.getItem(key)
  } catch {
    return null
  }
}

function set(store: 'local' | 'session', key: string, value: string): void {
  try {
    const s = store === 'local' ? window.localStorage : window.sessionStorage
    s.setItem(key, value)
  } catch {
    // ignore — private mode / disabled storage
  }
}

export const safeLocalGet = (key: string): string | null => get('local', key)
export const safeLocalSet = (key: string, value: string): void => set('local', key, value)
export const safeSessionGet = (key: string): string | null => get('session', key)
export const safeSessionSet = (key: string, value: string): void => set('session', key, value)
