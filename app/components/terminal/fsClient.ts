// Client fetcher for the lazy virtual-FS bodies. One batched request to
// /api/fs, deduped via a cached promise; on failure the cache resets so a
// later shell command can retry.

export type FsBodies = Record<string, string>

let cache: Promise<FsBodies> | null = null

export function fetchFsBodies(signal?: AbortSignal): Promise<FsBodies> {
  if (!cache) {
    cache = fetch('/api/fs', { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`/api/fs responded ${res.status}`)
        return res.json() as Promise<FsBodies>
      })
      .catch((err) => {
        cache = null // allow retry on the next shell command
        throw err
      })
  }
  return cache
}

/** Test/HMR escape hatch. */
export function resetFsCache(): void {
  cache = null
}
