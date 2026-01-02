// app/lib/useTinaSafe.ts
// Passthrough that preserves useTina's interface
// The data-tina-field attributes still work for click-to-edit in Tina admin
// TODO: Test if real useTina works now that we migrated to Panda CSS

'use client'

/**
 * A passthrough that mimics useTina's interface.
 * Click-to-edit still works via data-tina-field attributes.
 * Live preview updates are kept disabled for now (can test useTina later).
 */
export function useTinaSafe<T extends object>(props: {
  data: T
  query: string
  variables: Record<string, unknown>
}): { data: T } {
  // Just return the raw data - click-to-edit still works via tinaField markers
  return { data: props.data }
}
