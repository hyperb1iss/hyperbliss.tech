// app/lib/useTinaSafe.ts
// Passthrough for TinaCMS data - avoids React version conflicts
// Click-to-edit (tinaField) still works without the live hook

'use client'

interface UseTinaInput<T> {
  query: string
  variables: Record<string, unknown>
  data: T
}

/**
 * Passthrough that returns initial data unchanged.
 *
 * TinaCMS bundles its own React which conflicts with React 19.
 * This passthrough preserves compatibility while still enabling:
 * - Click-to-edit via data-tina-field attributes (tinaField helper)
 * - Static data rendering from server components
 *
 * Live content updates in the visual editor require TinaCMS to
 * update their React bundling for React 19 compatibility.
 */
export function useTinaSafe<T extends object>(props: UseTinaInput<T>): { data: T } {
  return { data: props.data }
}
