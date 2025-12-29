// app/lib/registry.tsx
'use client'

import { useServerInsertedHTML } from 'next/navigation'
import React, { useState } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/**
 * StyledComponentsRegistry component
 * Provides server-side rendering support for styled-components in Next.js App Router.
 * Based on the official Next.js example.
 * CRITICAL: Must be at root level to capture all styled-components.
 */
export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  // On client, just render children directly (styles are already in the DOM)
  if (typeof window !== 'undefined') return <>{children}</>

  // On server, wrap with StyleSheetManager to collect styles
  return <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>
}
