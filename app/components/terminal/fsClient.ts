// Client fetcher for lazy virtual-FS bodies. Requests are batched, deduped,
// and cached by virtual path; on failure the affected paths can retry.

export type FsBodies = Record<string, string>

const bodyCache: FsBodies = {}
const inFlight = new Map<string, Promise<void>>()
let allCache: Promise<FsBodies> | null = null

async function fetchBatch(paths: readonly string[], signal?: AbortSignal): Promise<void> {
  const url = `/api/fs?paths=${encodeURIComponent(JSON.stringify(paths))}`
  const bodies = await fetch(url, { signal }).then((res) => {
    if (!res.ok) throw new Error(`/api/fs responded ${res.status}`)
    return res.json() as Promise<FsBodies>
  })
  Object.assign(bodyCache, bodies)
}

function registerBatch(paths: readonly string[], signal?: AbortSignal): Promise<void> {
  const request = fetchBatch(paths, signal).finally(() => {
    for (const path of paths) {
      if (inFlight.get(path) === request) inFlight.delete(path)
    }
  })
  for (const path of paths) {
    inFlight.set(path, request)
  }
  return request
}

export async function fetchFsBodies(paths?: readonly string[], signal?: AbortSignal): Promise<FsBodies> {
  if (!paths) {
    allCache ??= fetch('/api/fs', { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`/api/fs responded ${res.status}`)
        return res.json() as Promise<FsBodies>
      })
      .then((bodies) => {
        Object.assign(bodyCache, bodies)
        return bodyCache
      })
      .catch((err) => {
        allCache = null
        throw err
      })
    return allCache
  }

  const uniquePaths = [...new Set(paths)]
  const missing = uniquePaths.filter((path) => !(path in bodyCache))
  if (missing.length > 0) {
    const waits = new Set<Promise<void>>()
    const cold: string[] = []
    for (const path of missing) {
      const pending = inFlight.get(path)
      if (pending) waits.add(pending)
      else cold.push(path)
    }
    if (cold.length > 0) waits.add(registerBatch(cold, signal))
    await Promise.all(waits)
  }

  return Object.fromEntries(uniquePaths.flatMap((path) => (path in bodyCache ? [[path, bodyCache[path]]] : [])))
}

/** Test/HMR escape hatch. */
export function resetFsCache(): void {
  for (const key of Object.keys(bodyCache)) {
    delete bodyCache[key]
  }
  inFlight.clear()
  allCache = null
}
