// app/lib/useTinaSafe.ts
// Passthrough that preserves useTina's interface without the SSR issues
// The data-tina-field attributes still work for click-to-edit in Tina admin
// Live preview updates are disabled until TinaCMS fixes React 19 SSR compatibility

'use client'

/**
 * A passthrough that mimics useTina's interface.
 * Click-to-edit still works via data-tina-field attributes.
 * Live preview is disabled due to React 19 + styled-components SSR issues.
 */
export function useTinaSafe<T extends object>(props: {
  data: T
  query: string
  variables: Record<string, unknown>
}): { data: T } {
  // Just return the raw data - click-to-edit still works via tinaField markers
  return { data: props.data }
}
